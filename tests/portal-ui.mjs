import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173/open-dipper/');await expect(page.locator('#earth')).toBeVisible();
 await page.locator('.product-nav [data-page=radar]').click();await expect(page).toHaveURL(/#radar$/);await expect(page.locator('[data-supply-month]')).toHaveCount(12);await page.locator('[data-supply-metric=datasets]').click();await expect(page.locator('.supply-selection')).toContainText('23,811');await page.locator('[data-supply-month="2026-06"]').click();await expect(page.locator('.supply-selection')).toContainText('49,480');
 await page.getByLabel('显示模拟',{exact:true}).check();expect(await page.locator('.signal-card .badge.demo').count()).toBeGreaterThan(0);await page.getByLabel('显示模拟',{exact:true}).uncheck();await expect(page.locator('.signal-card .badge.demo')).toHaveCount(0);
 await page.locator('.product-nav [data-page=ecosystem]').click();await expect(page).toHaveURL(/#ecosystem$/);await expect(page.locator('.portal-page')).toBeVisible();
 await page.locator('.product-nav [data-page=briefing]').click();await expect(page).toHaveURL(/#briefing$/);await expect(page.locator('.membership-section')).toContainText('未开售');await page.getByRole('button',{name:'阅读完整样刊 ↗',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');
 await page.locator('.product-nav [data-page=contribute]').click();await expect(page).toHaveURL(/#contribute$/);await expect(page.locator('.portal-page')).toBeVisible();
 await page.locator('.top-actions [data-page=following]').click();await expect(page).toHaveURL(/#following$/);await expect(page.locator('#brief-cadence')).toBeVisible();await page.locator('#brief-cadence').selectOption('daily');await page.reload();await expect(page.locator('#brief-cadence')).toHaveValue('daily');
 await page.locator('.product-nav [data-page=overview]').click();await expect(page.locator('#earth')).toHaveAttribute('data-view','map');expect(errors).toEqual([]);console.log('All product sections, AI supply charts, demo filter, sample, and local preferences passed');
}finally{await browser.close();}
