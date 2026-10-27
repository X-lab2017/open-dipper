import {chromium,expect} from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173/open-dipper/#briefing');await expect(page.locator('.agent-room')).toBeVisible();
 await expect(page.locator('.room-badge')).toContainText('模拟');await expect(page.locator('.room-evidence')).toContainText('未获取');
 await fs.mkdir('screenshots',{recursive:true});await page.screenshot({path:'screenshots/agent-room-dark.png',fullPage:true});
 await page.locator('[data-room="tab:research"]').first().click();await page.locator('#room-draft').fill('<script>alert(1)</script> 帮我研究真实需求');await page.locator('[data-room="save"]').click();
 await page.locator('[data-room="stage:2"]').click();await expect(page.locator('.room-stage')).toContainText('缺少同口径');
 await page.locator('[data-room="track"]').click();await page.locator('[data-room="tab:tracking"]').click();await expect(page.locator('.room-tracking-list')).toContainText('推理框架');
 await page.locator('#room-cadence').selectOption('changes');await page.locator('#room-condition').selectOption('maintenance');await page.reload();await expect(page.locator('#room-cadence')).toHaveValue('changes');await expect(page.locator('#room-condition')).toHaveValue('maintenance');
 await page.locator('[data-room="tab:research"]').click();await expect(page.locator('#room-draft')).toHaveValue('<script>alert(1)</script> 帮我研究真实需求');
 await page.locator('[data-room="feedback:missing"]').click();const download=page.waitForEvent('download');await page.locator('[data-room="export"]').click();const file=await download;const body=await fs.readFile(await file.path(),'utf8');expect(body).toContain('DEMO');expect(body).toContain('未执行真实 Agent');expect(body).toContain('missing');
 await page.locator('#theme-toggle').click();await page.screenshot({path:'screenshots/agent-room-light-research.png',fullPage:true});
 await page.locator('[data-room="select:continuity"]').click();await expect(page.locator('.room-evidence')).toContainText('维护者确认');
 await page.locator('#language-toggle').click();await expect(page.locator('#portal-title').first()).toHaveText('Agent Intelligence Room');await expect(page.locator('.room-stage')).toContainText('critical dependency');
 await page.locator('[data-room="tab:tracking"]').click();await page.locator('[data-room="clear"]').click();await page.locator('[data-room="tab:tracking"]').click();await expect(page.locator('.room-tracking-list')).toContainText('No tracking');
 await page.setViewportSize({width:390,height:844});await page.locator('[data-room="tab:signals"]').click();await page.screenshot({path:'screenshots/agent-room-mobile.png',fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
 await page.setViewportSize({width:1440,height:900});await page.locator('.product-nav [data-page="overview"]').click();await expect(page.locator('#earth')).toBeVisible();await page.locator('.product-nav [data-page="radar"]').click();await expect(page.locator('.radar-chart')).toBeVisible();await page.locator('.product-nav [data-page="ecosystem"]').click();await expect(page.locator('.galaxy-shell')).toBeVisible();
 expect(errors).toEqual([]);console.log('Agent Room: simulation, scenarios, drafts, persistence, export, clear, themes, languages, mobile, module return passed');
}finally{await browser.close();}
