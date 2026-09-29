/*
 * Fundo animado: partículas que flutuam e se ligam por linhas finas
 * quando estão próximas, com leve atração ao cursor.
 * Leve: densidade proporcional à área, pausa em aba oculta e
 * respeita prefers-reduced-motion (desenha um quadro estático).
 */
(function () {
  'use strict';

  var canvas = document.getElementById('bg');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');

  var CONFIG = {
    density: 0.00009,  // partículas por pixel² de tela
    maxParticles: 140,
    linkDistance: 130, // px para desenhar a linha entre duas partículas
    speed: 0.25,
    mouseRadius: 160
  };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var particles = [];
  var mouse = { x: null, y: null };
  var width = 0, height = 0, dpr = 1, rafId = null, rgb = '255, 255, 255';

  function readColor() {
    var v = getComputedStyle(document.documentElement).getPropertyValue('--particle').trim();
    if (v) rgb = v;
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var target = Math.min(CONFIG.maxParticles, Math.round(width * height * CONFIG.density));
    while (particles.length < target) particles.push(createParticle());
    particles.length = target;
  }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * CONFIG.speed * 2,
      vy: (Math.random() - 0.5) * CONFIG.speed * 2,
      r: Math.random() * 1.6 + 0.4
    };
  }

  function update(p) {
    if (mouse.x !== null) {
      var dx = mouse.x - p.x, dy = mouse.y - p.y;
      var d = Math.sqrt(dx * dx + dy * dy);
      if (d < CONFIG.mouseRadius && d > 0) {
        p.x += (dx / d) * 0.35; // atração suave
        p.y += (dy / d) * 0.35;
      }
    }
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    var linkSq = CONFIG.linkDistance * CONFIG.linkDistance;

    for (var i = 0; i < particles.length; i++) {
      var a = particles[i];
      for (var j = i + 1; j < particles.length; j++) {
        var b = particles[j];
        var dx = a.x - b.x, dy = a.y - b.y;
        var distSq = dx * dx + dy * dy;
        if (distSq < linkSq) {
          ctx.strokeStyle = 'rgba(' + rgb + ',' + (0.18 * (1 - distSq / linkSq)) + ')';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = 'rgba(' + rgb + ',0.55)';
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop() {
    for (var i = 0; i < particles.length; i++) update(particles[i]);
    draw();
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    stop();
    if (reduceMotion.matches) { draw(); return; } // quadro estático
    rafId = requestAnimationFrame(loop);
  }

  function stop() {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
  }

  window.addEventListener('resize', function () { resize(); if (reduceMotion.matches) draw(); });
  window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseout', function () { mouse.x = mouse.y = null; });
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  reduceMotion.addEventListener('change', start);

  // Permite que main.js avise quando o tema mudar.
  window.addEventListener('themechange', function () { readColor(); if (reduceMotion.matches) draw(); });

  readColor();
  resize();
  start();
})();
