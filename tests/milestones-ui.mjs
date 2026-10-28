import {chromium,expect} from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1366,height:1000}});const errors=[],writes=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.method()!=='GET')writes.push(r.url());});
 const base=(process.env.BASE_URL||'http://127.0.0.1:4173/open-dipper/').split('#')[0];
 await fs.mkdir('screenshots',{recursive:true});await page.goto(base+'#contribute');await expect(page.locator('.about-module')).toHaveCount(4);
 const before=await page.locator('.product-nav').boundingBox();
 await page.locator('#community-tab-milestones').click();await expect(page.locator('#community-tab-milestones')).toHaveAttribute('aria-selected','true');await expect(page.locator('.about-module')).toHaveCount(0);await expect(page.locator('.milestone-event')).toHaveCount(17);await expect(page.locator('.milestone-day')).toHaveCount(5);await expect(page.locator('#portal-title')).toContainText('让开放世界');
 expect(await page.locator('.product-nav').boundingBox()).toEqual(before);
 await expect(page.locator('.milestone-trail')).toHaveCSS('animation-play-state','running');await page.locator('[data-about-motion]').click();await expect(page.locator('.milestone-trail')).toHaveCSS('animation-play-state','paused');await page.locator('[data-about-motion]').click();await expect(page.locator('.milestone-trail')).toHaveCSS('animation-play-state','running');
 await page.screenshot({path:'screenshots/milestones-dark-overview.png'});
 await page.locator('[data-milestone-jump="research"]').click();await expect(page.locator('#milestone-research')).toBeFocused();await expect(page.locator('#milestone-research')).toContainText('编辑演示');await expect(page.locator('#milestone-research')).toBeInViewport();await page.screenshot({path:'screenshots/milestones-dark-research.png'});
 await page.locator('[data-milestone-day="2026-10-28"]').click();await expect(page.locator('#milestone-date-2026-10-28')).toBeFocused();await expect(page.locator('#milestone-date-2026-10-28')).toBeInViewport();
 for(const a of await page.locator('.milestone-evidence a').all()){expect(await a.getAttribute('href')).toMatch(/^https:\/\/github.com\/X-lab2017\/open-dipper\/(pull|issues|commit|actions\/runs)\//);expect(await a.getAttribute('rel')).toContain('noopener');}
 await page.reload();await expect(page.locator('#community-tab-milestones')).toHaveAttribute('aria-selected','true');
 for(const width of [1366,768,390]){
  await page.setViewportSize({width,height:1000});
  for(const lang of ['zh','en']){
   if((await page.locator('html').getAttribute('lang')).startsWith('zh')!==(lang==='zh'))await page.locator('#language-toggle').click();
   for(const theme of ['dark','light']){
    if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme-toggle').click();
    await expect(page.locator('#community-tab-milestones')).toHaveAttribute('aria-selected','true');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    if(width===1366&&lang==='en'&&theme==='light'){await page.locator('.page-contribute').evaluate(el=>el.scrollTop=0);await page.screenshot({path:'screenshots/milestones-light-en.png'});}
    if(width===390&&lang==='zh'&&theme==='dark'){await page.locator('.page-contribute').evaluate(el=>el.scrollTop=0);await page.screenshot({path:'screenshots/milestones-mobile-dark.png'});await page.locator('#milestone-galaxy').scrollIntoViewIfNeeded();await page.screenshot({path:'screenshots/milestones-mobile-event.png'});}
   }
  }
 }
 await page.locator('#community-tab-milestones').focus();await page.keyboard.press('ArrowLeft');await expect(page.locator('#community-tab-about')).toBeFocused();await expect(page.locator('.about-module')).toHaveCount(4);await page.keyboard.press('ArrowRight');await expect(page.locator('#community-tab-milestones')).toBeFocused();
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('[data-about-motion]')).toBeDisabled();await expect(page.locator('.milestone-trail')).toHaveCSS('animation-name','none');
 await page.locator('[data-about-join]').click();await expect(page.locator('#about-join')).toBeFocused();await expect(page.locator('.about-module')).toHaveCount(4);
 await page.locator('#nav-overview').click();await expect(page.locator('#earth')).toBeVisible();await page.locator('#nav-contribute').click();await expect(page.locator('.about-community')).toBeVisible();
 expect(writes).toEqual([]);expect(errors).toEqual([]);console.log('Milestones: evidence, deep link, jumps/focus, tabs, live reduced motion, theme/language/viewport matrix passed');
}finally{await browser.close();}
