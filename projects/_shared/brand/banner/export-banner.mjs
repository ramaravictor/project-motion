#!/usr/bin/env node
// Ekspor banner YouTube: node projects/_shared/brand/banner/export-banner.mjs
// Hasil: banner-2560x1440.png (unggah ke YouTube), banner-guides.png (dengan garis area aman),
//        banner-mobile-crop.png (yang terlihat di HP: 1546×423)
import puppeteer from 'puppeteer-core';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const url = pathToFileURL(resolve(dir, 'banner.html')).href;
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new', args: ['--allow-file-access-from-files'],
});
try {
  const page = await browser.newPage();
  page.on('pageerror', e => console.error('[halaman] ' + e.message));
  await page.setViewport({ width: 2560, height: 1440, deviceScaleFactor: 1 });
  const shot = async (q, out, clip = { x: 0, y: 0, width: 2560, height: 1440 }) => {
    await page.goto(url + q, { waitUntil: 'networkidle0' });
    await page.evaluate(async () => { await document.fonts.ready; window.seekTo(window.DURATION); });
    await page.screenshot({ path: resolve(dir, out), clip });
    console.log(out);
  };
  await shot('?still=1', 'banner-2560x1440.png');
  await shot('?still=1&guide=1', 'banner-guides.png');
  await shot('?still=1', 'banner-mobile-crop.png', { x: 507, y: 508, width: 1546, height: 423 });
} finally { await browser.close(); }
