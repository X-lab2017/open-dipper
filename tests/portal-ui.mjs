import {chromium,expect} from '@playwright/test';
import {mkdir,readFile} from 'node:fs/promises';
await mkdir('screenshots',{recursive:true});
const browser=await chromium.launch({headless:true});
const base=process.env.BASE_URL||'http://127.0.0.1:4173/open-dipper/';
try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await expect(page.locator('#earth')).toBeVisible();
  await expect(page.locator('.product-nav')).toContainText('AI 雷达');
  await expect(page.locator('.intelligence-rail')).toContainText('尚未收费');
  await expect(page.locator('#geo-dataset')).toHaveValue('global');
  await expect(page.locator('.evidence-headline')).toContainText('2025');await expect(page.locator('.evidence-headline')).toContainText('2026-10-16');
  await page.locator('[data-atlas-metric="contribution"]').press('Enter');await expect(page.locator('.scope-note')).toContainText('236');
  await expect(page.locator('[data-atlas-metric="contribution"]')).toBeFocused();
  await page.locator('[data-atlas-metric="influence"]').click();await expect(page.locator('.scope-note')).toContainText('30 个地域');
  await page.locator('[data-atlas-metric="developers"]').click();
  await page.getByRole('button',{name:'来源与范围 ↗',exact:true}).click();
  await expect(page.getByRole('dialog')).toContainText('统计期间未披露');
  await page.locator('[data-atlas-country="RE"]').click();await expect(page.getByRole('dialog')).toContainText('没有匹配的地图标注点');
  await expect(page.locator('.country-stats')).toContainText('—');await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'AI 雷达',exact:true}).click();
  await expect(page).toHaveURL(/#radar$/);
  await expect(page.locator('[data-supply-month]')).toHaveCount(12);
  await expect(page.locator('.supply-selection')).toContainText('55,545');
  await page.locator('[data-supply-metric="datasets"]').press('Enter');await expect(page.locator('.supply-selection')).toContainText('23,811');
  await page.locator('[data-supply-month="2026-06"]').press('Enter');await expect(page.locator('.supply-selection')).toContainText('49,480');
  await expect(page.locator('[data-supply-month="2026-06"]')).toBeFocused();
  await page.locator('[data-evidence="supply"]').click();await expect(page.getByRole('dialog')).toContainText('末月完整性未披露');
  await expect(page.getByRole('link',{name:'固定版本报告数据 ↗',exact:true})).toHaveAttribute('href',/c51e3441361407b68f10b339d97eff288319b503/);await page.keyboard.press('Escape');
  await expect(page.locator('.signal-card .badge.demo')).toHaveCount(8); // observed count can change during scheduled collection
  await page.getByLabel('显示模拟',{exact:true}).uncheck();
  await expect(page.locator('.signal-card .badge.demo')).toHaveCount(0);
  await page.reload();await expect(page.getByLabel('显示模拟',{exact:true})).not.toBeChecked();
  await page.getByRole('button',{name:'研究与复现',exact:true}).click();await expect(page.locator('.portal-empty')).toBeVisible();
  await page.getByLabel('显示模拟',{exact:true}).check();await expect(page.locator('.signal-card')).toHaveCount(2);
  await page.getByRole('button',{name:'全部主题',exact:true}).click();
  await page.getByLabel('搜索情报',{exact:true}).fill('Meridian');await expect(page.locator('.signal-card')).toHaveCount(1);
  await page.locator('.signal-title').click();await expect(page.getByRole('dialog')).toContainText('固定虚构场景');
  await expect(page.locator('.evidence-chain')).toContainText('待接入');
  await page.getByRole('button',{name:'在地图上查看 ↗',exact:true}).click();
  await expect(page).toHaveURL(/#overview$/);await expect(page.locator('.scene-inspector')).toContainText('上海 · 模拟');
  await expect(page.locator('#earth')).toHaveAttribute('data-camera',/-121.47,31.23/);
  await page.getByRole('button',{name:'查看详情与来源 ↗',exact:true}).click();await expect(page.locator('.signal-detail')).toBeVisible();
  await page.getByRole('button',{name:'☆ 收藏情报',exact:true}).click();await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button',{name:'我的关注',exact:true}).click();await expect(page.locator('.following-results')).toContainText('1 项收藏');
  await expect(page.locator('.signal-card')).toHaveCount(1);
  await page.getByRole('button',{name:'模型与能力 ＋',exact:true}).click();
  expect(await page.locator('.signal-card').count()).toBeGreaterThan(1);
  await page.locator('#brief-cadence').selectOption('daily');
  const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'导出当前简报',exact:true}).click();
  const download=await downloadPromise;const downloaded=await readFile(await download.path(),'utf8');
  expect(download.suggestedFilename()).toBe('opendipper-brief-zh.md');expect(downloaded).toContain('[DEMO]');expect(downloaded).toContain('daily');expect(downloaded).toContain('不代表新采集');
  await page.reload();await expect(page.locator('#brief-cadence')).toHaveValue('daily');await expect(page.locator('.following-results')).toContainText('1 项收藏');
  await page.getByLabel('显示模拟',{exact:true}).uncheck();await expect(page.locator('.signal-card .badge.demo')).toHaveCount(0);
  await page.getByRole('button',{name:'情报订阅',exact:true}).click();await expect(page.locator('.membership-section')).toContainText('未开售');
  await page.getByRole('button',{name:'阅读完整样刊 ↗',exact:true}).click();await expect(page.getByRole('dialog')).toContainText('模拟内容已隐藏');await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'我的关注',exact:true}).click();await page.getByLabel('显示模拟',{exact:true}).check();
  await page.getByRole('button',{name:'情报订阅',exact:true}).click();await page.getByRole('button',{name:'阅读完整样刊 ↗',exact:true}).click();
  await expect(page.locator('.brief-case')).toHaveCount(3);await page.screenshot({path:'screenshots/portal-brief-sample.png'});await page.keyboard.press('Escape');
  await page.screenshot({path:'screenshots/portal-intelligence.png',fullPage:true});
  await page.getByRole('button',{name:'开源生态',exact:true}).click();
  expect(await page.locator('.repo-row').count()).toBeGreaterThan(5);
  await page.locator('#metric').selectOption('activity');await expect(page.locator('.trend-value small')).toContainText('活跃度');
  await page.locator('#month').selectOption({index:6});await expect(page.locator('.trend-summary')).toContainText('有值月份');
  await page.getByRole('button',{name:'关注项目',exact:true}).click();await page.getByRole('button',{name:'我的关注',exact:true}).click();
  await expect(page.locator('.followed-repos [data-portal-project]')).toHaveCount(1);await page.locator('.followed-repos [data-portal-project]').click();await expect(page).toHaveURL(/#ecosystem$/);
  await page.getByRole('button',{name:'参与共建',exact:true}).click();await expect(page.locator('.work-card')).toHaveCount(6);
  for(const link of await page.locator('.work-card').all())expect(await link.getAttribute('href')).toMatch(/github.com\/X-lab2017\/open-dipper\/issues\/\d+$/);
  await expect(page.locator('.portal-page')).toContainText('没有公布专家或机构背书名单');
  await page.getByRole('button',{name:'AI 雷达',exact:true}).click();await page.getByLabel('搜索情报',{exact:true}).fill('');
  await page.screenshot({path:'screenshots/portal-radar.png',fullPage:true});
  await page.getByRole('button',{name:'EN',exact:true}).click();await expect(page.locator('.product-nav')).toContainText('AI radar');
  await page.getByRole('button',{name:'Toggle theme',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await page.screenshot({path:'screenshots/portal-radar-light.png',fullPage:true});
  for(const [width,height] of [[390,844],[768,1024],[1280,720],[1920,1080]]){
    await page.setViewportSize({width,height});
    for(const route of ['radar','briefing','following','contribute','ecosystem']){
      await page.goto(`${base}#${route}`);await expect(page.locator('#portal-title')).toBeVisible();
      await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      if(width===390&&route==='radar')await page.screenshot({path:'screenshots/portal-mobile-supply.png',fullPage:true});
      if(width===390&&route==='briefing'){
        await expect.poll(()=>page.locator('.membership-table-wrap').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
        await page.screenshot({path:'screenshots/portal-mobile-subscription.png',fullPage:true});
      }
    }
  }
  await page.setViewportSize({width:1440,height:1000});await page.goto(`${base}#radar`);
  // Optional content failure remains visible and does not replace observed data.
  await page.route('**/data/intelligence-demo.json',route=>route.fulfill({status:200,contentType:'application/json',body:'{"schemaVersion":1,"signals":[]}'}));
  await page.reload();await expect(page.locator('.portal-page')).toContainText('Demo material is unavailable');await expect(page.locator('.signal-card .badge.demo')).toHaveCount(0);
  await expect(page.locator('.signal-card').first()).toBeVisible();
  await page.route('**/data/evidence.json',route=>route.fulfill({status:503,body:'unavailable'}));
  await page.goto(base);await expect(page.locator('#earth')).toBeVisible();await expect(page.locator('#geo-dataset')).toHaveValue('real');
  await expect(page.locator('.evidence-headline')).toContainText('Global data unavailable');
  await page.getByRole('button',{name:'AI radar',exact:true}).click();await expect(page.locator('.supply-panel')).toContainText('unavailable');
  await page.unroute('**/data/evidence.json');
  expect(errors).toEqual([]);
  console.log('Portal navigation, provenance, filters, map links, local preferences, export, sample brief, project linking, themes, mobile and optional-feed failure passed');
}finally{await browser.close();}
