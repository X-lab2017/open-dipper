import {chromium,expect} from '@playwright/test';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
await mkdir('screenshots/research-exports',{recursive:true});
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>{errors.push(e.message);console.error('GALAXY PAGE ERROR:',e.message)});
 await page.goto((process.env.BASE_URL||'http://127.0.0.1:4173/open-dipper/')+'#ecosystem');
 await expect(page.locator('#galaxy-canvas')).toHaveAttribute('data-nodes','43771',{timeout:30000});
 await expect(page.locator('#galaxy-canvas')).toHaveAttribute('data-edges','125955');
 await page.screenshot({path:'screenshots/galaxy-dark-overview.png',fullPage:true});
 // Verify decorative motion in the actual browser, including a live preference change.
 await page.emulateMedia({reducedMotion:'no-preference'});
 await expect(page.locator('#galaxy-motion')).toHaveAttribute('aria-pressed','false');
 await page.locator('#galaxy-motion').click();await expect(page.locator('#galaxy-motion')).toHaveAttribute('aria-pressed','true');
 const fx=page.locator('.galaxy-fx'),motionEvidence=[];
 const frameHash=async()=>createHash('sha256').update(await fx.evaluate(c=>c.toDataURL())).digest('hex');
 const assertStill=async state=>{
  // emulateMedia resolves before the browser necessarily delivers matchMedia change.
  // Wait for the renderer to acknowledge it, then flush its already queued base draw.
  await expect(fx).toHaveAttribute('data-motion-state',state);
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const hashes=[await frameHash()];
  for(let i=0;i<3;i++){await page.waitForTimeout(180);hashes.push(await frameHash());}
  const dimensions=await fx.evaluate(c=>({width:c.width,height:c.height,state:c.dataset.motionState}));
  motionEvidence.push({state,dimensions,hashes});console.log('Galaxy motion evidence',motionEvidence.at(-1));
  await page.screenshot({path:`screenshots/galaxy-motion-${state}.png`,fullPage:true});
  await writeFile('screenshots/galaxy-motion-evidence.json',JSON.stringify(motionEvidence,null,2));
  for(const hash of hashes)expect(hash,`${state}: settled canvas stays static`).toBe(hashes[0]);
 };
 await expect(fx).toHaveAttribute('data-motion-state','running');
 const animatedFrame=await fx.evaluate(c=>c.toDataURL());
 await page.waitForFunction(before=>document.querySelector('.galaxy-fx').toDataURL()!==before,animatedFrame);
 await page.locator('#galaxy-motion').click();await expect(page.locator('#galaxy-motion')).toHaveAttribute('aria-pressed','false');
 await assertStill('paused');
 await page.locator('#galaxy-motion').click();await expect(fx).toHaveAttribute('data-motion-state','running');
 await page.emulateMedia({reducedMotion:'reduce'});await assertStill('reduced');

 await page.locator('#galaxy-search').fill('pytorch/pytorch');await expect(page.locator('#galaxy-result-list button')).toHaveCount(1);
 // Search blur emits change before click; it must not replace the pointer target.
 const firstResult=await page.locator('#galaxy-result-list button').elementHandle();
 await page.locator('#galaxy-search').dispatchEvent('change');expect(await firstResult.evaluate(el=>el.isConnected)).toBe(true);
 await page.locator('#galaxy-result-list button').click();
 await page.screenshot({path:'screenshots/galaxy-after-selection.png',fullPage:true});
 console.log('Selection diagnostics',await page.evaluate(()=>({hash:location.hash,root:document.querySelector('.galaxy-page')?.className,result:document.querySelector('#galaxy-result-list button')?.outerHTML,profile:document.querySelector('#galaxy-inspector')?.innerHTML.slice(0,500)})),errors);
 await expect(page.locator('.galaxy-profile h2')).toHaveText('pytorch');
 await page.locator('#galaxy-result-list button').click();await expect(page.locator('.galaxy-profile h2')).toHaveText('pytorch');
 await expect(page.locator('.galaxy-neighbors')).toContainText('vllm');await expect(page.locator('#galaxy-canvas')).toHaveAttribute('data-nodes','43771');
 await page.locator('[data-galaxy-action=shortlist]').click();
 await page.locator('.galaxy-neighbors button[data-galaxy-node]').filter({hasText:'vllm'}).click();
 await page.locator('[data-galaxy-action=shortlist]').click();await page.locator('.galaxy-shortlist-open').click();
 await expect(page.locator('.galaxy-comparison')).toContainText('Apache-2.0');
 await page.locator('#galaxy-find-path').click();await expect(page.locator('#galaxy-workstate')).toContainText('1 步');
 await page.locator('[data-galaxy-action=report]').click();await expect(page.locator('.research-cover h1')).toHaveText('pytorch/pytorch');
 await expect(page.locator('.research-report')).toContainText('2025.08—2026.07');await expect(page.locator('.research-report')).toContainText('2026-08');
 for(const format of ['md','html','json']){
  const pending=page.waitForEvent('download');await page.locator(`[data-research-export=${format}]`).click();const file=await pending;
  expect(file.suggestedFilename()).toContain(`.${format}`);expect(await file.failure()).toBeNull();
  const saved=`screenshots/research-exports/pytorch-report.${format}`;await file.saveAs(saved);const body=await readFile(saved,'utf8');
  expect(body.length).toBeGreaterThan(1000);expect(body).toContain('pytorch/pytorch');expect(body).toContain('2025.08');expect(body).toContain('2026.07');
  if(format==='json'){const report=JSON.parse(body);expect(report.entity.name).toBe('pytorch/pytorch');expect(report).toHaveProperty('sources');}
  if(format==='html'){expect(body.toLowerCase()).toContain('<!doctype html>');expect(body).toContain('<style>');}
  if(format==='md')expect(body).toContain('# ');
 }

 await page.locator('#close-modal').click();
 await page.locator('#galaxy-expand').click();await expect(page.locator('.galaxy-page')).toHaveClass(/is-expanded/);await page.keyboard.press('Escape');await expect(page.locator('.galaxy-page')).not.toHaveClass(/is-expanded/);
 await page.locator('#theme-toggle').click();await expect(page.locator('.galaxy-profile h2')).toHaveText('pytorch');
 await page.screenshot({path:'screenshots/galaxy-light-research.png',fullPage:true});
 await page.locator('[data-galaxy-mode=model]').click();expect(new URL(page.url()).hash).toBe('#ecosystem');await expect(page.locator('#galaxy-canvas')).toHaveAttribute('data-nodes','24000');await expect(page.locator('#galaxy-canvas')).toHaveAttribute('data-edges','19305');
 await page.locator('.galaxy-advanced summary').click();await page.locator('#galaxy-inferred').check();await expect(page.locator('#galaxy-canvas')).toHaveAttribute('data-edges','43263');await page.locator('#galaxy-inferred').uncheck();
 await page.locator('#galaxy-tour').click();await expect(page.locator('#galaxy-tour')).toHaveAttribute('aria-pressed','true');await page.keyboard.press('Escape');await expect(page.locator('#galaxy-tour')).toHaveAttribute('aria-pressed','false');
 await page.locator('#language-toggle').click();await expect(page.locator('.galaxy-title h1')).toHaveText('The open-source universe');
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await page.screenshot({path:'screenshots/galaxy-mobile.png',fullPage:true});
 await page.locator('.product-nav [data-page=radar]').click();await expect(page.locator('.radar-chart')).toBeVisible();
 await page.locator('.product-nav [data-page=overview]').click();await expect(page.locator('#earth')).toBeVisible();
 await page.locator('.product-nav [data-page=ecosystem]').click();await expect(page.locator('#galaxy-canvas')).toHaveAttribute('data-nodes','43771');
 await page.locator('.product-nav [data-page=overview]').click();await expect(page.locator('#earth')).toBeVisible();expect(errors).toEqual([]);
 console.log('Galaxy snapshots, search context, relationships, expansion, themes, tour, language, mobile and module navigation passed');
}finally{await browser.close();}
