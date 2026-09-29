/* Interações da página: tema, animação de entrada e ano do rodapé. */
(function () {
  'use strict';

  var root = document.documentElement;

  // --- Tema claro/escuro ---
  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      window.dispatchEvent(new Event('themechange'));
    });
  }

  // --- Revelar seções ao rolar ---
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { observer.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('visible'); });
  }

  // --- Ano atual no rodapé ---
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
