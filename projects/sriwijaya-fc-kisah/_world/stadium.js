/* Dunia bersama: Stadion Gelora Sriwijaya Jakabaring di malam hari.
   Semua fungsi murni dari waktu t (detik). Tidak ada jam sistem, tidak ada Math.random. */
(function () {
  const W = 1080, H = 1920;
  const rng = (seed) => { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; };
  const hash = (a, b) => { let h = (Math.imul(a + 1, 374761393) + Math.imul(b + 7, 668265263)) >>> 0; h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, p) => a + (b - a) * p;
  const EASE = {
    io: (p) => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2,
    out: (p) => 1 - Math.pow(1 - p, 3),
    in: (p) => p * p * p,
    lin: (p) => p,
  };

  const TOWERS = [130, 385, 695, 950];
  const HEAD_Y = 205;
  const TARGETS = [[300, 1470], [470, 1360], [650, 1380], [830, 1480]];

  const STARS = []; { const r = rng(7); for (let i = 0; i < 150; i++) STARS.push([r() * W, r() * 1080, 1 + r() * 1.8, r() * 6.28, .6 + r() * 1.4]); }
  const DUST = []; { const r = rng(11); for (let i = 0; i < 4; i++) { const a = []; for (let k = 0; k < 34; k++) a.push([r(), r() * 2 - 1, .6 + r() * .8, 1.2 + r() * 2.2, r() * 6.28]); DUST.push(a); } }
  const CONF = []; { const r = rng(23); const cols = ['#f5c400', '#ffe066', '#1f9d55', '#ffffff', '#f5c400']; for (let i = 0; i < 180; i++) CONF.push([r() * W, -60 - r() * 700, 160 + r() * 260, r() * 6.28, 1 + r() * 3, cols[i % 5], 9 + r() * 10, r() * 2 - 1]); }
  const ROWS = []; for (let r = 0; r < 14; r++) { const y = 1172 + r * 33, half = 470 + r * 24, sz = 17 + r * .75, sp = sz * 1.55; ROWS.push({ r, y, half, sz, sp, n: Math.floor(2 * half / sp) }); }

  const PLAYERS = []; { const r = rng(31); const nums = [10, 9, 7, 8, 1, 5, 14]; for (let i = 0; i < 7; i++) PLAYERS.push({ bx: 90 + r() * 900, y: 1712 + r() * 150, sp: (45 + r() * 50) * (i % 2 ? 1 : -1), ph: r() * 6.28, num: nums[i] }); }

  /* pemain vektor tampak belakang: tanpa wajah, jersey kuning, celana hijau */
  function drawPlayer(ctx, x, y, s, ph, pose, num, b) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const sw = pose === 'run' ? Math.sin(ph) * .6 : pose === 'walk' ? Math.sin(ph) * .3 : 0;
    const up = pose === 'jump' || pose === 'trophy';
    const jump = up ? Math.abs(Math.sin(ph)) * 26 : 0;
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(0, 0, 24, 6, 0, 0, 6.283); ctx.fill();
    ctx.translate(0, -jump);
    const jer = mix('#3a3210', '#f5c400', b), sh = mix('#06200f', '#0f7a3c', b), sock = mix('#2a2a2a', '#eeeeee', b);
    ctx.lineCap = 'round';
    ctx.strokeStyle = sock; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(-6, -40); ctx.lineTo(-6 + Math.sin(sw) * 22, -2); ctx.moveTo(6, -40); ctx.lineTo(6 - Math.sin(sw) * 22, -2); ctx.stroke();
    ctx.fillStyle = sh; ctx.fillRect(-15, -54, 30, 17);
    ctx.fillStyle = jer; ctx.fillRect(-17, -92, 34, 40);
    ctx.strokeStyle = jer; ctx.lineWidth = 8; ctx.beginPath();
    if (up) { ctx.moveTo(-15, -86); ctx.lineTo(-28, -124); ctx.moveTo(15, -86); ctx.lineTo(28, -124); }
    else { ctx.moveTo(-15, -86); ctx.lineTo(-21 - Math.sin(sw) * 14, -58); ctx.moveTo(15, -86); ctx.lineTo(21 + Math.sin(sw) * 14, -58); }
    ctx.stroke();
    ctx.fillStyle = mix('#140f0b', '#5e4130', b); ctx.beginPath(); ctx.arc(0, -105, 12, 0, 6.283); ctx.fill();
    ctx.fillStyle = mix('#050505', '#121212', b); ctx.beginPath(); ctx.arc(0, -108, 12.5, Math.PI, 0); ctx.fill();
    ctx.fillStyle = mix('#0a1a10', '#0f5c33', b); ctx.font = '800 20px "IBM Plex Mono",monospace'; ctx.textAlign = 'center'; ctx.fillText(String(num), 0, -64);
    if (pose === 'trophy') { ctx.fillStyle = mix('#4a3a10', '#ffd54a', b); ctx.fillRect(-12, -158, 24, 24); ctx.fillRect(-4, -134, 8, 8); ctx.fillRect(-11, -127, 22, 5); }
    ctx.restore();
  }
  function players(ctx, t, P, amb) {
    if (!P || P.a < .01) return;
    const b = clamp(amb * 1.05);
    ctx.save(); ctx.globalAlpha = P.a;
    const list = PLAYERS.map((p, i) => {
      let x, y = p.y, ph, pose = P.mode;
      if (P.mode === 'run') { x = 90 + ((((p.bx + t * p.sp) - 90) % 900) + 900) % 900; ph = t * 9 + p.ph; }
      else if (P.mode === 'walk') { x = 90 + ((((p.bx + t * 18) - 90) % 900) + 900) % 900; ph = t * 4 + p.ph; }
      else { x = 540 + (i - 3) * 118; y = 1760 + (i % 2) * 56; ph = t * 5.5 + i * .9; if (P.mode === 'trophy' && i !== 3) pose = 'jump'; if (P.mode === 'trophy' && i === 3) pose = 'trophy'; }
      return { x, y, ph, pose, num: p.num, sp: p.sp };
    }).sort((a, c) => a.y - c.y);
    for (const q of list) drawPlayer(ctx, q.x, q.y, .85 + (q.y - 1700) / 150 * .45, q.ph, q.pose, q.num, b);
    if (P.mode === 'run') { const lead = list[list.length - 1]; const bx = lead.x + (lead.sp > 0 ? 32 : -32), by = lead.y - 6 - Math.abs(Math.sin(t * 9)) * 10; ctx.fillStyle = mix('#555555', '#ffffff', b); ctx.beginPath(); ctx.arc(bx, by, 9, 0, 6.283); ctx.fill(); }
    ctx.restore();
  }

  const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const mix = (a, b, p) => { const A = hex(a), B = hex(b); return `rgb(${Math.round(lerp(A[0], B[0], p))},${Math.round(lerp(A[1], B[1], p))},${Math.round(lerp(A[2], B[2], p))})`; };

  function target(i, t) { return [TARGETS[i][0] + Math.sin(t * .35 + i * 1.7) * 34, TARGETS[i][1]]; }

  /* state: { lights:[4], crowd, cheer, confetti, confettiT, extra:[{x,y,tx,ty,lv,color}] } */
  function render(ctx, t, st) {
    const L = st.lights;
    ctx.setTransform(1,0,0,1,0,0); ctx.globalAlpha=1; ctx.shadowBlur=0; ctx.shadowColor='rgba(0,0,0,0)'; ctx.filter='none'; ctx.lineCap='butt'; ctx.textAlign='start';
    const amb = .16 + .84 * (L[0] + L[1] + L[2] + L[3]) / 4;
    ctx.globalCompositeOperation = 'source-over';
    // langit 2 lapis + cahaya horizon
    let g = ctx.createLinearGradient(0, 0, 0, 1200); g.addColorStop(0, '#0b1430'); g.addColorStop(1, '#070b18');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const hg = ctx.createRadialGradient(540, 1190, 40, 540, 1190, 780);
    hg.addColorStop(0, `rgba(255,214,120,${(.08 + .3 * amb).toFixed(3)})`); hg.addColorStop(1, 'rgba(255,214,120,0)');
    ctx.fillStyle = hg; ctx.fillRect(0, 300, W, 1400);
    // bintang (makin jelas saat lampu padam)
    for (const s of STARS) {
      const a = (.18 + .7 * (1 - amb)) * (.55 + .45 * Math.sin(t * s[4] + s[3]));
      ctx.fillStyle = `rgba(230,236,255,${clamp(a).toFixed(3)})`; ctx.fillRect(s[0], s[1], s[2], s[2]);
    }
    // tiang lampu + kaki papan skor
    ctx.fillStyle = '#141b33';
    for (const x of TOWERS) { ctx.fillRect(x - 8, HEAD_Y + 20, 16, 1160 - HEAD_Y - 20); ctx.fillRect(x - 26, HEAD_Y + 50, 52, 5); }
    ctx.fillStyle = '#10162b'; ctx.fillRect(300, 690, 22, 470); ctx.fillRect(758, 690, 22, 470);
    // dinding tribun
    ctx.fillStyle = '#0c1226'; ctx.fillRect(0, 1150, W, 490);
    // rumput
    g = ctx.createLinearGradient(0, 1630, 0, H); g.addColorStop(0, mix('#0a2016', '#1a5a37', amb)); g.addColorStop(1, '#05100a');
    ctx.fillStyle = g; ctx.fillRect(0, 1630, W, H - 1630);
    for (let i = 0; i < 9; i++) if (i % 2) { ctx.fillStyle = `rgba(255,255,255,${(.018 + .03 * amb).toFixed(3)})`; ctx.fillRect(0, 1630 + i * 32, W, 32); }
    // kursi + penonton
    const tg = [0, 1, 2, 3].map((i) => target(i, t));
    for (const R of ROWS) {
      const x0 = 540 - R.half;
      for (let c = 0; c < R.n; c++) {
        const sx = x0 + R.sp * (c + .5); if (sx < -20 || sx > W + 20) continue;
        let b = amb * .3;
        for (let i = 0; i < 4; i++) { if (L[i] < .01) continue; const dx = sx - tg[i][0], dy = R.y - tg[i][1]; b += L[i] * Math.exp(-(dx * dx) / 80000 - (dy * dy) / 115000); }
        if (st.extra) for (const e of st.extra) { if (e.lv < .01) continue; const dx = sx - e.tx, dy = R.y - e.ty; b += e.lv * .9 * Math.exp(-(dx * dx) / 80000 - (dy * dy) / 115000); }
        b = clamp(b);
        ctx.fillStyle = mix('#1a2240', '#f5c400', b);
        ctx.fillRect(sx - R.sz / 2, R.y - R.sz * .5, R.sz, R.sz * .78);
        const hc = hash(R.r, c);
        if (hc < (st.crowd || 0) * .88) {
          const bob = (st.cheer || 0) * Math.abs(Math.sin(t * 8 + hc * 40)) * 6;
          ctx.fillStyle = mix('#05070f', '#3b4057', b * .55);
          ctx.beginPath(); ctx.arc(sx, R.y - R.sz * .62 - bob, R.sz * .4, 0, 6.283); ctx.fill();
          ctx.fillRect(sx - R.sz * .55, R.y - R.sz * .3 - bob * .6, R.sz * 1.1, R.sz * .55);
          if ((st.cheer || 0) > .45 && hash(c, R.r + 99) < (st.cheer - .45) * 1.2) {
            const wv = Math.sin(t * 6 + hc * 30) * R.sz * .5;
            ctx.fillStyle = '#f5c400'; ctx.fillRect(sx - R.sz * .7 + wv, R.y - R.sz * 1.5 - bob, R.sz * 1.4, R.sz * .32);
          }
        }
      }
    }
    players(ctx, t, st.players, amb);
    // gelap ambien
    ctx.fillStyle = `rgba(2,4,12,${((1 - amb) * .5).toFixed(3)})`; ctx.fillRect(0, 0, W, H);
    // sinar lampu + debu (additive)
    ctx.globalCompositeOperation = 'lighter';
    const beams = [];
    for (let i = 0; i < 4; i++) beams.push({ hx: TOWERS[i], tx: tg[i][0], ty: tg[i][1], lv: L[i], col: [255, 226, 150], dust: DUST[i] });
    if (st.extra) st.extra.forEach((e, k) => beams.push({ hx: e.x, tx: e.tx, ty: e.ty, lv: e.lv, col: e.col || [200, 225, 255], dust: DUST[k % 4] }));
    for (const B of beams) {
      if (B.lv < .01) continue;
      const hy = HEAD_Y + 26, [cr, cg, cb] = B.col;
      const bg = ctx.createLinearGradient(0, hy, 0, B.ty);
      bg.addColorStop(0, `rgba(${cr},${cg},${cb},${(.26 * B.lv).toFixed(3)})`); bg.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
      ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(B.hx - 34, hy); ctx.lineTo(B.hx + 34, hy); ctx.lineTo(B.tx + 230, B.ty); ctx.lineTo(B.tx - 230, B.ty); ctx.closePath(); ctx.fill();
      const pg = ctx.createRadialGradient(B.tx, B.ty, 10, B.tx, B.ty, 300);
      pg.addColorStop(0, `rgba(${cr},${cg},${cb},${(.2 * B.lv).toFixed(3)})`); pg.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
      ctx.fillStyle = pg; ctx.fillRect(B.tx - 300, B.ty - 300, 600, 600);
      for (const d of B.dust) {
        const u = 1 - ((1 - d[0]) + t * .018 * d[2]) % 1;
        const px = lerp(B.hx, B.tx, u) + d[1] * (30 + 200 * u), py = lerp(hy, B.ty, u);
        const a = B.lv * .5 * (.5 + .5 * Math.sin(t * 1.7 + d[4]));
        ctx.fillStyle = `rgba(255,240,205,${clamp(a).toFixed(3)})`; ctx.beginPath(); ctx.arc(px, py, d[3], 0, 6.283); ctx.fill();
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    // kepala lampu
    const heads = TOWERS.map((x, i) => ({ x, lv: L[i], on: '#ffe7a6' }));
    if (st.extra) st.extra.forEach((e) => heads.push({ x: e.x, lv: e.lv, on: e.head || '#dcebff' }));
    for (const hd of heads) {
      ctx.save();
      if (hd.lv > .02) { ctx.shadowColor = hd.on === '#ffe7a6' ? 'rgba(255,220,130,.85)' : 'rgba(190,220,255,.85)'; ctx.shadowBlur = 80 * hd.lv; }
      ctx.fillStyle = mix('#1b2440', hd.on, hd.lv); ctx.fillRect(hd.x - 56, HEAD_Y - 26, 112, 52);
      ctx.restore();
      ctx.fillStyle = `rgba(20,27,51,${(.55 - .35 * hd.lv).toFixed(3)})`;
      for (let a = 0; a < 4; a++) for (let b2 = 0; b2 < 2; b2++) ctx.fillRect(hd.x - 46 + a * 26, HEAD_Y - 18 + b2 * 22, 14, 12);
      ctx.strokeStyle = '#2a355c'; ctx.lineWidth = 3; ctx.strokeRect(hd.x - 56, HEAD_Y - 26, 112, 52);
    }
    // konfeti
    if ((st.confetti || 0) > 0) {
      const d = t - st.confettiT;
      if (d >= 0 && d < 9) for (const p of CONF) {
        const y = p[1] + d * p[2]; if (y > H + 20) continue;
        const x = p[0] + Math.sin(d * p[4] + p[3]) * 34 + p[7] * d * 20;
        ctx.save(); ctx.globalAlpha = st.confetti * clamp((9 - d) / 2.5);
        ctx.translate(x, y); ctx.rotate(d * p[4] * 2 + p[3]); ctx.scale(1, Math.cos(d * p[4] * 3 + p[3]));
        ctx.fillStyle = p[5]; ctx.fillRect(-p[6] / 2, -p[6] / 4, p[6], p[6] / 2); ctx.restore();
      }
    }
    return amb;
  }

  /* lampu: event {i, t, type:'on'|'off'|'flick'} */
  function light(events, i, t, init = 0) {
    let v = init;
    for (const e of events) {
      if (e.i !== i || t < e.t) continue;
      const d = t - e.t;
      if (e.type === 'on') v = d >= .7 ? 1 : (Math.floor(d * 14) % 3 === 1 ? .12 : clamp(.35 + d));
      else if (e.type === 'off') v = d >= .85 ? 0 : (Math.floor(d * 16) % 2 ? .06 : .9);
      else if (e.type === 'flick') v = d >= .7 ? 1 : (Math.floor(d * 14) % 2 ? .1 : 1);
    }
    return v;
  }

  /* kamera: moves terurut, tidak tumpang tindih. {t0,t1,to:{s,x,y},ease} atau {t0,cut:true,to} */
  function cam(t, init, moves) {
    let c = { ...init };
    for (const m of moves) {
      if (t < m.t0) break;
      if (m.cut) { c = { ...m.to }; continue; }
      const p = clamp((t - m.t0) / (m.t1 - m.t0)), e = EASE[m.ease || 'io'](p);
      const n = { s: lerp(c.s, m.to.s, e), x: lerp(c.x, m.to.x, e), y: lerp(c.y, m.to.y, e) };
      if (p < 1) return n;
      c = { ...m.to };
    }
    return c;
  }
  function applyCam(el, t, c) {
    const s = c.s * (1 + .008 * (1 + Math.sin(t * .6)));
    const x = c.x + 5 * Math.sin(t * .41), y = c.y + 4 * Math.sin(t * .33);
    const tx = clamp(540 - x * s, W - W * s, 0), ty = clamp(960 - y * s, H - H * s, 0);
    el.style.transform = `translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px) scale(${s.toFixed(4)})`;
  }

  /* kliping */
  const TROPHY = '<svg viewBox="0 0 120 140"><path d="M30 10h60v20c0 28-14 46-30 50-16-4-30-22-30-50z" fill="#f9e7a0" stroke="#1f1a15" stroke-width="5"/><path d="M30 18H12c0 18 8 26 20 28M90 18h18c0 18-8 26-20 28" fill="none" stroke="#1f1a15" stroke-width="5"/><rect x="50" y="80" width="20" height="24" fill="#f9e7a0" stroke="#1f1a15" stroke-width="5"/><rect x="34" y="104" width="52" height="16" fill="#1f1a15"/></svg>';
  function clipping(o) {
    const el = document.createElement('div'); el.className = 'clip';
    if (o.w) el.style.width = o.w + 'px';
    el.innerHTML = `<div class="mast">${o.mast}</div><div class="date">${o.date}</div><h3>${o.head}</h3>` + (o.photo ? `<div class="ph">${o.photo === 'trophy' ? TROPHY : (o.photo === 'two' ? TROPHY + '' : '')}</div>` : '') + (o.stamp ? `<div class="stamp" style="${o.stampPos || 'left:120px;top:170px'}">${o.stamp}</div>` : '');
    if (o.photo === 'two') { const ph = el.querySelector('.ph'); ph.innerHTML = `<div style="position:absolute;inset:0;display:flex;justify-content:center;align-items:center;gap:30px">${TROPHY.replace('<svg', '<svg style="position:static;transform:none;height:150px"')}${TROPHY.replace('<svg', '<svg style="position:static;transform:none;height:150px"')}</div>`; }
    if (o.gray) el.style.filter = `grayscale(${o.gray}) contrast(.96)`;
    return el;
  }
  /* pose kliping jatuh berputar lalu mendarat: fungsi murni */
  function fall(el, t, f) {
    const { t0, dur = 1.0, x, y, rot = -4, spin = 220, scale = 1, out = Infinity } = f;
    if (t < t0 || t > out + .7) { el.style.visibility = 'hidden'; el.style.transform = ''; return; }
    el.style.visibility = 'visible';
    const p = clamp((t - t0) / dur), e = EASE.out(p);
    const q = t > out ? EASE.in(clamp((t - out) / .7)) : 0;      // diterbangkan angin keluar frame
    const yy = lerp(y - 1300, y, e) - q * 1500, xx = x + Math.sin(p * 3.2) * (1 - p) * 120 + q * 260;
    const r = rot + (1 - e) * spin + q * 70;
    const sc = scale * lerp(1.3, 1, e);
    const sway = p >= 1 ? Math.sin((t - t0) * 1.3) * .6 : 0;
    el.style.left = '0px'; el.style.top = '0px';
    el.style.transform = `translate(${xx.toFixed(1)}px,${yy.toFixed(1)}px) rotate(${(r + sway).toFixed(2)}deg) scale(${sc.toFixed(3)})`;
  }

  /* posisi papan skor di layar untuk kamera c pada waktu t (sama dengan applyCam) */
  function boardRect(t, c) {
    const s = c.s * (1 + .008 * (1 + Math.sin(t * .6)));
    const y = c.y + 4 * Math.sin(t * .33);
    const ty = clamp(960 - y * s, H - H * s, 0);
    return [ty + 380 * s, ty + 692 * s];
  }
  /* pilih slot teks (top) yang tidak ketutup papan selama [at, out]; blok teks setinggi 330 px */
  function pickTop(camAt, at, out) {
    const SLOTS = [790, 1190, 250];
    let best = SLOTS[0], bestOv = Infinity;
    for (const top of SLOTS) {
      let ov = 0;
      for (let t = at - .2; t <= out + .4; t += .1) { const [b0, b1] = boardRect(t, camAt(t)); ov += Math.max(0, Math.min(top + 330, b1) - Math.max(top, b0)); }
      if (ov < 1) return top;
      if (ov < bestOv) { bestOv = ov; best = top; }
    }
    return best;
  }
  window.Stadium = { boardRect, pickTop, W, H, render, light, cam, applyCam, clipping, fall, clamp, lerp, EASE, TOWERS, HEAD_Y, rng };
})();
