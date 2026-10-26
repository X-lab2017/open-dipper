import {chromium, expect} from '@playwright/test';
import {mkdir, readFile} from 'node:fs/promises';

await mkdir('screenshots', {recursive:true});
const feed=JSON.parse(await readFile('public/data/events.json','utf8'));
const browser=await chromium.launch({headless:true});
try {
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173/open-dipper/');
  const earth=page.locator('#earth');
  await expect(earth).toHaveAttribute('data-fill-metric','developers');
  await expect(page.locator('#perspective')).toHaveValue('participation');
  await expect(page.locator('[data-layer]:checked')).toHaveCount(1);
  await expect(page.locator('#observation-panel')).toContainText('活跃开发者');
  await expect(page.locator('.map-period')).toContainText('2025.07');
  await expect(page.locator('#legend-content')).toBeVisible();
  await expect(page.locator('[data-stat=intelligence]')).toHaveText(String(feed.events.filter(e=>e.provenance!=='demo').length));
  await expect(page.locator('#layer-settings-content')).toBeHidden();
  await page.locator('#layer-settings-toggle').press('Enter');
  await expect(page.locator('#clear-layers')).toBeVisible();
  await expect(page.locator('#layer-settings-toggle')).toBeFocused();
  await page.locator('#layer-settings-toggle').press('Enter');

  // The collapsed demo must neither mount its controls nor leave map pulses.
  await expect(page.locator('.pulse-panel')).toHaveCount(0);
  await expect(earth).toHaveAttribute('data-simulated-pulse-count','0');
  await page.locator('#pulse-toggle').click();
  await expect(page.locator('.pulse-panel')).toHaveAttribute('data-paused','true');
  await page.locator('[data-pulse-step]').click();
  await expect.poll(()=>earth.getAttribute('data-simulated-pulse-count')).not.toBe('0');
  await page.locator('#pulse-toggle').click();
  await expect(page.locator('.pulse-panel')).toHaveCount(0);
  await expect(earth).toHaveAttribute('data-simulated-pulse-count','0');
  await expect(page.locator('#pulse-toggle')).toBeFocused();

  // A geographic selection must not strand the inspector on a global project rank.
  await page.locator('#perspective').selectOption('overview');
  await page.getByRole('tab',{name:'标杆项目',exact:true}).click();
  await page.locator('[data-action=regions]').click();
  await page.locator('#region-query').fill('CHN');
  await page.locator('#region-results [data-region=CHN]').click();
  await expect(page.locator('.scope-panel')).toContainText('中国');
  await expect(page.locator('#observation-panel')).toContainText('活跃开发者');
  await page.getByRole('tab',{name:'标杆项目',exact:true}).click();
  await expect(page.locator('#observation-panel')).toContainText('全球前十');
  await page.locator('#perspective').selectOption('participation');

  for(const light of [false,true]) {
    if(light)await page.locator('#theme-toggle').click();
    for(const lang of ['zh','en']) {
      if(lang==='en')await page.locator('#language-toggle').click();
      for(const [width,height] of [[1280,720],[1024,768],[390,844]]) {
        await page.setViewportSize({width,height});
        await expect(earth).toBeVisible();
        await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
        const title=page.locator('.workspace-heading h1');
        expect(await title.evaluate(e=>parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(21);
        await page.screenshot({path:`screenshots/workbench-${light?'light':'dark'}-${lang}-${width}.png`,fullPage:true});
        if(width===390) {
          await page.locator('[data-mobile=layers]').click();
          await expect(page.locator('.left-panel')).toBeVisible();
          await expect(earth).toBeHidden();
          await page.locator('[data-mobile=overview]').click();
          await expect(page.locator('.right-panel')).toBeVisible();
          await expect(page.locator('.left-panel')).toBeHidden();
          await page.locator('[data-mobile=map]').click();
        }
      }
      if(lang==='en')await page.locator('#language-toggle').click();
    }
  }
  expect(errors).toEqual([]);
  console.log('Workbench defaults, scope continuity, disclosure lifecycle, keyboard focus and theme/language/responsive matrix passed');
} finally {await browser.close();}
