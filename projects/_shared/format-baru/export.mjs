#!/usr/bin/env node
// Contoh format baru: node projects/_shared/format-baru/export.mjs → contoh-1..4.png + board.png
import puppeteer from 'puppeteer-core';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new', args: ['--allow-file-access-from-files', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const ready = p => p.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))); });
try {
  const page = await browser.newPage();
  page.on('pageerror', e => console.error('[halaman] ' + e.message));
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  for (const v of [1, 2, 3, 4]) {
    await page.goto(pathToFileURL(resolve(dir, 'contoh.html')).href + '?v=' + v, { waitUntil: 'networkidle0' });
    await ready(page);
    await page.waitForFunction('window.READY === true', { timeout: 60000 });
    await page.screenshot({ path: resolve(dir, `contoh-${v}.png`) });
    console.log(`contoh-${v}.png`);
  }
  await page.setViewport({ width: 1640, height: 900, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(resolve(dir, 'board.html')).href, { waitUntil: 'networkidle0' });
  await ready(page);
  await page.screenshot({ path: resolve(dir, 'board.png'), fullPage: true });
  console.log('board.png');
} finally { await browser.close(); }
