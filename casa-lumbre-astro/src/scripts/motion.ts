// Casa Lumbre motion: smooth scroll, parallax display words, curtain image reveals,
// rotating collage photos. Everything is skipped when the visitor prefers reduced motion.
import Lenis from 'lenis';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. reveal + curtain (IntersectionObserver adds .is-in once)
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }),
  { rootMargin: '0px 0px -12% 0px' },
);
document.querySelectorAll('.reveal, .curtain').forEach((el) => io.observe(el));

if (!reduce) {
  // 2. smooth scroll
  const lenis = new Lenis({ duration: 1.15, anchors: { offset: -80 }, smoothWheel: true });
  const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);

  // 3. parallax display words: translateX by speed × distance from viewport centre
  const items = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
  const update = () => {
    const vh = window.innerHeight;
    for (const el of items) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      const d = (r.top + r.height / 2 - vh / 2) / vh; // -1 … 1
      el.style.transform = `translate3d(${(d * Number(el.dataset.parallax) * 100).toFixed(2)}px,0,0)`;
    }
  };
  if (items.length) { lenis.on('scroll', update); update(); }

  // 4. rotating collage photos (only while visible)
  document.querySelectorAll<HTMLElement>('[data-rotate]').forEach((box) => {
    const imgs = [...box.querySelectorAll<HTMLElement>('img')];
    if (imgs.length < 2) return;
    let i = 0; let timer: number | undefined;
    const step = () => { imgs[i].classList.remove('is-active'); i = (i + 1) % imgs.length; imgs[i].classList.add('is-active'); };
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !timer) timer = window.setInterval(step, Number(box.dataset.rotate) || 4500);
      else if (!e.isIntersecting && timer) { clearInterval(timer); timer = undefined; }
    }).observe(box);
  });
}
