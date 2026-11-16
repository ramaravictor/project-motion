#!/usr/bin/env node
// Jalankan panel "Cek Aturan Video" dari index.html secara headless, lalu cetak hasilnya.
//
// Pakai:  node projects/_shared/scripts/check.mjs projects/<nama> [--tahap2]
//   --tahap2  gagal "Envelope audio ter-inline" dianggap wajar (VO belum ada)
// Exit code 0 kalau 0 gagal (dengan pengecualian --tahap2), 1 kalau ada yang gagal.

import puppeteer from 'puppeteer-core';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const proj = args.find(a => !a.startsWith('--'));
const TAHAP2 = args.includes('--tahap2');
if (!proj) { console.error('Pakai: node check.mjs projects/<nama> [--tahap2]'); process.exit(1); }
const html = join(resolve(proj), 'index.html');

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new', args: ['--allow-file-access-from-files'],
});
let code = 0;
try {
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/vo\.mp3|ERR_FILE_NOT_FOUND|Failed to load resource/.test(m.text())) errs.push(m.text()); });
  await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(html).href, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => Array.isArray(window.RULE_CHECKS), { timeout: 30000 });
  const res = await page.evaluate(() => window.RULE_CHECKS);
  const meta = await page.evaluate(() => ({ D: window.OPENER?.DURATION, n: window.OPENER?.SCENES?.length }));
  const allowed = (r) => TAHAP2 && r.title.startsWith('Envelope audio');
  let fail = 0, warn = 0;
  for (const r of res) {
    const ic = r.status === 'pass' ? '✓' : r.status === 'fail' ? (allowed(r) ? '–' : '✕') : '!';
    if (r.status === 'fail' && !allowed(r)) fail++;
    if (r.status === 'warn') warn++;
    console.log(`${ic} ${r.title} — ${String(r.detail).replace(/<br>/g, '; ')}`);
  }
  if (errs.length) { console.log('\nError halaman:'); errs.forEach(e => console.log('  ' + e)); }
  console.log(`\n${proj}: ${meta.n} scene · ${meta.D?.toFixed(2)} s · ${fail} gagal · ${warn} peringatan${TAHAP2 ? ' (envelope dikecualikan)' : ''}`);
  if (fail || errs.length) code = 1;
} finally {
  await browser.close();
}
process.exit(code);
