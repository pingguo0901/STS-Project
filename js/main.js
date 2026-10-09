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
  if (page === '' ) page = 'index';
  var links = document.querySelectorAll('.nav-links a[data-nav]');
  links.forEach(function (a) {
    if (a.getAttribute('data-nav') === page) a.classList.add('active');
  });

  /* ===== 移动菜单 ===== */
  var hamburger = document.querySelector('.hamburger');
  var navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { navLinks.classList.remove('open'); });
    });
  }

  /* ===== 双语切换（data-en） ===== */
  var LANG_KEY = 'sts-lang';
  var curLang = localStorage.getItem(LANG_KEY) || 'zh';
  var langBtn = document.querySelectorAll('.lang-toggle');

  // 初始化：备份中文原文到 data-zh
  document.querySelectorAll('[data-en]').forEach(function (el) {
    if (!el.hasAttribute('data-zh')) el.setAttribute('data-zh', el.textContent);
  });
  document.querySelectorAll('[data-en-placeholder]').forEach(function (el) {
    if (!el.hasAttribute('data-zh-placeholder')) el.setAttribute('data-zh-placeholder', el.getAttribute('placeholder') || '');
  });

  function applyLang(lang) {
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'zh-CN');
    document.querySelectorAll('[data-en]').forEach(function (el) {
      el.textContent = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-zh');
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
