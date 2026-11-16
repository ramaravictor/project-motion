#!/usr/bin/env node
// Potret halaman monogram (default tangga1-anyam.html, atau tile tertentu) ke PNG.
// Pakai: [PAGE=file.html] [SCALE=8] node shoot.mjs <out.png> [selector] [--transparent]
import puppeteer from 'puppeteer-core';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const [out, sel, flag] = process.argv.slice(2);
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1040, deviceScaleFactor: +(process.env.SCALE || 2) });
  await page.goto(pathToFileURL(resolve(here, process.env.PAGE || 'tangga1-anyam.html')).href, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  const transparent = flag === '--transparent';
  if (transparent) await page.addStyleTag({ content: 'body,.tile{background:transparent!important;border:0!important}.lbl{display:none}' });
  const target = sel ? await page.$(sel + ' svg') : await page.$('.grid');
  await (target || page).screenshot({ path: resolve(out), omitBackground: transparent, ...(target ? {} : { fullPage: true }) });
  console.log('Tersimpan: ' + resolve(out));
} finally { await browser.close(); }
