/* Portofolio Fahmi Rizki Nur Setia: GSAP + ScrollTrigger (vanilla JS) */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var lenis = null;
  var menuOpen = false;

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Menu seluler (jalan tanpa GSAP juga) ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');

  function setMenu(open) {
    if (!burger || !menu) return;
    menuOpen = open;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    root.style.overflow = open ? 'hidden' : '';
    if (lenis) { open ? lenis.stop() : lenis.start(); }
    var links = menu.querySelectorAll('nav a');
    if (open) {
      menu.hidden = false;
      if (hasGSAP && !reduceMotion) {
        gsap.fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .7, ease: 'power4.out' });
        gsap.fromTo(links, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .8, ease: 'power4.out', stagger: .06, delay: .15 });
      }
      if (links[0]) links[0].focus();
    } else if (hasGSAP && !reduceMotion) {
      gsap.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: .5, ease: 'power3.inOut', onComplete: function () { menu.hidden = true; } });
    } else {
      menu.hidden = true;
    }
  }
  if (burger) burger.addEventListener('click', function () { setMenu(!menuOpen); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menuOpen) { setMenu(false); burger.focus(); } });
  if (menu) menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  window.matchMedia('(min-width: 62rem)').addEventListener('change', function (e) { if (e.matches && menuOpen) setMenu(false); });

  /* ---------- Formulir kontak: membuka aplikasi email ---------- */
  var form = document.getElementById('contactForm');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.elements.name.value.trim();
    var msg = form.elements.message.value.trim();
    var status = document.getElementById('formStatus');
    if (!name || !msg) { status.textContent = 'Isi nama dan pesan dulu, lalu kirim lagi.'; return; }
    var subject = encodeURIComponent('Pesan dari ' + name + ' lewat portofolio');
    var body = encodeURIComponent(msg + '\n\n' + name);
    window.location.href = 'mailto:fahmirizkinursetya@gmail.com?subject=' + subject + '&body=' + body;
    status.textContent = 'Aplikasi email dibuka. Jika tidak terbuka, kirim langsung ke fahmirizkinursetya@gmail.com.';
  });

  /* ---------- Tanpa animasi: konten tetap tampil ---------- */
  if (!hasGSAP || reduceMotion) {
    root.classList.remove('js');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scroll (Lenis, opsional) ---------- */
  if (typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.1, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(id === '#beranda' ? 0 : target, { offset: id === '#beranda' ? 0 : -10, duration: 1.3 });
    });
  }

  /* ---------- Pecah teks per kata (aksesibel) ---------- */
  function splitWords(el) {
    var label = el.getAttribute('aria-label') || el.textContent.replace(/\s+/g, ' ').trim();
    el.setAttribute('aria-label', label);
    var frag = document.createDocumentFragment();
    label.split(' ').forEach(function (word, i, arr) {
      var w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
      var wi = document.createElement('span'); wi.className = 'wi'; wi.textContent = word;
      w.appendChild(wi); frag.appendChild(w);
      if (i < arr.length - 1) frag.appendChild(document.createTextNode(' '));
    });
    el.textContent = '';
    el.appendChild(frag);
    el.classList.add('is-split');
    return el.querySelectorAll('.wi');
  }

  var started = false;
  function start() { if (started) return; started = true; init(); }
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(start);
  setTimeout(start, 1500);

  function init() {
    var mm = gsap.matchMedia();

    /* ----- Hero ----- */
    var title = document.querySelector('.hero__title');
    var words = splitWords(title);
    gsap.set(words, { yPercent: 115, rotate: 4 });
    gsap.set('#nav', { yPercent: -100 });
    gsap.set('.sheet', { y: 60, opacity: 0, rotate: 2 });
    gsap.set('[data-fade]', { y: 24 });

    gsap.timeline({ defaults: { ease: 'power4.out' } })
      .to('#nav', { yPercent: 0, duration: 1 }, 0)
      .to(words, { yPercent: 0, rotate: 0, duration: 1.2, stagger: .1 }, .1)
      .to('[data-fade]', { opacity: 1, y: 0, duration: 1, stagger: .12 }, .7)
      .to('.sheet', { y: 0, opacity: 1, rotate: 0, duration: 1.4 }, .5)
      .add(startSheetLoop, 1.6);

    // lembar kerja melayang pelan mengikuti scroll
    gsap.to('.hero__visual', { yPercent: -6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    /* ----- Lembar kerja: rumus diketik, sel terpilih berpindah ----- */
    function startSheetLoop() {
      var grid = document.getElementById('sheetGrid');
      var sel = document.getElementById('sel');
      var fx = document.getElementById('formula');
      if (!grid || !sel || !fx) return;
      var table = grid.querySelector('table');
      var cell = function (r, c) { return table.rows[r].cells[c]; };
      var steps = [
        { f: '=SUM(D2:D6)', from: [2, 4], to: [6, 4] },
        { f: '=XLOOKUP(A4,A2:A6,D2:D6)', from: [4, 4], to: [4, 4] },
        { f: '=COUNTIF(D2:D6,"<10")', from: [2, 4], to: [6, 4] },
        { f: '=IFERROR(VLOOKUP(A3,A2:D6,4,0),"-")', from: [3, 4], to: [3, 4] },
        { f: '=SUMIF(A2:A6,"Jaket*",D2:D6)', from: [2, 4], to: [6, 4] }
      ];
      var visible = true, i = 0;
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(grid);

      function rect(s) {
        var a = cell(s.from[0], s.from[1]), b = cell(s.to[0], s.to[1]);
        return { x: a.offsetLeft, y: a.offsetTop, width: b.offsetLeft + b.offsetWidth - a.offsetLeft, height: b.offsetTop + b.offsetHeight - a.offsetTop };
      }
      function typeText(text) {
        var o = { n: 0 };
        fx.textContent = '';
        return gsap.to(o, { n: text.length, duration: Math.max(.9, text.length * .045), ease: 'none', onUpdate: function () { fx.textContent = text.slice(0, Math.round(o.n)); } });
      }
      function run() {
        if (!visible) { gsap.delayedCall(1, run); return; }
        var s = steps[i % steps.length]; i++;
        var r = rect(s);
        gsap.to(sel, { x: r.x, y: r.y, width: r.width, height: r.height, duration: .7, ease: 'power3.inOut' });
        typeText(s.f).then(function () {
          var a = cell(s.from[0], s.from[1]);
          gsap.fromTo(a, { backgroundColor: '#CFDFEC' }, { backgroundColor: 'rgba(207,223,236,0)', duration: 1.2, clearProps: 'backgroundColor' });
          gsap.delayedCall(1.6, run);
        });
      }
      var first = rect(steps[0]);
      gsap.set(sel, first);
      run();
    }

    /* ----- Marquee (kecepatan ikut scroll) ----- */
    var marquee = gsap.to('.marquee__track', { xPercent: -25, duration: 24, ease: 'none', repeat: -1 });
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: function (self) {
        gsap.to(marquee, { timeScale: 1 + Math.min(Math.abs(self.getVelocity()) / 450, 4), duration: .2, overwrite: true });
        gsap.to(marquee, { timeScale: 1, duration: 1, delay: .2, overwrite: 'auto' });
      }
    });

    /* ----- Judul section ----- */
    document.querySelectorAll('[data-split]').forEach(function (el) {
      if (el === title) return;
      var w = splitWords(el);
      gsap.from(w, { yPercent: 115, rotate: 3, duration: 1.1, ease: 'power4.out', stagger: .06, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });

    /* ----- Blok teks ----- */
    gsap.utils.toArray('[data-reveal]').forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });

    /* ----- Foto: reveal + parallax ----- */
    gsap.utils.toArray('[data-reveal-img]').forEach(function (frame) {
      var inner = frame.querySelector('.portrait__inner');
      gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 85%', once: true } })
        .to(frame, { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'power4.inOut' })
        .fromTo(inner, { scale: 1.25 }, { scale: 1, duration: 1.6, ease: 'power3.out' }, 0);
      var img = frame.querySelector('[data-parallax]');
      if (img) gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    /* ----- Angka statistik ----- */
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var end = parseFloat(el.getAttribute('data-count')), o = { v: 0 };
      el.textContent = '0';
      ScrollTrigger.create({
        trigger: el, start: 'top 92%', once: true,
        onEnter: function () { gsap.to(o, { v: end, duration: 1.8, ease: 'power3.out', onUpdate: function () { el.textContent = Math.round(o.v); } }); }
      });
    });
    gsap.from('.stat', { y: 40, opacity: 0, duration: 1, ease: 'power3.out', stagger: .12, scrollTrigger: { trigger: '.stats', start: 'top 88%', once: true } });

    /* ----- Timeline pengalaman ----- */
    var tlEl = document.getElementById('timeline');
    ScrollTrigger.create({
      trigger: tlEl, start: 'top 70%', end: 'bottom 70%', scrub: true,
      onUpdate: function (self) { tlEl.style.setProperty('--p', self.progress.toFixed(3)); }
    });
    gsap.utils.toArray('.tl').forEach(function (item) {
      gsap.from(item, { x: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 88%', once: true } });
      ScrollTrigger.create({ trigger: item, start: 'top 65%', onToggle: function (s) { item.classList.toggle('is-on', s.isActive || s.progress > 0); } });
    });

    /* ----- Kompetensi ----- */
    gsap.from('.fx-grid li', { opacity: 0, y: 24, duration: .8, ease: 'power3.out', stagger: { each: .05, from: 'start' }, scrollTrigger: { trigger: '.fx-grid', start: 'top 85%', once: true } });
    gsap.from('.skill', { y: 50, opacity: 0, duration: 1, ease: 'power3.out', stagger: .1, scrollTrigger: { trigger: '.skill-cards', start: 'top 88%', once: true } });

    /* ----- Daftar aplikasi ----- */
    gsap.from('.app', { y: 36, opacity: 0, duration: .9, ease: 'power3.out', stagger: .1, scrollTrigger: { trigger: '.app-list', start: 'top 88%', once: true } });
    // hanya satu panel terbuka
    var details = document.querySelectorAll('.app details');
    details.forEach(function (d) {
      d.addEventListener('toggle', function () { if (d.open) details.forEach(function (o) { if (o !== d) o.open = false; }); });
    });

    /* ----- Transisi antar section: lembar naik ----- */
    ['.skills', '.contact'].forEach(function (sel) {
      gsap.fromTo(sel, { scale: .94 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: sel, start: 'top bottom', end: 'top 25%', scrub: true } });
    });
    gsap.from('.contact__title', { xPercent: -3, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'center center', scrub: true } });
    gsap.from('.links li', { x: -30, opacity: 0, duration: .9, ease: 'power3.out', stagger: .1, scrollTrigger: { trigger: '.links', start: 'top 88%', once: true } });

    /* ----- Progress bar scroll ----- */
    gsap.to('#progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .2 } });

    /* ----- Navigasi: sembunyi saat scroll turun; link aktif ----- */
    var nav = document.getElementById('nav'), hidden = false;
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: function (self) {
        if (menuOpen) return;
        var hide = self.direction === 1 && self.scroll() > 240;
        if (hide !== hidden) { hidden = hide; gsap.to(nav, { yPercent: hide ? -100 : 0, duration: .5, ease: 'power3.out', overwrite: 'auto' }); }
      }
    });
    ['tentang', 'pengalaman', 'kompetensi', 'aplikasi', 'kontak'].forEach(function (id) {
      var link = document.querySelector('.nav__links [data-link="' + id + '"]');
      ScrollTrigger.create({ trigger: '#' + id, start: 'top 55%', end: 'bottom 55%', onToggle: function (s) { if (link) link.classList.toggle('is-active', s.isActive); } });
    });

    /* ----- Tombol magnetik (perangkat dengan mouse) ----- */
    mm.add('(hover: hover) and (pointer: fine)', function () {
      var off = [];
      document.querySelectorAll('.btn').forEach(function (btn) {
        var xTo = gsap.quickTo(btn, 'x', { duration: .6, ease: 'power3.out' });
        var yTo = gsap.quickTo(btn, 'y', { duration: .6, ease: 'power3.out' });
        function move(e) { var r = btn.getBoundingClientRect(); xTo((e.clientX - (r.left + r.width / 2)) * .25); yTo((e.clientY - (r.top + r.height / 2)) * .35); }
        function leave() { xTo(0); yTo(0); }
        btn.addEventListener('pointermove', move); btn.addEventListener('pointerleave', leave);
        off.push(function () { btn.removeEventListener('pointermove', move); btn.removeEventListener('pointerleave', leave); });
      });
      return function () { off.forEach(function (f) { f(); }); };
    });

    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    ScrollTrigger.refresh();
  }
})();
