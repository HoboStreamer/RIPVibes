(function () {
  'use strict';

  var canvas = document.getElementById('rain');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var drops = [];
  var animId;

  var palette = [
    [140, 100, 210],
    [110,  80, 200],
    [160, 100, 225],
    [90,  120, 245],
    [180,  75, 205],
  ];

  function rcolor() {
    return palette[Math.floor(Math.random() * palette.length)];
  }

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    initDrops();
  }

  function initDrops() {
    drops = [];
    var count = Math.floor(canvas.width / 6);
    for (var i = 0; i < count; i++) {
      drops.push(makeDropAt(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      ));
    }
  }

  function makeDropAt(x, y) {
    return {
      x:       x,
      y:       y,
      length:  Math.random() * 30 + 12,
      speed:   Math.random() * 2.4 + 0.6,
      opacity: Math.random() * 0.55 + 0.12,
      width:   Math.random() < 0.1 ? 2.5 : (Math.random() < 0.35 ? 1.5 : 0.9),
      glow:    Math.random() < 0.07,
      color:   rcolor(),
    };
  }

  function draw() {
    // fade trail instead of clear — gives a comet/matrix feel
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(7, 7, 15, 0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < drops.length; i++) {
      var d  = drops[i];
      var r  = d.color[0], g = d.color[1], b = d.color[2];
      var tx = d.x - d.length * 0.16;
      var ty = d.y + d.length;

      ctx.save();
      if (d.glow) {
        ctx.shadowColor = 'rgba(' + r + ',' + g + ',' + b + ',0.95)';
        ctx.shadowBlur  = 16;
      }

      var grad = ctx.createLinearGradient(d.x, d.y, tx, ty);
      grad.addColorStop(0,   'rgba(' + r + ',' + g + ',' + b + ',0)');
      grad.addColorStop(0.3, 'rgba(' + r + ',' + g + ',' + b + ',' + (d.opacity * 0.5) + ')');
      grad.addColorStop(1,   'rgba(' + r + ',' + g + ',' + b + ',' + d.opacity + ')');

      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(tx, ty);
      ctx.strokeStyle = grad;
      ctx.lineWidth   = d.width;
      ctx.stroke();
      ctx.restore();

      d.y += d.speed;
      d.x -= d.speed * 0.16;

      if (d.y > canvas.height + d.length) {
        drops[i] = makeDropAt(
          Math.random() * canvas.width * 1.05,
          -d.length - Math.random() * 60
        );
      }
    }

    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', function () {
    cancelAnimationFrame(animId);
    resize();
    draw();
  });

  resize();
  draw();

  // ─── Scroll fade-ins ─────────────────────────────────────
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll(
      '.section, .project-card, .link-card, .stat, .open-source-note'
    ).forEach(function (el) {
      el.classList.add('fade-in');
      io.observe(el);
    });
  }

  // ─── Replace → arrows in card-links with FA icon ─────────
  document.querySelectorAll('.card-link').forEach(function (el) {
    el.innerHTML = el.innerHTML.replace(/\u2192/g, '<i class="fa-solid fa-arrow-right"></i>');
  });

  // ─── VanillaTilt on cards ─────────────────────────────────
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.project-card, .link-card'), {
      max: 4,
      speed: 500,
      glare: true,
      'max-glare': 0.06,
      gyroscope: false,
    });
  }
})();
