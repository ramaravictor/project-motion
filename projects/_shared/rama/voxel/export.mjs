#!/usr/bin/env node
// Rama voxel: node projects/_shared/rama/voxel/export.mjs [--no-video]
// Hasil: pose-present.png, pose-point.png, pose-thumbs.png, pose-shocked.png (1080×1080),
//        board.png (4 pose berdampingan), voxel.mp4 (8 detik, pose berganti tiap 2 detik, suara demo)
import puppeteer from 'puppeteer-core';
import { mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const url = pathToFileURL(resolve(dir, 'voxel.html')).href;
const VO = resolve(dir, '../../../_template/vo.mp3');
const POSES = ['present', 'point', 'thumbs', 'shocked'];
const video = !process.argv.includes('--no-video');
const ff = a => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a]);

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new', args: ['--allow-file-access-from-files', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
try {
  const page = await browser.newPage();
  page.on('pageerror', e => console.error('[halaman] ' + e.message));
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });
  for (const p of POSES) {
    await page.goto(`${url}?render=1&pose=${p}`, { waitUntil: 'networkidle0' });
    await page.waitForFunction('window.READY === true', { timeout: 60000 });
    await page.evaluate(() => window.seekTo(4.1)); // suara keras: mulut terbuka
    await page.screenshot({ path: resolve(dir, `pose-${p}.png`) });
    console.log(`pose-${p}.png`);
  }
  ff(['-i', resolve(dir, 'pose-present.png'), '-i', resolve(dir, 'pose-point.png'), '-i', resolve(dir, 'pose-thumbs.png'), '-i', resolve(dir, 'pose-shocked.png'),
    '-filter_complex', '[0][1][2][3]hstack=inputs=4,scale=2160:-1', resolve(dir, 'board.png')]);
  console.log('board.png');
  if (video) {
    await page.goto(`${url}?render=1`, { waitUntil: 'networkidle0' });
    await page.waitForFunction('window.READY === true', { timeout: 60000 });
    const fdir = resolve(dir, '_frames'); rmSync(fdir, { recursive: true, force: true }); mkdirSync(fdir);
    for (let f = 0; f < 240; f++) {
      await page.evaluate(t => window.seekTo(t), f / 30);
      await page.screenshot({ path: resolve(fdir, String(f).padStart(4, '0') + '.png') });
    }
    ff(['-framerate', '30', '-i', resolve(fdir, '%04d.png'), '-t', '8', '-i', VO, '-c:v', 'libx264', '-crf', '20', '-pix_fmt', 'yuv420p',
      '-c:a', 'aac', '-b:a', '160k', '-shortest', resolve(dir, 'voxel.mp4')]);
    rmSync(fdir, { recursive: true, force: true });
    console.log('voxel.mp4');
  }
} finally { await browser.close(); }
