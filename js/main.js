// 流动丝绸波纹 —— 用 JS 让 SVG 路径持续柔和地起伏
(function () {
  const paths = document.querySelectorAll('.silk-path');
  if (!paths.length) return;

  // 基础路径控制点（每个 path 有自己的基准 d）
  const bases = [
    "M0,192 C240,288 480,96 720,160 C960,224 1200,128 1440,192 L1440,320 L0,320 Z",
    "M0,224 C260,128 520,288 760,224 C1000,160 1240,256 1440,208 L1440,320 L0,320 Z",
    "M0,256 C280,192 560,288 800,248 C1040,208 1280,272 1440,240 L1440,320 L0,320 Z"
  ];

  let t = 0;
  function animate() {
    t += 0.004;
    paths.forEach(function (p, i) {
      const base = bases[i % bases.length];
      const amp = 40 + i * 14;
      const ph = t * (1.4 + i * 0.35);
      const y1 = Math.round(192 + Math.sin(ph) * amp);
      const y2 = Math.round(160 + Math.sin(ph + 1.7) * amp);
      const d = base
        .replace(/C240,288 480,96 720,160/, "C240," + (y1 + 60) + " 480," + (y2 - 40) + " 720," + y2)
        .replace(/C260,128 520,288 760,224/, "C260," + (y2 - 40) + " 520," + (y1 + 40) + " 760," + y1)
        .replace(/C280,192 560,288 800,248/, "C280," + y2 + " 560," + (y1 + 30) + " 800," + ((y1 + y2) / 2));
      p.setAttribute('d', d);
    });
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
