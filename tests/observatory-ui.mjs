import {chromium,expect} from '@playwright/test';
import {mkdir,readFile} from 'node:fs/promises';
const visualVersion=JSON.parse(await readFile('design/tokens.json','utf8')).version;
await mkdir('screenshots',{recursive:true});
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173/open-dipper/');
 const earth=page.locator('#earth');await expect(earth).toHaveAttribute('data-camera','-5.00,41.80,1.00');await expect(earth).toHaveAttribute('data-view','map');
 await expect(page.locator('.product-nav button')).toHaveCount(5);await expect(page.locator('.inspector-rank')).toHaveCount(10);
 await expect(page.locator('.lab-logo')).toHaveJSProperty('naturalWidth',981);await expect(page.locator('.product-logo')).toHaveJSProperty('naturalWidth',1040);
 await earth.press('ArrowRight');await expect(earth).not.toHaveAttribute('data-camera','-5.00,41.80,1.00');await earth.press('Home');await expect(earth).toHaveAttribute('data-camera','-5.00,41.80,1.00');
 await page.locator('[data-action=zoom-in]').click();await expect(earth).toHaveAttribute('data-camera','-5.00,41.80,1.30');await page.locator('[data-action=reset]').click();await expect(earth).toHaveAttribute('data-camera','-5.00,41.80,1.00');
 await page.locator('button[data-view=globe]').click();await expect(earth).toHaveAttribute('data-view','globe');await expect(earth).toHaveAttribute('data-rotating','false');await expect(page.locator('[data-action=rotate]')).toBeDisabled();
 await page.locator('[data-zone=asia]').click();await expect(earth).toHaveAttribute('data-camera','-105.00,28.00,1.60');await page.locator('button[data-view=map]').click();await expect(earth).toHaveAttribute('data-camera','-105.00,28.00,1.60');await page.locator('[data-action=reset]').click();
 await page.locator('[data-action=regions]').click();await page.locator('#region-query').fill('CHN');await page.locator('#region-results [data-region=CHN]').click();await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page.locator('.scope-panel')).toContainText('中国');await page.locator('[data-action=reset]').click();
 await page.locator('#legend-toggle').click();await expect(page.locator('#legend-content')).toBeVisible();await page.locator('#legend-toggle').click();await expect(page.locator('#legend-content')).toBeHidden();

 for(const [width,height] of [[1280,720],[1440,900],[1920,1080]]){await page.setViewportSize({width,height});await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1&&document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(earth).toHaveAttribute('data-camera','-5.00,41.80,1.00');await expect.poll(()=>page.locator('.map-container').evaluate(e=>e.getBoundingClientRect().height)).toBeGreaterThan(400);}
 await page.screenshot({path:'screenshots/atlas-dark-map.png'});await page.locator('#theme-toggle').click();await expect(page.locator('html')).toHaveAttribute('data-theme','light');await page.screenshot({path:'screenshots/atlas-light-map.png'});await page.locator('button[data-view=globe]').click();await page.screenshot({path:'screenshots/atlas-light-globe.png'});await page.locator('#theme-toggle').click();await page.screenshot({path:'screenshots/atlas-dark-globe.png'});
 await page.locator('[data-layout=two]').click();await expect(page.locator('#screen-two')).toBeVisible();await page.locator('[data-layout=one]').click();await expect(page.locator('#screen-two')).toHaveCount(0);
 await page.locator('#language-toggle').click();await expect(page.locator('.product-nav')).toContainText('AI radar');await page.reload();await expect(page.locator('.product-nav')).toContainText('AI radar');await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.setViewportSize({width:390,height:844});await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(earth).toBeVisible();await page.screenshot({path:'screenshots/atlas-mobile.png',fullPage:true});
 await page.locator('#map-fullscreen-button').click();await expect(page.locator('.shell')).toHaveClass(/focus-mode/);await expect(page.locator('.map-return')).toBeVisible();await expect.poll(()=>page.evaluate(()=>!!document.fullscreenElement)).toBe(true);await page.keyboard.press('Escape');await expect.poll(()=>page.evaluate(()=>!!document.fullscreenElement)).toBe(false);await expect(page.locator('.shell')).not.toHaveClass(/focus-mode/);
 await page.goto(new URL('design-system.html',page.url()).href);await expect(page.locator('h1')).toContainText('一致的视觉');await expect(page.locator('.ds-header')).toContainText(visualVersion);const download=page.waitForEvent('download');await page.getByRole('link',{name:'↓ 下载视觉基线',exact:true}).click();expect(await(await download).failure()).toBeNull();
 expect(errors).toEqual([]);console.log('Atlas framing, resize, themes, globe, navigation, fullscreen return, legacy design download and responsive checks passed');
}finally{await browser.close();}
