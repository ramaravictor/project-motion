#!/usr/bin/env node
// Render semua overlay teks (PNG transparan 1080x1920) dalam satu browser.
// Pakai: node overlay/build-overlays.mjs   (dari folder project)
import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const BEATS = [
  ['hook-a', null, 'Selebrasinya lebih <b>niat</b> dari golnya?'],
  ['hook-b', null, 'Tonton sampai <b>nomor 1</b>. Yang ini nggak masuk akal 👀'],
  ['5-a', 5, 'Gol masuk, nomor 13 <b>senyumnya lebar banget</b>…'],
  ['5-b', 5, '…langsung <b>dikeroyok pelukan</b> satu tim 🤗'],
  ['4-a', 4, 'Abis gol, kaptennya malah <b>goyang di pinggir lapangan</b> 💃'],
  ['4-b', 4, 'Nomor 10 dateng, <b>ikut pose kompakan</b> 🙌'],
  ['3-a', 3, 'Yang cetak gol nomor 22. Tapi lihat <b>pinggir lapangan</b>…'],
  ['3-b', 3, 'Yang <b>push-up malah ofisial tim</b> 🤣'],
  ['2-a', 2, 'Nomor 13 lari ke pinggir, <b>temennya nyusul</b>…'],
  ['2-b', 2, '…terus <b>rame-rame berlutut</b> di rumput 🙏'],
  ['1-a', 1, 'Bukan joget. Bukan pelukan…'],
  ['1-b', 1, 'Nomor 17 <b>jungkir balik</b> di rumput 🤸'],
  ['1-c', 1, 'Kamu berani nggak? <b>Tulis di komentar</b> 👇'],
];

const page = (rank, text) => `<!doctype html><html lang="id"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Plus+Jakarta+Sans:wght@700;800&family=JetBrains+Mono:wght@800&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:1080px;height:1920px;background:transparent;overflow:hidden;font-family:"Plus Jakarta Sans",sans-serif;color:#fff}
.top{position:absolute;left:80px;width:870px;top:210px;display:flex;align-items:flex-end;gap:28px}
.rank{font:400 250px/0.85 Anton,sans-serif;color:#F5C400;text-shadow:0 10px 30px rgba(0,0,0,.6)}
.rank i{font-style:normal;font-size:130px;color:#fff;vertical-align:top}
.ttl{display:flex;flex-direction:column;gap:12px;padding-bottom:14px}
.tag{align-self:flex-start;font:800 26px "JetBrains Mono";background:#C8102E;padding:8px 16px;letter-spacing:.04em}
.h{font:400 74px/1 Anton,sans-serif;text-transform:uppercase;text-shadow:0 6px 20px rgba(0,0,0,.6)}
.hook{position:absolute;left:80px;width:870px;top:210px;display:flex;flex-direction:column;gap:18px}
.hook .h{font-size:120px;line-height:.95}
.hook .h span{background:#F5C400;color:#141619;padding:0 .12em;display:inline-block;transform:skewX(-6deg)}
.cap{position:absolute;left:80px;width:870px;top:1225px;font-size:50px;font-weight:800;line-height:1.2;color:#141619;background:#F5C400;padding:24px 30px;border-radius:20px;box-shadow:0 14px 34px rgba(0,0,0,.45)}
.cap b{color:#C8102E}
</style></head><body>
${rank ? `<div class="top"><div class="rank"><i>#</i>${rank}</div><div class="ttl"><div class="tag">TOP 5 SELEBRASI UNIK</div><div class="h">Sriwijaya FC</div></div></div>`
       : `<div class="hook"><div class="tag">SRIWIJAYA FC</div><div class="h">Top 5 selebrasi<br><span>paling unik</span></div></div>`}
<div class="cap">${text}</div></body></html>`;

mkdirSync('work/ov', { recursive: true });
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
});
try {
  const p = await browser.newPage();
  await p.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  for (const [id, rank, text] of BEATS) {
    const f = resolve(`work/ov/${id}.html`);
    writeFileSync(f, page(rank, text));
    await p.goto(pathToFileURL(f).href, { waitUntil: 'load', timeout: 90000 });
    await p.evaluate(async () => { await document.fonts.ready; });
    await p.screenshot({ path: resolve(`work/ov/${id}.png`), omitBackground: true, clip: { x: 0, y: 0, width: 1080, height: 1920 } });
  }
  console.log('Overlay: ' + BEATS.length);
} finally { await browser.close(); }
