import {chromium,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const base=process.env.BASE_URL||'http://127.0.0.1:4173/open-dipper/';
const browser=await chromium.launch({headless:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.clock.install();await page.goto(base);
 await expect(page.locator('.coverage-card')).toHaveCount(8);
 await expect(page.locator('[data-stat=organizations]')).toHaveText('508');
 await expect(page.locator('[data-stat=facilities]')).toHaveText('—');
 await page.locator('.organization-breakdown summary').click();await expect(page.locator('.organization-breakdown')).toContainText('基金会 34');
 const presets=[['developer','开发者贡献',['release','community','security']],['enterprise','项目影响力',['release','security','research']],['researcher','模型发布组织样本',['research','release']],['policy','开发者规模',['policy','foundation','research']],['foundation','组织关联社区',['foundation','community','security']],['global','开发者规模',[]]];
 for(const [id,title,categories] of presets){
  await page.locator('#viewpoint').selectOption(id);await expect(page.locator('.map-heading h2')).toContainText(title);
  expect((await page.locator('[data-category][aria-pressed=true]').evaluateAll(es=>es.map(e=>e.dataset.category))).sort()).toEqual(categories.sort());
  await expect(page.locator('#viewpoint')).toHaveValue(id);
 }
 await page.locator('#viewpoint').selectOption('researcher');
 await page.getByRole('button',{name:'⌕ 定位地域',exact:true}).click();await page.getByLabel('地域名称或代码').fill('USA');await page.locator('[data-locate-country=USA]').click();
 await page.getByRole('button',{name:'地域详情与事件 ↗',exact:true}).click();await expect(page.getByRole('dialog')).toContainText('46,314');await expect(page.getByRole('dialog')).toContainText('统计期未披露');await page.keyboard.press('Escape');
 await page.locator('[data-object=dataset]').click();await expect(page.locator('#viewpoint')).toHaveValue('custom');await expect(page.locator('.map-heading')).toContainText('数据集');
 await page.locator('#publisher-metric').selectOption('downloads');await expect(page.locator('#publisher-metric')).toHaveValue('downloads');
 await page.locator('[data-object=facility]').click();await expect(page.locator('.layer-unavailable')).toContainText('位置数据待接入');
 await page.locator('#viewpoint').selectOption('global');await page.getByRole('button',{name:'⌕ 定位地域',exact:true}).click();await page.getByLabel('地域名称或代码').fill('CHN');await page.locator('[data-locate-country=CHN]').click();
 await expect(page.locator('.scene-inspector')).toContainText('中国');await expect(page.locator('#earth')).toHaveAttribute('data-selected-group','CHN');
 await page.locator('#event-days').selectOption('0');await page.locator('#region').selectOption('CHN');await expect(page.locator('.event-feed')).toContainText('中国台湾');
 await page.locator('.event-feed .event-card').filter({hasText:'中国台湾开源社区交流'}).click();await expect(page.locator('.scene-inspector')).toContainText('中国台湾');await page.getByRole('button',{name:'EN',exact:true}).click();await expect(page.locator('.scene-inspector')).toContainText('Taiwan, China');
 await page.locator('#viewpoint').selectOption('global');
 // A failed fetch preserves the observed count; a new snapshot is shown once, including with an open dialog.
 const feed=JSON.parse(await readFile('public/data/events.json','utf8'));const previous=await page.locator('[data-stat=events]').innerText();
 await page.route('**/data/events.json',r=>r.fulfill({status:503,body:'unavailable'}));
 await page.locator('[data-action=refresh]').click();await expect(page.locator('#refresh-feedback')).toContainText('Check failed');await expect(page.locator('[data-stat=events]')).toHaveText(previous);
 const stamp=new Date(Date.now()+1000).toISOString();const item={...feed.events[0],id:'workspace-refresh-fixture',title:'Workspace refresh fixture',titleEn:'Workspace refresh fixture',occurredAt:stamp};const next={...feed,generatedAt:stamp,events:[item,...feed.events]};
 await page.unroute('**/data/events.json');await page.route('**/data/events.json',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(next)}));
 await page.getByRole('button',{name:'View data & sources',exact:true}).click();await page.clock.fastForward(300001);await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');
 await expect(page.locator('[data-stat=events]')).toHaveText(String(Number(previous.replaceAll(',',''))+1));await expect(page.locator('#refresh-feedback')).toContainText('1 new');await expect(page.locator('.event-card.new-event')).toContainText('Workspace refresh fixture');
 await page.locator('[data-action=refresh]').click();await expect(page.locator('#refresh-feedback')).not.toContainText('1 new');
 await page.route('**/data/observation.json',r=>r.fulfill({status:503,body:'unavailable'}));await page.reload();
 await expect(page.locator('[data-stat=organizations]')).toHaveText('—');await page.locator('#viewpoint').selectOption('researcher');await expect(page.locator('.layer-unavailable')).toBeVisible();await expect(page.locator('[data-stat=models]')).not.toHaveText('—');
 expect(errors).toEqual([]);console.log('Workspace audience presets, entity layers, coverage, China grouping, refresh and optional-source failure passed');
}finally{await browser.close();}
