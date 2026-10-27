import {chromium,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({headless:true});
const base=process.env.BASE_URL||'http://127.0.0.1:4173/open-dipper/';
const ids=['developers','companies','benchmark','models','meetings'];
const views=['map','globe','globe','map','globe'];
try{
 await mkdir('screenshots',{recursive:true});
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base);
 await expect(page.locator('.product-nav [data-page=ecosystem]')).toHaveText('开源星系');
 await expect(page.locator('[data-observation-tab="layer:developers"]')).toHaveAttribute('aria-selected','true');
 await expect(page.locator('.tour-controls')).toHaveCount(0);
 await page.locator('[data-zone=asia]').click();await expect(page.locator('#earth')).toHaveAttribute('data-camera','-105.00,28.00,1.60');const before=await page.locator('#earth').getAttribute('data-camera');
 await page.locator('#tour-start').click();await expect(page.locator('.tour-controls')).toHaveAttribute('data-playing','false');
 for(let i=0;i<5;i++){
  await expect(page.locator('.tour-controls')).toHaveAttribute('data-tour-index',String(i));
  await expect(page.locator(`[data-observation-tab="layer:${ids[i]}"]`)).toHaveAttribute('aria-selected','true');
  await expect(page.locator('#earth')).toHaveAttribute('data-view',views[i]);
  await expect(page.locator('.scope-panel h2')).toHaveText('全球');
  await expect(page.locator('.coverage-metric')).toHaveCount(5);await expect(page.locator('.pulse-metric')).toHaveCount(4);
  if(i===4){await expect(page.locator('#observation-panel')).toContainText('2026-11-09');await expect(page.locator('#tour-next')).toBeDisabled();}
  else await page.locator('#tour-next').click();
 }
 await page.locator('#map-fullscreen-button').click();await expect(page.locator('.shell')).toHaveClass(/focus-mode/);
 await page.keyboard.press('Escape');await expect(page.locator('.shell')).not.toHaveClass(/focus-mode/);await expect.poll(()=>page.evaluate(()=>!!document.fullscreenElement)).toBe(false);await expect(page.locator('#tour-start')).toBeFocused();
 await expect(page.locator('#earth')).toHaveAttribute('data-camera',before);
 await expect(page.locator('#earth')).toHaveAttribute('data-bubble-layer','models');
 await expect(page.locator('.scope-stats b')).toHaveText(['5','3','11']);

 // All geometry marks reserve the same slot; text baselines and type columns align.
 const alignment=await page.locator('.layer-row').evaluateAll(rows=>rows.map(row=>{
  const symbol=row.querySelector('.geometry-icon').getBoundingClientRect(),name=row.querySelector('label>span').getBoundingClientRect(),tag=row.querySelector('.geometry-tag').getBoundingClientRect();
  return {width:symbol.width,height:symbol.height,x:name.x,tag:tag.x,delta:Math.abs(symbol.y+symbol.height/2-name.y-name.height/2)};
 }));
 expect(alignment.every(r=>r.width===16&&r.height===16&&r.delta<1)).toBeTruthy();
 expect(new Set(alignment.map(r=>r.x)).size).toBe(1);expect(new Set(alignment.map(r=>r.tag)).size).toBe(1);

 for(const [width,height] of [[1280,720],[390,844]]){
  await page.setViewportSize({width,height});
  for(const light of [false,true]){
   if((await page.locator('html').getAttribute('data-theme'))!==(light?'light':'dark'))await page.locator('#theme-toggle').click();
   await page.locator('#tour-start').click();await page.locator('#tour-next').click();
   const fit=await page.evaluate(()=>{const e=document.querySelector('.tour-controls'),r=e.getBoundingClientRect();return {scroll:document.documentElement.scrollWidth,viewport:innerWidth,controls:r.right<=innerWidth&&r.left>=0&&e.scrollWidth<=e.clientWidth+1};});
   expect(fit.scroll).toBeLessThanOrEqual(fit.viewport);expect(fit.controls).toBeTruthy();
   if(width<700){await page.locator('[data-tour=panel]').click();await expect(page.locator('#observation-panel')).toBeInViewport();}
   await page.screenshot({path:`screenshots/world-tour-${width}-${light?'light':'dark'}.png`,fullPage:true});
   await page.locator('#tour-exit').click();
  }
 }
 await page.setViewportSize({width:1440,height:900});await page.locator('#language-toggle').click();
 await page.locator('#tour-start').click();await expect(page.locator('.tour-note')).toContainText('regional observations');
 await page.locator('#tour-exit').click();
 // Exercise the real browser timer, interruption, reduced-motion change and navigation cleanup.
 await page.emulateMedia({reducedMotion:'no-preference'});await page.clock.install();
 await page.locator('#tour-start').click();await expect(page.locator('.tour-controls')).toHaveAttribute('data-playing','true');
 await page.clock.fastForward(10100);await expect(page.locator('.tour-controls')).toHaveAttribute('data-tour-index','1');
 await page.locator('#earth').press('ArrowRight');await expect(page.locator('.tour-controls')).toHaveAttribute('data-playing','false');
 await page.clock.fastForward(20100);await expect(page.locator('.tour-controls')).toHaveAttribute('data-tour-index','1');
 await page.locator('#tour-toggle').click();await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('.tour-controls')).toHaveAttribute('data-playing','false');
 await page.locator('#tour-toggle').click();
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
 await expect(page.locator('.tour-controls')).toHaveAttribute('data-playing','false');
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));});
 await page.locator('.product-nav [data-page=radar]').click();await page.clock.fastForward(20100);await expect(page.locator('.radar-chart')).toBeVisible();
 await page.locator('.product-nav [data-page=overview]').click();await expect(page.locator('.tour-controls')).toHaveCount(0);await expect(page.locator('#tour-start')).toBeVisible();
 expect(errors).toEqual([]);console.log('World tour: 5 panels, sourced cameras, restoration, glyph alignment, themes, mobile, keyboard, timers and lifecycle passed');
}finally{await browser.close();}
