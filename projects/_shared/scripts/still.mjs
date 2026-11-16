#!/usr/bin/env node
// Potret satu frame 1080x1920 dari sebuah HTML (mode render) ke PNG.
// Dipakai untuk contoh visual pilihan style (Tahap 1) dan cek cepat.
//
// Pakai:  node projects/_shared/scripts/still.mjs <file.html> <detik> <out.png>
//   contoh: node projects/_shared/scripts/still.mjs projects/x/style-options/opsi-a.html 4 projects/x/style-options/opsi-a.png
//   Kalau halaman punya window.seekTo, frame diambil di <detik>; kalau tidak, diambil apa adanya.

import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [html, sec = '0', out] = process.argv.slice(2);
if (!html || !out) { console.error('Pakai: node still.mjs <file.html> <detik> <out.png>'); process.exit(1); }
mkdirSync(dirname(resolve(out)), { recursive: true });

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new', args: ['--allow-file-access-from-files'],
});
try {
  const page = await browser.newPage();
  page.on('pageerror', e => console.error('[halaman] ' + e.message));
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(resolve(html)).href + '?render=1', { waitUntil: 'networkidle0' });
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))); });
  await page.evaluate(t => { if (typeof window.seekTo === 'function') window.seekTo(t); }, +sec);
  await page.screenshot({ path: resolve(out), clip: { x: 0, y: 0, width: 1080, height: 1920 } });
  console.log('Tersimpan: ' + resolve(out));
} finally {
  await browser.close();
}
