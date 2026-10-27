import {chromium,expect} from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true});
const modules=['overview','radar','ecosystem','briefing','contribute'];
try {
 const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173/open-dipper/');
 await expect(page.locator('#earth')).toBeVisible();
 await fs.mkdir('screenshots',{recursive:true});
 const geometry=()=>page.locator('.product-nav').evaluate(nav=>({
  header:nav.closest('.topbar').getBoundingClientRect().height,
  buttons:[...nav.children].map(el=>{const r=el.getBoundingClientRect();return {x:r.x+nav.scrollLeft,y:r.y,w:r.width,h:r.height};})
 }));
 for(const width of [1366,1024,768,390]) {
  await page.setViewportSize({width,height:900});
  for(const lang of ['zh','en']) {
   if((await page.locator('html').getAttribute('lang')).startsWith('zh')!==(lang==='zh'))await page.locator('#language-toggle').click();
   for(const theme of ['dark','light']) {
    if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme-toggle').click();
    const baseline=await geometry();
    for(const id of modules) {
     await page.locator(`#nav-${id}`).click();
     await expect(page.locator(`#nav-${id}`)).toHaveAttribute('aria-current','page');
     await expect(page.locator(`#nav-${id}`)).toBeFocused();
     const actual=await geometry();expect(actual.header).toBe(baseline.header);
     actual.buttons.forEach((b,i)=>{for(const key of ['x','y','w','h'])expect(Math.abs(b[key]-baseline.buttons[i][key]),`${width}/${lang}/${theme}/${id}/${key}`).toBeLessThanOrEqual(1);});
     const overflow=await page.evaluate(()=>({width:innerWidth,document:document.documentElement.scrollWidth,elements:[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect();return r.right>innerWidth+1&&getComputedStyle(el).position!=='fixed';}).slice(0,16).map(el=>({tag:el.tagName,cls:el.className,right:el.getBoundingClientRect().right}))}));
     if(overflow.document>width+1){console.log('Navigation overflow',width,lang,theme,id,JSON.stringify(overflow));await page.screenshot({path:`screenshots/navigation-overflow-${width}-${lang}-${theme}-${id}.png`});}
     expect(overflow.document,`${width}/${lang}/${theme}/${id}: document overflow`).toBeLessThanOrEqual(width+1);
     if(width===1366&&lang==='zh'&&theme==='dark')await page.screenshot({path:`screenshots/navigation-${id}.png`});
    }
   }
  }
 }
 // The same module retains reading position; changing modules clears document scroll.
 await page.setViewportSize({width:1366,height:900});
 await page.locator('.page-contribute').evaluate(el=>el.scrollTop=250);
 await page.locator('#nav-contribute').click();
 expect(await page.locator('.page-contribute').evaluate(el=>el.scrollTop)).toBeGreaterThan(100);
 await page.locator('#nav-briefing').click();await expect(page.locator('.agent-room')).toBeVisible();
 await page.locator('.header-context-tools [data-action=sources]').click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');
 await page.locator('#nav-overview').click();await page.locator('[data-layout=two]').click();
 await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));
 // Programmatic activation avoids Playwright scrolling the header before the assertion.
 await page.locator('#nav-briefing').evaluate(el=>el.click());
 expect(await page.evaluate(()=>scrollY)).toBe(0);
 await page.locator('#nav-contribute').focus();await page.keyboard.press('Enter');
 await expect(page.locator('#nav-contribute')).toBeFocused();
 expect(errors).toEqual([]);console.log('Five-module navigation: fixed geometry, four widths, both languages/themes, scroll, focus and sources passed');
} finally {await browser.close();}
