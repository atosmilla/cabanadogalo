(() => {
  'use strict';

  const WA = '5547992201777';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const smoothstep = (p, e0, e1) => { const t = clamp((p - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
  function rng(seed) { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
  const easeOutBack = t => { const c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  const RM = matchMedia('(prefers-reduced-motion: reduce)');
  const NS = 'http://www.w3.org/2000/svg';
  const SMALL = matchMedia('(max-width: 720px)').matches;
  const TOUCH = matchMedia('(pointer: coarse)').matches;

  /* ---------- detalhes do prato, gerados com semente ---------- */
  function scatter(g, n, seed, inside, make) {
    if (!g) return;
    const r = rng(seed);
    let made = 0, guard = 0;
    while (made < n && guard++ < n * 30) {
      const x = inside.x + r() * inside.w, y = inside.y + r() * inside.h;
      if (inside.test && !inside.test(x, y)) continue;
      g.appendChild(make(x, y, r, made));
      made++;
    }
  }
  const el = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
  const inEllipse = (cx, cy, rx, ry) => (x, y) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 < 1;

  // grãos de arroz
  scatter($('#grains'), 70, 3, { x: 380, y: 186, w: 150, h: 110, test: inEllipse(456, 242, 64, 46) }, (x, y, r) =>
    el('ellipse', { cx: x.toFixed(1), cy: y.toFixed(1), rx: '4.6', ry: '1.8', fill: r() > .5 ? '#e4dbc6' : '#fffdf7', transform: `rotate(${(r() * 180).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})` }));
  // feijões
  scatter($('#beans'), 26, 5, { x: 430, y: 316, w: 120, h: 106, test: inEllipse(492, 368, 52, 42) }, (x, y, r) =>
    el('ellipse', { cx: x.toFixed(1), cy: y.toFixed(1), rx: '7', ry: '4.2', fill: r() > .5 ? '#7a4630' : '#5a2f1f', transform: `rotate(${(r() * 180).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})` }));
  // grãos do risoto e sementes de maracujá
  scatter($('#risgrains'), 40, 9, { x: 190, y: 330, w: 120, h: 112, test: inEllipse(250, 388, 52, 44) }, (x, y, r) =>
    el('ellipse', { cx: x.toFixed(1), cy: y.toFixed(1), rx: '4', ry: '2', fill: '#fbe39a', opacity: '.8', transform: `rotate(${(r() * 180).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})` }));
  scatter($('#seeds'), 16, 13, { x: 196, y: 340, w: 110, h: 100, test: inEllipse(250, 388, 46, 38) }, (x, y) =>
    el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: '3', fill: '#2b1d12' }));
  // farelo de pé de moleque (dispersão com semente)
  scatter($('#crumbs'), 26, 17, { x: 196, y: 340, w: 112, h: 100, test: inEllipse(252, 388, 50, 40) }, (x, y, r) => {
    const s = 4 + r() * 5;
    const p = el('path', { d: `M${x.toFixed(1)} ${y.toFixed(1)}l${s} ${(-s * .4).toFixed(1)} ${(s * .5).toFixed(1)} ${s} ${(-s * 1.2).toFixed(1)} ${(s * .4).toFixed(1)}z`, fill: r() > .5 ? '#a0612c' : '#c48446' });
    return p;
  });
  // salsinha por cima de tudo
  scatter($('#parsley'), 34, 21, { x: 180, y: 160, w: 400, h: 380, test: inEllipse(380, 350, 190, 180) }, (x, y, r) => {
    const c = el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: (1.6 + r() * 1.6).toFixed(1), fill: r() > .4 ? '#3f8a2e' : '#62a843' });
    return c;
  });

  /* ---------- divisão de texto dos títulos do hero ---------- */
  if (!SMALL) $$('.split').forEach((h, idx) => {
    const text = h.textContent.trim();
    const fx = h.dataset.fx;
    const band = h.closest('.band');
    const spread = parseFloat(band && band.dataset.spread) || .45;
    const r = rng(101 + idx * 17);
    h.textContent = '';
    const sr = document.createElement('span');
    sr.className = 'sr-full';
    sr.textContent = text;
    const vis = document.createElement('span');
    vis.setAttribute('aria-hidden', 'true');
    const words = text.split(' ');
    words.forEach((word, wi) => {
      const w = document.createElement('span');
      w.className = 'w';
      w.style.setProperty('--th', (wi / Math.max(1, words.length) * .5).toFixed(3));
      [...word].forEach(ch => {
        const c = document.createElement('span');
        c.className = 'c';
        c.textContent = ch;
        if (fx === 'scatter') {
          c.style.setProperty('--th', (r() * spread).toFixed(3));
          c.style.setProperty('--jx', ((r() - .5) * 70).toFixed(1) + 'px');
          c.style.setProperty('--jy', (-30 - r() * 60).toFixed(1) + 'px');
          c.style.setProperty('--jr', ((r() - .5) * 100).toFixed(0) + 'deg');
        }
        w.appendChild(c);
      });
      vis.appendChild(w);
      if (wi < words.length - 1) vis.appendChild(document.createTextNode(' '));
    });
    h.append(sr, vis);
  });

  /* ---------- HERO: o prato se serve ---------- */
  const hero = $('#topo');
  const stage = $('.stage', hero);
  // cada comida é uma camada própria; só mexemos em transform e opacity (a placa de vídeo faz o resto)
  const lays = $$('.lay', hero).map(d => {
    const vb = d.querySelector('svg').viewBox.baseVal;
    return { el: d, kind: d.dataset.k, a: parseFloat(d.dataset.a), b: parseFloat(d.dataset.b), w: vb.width, h: vb.height, tf: '', op: '' };
  });
  const cue = $('.cue', hero);
  let cueOp = '';
  const bands = $$('.band', hero).map((b, i, all) => ({
    el: b, a: parseFloat(b.dataset.a), b: parseFloat(b.dataset.b), ramp: parseFloat(b.dataset.ramp) || 0,
    first: i === 0, last: i === all.length - 1, op: -1, k: -1, live: null
  }));
  const cache = {};

  const geo = { top: 0, h: 0, range: 0 };
  function measureHero() {
    geo.top = hero.getBoundingClientRect().top + scrollY;
    geo.h = hero.offsetHeight;
    geo.range = geo.h - innerHeight;
  }
  measureHero();
  function heroProgress() {
    return geo.range > 0 ? clamp((scrollY - geo.top) / geo.range, 0, 1) : 1;
  }
  function setVar(node, name, v, eps) {
    if (cache[name] !== undefined && Math.abs(cache[name] - v) < eps) return;
    cache[name] = v;
    node.style.setProperty(name, v.toFixed(4));
  }

  let loadK = 0;
  function render(p) {
    const c = clamp(1 - p * 12, 0, 1).toFixed(2);
    if (c !== cueOp) { cueOp = c; cue.style.opacity = c; }
    lays.forEach(L => {
      const t = clamp((p - L.a) / (L.b - L.a), 0, 1);
      let tf = '', o;
      if (L.kind === 'steam') { o = smoothstep(p, L.a, L.b); }
      else if (L.kind === 'crumbs') { o = t; tf = `translate3d(0,${((1 - t) * -35).toFixed(2)}%,0) scale(${(1.5 - .5 * t).toFixed(4)})`; }
      else if (L.kind === 'pars') { o = t; tf = `translate3d(0,${((1 - t) * -12).toFixed(2)}%,0)`; }
      else {
        const e = t === 0 ? 0 : t === 1 ? 1 : easeOutBack(t);
        o = clamp(t * 4, 0, 1);
        const q = 1 - e;
        tf = L.kind === 'pud'
          ? `translate3d(${(q * 220 / L.w * 100).toFixed(2)}%,${(q * -60 / L.h * 100).toFixed(2)}%,0) rotate(${(q * 40).toFixed(2)}deg)`
          : `translate3d(0,${(q * -150 / L.h * 100).toFixed(2)}%,0) scale(${(1.32 - .32 * e).toFixed(4)})`;
      }
      const os = o.toFixed(3);
      if (tf !== L.tf) { L.tf = tf; L.el.style.transform = tf; }
      if (os !== L.op) { L.op = os; L.el.style.opacity = os; }
      const vis = o > 0;
      if (vis !== L.vis) { L.vis = vis; L.el.style.visibility = vis ? '' : 'hidden'; }
    });

    bands.forEach(bd => {
      const { a, b } = bd;
      const f = Math.min(.02, (b - a) / 3);
      const op = (bd.first ? 1 : smoothstep(p, a, a + f)) * (bd.last ? 1 : 1 - smoothstep(p, b - f, b));
      let k = clamp((p - a) / (bd.ramp || Math.min(.025, (b - a) * .35)), 0, 1);
      if (bd.first) k = Math.max(k, loadK);
      if (bd.last) k = smoothstep(p, a, a + .08);
      if (Math.abs(op - bd.op) > .004 || (op === 0 && bd.op !== 0) || (op === 1 && bd.op !== 1)) { bd.op = op; bd.el.style.opacity = op.toFixed(3); }
      if (Math.abs(k - bd.k) > .008 || (k === 1 && bd.k !== 1) || (k === 0 && bd.k !== 0)) { bd.k = k; bd.el.style.setProperty('--k', k.toFixed(3)); }
      const live = op > .5;
      if (live !== bd.live) { bd.live = live; bd.el.classList.toggle('live', live); bd.el.toggleAttribute('inert', !live); }
    });
  }

  let target = 0, shown = 0, rafId = null, lastTick = 0, heroOnScreen = true, scrubOn = false;
  function tick(now) {
    const dt = Math.min(100, now - (lastTick || now));
    lastTick = now;
    shown = TOUCH ? target : shown + (target - shown) * (1 - Math.pow(1 - .14, dt / 16.667));
    if (Math.abs(target - shown) < .0004) { shown = target; rafId = null; lastTick = 0; }
    else rafId = requestAnimationFrame(tick);
    render(shown);
  }
  function onScroll() {
    target = heroProgress();
    if (rafId === null && heroOnScreen) rafId = requestAnimationFrame(tick);
  }
  new IntersectionObserver(es => {
    heroOnScreen = es[0].isIntersecting;
    stage.classList.toggle('run', heroOnScreen);
    if (heroOnScreen && scrubOn) onScroll();
  }).observe(hero);

  function loadRamp() {
    const t0 = performance.now();
    const step = now => {
      loadK = clamp((now - t0) / 1400, 0, 1);
      if (scrubOn) render(shown);
      if (loadK < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function enableScrub() {
    if (scrubOn) return;
    scrubOn = true;
    hero.classList.remove('static');
    bands.forEach(b => { b.op = -1; b.k = -1; b.live = null; b.el.style.opacity = ''; });
    lays.forEach(L => { L.tf = ''; L.op = ''; L.vis = null; });
    cueOp = '';
    Object.keys(cache).forEach(k => delete cache[k]);
    unpinFinalStates();
    addEventListener('scroll', onScroll, { passive: true });
    shown = target = heroProgress();
    render(shown);
  }
  function disableScrub() {
    if (!scrubOn && hero.classList.contains('static')) return;
    scrubOn = false;
    removeEventListener('scroll', onScroll);
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    hero.classList.add('static');
    lays.forEach(L => { L.el.style.transform = ''; L.el.style.opacity = ''; L.el.style.visibility = ''; L.tf = ''; L.op = ''; L.vis = null; });
    cue.style.opacity = ''; cueOp = '';
    bands.forEach(b => { b.el.style.opacity = ''; b.el.style.removeProperty('--k'); b.el.toggleAttribute('inert', !b.last); b.el.classList.toggle('live', b.last); });
  }
  function applyHeroMode() { if (RM.matches) disableScrub(); else enableScrub(); }

  /* ---------- estados finais (movimento reduzido ao vivo) ---------- */
  let pinned = false;
  const fmt = (v, dec) => v.toFixed(dec).replace('.', ',');
  function pinToFinalStates() {
    pinned = true;
    sprigs.forEach(s => s.style.setProperty('--dk', '1'));
    $$('.count').forEach(c => c.textContent = fmt(parseFloat(c.dataset.to), +c.dataset.dec || 0));
    $$('.reveal').forEach(s => s.classList.add('in', 'done'));
  }
  function unpinFinalStates() {
    if (!pinned) return;
    pinned = false;
    sprigs.forEach(s => { s.style.removeProperty('--dk'); s._k = -1; });
    updateSprigs();
  }

  /* ---------- ramo de salsinha que se desenha no scroll ---------- */
  const sprigs = $$('.sprig').map(s => {
    const path = s.querySelector('path');
    s.style.setProperty('--len', Math.ceil(path.getTotalLength()) + 2);
    s._k = -1; s._top = 0;
    return s;
  });
  function measureSprigs() { sprigs.forEach(s => { s._top = s.getBoundingClientRect().top + scrollY; }); }
  measureSprigs();
  let sprigTick = null;
  function updateSprigs() {
    sprigTick = null;
    if (RM.matches) return;
    const vh = innerHeight;
    sprigs.forEach(s => {
      const k = clamp((vh - (s._top - scrollY)) / (vh * .6), 0, 1);
      if (Math.abs(k - s._k) > .005) { s._k = k; s.style.setProperty('--dk', k.toFixed(3)); }
    });
  }
  addEventListener('scroll', () => { if (!sprigTick) sprigTick = requestAnimationFrame(updateSprigs); }, { passive: true });

  /* ---------- entradas das seções ---------- */
  $$('.reveal').forEach(sec => {
    const kids = [...sec.children].flatMap(ch => ch.matches('.stats, .quotes, .board, .steps, .faq-list, .picks') ? [ch] : [ch]);
    kids.forEach(ch => ch.classList.add('rv'));
    $$('.quotes figure, .board .col, .steps li, .faq details, .stats li', sec).forEach(x => x.classList.add('rv'));
  });
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const s = e.target;
    s.classList.add('in');
    io.unobserve(s);
    setTimeout(() => s.classList.add('done'), 1600);
    $$('.count', s).forEach(countUp);
  }), { threshold: .15, rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach(s => io.observe(s));

  function countUp(c) {
    const to = parseFloat(c.dataset.to), dec = +c.dataset.dec || 0;
    if (RM.matches) { c.textContent = fmt(to, dec); return; }
    const t0 = performance.now(), dur = 1300;
    const step = now => {
      const t = clamp((now - t0) / dur, 0, 1);
      c.textContent = fmt(to * (1 - Math.pow(1 - t, 3)), dec);
      if (t < 1 && !pinned) requestAnimationFrame(step); else c.textContent = fmt(to, dec);
    };
    requestAnimationFrame(step);
  }

  /* ---------- navegação sólida depois do hero ---------- */
  const nav = $('.nav');
  let navSolid = null;
  function navState() {
    const solid = scrollY > geo.h - innerHeight * .6 || (hero.classList.contains('static') && scrollY > 40);
    if (solid !== navSolid) { navSolid = solid; nav.classList.toggle('solid', solid); }
  }
  addEventListener('scroll', navState, { passive: true });

  /* ---------- sirva o seu prato ---------- */
  const NAMES = { salada: 'salada', arroz: 'arroz', feijao: 'feijão', carne: 'carne de panela', risoto: 'risoto de maracujá', pudim: 'pudim de tapioca' };
  const picked = new Set();
  const join = arr => arr.length < 2 ? arr.join('') : arr.slice(0, -1).join(', ') + ' e ' + arr[arr.length - 1];
  function plateList() { return Object.keys(NAMES).filter(k => picked.has(k)).map(k => NAMES[k]); }
  $$('.pick').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.k;
    picked.has(k) ? picked.delete(k) : picked.add(k);
    b.setAttribute('aria-pressed', picked.has(k));
    $('.mini .o-' + k).classList.toggle('on', picked.has(k));
    const list = plateList();
    $('#pnote').textContent = !list.length ? 'Seu prato ainda está vazio.'
      : list.length >= 5 ? 'Prato completo, do jeito da casa: ' + join(list) + '.'
      : 'No seu prato: ' + join(list) + '.';
  }));

  /* ---------- reserva pelo WhatsApp ---------- */
  const form = $('#resForm');
  let ppl = 2;
  const pOut = $('#pQty');
  $('#pMinus').addEventListener('click', () => { ppl = Math.max(1, ppl - 1); pOut.textContent = ppl; });
  $('#pPlus').addEventListener('click', () => { ppl = Math.min(40, ppl + 1); pOut.textContent = ppl; });
  const dia = $('#rDia');
  const todayISO = () => {
    const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };
  dia.min = todayISO();
  dia.value = todayISO();
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nome = $('#rNome').value.trim();
    const err = $('#rErr');
    if (!nome) { err.textContent = 'Coloque seu nome para a gente reservar.'; $('#rNome').focus(); return; }
    if (!dia.value) { err.textContent = 'Escolha o dia da reserva.'; dia.focus(); return; }
    err.textContent = '';
    const [y, m, d] = dia.value.split('-');
    let msg = `Olá, Cabanä do Galo! Quero reservar uma mesa.\nNome: ${nome}\nDia: ${d}/${m}/${y}\nHorário: ${$('#rHora').value}\nPessoas: ${ppl}`;
    const list = plateList();
    if (list.length) msg += `\nMeu prato vai ter: ${join(list)}`;
    const obs = $('#rObs').value.trim();
    if (obs) msg += `\nRecado: ${obs}`;
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });

  /* ---------- aberto agora? (horário de Brasília) ---------- */
  function openStatus() {
    const s = $('#status');
    try {
      const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
      const h = parseInt(parts.find(x => x.type === 'hour').value, 10) % 24;
      const mi = parseInt(parts.find(x => x.type === 'minute').value, 10);
      const t = h * 60 + mi;
      const open = t >= 690 && t < 885;
      s.classList.toggle('open', open);
      s.querySelector('span').textContent = open ? 'Aberto agora, almoço até as 14:45'
        : t < 690 ? 'Fechado agora. Abre hoje às 11:30' : 'Fechado agora. Abre amanhã às 11:30';
    } catch (e) { /* mantém o texto padrão */ }
  }
  openStatus();
  setInterval(openStatus, 60000);
  $('#ano').textContent = new Date().getFullYear();

  /* ---------- pausa em aba escondida ---------- */
  document.addEventListener('visibilitychange', () => document.body.classList.toggle('paused', document.hidden));

  /* ---------- portão de movimento reduzido, ao vivo ---------- */
  RM.addEventListener('change', e => {
    if (e.matches) { pinToFinalStates(); disableScrub(); }
    else applyHeroMode();
    navState();
  });
  if (RM.matches) pinToFinalStates();
  let measT = null;
  function remeasure() {
    measT = null;
    measureHero(); measureSprigs();
    if (scrubOn) onScroll();
    updateSprigs(); navState();
  }
  const queueMeasure = () => { if (!measT) measT = requestAnimationFrame(remeasure); };
  addEventListener('resize', queueMeasure, { passive: true });
  new ResizeObserver(queueMeasure).observe(document.body);
  if (document.fonts) document.fonts.ready.then(queueMeasure);

  applyHeroMode();
  loadRamp();
  updateSprigs();
  navState();
})();
