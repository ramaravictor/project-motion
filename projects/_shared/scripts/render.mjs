#!/usr/bin/env node
// Render index.html → MP4 1080x1920 30fps, frame demi frame lewat window.seekTo(sec).
//
// Pakai:  node projects/_shared/scripts/render.mjs projects/<nama> [--seconds N] [--out file.mp4]
//   --seconds N   render N detik pertama saja (untuk cek cepat)
//   CHROME_PATH   path Chrome kalau bukan lokasi default macOS
//
// Audio: vo.mp3 + SFX dari window.OPENER.SFX ([{ t, file, vol }], file di projects/_shared/sfx).

import puppeteer from 'puppeteer-core';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const proj = args.find(a => !a.startsWith('--') && !/^\d/.test(a));
if (!proj) { console.error('Pakai: node render.mjs projects/<nama> [--seconds N] [--out file.mp4]'); process.exit(1); }
const opt = (k) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : null; };
const root = resolve(proj), name = basename(root);
const html = join(root, 'index.html');
const vo = join(root, 'vo.mp3');
const sfxDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'sfx');
const out = resolve(opt('--out') || join(root, `${name}.mp4`));
mkdirSync(dirname(out), { recursive: true });

const FPS = 30;
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new', args: ['--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'],
  // Tutup Chrome sendiri secara normal (bukan kill paksa) supaya macOS menghapus
  // salinan code_sign_clone di /private/var/folders/.../X. Kalau Chrome mati paksa,
  // tiap render meninggalkan salinan Chrome ~2 GB.
  handleSIGINT: false, handleSIGTERM: false, handleSIGHUP: false,
});
let closing = false;
async function shutdown(code) {
  if (closing) return;
  closing = true;
  await browser.close().catch(() => {});
  process.exit(code);
}
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => { console.error(`\n${sig}: menutup Chrome…`); shutdown(130); });
process.on('uncaughtException', e => { console.error(e); shutdown(1); });
process.on('unhandledRejection', e => { console.error(e); shutdown(1); });
const page = await browser.newPage();
page.on('pageerror', e => console.error('[halaman] ' + e.message));
await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(html).href + '?render=1', { waitUntil: 'networkidle0' });
await page.waitForFunction(() => window.OPENER && window.OPENER.ready, { timeout: 30000 });
await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))); });

const { DURATION, SFX = [] } = await page.evaluate(() => ({ DURATION: window.OPENER.DURATION, SFX: window.OPENER.SFX || [] }));
const secs = Math.min(DURATION, +(opt('--seconds') || DURATION));
const total = Math.round(secs * FPS);
console.log(`Render ${name}: ${secs.toFixed(2)} s · ${total} frame → ${out}`);

// ffmpeg: video dari pipe PNG + VO + SFX (volume per cue, tanpa normalisasi amix)
const cues = SFX.filter(c => c.t < secs && existsSync(join(sfxDir, c.file)));
const inputs = ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-'];
const hasVo = existsSync(vo);
if (hasVo) inputs.push('-i', vo);
cues.forEach(c => inputs.push('-i', join(sfxDir, c.file)));
const filters = [];
const mixIn = [];
if (hasVo) mixIn.push('[1:a]');
cues.forEach((c, i) => { const idx = (hasVo ? 2 : 1) + i; filters.push(`[${idx}:a]adelay=${Math.round(c.t * 1000)}:all=1,volume=${c.vol ?? 0.15}[s${i}]`); mixIn.push(`[s${i}]`); });
const audioArgs = [];
if (mixIn.length) {
  filters.push(`${mixIn.join('')}amix=inputs=${mixIn.length}:normalize=0:duration=first,atrim=0:${secs}[aout]`);
  audioArgs.push('-filter_complex', filters.join(';'), '-map', '0:v', '-map', '[aout]', '-c:a', 'aac', '-b:a', '192k');
}
const ff = spawn('ffmpeg', [...inputs, ...audioArgs, '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-t', String(secs), out], { stdio: ['pipe', 'ignore', 'pipe'] });
let ffErr = ''; ff.stderr.on('data', d => { ffErr += d; });
const ffDone = new Promise(r => ff.on('close', r));

const t0 = Date.now();
for (let f = 0; f < total; f++) {
  await page.evaluate(t => window.seekTo(t), f / FPS);
  const png = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1080, height: 1920 } });
  if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
  if (f % 30 === 0) process.stdout.write(`\r  frame ${f}/${total} · ${((f + 1) / ((Date.now() - t0) / 1000)).toFixed(1)} fps   `);
}
ff.stdin.end();
const code = await ffDone;
closing = true;
await browser.close();
if (code !== 0) { console.error('\nffmpeg gagal:\n' + ffErr.slice(-2000)); process.exit(1); }
const d = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=width,height,r_frame_rate', '-of', 'default=nw=1', out], { encoding: 'utf8' }).stdout.replace(/\n/g, ' ');
console.log(`\nSelesai (${((Date.now() - t0) / 1000).toFixed(0)} s): ${out}\n  ${d}`);
