#!/usr/bin/env node
// Contoh gaya Bang Motion di kerangka v2: node projects/_shared/format-baru/export-gaya.mjs [--no-video]
// Hasil di format-baru/gaya/: gaya-1..8.png (detik 3,2), gaya-1..8.mp4 (4 detik, suara demo), lalu gaya-board.png
import puppeteer from 'puppeteer-core';
import { mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url)), out = resolve(dir, 'gaya');
mkdirSync(out, { recursive: true });
const url = pathToFileURL(resolve(dir, 'gaya.html')).href;
const VO = resolve(dir, '../../_template/vo.mp3');
const video = !process.argv.includes('--no-video');
const only = process.argv.find(a => /^\d$/.test(a));
const KEYS = only ? [only] : ['1', '2', '3', '4', '5', '6', '7', '8'];

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new', args: ['--allow-file-access-from-files', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
try {
  const page = await browser.newPage();
  page.on('pageerror', e => console.error('[halaman] ' + e.message));
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  for (const k of KEYS) {
    await page.goto(`${url}?render=1&v=${k}`, { waitUntil: 'networkidle0' });
    await page.waitForFunction('window.READY === true', { timeout: 60000 });
    await page.evaluate(() => window.seekTo(3.2));
    await page.screenshot({ path: resolve(out, `gaya-${k}.png`) });
    console.log(`gaya-${k}.png`);
    if (!video) continue;
    const fdir = resolve(out, `_frames-${k}`); rmSync(fdir, { recursive: true, force: true }); mkdirSync(fdir);
    for (let f = 0; f < 120; f++) {
      await page.evaluate(t => window.seekTo(t), f / 30);
      await page.screenshot({ path: resolve(fdir, String(f).padStart(4, '0') + '.png') });
    }
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '30', '-i', resolve(fdir, '%04d.png'), '-t', '4', '-i', VO,
      '-c:v', 'libx264', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-shortest', resolve(out, `gaya-${k}.mp4`)]);
    rmSync(fdir, { recursive: true, force: true });
    console.log(`gaya-${k}.mp4`);
  }
  await page.setViewport({ width: 1640, height: 1200, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(resolve(dir, 'gaya-board.html')).href, { waitUntil: 'networkidle0' });
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))); });
  await page.screenshot({ path: resolve(out, 'gaya-board.png'), fullPage: true });
  console.log('gaya-board.png');
} finally { await browser.close(); }
