#!/usr/bin/env node
// Buat envelope lip-sync 30fps dari VO bersih (sebelum dicampur SFX), lalu tanam ke index.html.
//
// Pakai:  node projects/_shared/scripts/envelope.mjs projects/<nama> [--vo path/ke/vo.mp3]
//
// Rumus normalisasi: vol = min(1, 2.265 * RMS^0.78)
// Ditemukan dengan mencocokkan ke audio_envelope.json milik claude-code-peta
// (rata-rata selisih 0.0003), jadi ambang viseme 0.14 / 0.32 / 0.72 berperilaku sama.

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
const proj = args.find(a => !a.startsWith('--'));
if (!proj) { console.error('Pakai: node envelope.mjs projects/<nama> [--vo file]'); process.exit(1); }
const dir = resolve(proj);
const voArg = args.indexOf('--vo');
const vo = voArg > -1 ? resolve(args[voArg + 1]) : join(dir, 'vo.mp3');
if (!existsSync(vo)) { console.error('VO tidak ditemukan: ' + vo); process.exit(1); }

const FPS = 30, SR = 44100;

// 1. Durasi
const dur = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', vo], { encoding: 'utf8' }).stdout.trim();
console.log(`Durasi VO: ${(+dur).toFixed(3)} s`);

// 2. Jeda kalimat (bantu tentukan t0/t1 scene)
const sd = spawnSync('ffmpeg', ['-i', vo, '-af', 'silencedetect=noise=-32dB:d=0.22', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
const starts = [...sd.matchAll(/silence_start: ([\d.]+)/g)].map(m => +m[1]);
const ends = [...sd.matchAll(/silence_end: ([\d.]+)/g)].map(m => +m[1]);
console.log('Jeda kalimat (kandidat batas scene, pakai titik tengah):');
starts.forEach((s, i) => { const e = ends[i] ?? +dur; console.log(`  ${s.toFixed(2)} – ${e.toFixed(2)}  → batas ≈ ${((s + e) / 2).toFixed(2)}`); });

// 3. PCM s16le mono 44.1kHz → RMS per frame
const pcm = spawnSync('ffmpeg', ['-v', 'error', '-i', vo, '-ac', '1', '-ar', String(SR), '-f', 's16le', '-'], { maxBuffer: 1 << 30 }).stdout;
const n = pcm.length >> 1, per = SR / FPS, env = [];
for (let f = 0; f * per < n; f++) {
  let s = 0, c = 0;
  for (let i = Math.floor(f * per); i < Math.min(n, Math.floor((f + 1) * per)); i++) { const v = pcm.readInt16LE(i * 2) / 32768; s += v * v; c++; }
  env.push(+Math.min(1, 2.265 * Math.pow(Math.sqrt(s / c), 0.78)).toFixed(3));
}
writeFileSync(join(dir, 'audio_envelope.json'), JSON.stringify(env));
console.log(`audio_envelope.json: ${env.length} frame`);

// 4. Tanam ke index.html di antara marker /*ENV*/ ... /*ENV*/
const html = join(dir, 'index.html');
if (existsSync(html)) {
  const h = readFileSync(html, 'utf8');
  const re = /\/\*ENV\*\/[\s\S]*?\/\*ENV\*\//;
  if (re.test(h)) { writeFileSync(html, h.replace(re, '/*ENV*/' + JSON.stringify(env) + '/*ENV*/')); console.log('Envelope ditanam ke index.html'); }
  else console.warn('Marker /*ENV*/ tidak ada di index.html, envelope tidak ditanam.');
}
