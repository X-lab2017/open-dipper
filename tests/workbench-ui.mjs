import {chromium, expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';

await mkdir('screenshots', {recursive:true});
const browser=await chromium.launch({headless:true});
try {
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173/open-dipper/');
  const earth=page.locator('#earth');
  await expect(earth).toHaveAttribute('data-fill-metric','developers');
  await expect(page.locator('#perspective')).toHaveValue('overview');
  await expect(page.locator('[data-layer]:checked')).toHaveCount(5);
  await expect(earth).toHaveAttribute('data-bubble-layer','models');
  await expect(page.locator('#observation-panel')).toContainText('标杆项目');
  await expect(page.locator('.scope-stats b')).toHaveText(['5','3','11']);
  await expect(page.locator('#legend-content')).toBeHidden();
  await expect(page.locator('#clear-layers')).toBeVisible();
  await expect(page.locator('.pulse-panel')).toHaveAttribute('data-paused','true');
  await page.locator('[data-pulse-step]').click();
  await expect.poll(()=>earth.getAttribute('data-simulated-pulse-count')).not.toBe('0');

  // Visibility includes clipping ancestors; DOM presence alone hid the regression.
  const clippedContent=()=>{
    const selectors=['.coverage-metric','.scope-stats','.inspector-rank','.catalog-link',
      '.latest-row','.pulse-metric','.pulse-platform','.pulse-event','.pulse-controls button',
      '.stack-title','#clear-layers'];
    const clipped=[];
    for(const selector of selectors)for(const [i,e] of [...document.querySelectorAll(selector)].entries()){
      const style=getComputedStyle(e);
      // The accepted composition deliberately shows two events, hiding the third.
      if(selector==='.pulse-event'&&style.display==='none')continue;
      const r=e.getBoundingClientRect();
      let left=0,top=0,right=innerWidth,bottom=innerHeight;
      for(let p=e.parentElement;p;p=p.parentElement){
        const s=getComputedStyle(p),b=p.getBoundingClientRect();
        if(/hidden|clip|auto|scroll/.test(s.overflowX)){left=Math.max(left,b.left);right=Math.min(right,b.right);}
        if(/hidden|clip|auto|scroll/.test(s.overflowY)){top=Math.max(top,b.top);bottom=Math.min(bottom,b.bottom);}
      }
      if(!r.width||!r.height||r.left<left-1||r.right>right+1||r.top<top-1||r.bottom>bottom+1)clipped.push(`${selector}[${i}]`);
    }
    return clipped;
  };
  for(const light of [false,true]) {
    if(light)await page.locator('#theme-toggle').click();
    for(const lang of ['zh','en']) {
      if(lang==='en')await page.locator('#language-toggle').click();
      for(const [width,height] of [[1280,720],[1366,768],[1440,900],[1920,1080],[1920,1200]]) {
        await page.setViewportSize({width,height});
        await expect(page.locator('.coverage-metric')).toHaveCount(5);
        await expect(page.locator('.inspector-rank')).toHaveCount(10);
        await expect(page.locator('.pulse-metric')).toHaveCount(4);
        await expect(page.locator('.pulse-platform')).toHaveCount(7);
        await expect(page.locator('.pulse-controls button')).toHaveCount(5);
        await expect.poll(()=>page.evaluate(clippedContent)).toEqual([]);
        await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1&&document.documentElement.scrollWidth<=innerWidth)).toBe(true);
        await expect.poll(()=>page.locator('.map-container').evaluate(e=>e.getBoundingClientRect().height)).toBeGreaterThan(400);
        const layout=await page.evaluate(()=>{
          const rect=s=>document.querySelector(s).getBoundingClientRect();
          const l=rect('.left-panel'),c=rect('.center-stage'),r=rect('.right-panel');
          return Math.abs(l.width-r.width)<1&&l.right<c.left&&c.right<r.left&&Math.abs(rect('.pulse-panel').top-rect('.latest-panel').top)<1;
        });
        expect(layout).toBe(true);
        await page.screenshot({path:`screenshots/workbench-${light?'light':'dark'}-${lang}-${width}x${height}.png`});
      }
      await page.setViewportSize({width:390,height:844});
      await expect(earth).toBeVisible();
      const camera=await earth.getAttribute('data-camera');
      await page.locator('[data-mobile=layers]').click();
      await expect(page.locator('.left-panel')).toBeVisible();
      await page.locator('[data-mobile=overview]').click();
      await expect(page.locator('.right-panel')).toBeVisible();
      await page.locator('[data-mobile=map]').click();
      await expect(earth).toHaveAttribute('data-camera',camera);
      await expect(earth).not.toHaveAttribute('data-camera',/NaN|Infinity/);
      await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      await page.screenshot({path:`screenshots/workbench-${light?'light':'dark'}-${lang}-mobile.png`,fullPage:true});
      if(lang==='en')await page.locator('#language-toggle').click();
    }
  }
  expect(errors).toEqual([]);
  console.log('Comprehensive defaults, complete first-screen inventory, clipping, pulse controls, themes/languages and mobile camera passed');
} finally {await browser.close();}
