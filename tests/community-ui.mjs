import {chromium,expect} from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1366,height:768},reducedMotion:'reduce'});const errors=[],writes=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.method()!=='GET')writes.push(r.url());});
 const base=(process.env.BASE_URL||'http://127.0.0.1:4173/open-dipper/').split('#')[0];await page.goto(base+'#contribute');
 await expect(page.locator('#portal-title')).toHaveText('共建社区');await expect(page.locator('[data-community-intent]')).toHaveCount(3);
 await expect(page.locator('.community-main a').first()).toHaveAttribute('href','https://github.com/X-lab2017/open-dipper/issues/35');
 await page.locator('[data-community-copy]').click();await expect(page.locator('#community-copy-status')).toContainText('先填写');
 await page.locator('#community-draft').fill('反馈草稿 <script>alert(1)</script>');
 await page.locator('[data-community-intent="sources"]').click();await expect(page.locator('#community-draft')).toHaveValue('');await page.locator('#community-draft').fill('来源 https://example.org/paper');
 await expect(page.locator('.community-main a').first()).toHaveAttribute('href',/data_correction.yml$/);await page.locator('[data-community-intent="feedback"]').click();await expect(page.locator('#community-draft')).toHaveValue('反馈草稿 <script>alert(1)</script>');
 const box=await page.locator('.community-workspace').boundingBox();expect(box.y+box.height).toBeLessThanOrEqual(768);await fs.mkdir('screenshots',{recursive:true});await page.screenshot({path:'screenshots/community-dark.png'});
 await page.context().grantPermissions(['clipboard-read','clipboard-write']);await page.locator('[data-community-copy]').click();await expect(page.locator('#community-copy-status')).toContainText('尚未提交');expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('反馈草稿');
 await page.locator('[data-community-intent="develop"]').click();await expect(page.locator('.community-main')).toContainText('AGENTS.md');await expect(page.locator('.community-main a[href$="/issues"]')).toBeVisible();await expect(page.locator('#community-draft')).toHaveCount(0);await page.screenshot({path:'screenshots/community-develop-dark.png'});
 await page.locator('#theme-toggle').click();await page.locator('#language-toggle').click();await expect(page.locator('#portal-title')).toHaveText('Community');await expect(page.locator('.community-main')).toContainText('Start with one well-scoped task');
 await page.locator('[data-community-intent="feedback"]').click();await expect(page.locator('#community-draft')).toHaveValue('反馈草稿 <script>alert(1)</script>');await page.screenshot({path:'screenshots/community-light-en.png'});
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);await page.screenshot({path:'screenshots/community-mobile.png'});
 await page.locator('[data-community-results]').click();await expect(page.locator('#community-results')).toBeFocused();await expect(page.locator('.community-result-grid article')).toHaveCount(3);await page.locator('.community-result-grid [data-page="briefing"]').click();await expect(page.locator('.agent-room')).toBeVisible();
 await page.locator('.product-nav [data-page="contribute"]').click();await expect(page.locator('#community-draft')).toHaveValue('反馈草稿 <script>alert(1)</script>');await page.reload();await expect(page.locator('#community-draft')).toHaveValue('');
 expect(writes).toEqual([]);expect(errors).toEqual([]);console.log('Community intents, source links, draft privacy, real copy, themes, mobile and product round trip passed');
}finally{await browser.close();}
