#!/usr/bin/env node
// Ekspor DEV UNITED (crest 5) 1:1 Full HD: node projects/_shared/brand/profile-pic/crest/export-dev-united.mjs
// Hasil: dev-united-1080.png (1080×1080). Desainnya vektor, jadi dirender tajam lewat deviceScaleFactor.
import puppeteer from 'puppeteer-core';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const SIZE = 1080;
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new', args: ['--allow-file-access-from-files'],
});
try {
  const page = await browser.newPage();
  page.on('pageerror', e => console.error('[halaman] ' + e.message));
  await page.setViewport({ width: 800, height: 800, deviceScaleFactor: SIZE / 800 });
  await page.goto(pathToFileURL(resolve(dir, 'crest.html')).href + '?still=1&v=5', { waitUntil: 'networkidle0' });
  await page.evaluate(async () => { await document.fonts.ready; window.seekTo(window.DURATION); });
  await page.screenshot({ path: resolve(dir, 'dev-united-1080.png'), clip: { x: 0, y: 0, width: 800, height: 800 } });
  console.log('dev-united-1080.png');
} finally { await browser.close(); }
