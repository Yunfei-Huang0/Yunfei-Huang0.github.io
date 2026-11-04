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
