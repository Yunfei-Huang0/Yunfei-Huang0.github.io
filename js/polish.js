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
