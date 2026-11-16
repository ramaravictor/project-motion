#!/usr/bin/env node
// Potret HTML overlay 1080x1920 ke PNG berlatar transparan.
// Pakai: node overlay.mjs <file.html> <out.png>
import puppeteer from 'puppeteer-core';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [html, out] = process.argv.slice(2);
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(resolve(html)).href, { waitUntil: 'networkidle0' });
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.screenshot({ path: resolve(out), omitBackground: true, clip: { x: 0, y: 0, width: 1080, height: 1920 } });
  console.log('Tersimpan: ' + resolve(out));
} finally { await browser.close(); }
