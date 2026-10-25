import {chromium,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
await mkdir('screenshots',{recursive:true});
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173/open-dipper/');
 await expect(page.locator('#earth')).toBeVisible();await expect(page.locator('.pulse-strip')).toContainText('样本仓库');
 await expect.poll(()=>page.locator('#earth').evaluate(c=>c.width>100&&c.height>100)).toBe(true);
 await page.screenshot({path:'screenshots/observatory-map.png',fullPage:true});
 await page.getByRole('button',{name:'立体地球',exact:true}).click();await expect(page.locator('[data-action="view-globe"]')).toHaveClass('active');
 await page.screenshot({path:'screenshots/observatory-globe.png'});
 await page.locator('#demo-events').uncheck();await expect(page.locator('.event-feed .badge.demo')).toHaveCount(0);
 await page.locator('#demo-events').check();await page.locator('#geo-dataset').selectOption('demo');await page.getByRole('button',{name:'活跃度',exact:true}).click();await expect(page.locator('.map-heading')).toContainText('模拟地域指标');
 await page.locator('#geo-dataset').selectOption('real');const caption=await page.locator('.map-caption').innerText();await page.locator('#month').selectOption({index:6});await expect(page.locator('.map-caption')).toHaveText(caption,{useInnerText:true});
 await page.getByRole('button',{name:'事件快讯',exact:true}).click();await expect(page.locator('.wire-main')).toBeVisible();await page.locator('#search').fill('nonexistent-open-dipper-query');await page.locator('#search').blur();await expect(page.locator('.event-feed .empty')).toBeVisible();await page.locator('#search').fill('');await page.locator('#search').blur();
 await page.locator('.event-card').first().click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);
 await page.getByRole('button',{name:'＋ 录入生态事件',exact:true}).click();await page.locator('[name="title"]').fill('Review fixture');await page.locator('[name="summary"]').fill('Not submitted by this test');await page.locator('[name="occurredAt"]').fill('2026-10-24T12:00');await page.locator('[name="sourceUrl"]').fill('https://example.com/event');await page.locator('[name="source"]').fill('Fixture');await page.locator('button[type=submit]').click();await expect(page.locator('#draft-result')).toContainText('尚未公开发布');await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'全球地图',exact:true}).click();await page.getByRole('button',{name:'EN',exact:true}).click();await expect(page.locator('nav')).toContainText('THE MAP');await page.getByRole('button',{name:'Toggle theme',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.setViewportSize({width:390,height:844});await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(page.locator('#earth')).toBeVisible();await page.screenshot({path:'screenshots/observatory-mobile.png',fullPage:true});
 await page.getByRole('button',{name:'Submit an event',exact:false}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');
 expect(errors).toEqual([]);console.log('Observatory map/globe/wire, filters, draft, language, themes and mobile checks passed');
}finally{await browser.close();}
