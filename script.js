/* ===== Helper ===== */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const ic = n => `<svg class="ic"><use href="#i-${n}"/></svg>`;
const esc = s => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
$('#yr').textContent = '© ' + new Date().getFullYear() + '.';

/* ===== Data ===== */
// Ganti dengan 'img/foto.jpg' jika sudah punya file foto sendiri
const FOTO = "jwen.jpeg";
$$('.foto').forEach(i => i.src = FOTO);

const skills = [
  ['code','HTML dan CSS',90,'HTML & CSS'], ['globe','JavaScript',75,'JavaScript'], ['db','Basis Data (MySQL)',85,'MySQL'],
  ['layers','Analisis Sistem (UML, ERD)',88,'UML & ERD'], ['pen','Desain UI',80,'Desain UI']];
const tools = [['code','VS Code'],['git','Git dan GitHub'],['layers','Tailwind CSS'],['pen','Figma'],['chart','Excel'],['chart','Power BI'],['code','PHP'],['layers','Draw.io']];
const soft = ['Kerja tim','Komunikasi','Analitis','Manajemen waktu','Cepat belajar'];
const projects = [
  ['book','Sistem Informasi Akademik','Pengelolaan data mahasiswa, jadwal, dan nilai dengan hak akses berbeda untuk dosen dan mahasiswa.','PHP · MySQL'],
  ['cart','Aplikasi Kasir UMKM','Sistem kasir sederhana untuk mencatat transaksi, stok barang, dan laporan harian toko kecil.','JavaScript · LocalStorage'],
  ['globe','Website Profil Desa','Situs informasi desa yang responsif lengkap dengan berita, galeri kegiatan, dan peta lokasi.','HTML · CSS · Tailwind'],
  ['chart','Dashboard Analisis Penjualan','Visualisasi data penjualan bulanan agar tren dan produk terlaris mudah dibaca.','Excel · Power BI'],
  ['db','Perancangan Sistem Perpustakaan','Tugas kuliah analisis dan perancangan sistem: use case, ERD, dan prototipe antarmuka peminjaman buku.','UML · ERD · Figma'],
  ['check','Aplikasi To-Do Kolaboratif','Pengelola tugas harian dengan kategori, pengingat, dan tampilan mode gelap.','JavaScript · CSS']];

/* ===== Render ===== */
const words = ['Sistem Informasi','Web Development','Basis Data','UI Design','Analisis Data','Universitas Pamulang'];
const mq = words.map(w => `<span>${w}</span><i class="gem"></i>`).join('');
$('#marq').innerHTML = mq + mq;

$('#rings').innerHTML = skills.map((s, i) =>
  `<div class="ring glass" style="--d:${.15 + i * .1}s"><div class="gauge"><svg viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="44"/><circle class="fg" cx="50" cy="50" r="44" data-w="${s[2]}"/></svg><span class="ico">${ic(s[0])}</span></div><b class="pc">${s[2]}%</b><span class="nm">${s[1]}</span></div>`).join('');
$('#soft').innerHTML = soft.map((t, i) => `<span class="tag" style="--d:${.5 + i * .07}s">${ic('star')}${t}</span>`).join('');
$('#grid').innerHTML = projects.map((p,i) =>
  `<article class="glass card rv ${i % 2 ? 'r' : 'l'}"><svg class="ic ghost"><use href="#i-${p[0]}"/></svg><div class="top"><span class="ib">${ic(p[0])}</span><span class="no">0${i+1}</span></div><h3>${p[1]}</h3><p>${p[2]}</p><span class="tag">${ic('code')}${p[3]}</span></article>`).join('');

/* ===== Sorotan proyek: slider halus (posisi dihitung per item, tanpa lompatan) ===== */
(() => {
  const tints = ['#6b4226','#5b6068','#8b5a2b','#3f444c','#7a4a28','#7d828b'];
  const box = $('#show'), stage = $('#sStage'), n = projects.length;
  stage.innerHTML = projects.map(p => `<div class="so"><div class="med"><span>${ic(p[0])}</span></div></div>`).join('');
  $('#sDots').innerHTML = projects.map((_, i) => `<i data-i="${i}"></i>`).join('');
  const items = $$('.so'), dots = $$('#sDots i'), prevO = items.map(() => 0);
  let cur = 0, timer, swapT, paused = false, visible = true;

  const signed = (k, c) => { let o = ((k - c) % n + n) % n; if (o > n / 2) o -= n; return o; };
  function layout(first) {
    items.forEach((el, k) => {
      const o = signed(k, cur), ao = Math.abs(o);
      const wrap = !first && Math.abs(o - prevO[k]) > n / 2;        // item meloncat dari sisi kiri ke kanan saat tak terlihat
      if (wrap) el.style.transition = 'none';
      el.style.transform = `translateX(${o === 0 ? 0 : Math.sign(o) * (ao === 1 ? 62 : 95)}%) scale(${ao === 0 ? 1.15 : ao === 1 ? .6 : .4})`;
      el.style.opacity = ao === 0 ? 1 : ao === 1 ? .65 : 0;
      el.style.filter = `blur(${ao === 0 ? 0 : ao === 1 ? 5 : 9}px)`;
      el.style.zIndex = 3 - Math.min(ao, 2);
      if (wrap) { void el.offsetWidth; el.style.transition = ''; }
      prevO[k] = o;
    });
  }
  function text(first) {
    const set = () => {
      const p = projects[cur];
      $('#sNo').textContent = '0' + (cur + 1) + ' / 0' + n;
      $('#sTitle').textContent = p[1]; $('#sDesc').textContent = p[2];
      $('#sTag').innerHTML = ic('code') + p[3];
      box.classList.remove('sw');
    };
    clearTimeout(swapT);
    if (first) return set();
    box.classList.add('sw'); swapT = setTimeout(set, 320);
  }
  function go(i, first) {
    cur = (i + n) % n;
    layout(first); text(first);
    box.style.setProperty('--tint', tints[cur % tints.length]);
    dots.forEach((d, k) => d.classList.toggle('on', k === cur));
  }
  const auto = () => { clearInterval(timer); timer = setInterval(() => { if (!paused && visible) go(cur + 1); }, 4200); };
  $('#sNext').onclick = () => { go(cur + 1); auto(); };
  $('#sPrev').onclick = () => { go(cur - 1); auto(); };
  dots.forEach(d => d.onclick = () => { go(+d.dataset.i); auto(); });
  box.addEventListener('pointerenter', () => paused = true);
  box.addEventListener('pointerleave', () => paused = false);
  new IntersectionObserver(es => visible = es[0].isIntersecting).observe(box);
  let sx = null;                                                   // geser untuk ganti slide
  stage.addEventListener('pointerdown', e => sx = e.clientX);
  addEventListener('pointerup', e => { if (sx === null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 40) { go(cur + (dx < 0 ? 1 : -1)); auto(); } });
  go(0, true); auto();
})();

/* ===== Efek kartu proyek ===== */
$$('.card').forEach(c => {
  c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    c.style.setProperty('--x', x + 'px'); c.style.setProperty('--y', y + 'px');
    c.style.transform = `perspective(900px) rotateY(${(x/r.width-.5)*7}deg) rotateX(${(.5-y/r.height)*7}deg) translateY(-5px)`;
  });
  c.addEventListener('pointerleave', () => c.style.transform = '');
});

/* ===== Reveal saat scroll + animasi bar ===== */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    e.target.classList.add('in');
    const dl = parseFloat(e.target.style.transitionDelay) || 0;
    setTimeout(() => { e.target.style.transitionDelay = ''; e.target.classList.add('done'); }, 1000 + dl);
    e.target.querySelectorAll('.fg[data-w]').forEach(c => { c.style.strokeDashoffset = 276.46 * (1 - c.dataset.w / 100); countUp(c.closest('.ring').querySelector('.pc'), +c.dataset.w, '%', 1800); });
    if (e.target.id === 'radarCard') growRadar();
    e.target.querySelectorAll('.stat b').forEach(b => countUp(b, parseInt(b.textContent), b.textContent.replace(/\d/g, ''), 1400));
    io.unobserve(e.target);
  }
}), {threshold: .15});
$$('.rv').forEach((el,i) => { el.style.transitionDelay = (i % 3) * 90 + 'ms'; io.observe(el); });

/* ===== Navbar dynamic island: indikator meluncur, scroll-spy halus ===== */
const isl = $('#island'), links = $$('#links a'), cur = $('#cur'), ind = $('#ind'), tog = $('#tog');
const secs = links.map(a => $(a.getAttribute('href')));
links.forEach((a, i) => a.style.setProperty('--i', i));
let active = -1, ticking = false;
const mobile = () => innerWidth <= 760;
function place() {
  const a = links[active];
  if (!a || isl.classList.contains('mini')) return;
  ind.style.width = a.offsetWidth + 'px';
  ind.style.transform = `translateX(${a.offsetLeft}px)`;
}
/* ringkas (satu item + tombol) di HP dan di semua bagian selain Beranda */
function syncMini() {
  const m = mobile() || active > 0;
  if (m === isl.classList.contains('mini')) return;
  isl.classList.toggle('mini', m);
  if (!m) closeNav();
}
function setActive(i) {
  if (i === active) return;
  active = i;
  links.forEach((l, k) => l.classList.toggle('on', k === i));
  cur.textContent = links[i].dataset.n;
  syncMini();
  place();
  isl.classList.add('pop'); setTimeout(() => isl.classList.remove('pop'), 450);
}
function spy() {
  ticking = false;
  const y = scrollY + innerHeight * .35;
  let i = 0; secs.forEach((s, k) => { if (s.offsetTop <= y) i = k; });
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) i = secs.length - 1;
  setActive(i);
  isl.classList.toggle('sm', scrollY > 30);
}
let lastY = 0;
const closeNav = () => { isl.classList.remove('open'); tog.setAttribute('aria-expanded', 'false'); lastY = scrollY; };
tog.addEventListener('click', e => {
  e.stopPropagation();
  const o = isl.classList.toggle('open'); tog.setAttribute('aria-expanded', o); lastY = scrollY;
});
/* menu tetap terbuka saat memilih bagian atau scroll; baru menutup saat jwendi luar navbar, Escape, atau tombol */
document.addEventListener('click', e => { if (!isl.contains(e.target)) closeNav(); });
addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, {passive: true});
addEventListener('resize', () => { syncMini(); place(); });
spy(); place();
requestAnimationFrame(() => isl.classList.add('rdy'));
if (document.fonts) document.fonts.ready.then(place);

/* ===== Kartu KTM: flip + tilt ===== */
const ktm = $('#ktm');
const flip = () => ktm.classList.toggle('flipped');
ktm.addEventListener('click', flip);
ktm.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
ktm.addEventListener('pointermove', e => {
  if (e.pointerType === 'touch') return;
  const r = ktm.getBoundingClientRect();
  ktm.style.transform = `rotateX(${(.5-(e.clientY-r.top)/r.height)*10}deg) rotateY(${((e.clientX-r.left)/r.width-.5)*12}deg)`;
});
ktm.addEventListener('pointerleave', () => ktm.style.transform = '');
ktm.style.transition = 'transform .3s ease-out';

/* ===== Komentar publik ===== */
const KEY = 'jenita-komentar';
let cms = [];
try { cms = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) {}
if (!cms.length) cms = [
  {n:'Scoups', m:'Kartu KTM-nya bisa dibalik, kreatif banget! Semangat terus Jenita.', t:''},
  {n:'Woojin', m:'Tampilannya rapi dan efek airnya halus. Proyek perpustakaannya juga jelas.', t:''},
  {n:'Siwan', m:'Navbar dynamic island-nya keren, beda dari portofolio biasa.', t:''}];
function draw() {
  $('#list').innerHTML = cms.map(c =>
    `<div class="glass cm" style="--i:${cms.indexOf(c)}"><div class="av">${esc(c.n[0] || '?').toUpperCase()}</div><div><b>${esc(c.n)}</b> ${c.t ? `<small>· ${esc(c.t)}</small>` : ''}<p>${esc(c.m)}</p></div></div>`).join('');
}
draw();
$('#send').addEventListener('click', () => {
  const n = $('#nm').value.trim(), m = $('#ms').value.trim();
  if (!n || !m) { const f = n ? $('#ms') : $('#nm'); f.focus(); f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); return; }
  confetti($('#send'));
  cms.unshift({n, m, t: new Date().toLocaleDateString('id-ID', {day:'numeric', month:'short'})});
  try { localStorage.setItem(KEY, JSON.stringify(cms.slice(0, 50))); } catch (e) {}
  $('#nm').value = $('#ms').value = ''; draw();
});

/* ===== Kursor splash: simulasi cairan WebGL (hitam, coklat, silver) =====
   Cairan keluar tepat di titik kursor, berpusar mulus, lalu cepat memudar. */
(() => { try {
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const cv = $('#water');
  const gl = cv.getContext('webgl2', {alpha: true, antialias: false, depth: false, stencil: false});
  if (!gl || !(gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float'))) return;

  /* pengaturan: ubah di sini */
  const FORCE = 3800, RADIUS = .0017, DENSITY = .18, CURL = 18, DYE_FADE = 2.3, VEL_FADE = 1.8, IDLE_MS = 3500;

  const VS = `#version 300 es
layout(location=0) in vec2 a;out vec2 uv,L,R,T,B;uniform vec2 px;
void main(){uv=a*.5+.5;L=uv-vec2(px.x,0.);R=uv+vec2(px.x,0.);T=uv+vec2(0.,px.y);B=uv-vec2(0.,px.y);gl_Position=vec4(a,0.,1.);}`;
  const HEAD = `#version 300 es
precision highp float;precision highp sampler2D;in vec2 uv,L,R,T,B;out vec4 o;`;
  const SRC = {
    adv:`uniform sampler2D v,s;uniform vec2 px;uniform float dt,k;void main(){o=texture(s,uv-dt*texture(v,uv).xy*px)/(1.+k*dt);}`,
    splat:`uniform sampler2D s;uniform vec2 pt;uniform vec4 c;uniform float asp,r;void main(){vec2 d=uv-pt;d.x*=asp;o=texture(s,uv)+exp(-dot(d,d)/r)*c;}`,
    curl:`uniform sampler2D v;void main(){o=vec4(.5*(texture(v,R).y-texture(v,L).y-texture(v,T).x+texture(v,B).x),0.,0.,1.);}`,
    vort:`uniform sampler2D v,c;uniform float k,dt;void main(){float l=texture(c,L).x,r=texture(c,R).x,t=texture(c,T).x,b=texture(c,B).x,m=texture(c,uv).x;vec2 f=.5*vec2(abs(t)-abs(b),abs(r)-abs(l));f/=length(f)+1e-4;f*=k*m;f.y*=-1.;o=vec4(clamp(texture(v,uv).xy+f*dt,-1000.,1000.),0.,1.);}`,
    div:`uniform sampler2D v;void main(){float l=texture(v,L).x,r=texture(v,R).x,t=texture(v,T).y,b=texture(v,B).y;vec2 c=texture(v,uv).xy;if(L.x<0.)l=-c.x;if(R.x>1.)r=-c.x;if(T.y>1.)t=-c.y;if(B.y<0.)b=-c.y;o=vec4(.5*(r-l+t-b),0.,0.,1.);}`,
    prs:`uniform sampler2D p,d;void main(){o=vec4((texture(p,L).x+texture(p,R).x+texture(p,B).x+texture(p,T).x-texture(d,uv).x)*.25,0.,0.,1.);}`,
    grad:`uniform sampler2D p,v;void main(){o=vec4(texture(v,uv).xy-vec2(texture(p,R).x-texture(p,L).x,texture(p,T).x-texture(p,B).x),0.,1.);}`,
    clr:`uniform sampler2D s;uniform float k;void main(){o=k*texture(s,uv);}`,
    disp:`uniform sampler2D s;void main(){vec4 d=texture(s,uv);float a=clamp(d.a,0.,.3);o=vec4(d.rgb/max(d.a,.001)*a,a);}`
  };
  const P = {};
  for (const k in SRC) {
    const p = gl.createProgram();
    [[gl.VERTEX_SHADER, VS], [gl.FRAGMENT_SHADER, HEAD + SRC[k]]].forEach(([t, s]) => {
      const sh = gl.createShader(t); gl.shaderSource(sh, s); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(k + ': ' + gl.getShaderInfoLog(sh));
      gl.attachShader(p, sh);
    });
    gl.linkProgram(p); P[k] = {p, l: {}};
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  function fbo(w, h) {
    const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
    [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]].forEach(([a, b]) => gl.texParameteri(gl.TEXTURE_2D, a, b));
    const fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    return {tex, fb, w, h};
  }
  const dbl = (w, h) => { const o = {r: fbo(w, h), w: fbo(w, h), sw() { [o.r, o.w] = [o.w, o.r]; }}; return o; };

  function run(pr, u, t) {
    gl.useProgram(pr.p); let n = 0;
    for (const k in u) {
      const v = u[k]; const loc = pr.l[k] ?? (pr.l[k] = gl.getUniformLocation(pr.p, k));
      if (v && v.tex) { gl.activeTexture(gl.TEXTURE0 + n); gl.bindTexture(gl.TEXTURE_2D, v.tex); gl.uniform1i(loc, n++); }
      else if (Array.isArray(v)) gl['uniform' + v.length + 'f'](loc, ...v);
      else gl.uniform1f(loc, v);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, t ? t.fb : null);
    gl.viewport(0, 0, t ? t.w : cv.width, t ? t.h : cv.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  let vel, dye, curl, dv, pr, sx, asp;
  const dim = base => { const a = cv.width / cv.height; return a > 1 ? [Math.round(base * a), base] : [base, Math.round(base / a)]; };
  function init() {
    const d = Math.min(devicePixelRatio || 1, 1.5);
    cv.width = Math.max(2, Math.round(innerWidth * d)); cv.height = Math.max(2, Math.round(innerHeight * d));
    asp = cv.width / cv.height;
    const [sw, sh] = dim(128), [dw, dh] = dim(512);
    vel = dbl(sw, sh); dye = dbl(dw, dh); curl = fbo(sw, sh); dv = fbo(sw, sh); pr = dbl(sw, sh);
    sx = [1 / sw, 1 / sh];
  }
  init();
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(init, 250); });

  /* warna: silver > coklat > coklat tua > hitam kecoklatan > silver ... */
  const pal = [[.89,.9,.92],[.69,.48,.29],[.44,.27,.15],[.06,.04,.03],[.67,.69,.72],[.59,.38,.23]];
  const col = h => { const n = pal.length, i = Math.floor(h) % n, f = h % 1, a = pal[i], b = pal[(i + 1) % n]; return a.map((v, k) => v + (b[k] - v) * f); };

  const Q = []; let last = null, hue = 0, lastMove = 0, idle = true;
  function push(x, y, fx, fy) { Q.push([x / innerWidth, 1 - y / innerHeight, fx, fy, col(hue)]); idle = false; lastMove = performance.now(); }
  function feed(x, y) {                 // titik kursor asli, disambung rapat sepanjang jalur
    if (last) {
      const dx = x - last.x, dy = y - last.y, dist = Math.hypot(dx, dy);
      if (dist < .5) return;
      hue += dist * .004;
      const n = Math.min(8, Math.ceil(dist / 22));
      for (let s = 1; s <= n; s++) { const f = s / n; push(last.x + dx * f, last.y + dy * f, dx / n / innerWidth * FORCE, -dy / n / innerHeight * FORCE); }
    } else push(x, y, 0, 0);
    last = {x, y};
  }
  addEventListener('pointermove', e => (e.getCoalescedEvents ? e.getCoalescedEvents() : [e]).forEach(ev => feed(ev.clientX, ev.clientY)), {passive: true});
  addEventListener('pointerdown', e => { for (let k = 0; k < 8; k++) { const a = Math.random() * 6.28; push(e.clientX, e.clientY, Math.cos(a) * 18, Math.sin(a) * 18); } });
  document.addEventListener('pointerleave', () => last = null);

  function splat(x, y, fx, fy, c) {
    run(P.splat, {s: vel.r, pt: [x, y], c: [fx, fy, 0, 0], asp, r: RADIUS, px: sx}, vel.w); vel.sw();
    run(P.splat, {s: dye.r, pt: [x, y], c: [c[0] * DENSITY, c[1] * DENSITY, c[2] * DENSITY, DENSITY], asp, r: RADIUS, px: sx}, dye.w); dye.sw();
  }
  function step(dt) {
    run(P.curl, {v: vel.r, px: sx}, curl);
    run(P.vort, {v: vel.r, c: curl, k: CURL, dt, px: sx}, vel.w); vel.sw();
    run(P.div, {v: vel.r, px: sx}, dv);
    run(P.clr, {s: pr.r, k: .8, px: sx}, pr.w); pr.sw();
    for (let i = 0; i < 16; i++) { run(P.prs, {p: pr.r, d: dv, px: sx}, pr.w); pr.sw(); }
    run(P.grad, {p: pr.r, v: vel.r, px: sx}, vel.w); vel.sw();
    run(P.adv, {v: vel.r, s: vel.r, px: sx, dt, k: VEL_FADE}, vel.w); vel.sw();
    run(P.adv, {v: vel.r, s: dye.r, px: sx, dt, k: DYE_FADE}, dye.w); dye.sw();
  }

  let prev = performance.now();
  (function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min((now - prev) / 1000, .0167); prev = now;
    if (idle) return;
    if (now - lastMove > IDLE_MS) { idle = true; gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); return; }
    Q.splice(0, 24).forEach(s => splat(...s)); Q.length = 0;
    step(dt || .0167);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    run(P.disp, {s: dye.r, px: [1, 1]}, null);
    gl.disable(gl.BLEND);
  })(performance.now());
} catch (err) { console.warn('Efek kursor dinonaktifkan:', err); } })();

/* ===== ANIMASI SERU ===== */
const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;

/* angka naik dari 0 */
function countUp(el, to, suf, ms) {
  const t0 = performance.now();
  (function f(t) {
    const p = Math.min((t - t0) / ms, 1), e = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(to * e) + suf;
    if (p < 1) requestAnimationFrame(f);
  })(t0);
}

/* ledakan permata kecil (klik) dan confetti (kirim komentar) */
function burst(x, y, n, spread, size) {
  if (calm) return;
  const cols = ['#e6e8ec', '#b07a4a', '#6b4226', '#9fa4ac', '#d3d6db'];
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i'); p.className = 'fx';
    const s = 9 * size * (.5 + Math.random());
    p.style.background = cols[i % cols.length]; p.style.width = p.style.height = s + 'px';
    if (i % 2) p.style.borderRadius = '50%';
    document.body.appendChild(p);
    const a = Math.random() * 6.283, d = spread * (.4 + Math.random() * .6);
    p.animate([
      {transform: `translate(${x}px,${y}px) rotate(0deg)`, opacity: 1},
      {transform: `translate(${x + Math.cos(a) * d}px,${y + Math.sin(a) * d + spread * .5}px) rotate(${Math.random() * 720}deg)`, opacity: 0}
    ], {duration: 700 + Math.random() * 600, easing: 'cubic-bezier(.1,.7,.3,1)'}).onfinish = () => p.remove();
  }
}
function confetti(el) { const r = el.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 46, 260, 1.2); }
addEventListener('pointerdown', e => burst(e.clientX, e.clientY, 8, 55, .6));

/* nama: huruf per huruf jatuh, lalu memantul saat disentuh */
(() => {
  const nm = $('#home .nm'), txt = nm.textContent.trim();
  let k = 0;
  nm.setAttribute('aria-label', txt); nm.classList.add('split');
  nm.innerHTML = txt.split(' ').map(w => `<span aria-hidden="true" style="display:inline-block;white-space:nowrap">${[...w].map(c => `<span class="ch" style="--k:${k++}">${c}</span>`).join('')}</span>`).join(' ');
  setTimeout(() => nm.classList.add('ready'), 1400 + k * 55);
  nm.addEventListener('pointerover', e => {
    const c = e.target.closest('.ch');
    if (!c || c.classList.contains('jel')) return;
    c.classList.add('jel'); setTimeout(() => c.classList.remove('jel'), 700);
  });
})();

/* teks mengetik bergantian */
(() => {
  const el = $('#typed'), roles = ['Mahasiswa Sistem Informasi', 'Web Developer', 'Pecinta Basis Data', 'Analis Data Pemula', 'UI Designer'];
  let r = 0, c = 0, del = false;
  (function tick() {
    const w = roles[r];
    el.textContent = w.slice(0, c);
    if (!del && c === w.length) { del = true; return setTimeout(tick, 1500); }
    if (del && c === 0) { del = false; r = (r + 1) % roles.length; }
    c += del ? -1 : 1;
    setTimeout(tick, del ? 35 : 80);
  })();
})();

/* progress scroll + parallax latar */
(() => {
  const root = document.documentElement; let t = false;
  const upd = () => { t = false; const h = root.scrollHeight - innerHeight; root.style.setProperty('--p', h > 0 ? scrollY / h : 0); root.style.setProperty('--sy', scrollY); };
  addEventListener('scroll', () => { if (!t) { t = true; requestAnimationFrame(upd); } }, {passive: true});
  upd();
})();

/* permata melayang di latar */
if (!calm) for (let i = 0; i < 16; i++) {
  const s = document.createElement('i'); s.className = 'spark';
  s.style.cssText = `left:${Math.random() * 100}vw;--s:${5 + Math.random() * 9}px;--d:${14 + Math.random() * 16}s;--dl:${-Math.random() * 25}s;--x:${(Math.random() - .5) * 160}px`;
  document.body.appendChild(s);
}

/* tombol: ripple + magnet */
$$('.btn').forEach(b => {
  b.addEventListener('pointerdown', e => {
    const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2.2, i = document.createElement('span');
    i.className = 'rip';
    i.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
    b.appendChild(i); setTimeout(() => i.remove(), 700);
  });
  b.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    const r = b.getBoundingClientRect();
    b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px) scale(1.04)`;
  });
  b.addEventListener('pointerleave', () => b.style.transform = '');
});

/* foto hero: miring mengikuti kursor + orbit permata */
(() => {
  const f = $('.frame'), sec = $('#home');
  f.insertAdjacentHTML('beforeend', '<div class="orb"><i></i><i></i><i></i></div>');
  sec.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    const r = f.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / innerWidth, y = (e.clientY - r.top - r.height / 2) / innerHeight;
    f.style.transform = `perspective(900px) rotateY(${x * 28}deg) rotateX(${-y * 28}deg)`;
  });
  sec.addEventListener('pointerleave', () => f.style.transform = '');
})();

/* judul tab ikut bercanda */
(() => {
  const T = document.title;
  document.addEventListener('visibilitychange', () => document.title = document.hidden ? 'Balik lagi ya, ada proyek seru nih' : T);
})();


/* ===== Peta keahlian (radar interaktif) ===== */
const RAD = (() => {
  const host = $('#radar'), cx = 230, cy = 190, R = 118, n = skills.length;
  const ang = i => -Math.PI / 2 + i * 2 * Math.PI / n;
  const pt = (i, r) => [cx + Math.cos(ang(i)) * r, cy + Math.sin(ang(i)) * r];
  const pts = rs => rs.map((r, i) => pt(i, r).map(v => v.toFixed(1)).join(',')).join(' ');
  const grid = [.25, .5, .75, 1].map(f => `<polygon class="rg" points="${pts(skills.map(() => R * f))}"/>`).join('');
  const axes = skills.map((_, i) => { const [x, y] = pt(i, R); return `<line class="ax" x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`; }).join('');
  const labels = skills.map((s, i) => { const [x, y] = pt(i, R + 26), a = Math.abs(x - cx) < 8 ? 'middle' : x > cx ? 'start' : 'end'; return `<text class="lb" x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="${a}">${s[3]}</text>`; }).join('');
  const nodes = skills.map(() => `<circle class="node" r="6" cx="${cx}" cy="${cy}"/>`).join('');
  host.innerHTML = `<svg viewBox="0 0 460 380" role="img" aria-label="Radar keahlian"><circle class="orbit" cx="${cx}" cy="${cy}" r="${R + 12}"/>${grid}${axes}<polygon id="rp" points="${pts(skills.map(() => 0))}"/>${nodes}${labels}</svg>`;
  const poly = $('#rp'), nd = $$('#radar .node'), lb = $$('#radar .lb'), rg = $$('.ring');
  const set = k => {
    const rs = skills.map(s => R * s[2] / 100 * k);
    poly.setAttribute('points', pts(rs));
    nd.forEach((c, i) => { const [x, y] = pt(i, rs[i]); c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y.toFixed(1)); });
  };
  const hl = (i, on) => { nd[i].classList.toggle('on', on); lb[i].classList.toggle('on', on); rg[i].classList.toggle('hl', on); };
  [nd, lb, rg].forEach(list => list.forEach((el, i) => { el.addEventListener('pointerenter', () => hl(i, true)); el.addEventListener('pointerleave', () => hl(i, false)); }));
  let grown = false;
  return { grow() {
    if (grown) return; grown = true;
    if (calm) return set(1);
    const t0 = performance.now(), c1 = 1.70158, c3 = c1 + 1;
    (function f(t) { const p = Math.min((t - t0) / 1600, 1); set(1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2)); if (p < 1) requestAnimationFrame(f); })(t0);
  } };
})();
function growRadar() { RAD.grow(); }

/* ===== Gelembung alat: fisika sederhana, menghindar dari kursor, saling tumbuk ===== */
(() => {
  const box = $('#bubbles');
  box.innerHTML = tools.map((t, i) => `<div class="bub" style="width:${74 + (i % 3) * 8}px;height:${74 + (i % 3) * 8}px">${ic(t[0])}<span>${t[1]}</span></div>`).join('');
  const els = $$('#bubbles .bub');
  const B = els.map((el, i) => ({el, r: (74 + (i % 3) * 8) / 2, x: 0, y: 0, vx: (Math.random() - .5) * 1.6, vy: (Math.random() - .5) * 1.6}));
  let W = 0, H = 0, vis = false, mx = -999, my = -999;
  const meas = () => {
    W = box.clientWidth; H = box.clientHeight;
    B.forEach((b, i) => {
      if (!b.x) { b.x = (i + .5) / B.length * W; b.y = H / 2 + (i % 2 ? 40 : -40); }
      b.x = Math.min(Math.max(b.x, b.r), W - b.r); b.y = Math.min(Math.max(b.y, b.r), H - b.r);
    });
  };
  const draw = () => B.forEach(b => b.el.style.transform = `translate(${(b.x - b.r).toFixed(1)}px,${(b.y - b.r).toFixed(1)}px)`);
  meas(); draw(); addEventListener('resize', () => { meas(); draw(); });
  box.addEventListener('pointermove', e => { const r = box.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
  box.addEventListener('pointerleave', () => { mx = my = -999; });
  box.addEventListener('pointerdown', e => {
    const r = box.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
    B.forEach(b => { const dx = b.x - px, dy = b.y - py, d = Math.hypot(dx, dy) || 1, f = Math.max(0, 1 - d / 240) * 16; b.vx += dx / d * f; b.vy += dy / d * f; });
  });
  new IntersectionObserver(es => vis = es[0].isIntersecting).observe(box);
  (function tick() {
    requestAnimationFrame(tick);
    if (!vis || calm) return;
    B.forEach((a, i) => {
      const dx = a.x - mx, dy = a.y - my, d = Math.hypot(dx, dy), reach = a.r + 90;
      if (d < reach) { const f = (reach - d) / reach * .9; a.vx += dx / (d || 1) * f; a.vy += dy / (d || 1) * f; }
      for (let j = i + 1; j < B.length; j++) {
        const b = B[j], ex = b.x - a.x, ey = b.y - a.y, dd = Math.hypot(ex, ey) || 1, min = a.r + b.r;
        if (dd < min) {
          const o = (min - dd) / 2, nx = ex / dd, ny = ey / dd;
          a.x -= nx * o; a.y -= ny * o; b.x += nx * o; b.y += ny * o;
          const rel = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
          if (rel > 0) { a.vx -= rel * nx; a.vy -= rel * ny; b.vx += rel * nx; b.vy += rel * ny; }
        }
      }
      a.vx = a.vx * .985 + (Math.random() - .5) * .08; a.vy = a.vy * .985 + (Math.random() - .5) * .08;
      const sp = Math.hypot(a.vx, a.vy); if (sp > 9) { a.vx *= 9 / sp; a.vy *= 9 / sp; }
      a.x += a.vx; a.y += a.vy;
      if (a.x < a.r) { a.x = a.r; a.vx = Math.abs(a.vx); } if (a.x > W - a.r) { a.x = W - a.r; a.vx = -Math.abs(a.vx); }
      if (a.y < a.r) { a.y = a.r; a.vy = Math.abs(a.vy); } if (a.y > H - a.r) { a.y = H - a.r; a.vy = -Math.abs(a.vy); }
    });
    draw();
  })();
})();
