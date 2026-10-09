/* Stellar Tech Studio - 共享脚本 */
(function () {
  'use strict';

  /* ===== 流动丝绸波纹 ===== */
  var paths = document.querySelectorAll('.silk-path');
  if (paths.length) {
    var bases = [
      'M0,192 C240,288 480,96 720,160 C960,224 1200,128 1440,192 L1440,320 L0,320 Z',
      'M0,224 C260,128 520,288 760,224 C1000,160 1240,256 1440,208 L1440,320 L0,320 Z',
      'M0,256 C280,192 560,288 800,248 C1040,208 1280,272 1440,240 L1440,320 L0,320 Z'
    ];
    var t = 0;
    function animateSilk() {
      t += 0.004;
      for (var i = 0; i < paths.length; i++) {
        var base = bases[i % bases.length];
        var amp = 40 + i * 14;
        var ph = t * (1.4 + i * 0.35);
        var y1 = Math.round(192 + Math.sin(ph) * amp);
        var y2 = Math.round(160 + Math.sin(ph + 1.7) * amp);
        var d = base
          .replace(/C240,288 480,96 720,160/, 'C240,' + (y1 + 60) + ' 480,' + (y2 - 40) + ' 720,' + y2)
          .replace(/C260,128 520,288 760,224/, 'C260,' + (y2 - 40) + ' 520,' + (y1 + 40) + ' 760,' + y1)
          .replace(/C280,192 560,288 800,248/, 'C280,' + y2 + ' 560,' + (y1 + 30) + ' 800,' + ((y1 + y2) / 2));
        paths[i].setAttribute('d', d);
      }
      requestAnimationFrame(animateSilk);
    }
    requestAnimationFrame(animateSilk);
  }

  /* ===== 导航当前页高亮 ===== */
  var page = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '');
  if (page === '') page = 'index';
  var navAnchors = document.querySelectorAll('.nav-links a[data-nav]');
  navAnchors.forEach(function (a) {
    if (a.getAttribute('data-nav') === page) a.classList.add('active');
  });

  /* ===== 移动菜单 ===== */
  var hamburger = document.querySelector('.hamburger');
  var navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () { navLinks.classList.toggle('open'); });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { navLinks.classList.remove('open'); });
    });
  }

  /* ===== iOS 液态玻璃按钮：注入多层结构 + 交互事件 ===== */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.btn').forEach(function (btn) {
    if (btn.querySelector('.btn__glass')) return;

    // 把原内容包进 label
    var label = document.createElement('span');
    label.className = 'btn__label';
    while (btn.firstChild) label.appendChild(btn.firstChild);

    // 注入 5 个玻璃层
    var layers = ['glass', 'refract', 'glow', 'shine', 'rim'];
    layers.forEach(function (name) {
      var s = document.createElement('span');
      s.className = 'btn__' + name;
      s.setAttribute('aria-hidden', 'true');
      btn.insertBefore(s, label);
    });
    btn.appendChild(label);

    // 光标跟手高光
    function track(e) {
      var r = btn.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width) * 100;
      var y = ((e.clientY - r.top) / r.height) * 100;
      btn.style.setProperty('--px', x.toFixed(2) + '%');
      btn.style.setProperty('--py', y.toFixed(2) + '%');
    }
    btn.addEventListener('pointerenter', function () { btn.classList.add('is-hover'); });
    btn.addEventListener('pointermove', track, { passive: true });
    btn.addEventListener('pointerleave', function () { btn.classList.remove('is-hover', 'is-pressed'); });
    btn.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      btn.classList.add('is-pressed');
    });
    ['pointerup', 'pointercancel', 'blur'].forEach(function (type) {
      btn.addEventListener(type, function () { btn.classList.remove('is-pressed'); });
    });
    btn.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') btn.classList.add('is-pressed');
    });
    btn.addEventListener('keyup', function () { btn.classList.remove('is-pressed'); });

    // 点击扫光
    btn.addEventListener('click', function () {
      if (reduceMotion) return;
      btn.classList.remove('is-shine');
      void btn.offsetWidth;
      btn.classList.add('is-shine');
    });
    btn.querySelector('.btn__shine').addEventListener('animationend', function () {
      btn.classList.remove('is-shine');
    });
  });

  /* ===== 双语切换（data-en） ===== */
  var LANG_KEY = 'sts-lang';
  var curLang = localStorage.getItem(LANG_KEY) || 'zh';
  var langBtn = document.querySelectorAll('.lang-toggle');

  // 备份中文原文到 data-zh（按钮只备份 label 文本）
  document.querySelectorAll('[data-en]').forEach(function (el) {
    if (!el.hasAttribute('data-zh')) {
      var lbl = el.querySelector('.btn__label');
      el.setAttribute('data-zh', lbl ? lbl.textContent : el.textContent);
    }
  });
  document.querySelectorAll('[data-en-placeholder]').forEach(function (el) {
    if (!el.hasAttribute('data-zh-placeholder')) el.setAttribute('data-zh-placeholder', el.getAttribute('placeholder') || '');
  });

  function setText(el, text) {
    var lbl = el.querySelector('.btn__label');
    if (lbl) lbl.textContent = text;
    else el.textContent = text;
  }

  function applyLang(lang) {
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'zh-CN');
    document.querySelectorAll('[data-en]').forEach(function (el) {
      setText(el, lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-zh'));
    });
    document.querySelectorAll('[data-en-placeholder]').forEach(function (el) {
      el.setAttribute('placeholder', lang === 'en' ? el.getAttribute('data-en-placeholder') : el.getAttribute('data-zh-placeholder'));
    });
    langBtn.forEach(function (b) {
      b.textContent = lang === 'en' ? '中文' : 'EN';
    });
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  }

  langBtn.forEach(function (b) {
    b.addEventListener('click', function () {
      curLang = curLang === 'zh' ? 'en' : 'zh';
      applyLang(curLang);
    });
  });

  applyLang(curLang);

  /* ===== 滚动出现动效 ===== */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }
})();
