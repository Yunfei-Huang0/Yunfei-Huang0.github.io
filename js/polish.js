/* gentle fade-in of content blocks as they scroll into view */
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var els = document.querySelectorAll('.home-section .section-heading, .home-section .pub-list-item, .home-section .stream-item, .home-section .rs, .home-section .card, #container-publications .pub-list-item, .view-list-item');
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('ac-in'); io.unobserve(e.target); } });
  }, { threshold: .1, rootMargin: '0px 0px -30px 0px' });
  els.forEach(function (el) {
    if (el.getBoundingClientRect().top < window.innerHeight) return;  // already visible: no animation
    el.classList.add('ac-reveal'); io.observe(el);
  });
})();

/* click a publication figure to see it full size */
(function () {
  var links = document.querySelectorAll('.js-figzoom');
  if (!links.length) return;
  var box = document.createElement('div');
  box.className = 'figzoom'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Figure');
  box.innerHTML = '<button class="figzoom-close" aria-label="Close">&times;</button><img alt=""><p class="figzoom-cap"></p>';
  document.body.appendChild(box);
  var img = box.querySelector('img'), cap = box.querySelector('.figzoom-cap');
  function close() { box.classList.remove('open'); document.body.style.overflow = ''; }
  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      img.src = a.getAttribute('href');
      var item = a.closest('.pub-list-item'), t = item && item.querySelector('[itemprop="name"]');
      cap.textContent = t ? t.textContent.replace(/\s+/g, ' ').trim() : '';
      box.classList.add('open'); document.body.style.overflow = 'hidden';
    });
  });
  box.addEventListener('click', function (e) { if (e.target !== img) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();

/* subtle connected-dots background (academic, low contrast) */
(function () {
  if (document.getElementById('ac-net')) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var c = document.createElement('canvas'); c.id = 'ac-net'; c.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(c, document.body.firstChild);
  var pan = document.createElement('div'); pan.id = 'ac-panel'; pan.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(pan, c.nextSibling);
  var ctx = c.getContext('2d'), W, H, dpr = Math.min(window.devicePixelRatio || 1, 2), pts = [], mouse = { x: -9999, y: -9999 };
  function init() {
    W = window.innerWidth; H = window.innerHeight; c.width = W * dpr; c.height = H * dpr;
    c.style.width = W + 'px'; c.style.height = H + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(110, Math.max(40, W * H / 16000))); pts = [];
    for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
      r: Math.random() * 1.4 + 1, g: Math.random() < .3 });
  }
  var running = true;
  function frame() {
    ctx.clearRect(0, 0, W, H);
    var L = Math.min(150, Math.max(110, W / 11)), L2 = L * L;
    for (var i = 0; i < pts.length; i++) {
      var a = pts[i];
      if (!reduce) { a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1; }
      for (var j = i + 1; j < pts.length; j++) {
        var b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
        if (d < L2) { ctx.strokeStyle = 'rgba(46,125,50,' + (0.28 * (1 - Math.sqrt(d) / L)).toFixed(3) + ')'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      var mx = a.x - mouse.x, my = a.y - mouse.y, md = mx * mx + my * my;
      if (md < 180 * 180) { ctx.strokeStyle = 'rgba(46,125,50,' + (0.32 * (1 - Math.sqrt(md) / 180)).toFixed(3) + ')';
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
    }
    for (var k = 0; k < pts.length; k++) { var p = pts[k]; ctx.fillStyle = p.g ? 'rgba(46,125,50,.65)' : 'rgba(100,116,139,.55)';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill(); }
    if (running && !reduce) requestAnimationFrame(frame);
  }
  init(); frame();
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { init(); if (reduce) frame(); }, 150); });
  window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  document.addEventListener('mouseleave', function () { mouse.x = mouse.y = -9999; });
  document.addEventListener('visibilitychange', function () { var was = running; running = !document.hidden; if (running && !was && !reduce) requestAnimationFrame(frame); });
})();
