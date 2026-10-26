import {chromium,expect} from '@playwright/test';
import {mkdir,readFile} from 'node:fs/promises';
await mkdir('screenshots/research-exports',{recursive:true});
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto((process.env.BASE_URL||'http://127.0.0.1:4173/open-dipper/')+'#ecosystem');
 await expect(page.locator('#galaxy-canvas')).toHaveAttribute('data-nodes','43771',{timeout:30000});
 await expect(page.locator('#galaxy-canvas')).toHaveAttribute('data-edges','125955');
 await page.screenshot({path:'screenshots/galaxy-dark-overview.png',fullPage:true});
 // Verify decorative motion in the actual browser, including a live preference change.
 await page.emulateMedia({reducedMotion:'no-preference'});
 await expect(page.locator('#galaxy-motion')).toHaveAttribute('aria-pressed','false');
 await page.locator('#galaxy-motion').click();await expect(page.locator('#galaxy-motion')).toHaveAttribute('aria-pressed','true');
 const fx=page.locator('.galaxy-fx');const animatedFrame=await fx.evaluate(c=>c.toDataURL());
 await page.waitForFunction(before=>document.querySelector('.galaxy-fx').toDataURL()!==before,animatedFrame);
 await page.locator('#galaxy-motion').click();await expect(page.locator('#galaxy-motion')).toHaveAttribute('aria-pressed','false');
 const pausedFrame=await fx.evaluate(c=>c.toDataURL());await page.waitForTimeout(180);expect(await fx.evaluate(c=>c.toDataURL())).toBe(pausedFrame);
 await page.locator('#galaxy-motion').click();await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>new Promise(requestAnimationFrame));
 const reducedFrame=await fx.evaluate(c=>c.toDataURL());await page.waitForTimeout(180);expect(await fx.evaluate(c=>c.toDataURL())).toBe(reducedFrame);

 await page.locator('#galaxy-search').fill('pytorch/pytorch');await expect(page.locator('#galaxy-result-list button')).toHaveCount(1);
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
 await page.locator('.product-nav [data-page=overview]').click();await expect(page.locator('#earth')).toBeVisible();expect(errors).toEqual([]);
 console.log('Galaxy snapshots, search context, relationships, expansion, themes, tour, language, mobile and module navigation passed');
}finally{await browser.close();}
