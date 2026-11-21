/* ==========================================================
   FVG4Life - script.js (próprio)
   Menu mobile, seletor de idioma, slide, voltar ao topo e modal
   ========================================================== */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {

    /* ---------- Menu mobile ---------- */
    var btn = document.getElementById('menu-mobile-btn');
    var menu = document.getElementById('menu-mobile');

    function setMenu(open) {
      if (!btn || !menu) return;
      btn.classList.toggle('active', open);
      menu.classList.toggle('active', open);
      document.body.classList.toggle('menu-open', open);
    }

    if (btn && menu) {
      btn.setAttribute('role', 'button');
      btn.setAttribute('aria-label', 'Abrir menu');
      btn.setAttribute('tabindex', '0');

      btn.addEventListener('click', function () {
        setMenu(!menu.classList.contains('active'));
      });
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setMenu(!menu.classList.contains('active'));
        }
      });

      // clicar fora do painel fecha o menu
      menu.addEventListener('click', function (e) {
        if (e.target === menu) setMenu(false);
      });

      // clicar em um link do menu fecha o menu
      menu.querySelectorAll('.menu-mobile-nav a').forEach(function (a) {
        a.addEventListener('click', function () { setMenu(false); });
      });
    }

    /* ---------- Seletor de idioma ---------- */
    var langs = document.querySelector('.header-langs');
    if (langs) {
      var langIcon = langs.querySelector(':scope > .header-langs-icon');
      if (langIcon) {
        langIcon.addEventListener('click', function (e) {
          e.stopPropagation();
          langs.classList.toggle('open');
        });
      }
      document.addEventListener('click', function (e) {
        if (!langs.contains(e.target)) langs.classList.remove('open');
      });
    }

    /* ---------- Slide ---------- */
    var slides = document.querySelectorAll('.slide-home .slide-item');
    var slideWrap = document.querySelector('.slide-home');

    if (slideWrap && slides.length) {
      var current = 0;
      var timer = null;
      var delay = 5000;
      var dotsWrap = null;

      if (slides.length > 1) {
        dotsWrap = document.createElement('div');
        dotsWrap.className = 'slide-dots';
        slides.forEach(function (s, i) {
          var dot = document.createElement('button');
          dot.type = 'button';
          dot.setAttribute('aria-label', 'Slide ' + (i + 1));
          dot.addEventListener('click', function () {
            show(i);
            restart();
          });
          dotsWrap.appendChild(dot);
        });
        slideWrap.appendChild(dotsWrap);
      }

      function show(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (s, i) {
          s.classList.toggle('active', i === current);
        });
        if (dotsWrap) {
          Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
            d.classList.toggle('active', i === current);
          });
        }
      }

      function start() {
        if (slides.length < 2) return;
        timer = setInterval(function () { show(current + 1); }, delay);
      }
      function stop() { if (timer) clearInterval(timer); timer = null; }
      function restart() { stop(); start(); }

      // links com href="#" não devem rolar a página para o topo
      slides.forEach(function (s) {
        if (s.getAttribute('href') === '#') {
          s.addEventListener('click', function (e) { e.preventDefault(); });
        }
      });

      // arrastar/deslizar no celular
      var startX = null;
      slideWrap.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
      }, { passive: true });
      slideWrap.addEventListener('touchend', function (e) {
        if (startX === null) return;
        var diff = e.changedTouches[0].clientX - startX;
        if (Math.abs(diff) > 50) {
          show(diff < 0 ? current + 1 : current - 1);
          restart();
        }
        startX = null;
      }, { passive: true });

      slideWrap.addEventListener('mouseenter', stop);
      slideWrap.addEventListener('mouseleave', start);

      show(0);
      start();
    }

    /* ---------- Voltar ao topo ---------- */
    var gotop = document.querySelector('.gotop');
    if (gotop) {
      var toggleTop = function () {
        gotop.classList.toggle('show', window.pageYOffset > 400);
      };
      window.addEventListener('scroll', toggleTop, { passive: true });
      toggleTop();

      gotop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* ---------- Modal (fechar) ---------- */
    document.querySelectorAll('.modal-close').forEach(function (el) {
      el.addEventListener('click', function () {
        var modal = document.getElementById(el.getAttribute('data-modal'));
        if (modal) modal.classList.remove('active');
      });
    });

    /* ---------- Tecla Esc ---------- */
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      setMenu(false);
      if (langs) langs.classList.remove('open');
      document.querySelectorAll('.modal.active').forEach(function (m) {
        m.classList.remove('active');
      });
    });

  });
})();
