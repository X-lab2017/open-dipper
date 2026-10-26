import {chromium,expect} from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true});
const base=process.env.BASE_URL||'http://127.0.0.1:4173/open-dipper/';
try{
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'#radar');await expect(page.locator('.radar-node')).toHaveCount(80);await expect(page.locator('.radar-summary')).toContainText('60');
 await page.locator('[data-radar-sector="1"]').click();await expect(page.locator('.radar-node')).toHaveCount(20);await expect(page.locator('.radar-chart')).toHaveAttribute('viewBox','340 0 340 340');
 await page.locator('[data-radar-sector="all"]').click();await expect(page.locator('.radar-node')).toHaveCount(80);
 await page.locator('.radar-node').nth(30).hover();await expect(page.locator('.radar-target-preview')).not.toContainText('Codex');
 await expect(page.locator('.product-logo')).toHaveAttribute('src',/opendipper-horizontal-dark/);
 await page.locator('[data-radar-guide]').first().click();await expect(page.getByRole('dialog')).toContainText('从发现到行动');await page.getByRole('dialog').locator('[data-radar-scenario=coding]').click();await expect(page.locator('#radar-scenario')).toHaveValue('coding');await expect(page.getByRole('dialog')).toHaveCount(0);
 await page.locator('[data-radar-reset]').first().click();
 const first=await page.locator('.radar-candidate').first().getAttribute('data-radar-select');await page.locator('.radar-inspector [data-radar-watch]').click();await expect(page.locator('.radar-inspector [data-radar-watch]')).toHaveAttribute('aria-pressed','true');
 await page.locator('.radar-inspector [data-radar-compare]').click();await page.locator('.radar-candidate').nth(1).click();await page.locator('.radar-inspector [data-radar-compare]').click();await page.locator('[data-radar-open-compare]').click();await expect(page.getByRole('dialog')).toContainText('Codex');await expect(page.getByRole('dialog')).toContainText('Gemini');
 const downloadPromise=page.waitForEvent('download');await page.locator('#radar-export-compare').click();const download=await downloadPromise;const markdown=await fs.readFile(await download.path(),'utf8');expect(markdown).toContain('模拟建议');expect(markdown).toContain('2026-08');await page.keyboard.press('Escape');
 await page.locator('.radar-inspector [data-radar-checklist]').click();await expect(page.getByRole('dialog').locator('input[type=checkbox]')).toHaveCount(3);await page.getByRole('dialog').locator('input[type=checkbox]').first().check();await page.keyboard.press('Escape');
 await page.locator('[data-radar-focus]').click();await expect(page.locator('.radar-expanded')).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('.radar-expanded')).toHaveCount(0);
 await page.locator('.radar-inspector [data-radar-evidence]').click();await expect(page.getByRole('dialog')).toContainText('Agentic AI Landscape');await page.keyboard.press('Escape');
 await page.locator('[data-radar-lens=assets]').click();await expect(page.locator('.radar-node')).toHaveCount(80);await page.locator('[data-radar-kind=dataset]').click();await expect(page.locator('.radar-node')).toHaveCount(20);
 await page.locator('#radar-demo').uncheck();await expect(page.locator('.radar-chart')).toHaveCount(0);await expect(page.locator('.radar-table tbody tr')).toHaveCount(20);await expect(page.locator('.radar-inspector .simulated')).toHaveCount(0);
 await page.locator('#radar-search').fill('no-such-candidate');await expect(page.locator('.radar-table tbody tr')).toHaveCount(0);await page.locator('[data-radar-reset]').first().click();await page.locator('#radar-demo').check();await page.locator('[data-radar-view=radar]').click();
 await page.locator('.top-actions [data-page=following]').click();await expect(page.locator(`[data-radar-open="${first}"]`)).toBeVisible();await page.reload();await page.locator(`[data-radar-open="${first}"]`).click();await expect(page.locator('.radar-inspector h2')).toHaveText('Codex');
 await page.locator('.radar-node').nth(1).focus();await page.keyboard.press('Enter');await expect(page.locator('.radar-node[aria-pressed=true]')).toBeFocused();
 await page.locator('[data-layout=two]').click();await expect(page.locator('#radar-screen-two')).toBeVisible();await page.locator('[data-layout=one]').click();await expect(page.locator('#radar-screen-two')).toHaveCount(0);
 await fs.mkdir('screenshots',{recursive:true});await page.screenshot({path:'screenshots/ai-radar-dark.png',fullPage:true});
 await page.locator('#theme-toggle').click();await expect(page.locator('html')).toHaveAttribute('data-theme','light');await page.locator('[data-radar-lens=assets]').click();await page.screenshot({path:'screenshots/ai-radar-light.png',fullPage:true});
 await page.locator('#language-toggle').click();await expect(page.locator('html')).toHaveAttribute('lang','en');await expect(page.locator('.radar-intro')).toContainText('Choose your next step');
 await page.setViewportSize({width:390,height:844});await expect(page.locator('.radar-chart')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);await page.screenshot({path:'screenshots/ai-radar-mobile.png',fullPage:true});
 await page.locator('.product-nav [data-page=overview]').click();await expect(page.locator('#earth')).toBeVisible();expect(errors).toEqual([]);
 // Optional demo failure preserves sourced candidates; catalog failure must leave the atlas usable.
 const noDemo=await browser.newPage();await noDemo.route('**/data/radar-demo.json',r=>r.fulfill({status:200,body:'{}',contentType:'application/json'}));await noDemo.goto(base+'#radar');await expect(noDemo.locator('.radar-table tbody tr')).toHaveCount(80);await expect(noDemo.locator('#radar-demo')).toBeDisabled();
 const noCatalog=await browser.newPage();await noCatalog.route('**/data/radar-catalog.json',r=>r.fulfill({status:200,body:'{}',contentType:'application/json'}));await noCatalog.goto(base+'#radar');await expect(noCatalog.locator('[data-radar-reload]')).toBeVisible();await noCatalog.locator('.product-nav [data-page=overview]').click();await expect(noCatalog.locator('#earth')).toBeVisible();
 console.log('AI radar: sources/demo separation, two lenses, tasks, compare/export, local watch, keyboard, themes, EN/mobile, presentation and optional-data failures passed');
}finally{await browser.close();}
