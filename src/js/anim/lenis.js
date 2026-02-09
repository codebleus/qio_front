import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import videojs from 'video.js';

export const lenis = new Lenis({
  duration: 2,
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 16,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

const MOBILE_MQ = window.matchMedia('(max-width: 48em)');
let pauseTimer = null;
const PAUSE_DELAY = 150;

const players = (() => {
  const els = document.querySelectorAll('.projects video');
  els.forEach(v => {
    v.setAttribute('playsinline', '');
    v.muted = true;
    v.loop = true;
  });
  return Array.from(els).map(el => videojs(el));
})();

function playAll() {
  players.forEach(p => {
    const r = p.play();
    if (r && r.catch) r.catch(() => {});
  });
}

function pauseAll() {
  players.forEach(p => p.pause());
}

let touchActive = false;

window.addEventListener(
  'touchstart',
  e => {
    if (!MOBILE_MQ.matches) return;
    touchActive = true;
    playAll();
    clearTimeout(pauseTimer);
  },
  { passive: true }
);

window.addEventListener(
  'touchend',
  e => {
    if (!MOBILE_MQ.matches) return;
    if (!e.touches || e.touches.length === 0) {
      touchActive = false;
      clearTimeout(pauseTimer);
      pauseTimer = setTimeout(pauseAll, PAUSE_DELAY);
    }
  },
  { passive: true }
);

window.addEventListener(
  'touchcancel',
  () => {
    if (!MOBILE_MQ.matches) return;
    clearTimeout(pauseTimer);
    pauseTimer = setTimeout(() => {
      if (!touchActive) pauseAll();
    }, 400);
  },
  { passive: true }
);

lenis.on('scroll', () => {
  ScrollTrigger.update();
  if (!MOBILE_MQ.matches) return;
  playAll();
  if (!touchActive) {
    clearTimeout(pauseTimer);
    pauseTimer = setTimeout(pauseAll, PAUSE_DELAY);
  }
});

gsap.ticker.add(time => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

document.addEventListener('visibilitychange', () => {
  if (document.hidden) pauseAll();
});

window.addEventListener('resize', () => {
  if (!MOBILE_MQ.matches) pauseAll();
});
