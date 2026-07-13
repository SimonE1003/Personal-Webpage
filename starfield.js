/**
 * Star Trek 风曲速星空背景
 * 星星从屏幕中心向四周飞出，带彗星拖尾效果
 */
(function () {
  if (!document.body.classList.contains('home')) return;

  // 尊重减少动态设置
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.createElement('canvas');
  canvas.id = 'warp-starfield';
  canvas.style.cssText =
    'position:fixed;inset:0;z-index:-2;pointer-events:none;';
  document.body.insertBefore(canvas, document.body.firstChild);

  var ctx = canvas.getContext('2d');
  var w, h, cx, cy;
  var stars = [];

  // ===== 可调参数 =====
  var SPEED = 1.5;      // 飞行速度（越小越慢）
  var WARP = 3;       // 曲速拉伸倍率，控制拖尾长度（1 = 无拉伸，越大越像曲速冲刺）
  var DENSITY = 7;      // 星星密度 1-10（1 = 稀疏，10 = 密集）
  // ====================

  // 根据 DENSITY (1-10) 计算实际星星数量
  function getStarCount() {
    var base = window.innerWidth < 768 ? 40 : 80;
    return Math.round(base * DENSITY);
  }

  var STAR_COUNT = getStarCount();

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    cx = w / 2;
    cy = h / 2;
  }

  function createStar() {
    return {
      x: (Math.random() - 0.5) * w * 2,
      y: (Math.random() - 0.5) * h * 2,
      z: Math.random() * w,
      pz: 0,
    };
  }

  function init() {
    resize();
    stars.length = 0;
    for (var i = 0; i < STAR_COUNT; i++) {
      var s = createStar();
      s.pz = s.z;
      stars.push(s);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      s.pz = s.z;
      s.z -= SPEED;

      if (s.z < 1) {
        s.x = (Math.random() - 0.5) * w * 2;
        s.y = (Math.random() - 0.5) * h * 2;
        s.z = w;
        s.pz = s.z;
      }

      var sx = (s.x / s.z) * w + cx;
      var sy = (s.y / s.z) * h + cy;

      // 曲速拉伸：拖尾起点用更远的 z 值，拉长拖尾
      var warpPz = s.z + SPEED * WARP;
      var psx = (s.x / warpPz) * w + cx;
      var psy = (s.y / warpPz) * h + cy;

      // 超出屏幕则跳过绘制
      if (sx < -10 || sx > w + 10 || sy < -10 || sy > h + 10) continue;

      var depth = 1 - s.z / w;
      var size = depth * 2.5;
      var opacity = Math.min(1, depth * 1.5);

      // 彗星拖尾：用渐变线段，从星头到拖尾末端逐渐变细变透明
      var tailGrad = ctx.createLinearGradient(psx, psy, sx, sy);
      tailGrad.addColorStop(0, 'rgba(255,255,255,0)');           // 尾端透明
      tailGrad.addColorStop(0.5, 'rgba(255,255,255,' + (opacity * 0.2) + ')');
      tailGrad.addColorStop(1, 'rgba(255,255,255,' + (opacity * 0.6) + ')'); // 靠近星头

      ctx.strokeStyle = tailGrad;
      ctx.lineWidth = Math.max(0.5, size * 0.8);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(psx, psy);
      ctx.lineTo(sx, sy);
      ctx.stroke();

      // 星头光晕（外圈柔和发光）
      var glowGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, size * 3);
      glowGrad.addColorStop(0, 'rgba(255,255,255,' + (opacity * 0.4) + ')');
      glowGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(sx, sy, Math.max(0.5, size * 3), 0, Math.PI * 2);
      ctx.fill();

      // 星头核心
      ctx.fillStyle = 'rgba(255,255,255,' + opacity + ')';
      ctx.beginPath();
      ctx.arc(sx, sy, Math.max(0.3, size), 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', function () {
    resize();
    STAR_COUNT = getStarCount();
  });

  init();
  draw();
})();
