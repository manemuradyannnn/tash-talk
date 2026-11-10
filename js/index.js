// Importing utility function for preloading images
import { preloadImages } from './utils.js';
import { initHero } from './hero.js?v=22';
import { initHolo } from './holo.js?v=2';
// Importing StackMotionEffect classes from different effect files with renamed imports to avoid name conflicts
import { StackMotionEffect as StackMotionEffect1 } from './effect-1/stackMotionEffect.js?v=6';
import { StackMotionEffect as StackMotionEffect2 } from './effect-2/stackMotionEffect.js';
import { StackMotionEffect as StackMotionEffect3 } from './effect-3/stackMotionEffect.js';

// Registers ScrollTrigger plugin with GSAP for scroll-based animations.
gsap.registerPlugin(ScrollTrigger);

// Initialize function to set up motion effects and animations
const init = () => {
  // Apply the first stack motion effect to all elements with a specific data attribute
  document.querySelectorAll('[data-stack-1]').forEach((stackEl) => {
    new StackMotionEffect1(stackEl);
  });
  // Apply the second stack motion effect to all elements with a different specific data attribute
  document.querySelectorAll('[data-stack-2]').forEach((stackEl) => {
    new StackMotionEffect2(stackEl);
  });
  // Apply the third stack motion effect to all elements with yet another specific data attribute
  document.querySelectorAll('[data-stack-3]').forEach((stackEl) => {
    new StackMotionEffect3(stackEl);
  });

  const missionCards = gsap.utils.toArray('.mission__holo');
  if (missionCards.length) {
    gsap.matchMedia().add({
      large: '(min-width: 1100px)',
      small: '(max-width: 799px)',
      reduce: '(prefers-reduced-motion: reduce)'
    }, (context) => {
      const { large, small, reduce } = context.conditions;
      const step = large ? 214 : small ? 58 : 124;
      const spread = {
        x: (i) => (i - 1) * step,
        y: (i) => (large ? [30, -18, 42] : [18, -8, 26])[i],
        rotation: (i) => [-14, 2, 16][i]
      };
      if (reduce) {
        gsap.set(missionCards, spread);
        return;
      }
      gsap.fromTo(missionCards, {
        x: 0,
        y: (i) => (i - 1) * 10,
        rotation: (i) => (i - 1) * 4
      }, {
        ...spread,
        ease: 'none',
        scrollTrigger: {
          trigger: '.mission',
          start: 'top 80%',
          end: 'center 45%',
          scrub: true
        }
      });
    });
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.wrap').forEach((wrap) => {
      const cards = wrap.querySelectorAll('.card');
      if (!cards.length) return;
      gsap.fromTo(cards, {
        '--shine': 0
      }, {
        '--shine': 1,
        ease: 'none',
        stagger: 0.015,
        scrollTrigger: {
          trigger: wrap,
          start: 'top 75%',
          end: 'bottom 25%',
          scrub: true
        }
      });
    });
  }

  // Select all grid intro card elements and apply animations on scroll
  const introCards = document.querySelectorAll('.intro .card');
  introCards.forEach(introCard => {
    gsap.to(introCard, {
      ease: 'power1.in',
      startAt: {
        transformOrigin: '100% 50%',
        filter: 'brightness(70%)'
      },
      rotationX: () => -60,
      yPercent: () => gsap.utils.random(-100,0),
      z: () => gsap.utils.random(-100,0),
      filter: 'brightness(0%)',
      scrollTrigger: {
        trigger: introCard,
        start: 'clamp(top bottom)',
        end: 'clamp(bottom top)',
        scrub: true,
      }
    });
  });
};

// Preloading images and initializing setup when complete
const initAudience = () => {
  const root = document.querySelector('.aud');
  if (!root) return;
  const tabs = [...root.querySelectorAll('.aud__role')];
  const panels = [...root.querySelectorAll('.aud__panel')];
  let index = 0;
  const mark = (next) => {
    index = next;
    tabs.forEach((tab, i) => {
      const on = i === index;
      tab.classList.toggle('is-on', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  };
  panels.forEach((panel) => { panel.hidden = false; });
  if (typeof ScrollTrigger !== 'undefined') {
    panels.forEach((panel, i) => {
      ScrollTrigger.create({
        trigger: panel,
        start: 'top 46%',
        end: 'bottom 46%',
        onToggle(self) { if (self.isActive) mark(i); }
      });
    });
  }
  tabs.forEach((tab, i) => tab.addEventListener('click', () => {
    mark(i);
    if (window.lenis) window.lenis.scrollTo(panels[i], { offset: -48, force: true });
    else panels[i].scrollIntoView({ block: 'start' });
  }));
  window.addEventListener('load', () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); });
};

document.body.classList.remove('loading');
initHero();
initHolo();
initAudience();

const menuButton = document.querySelector('.hero__menu');
if (menuButton) {
  menuButton.addEventListener('click', () => {
    const nav = menuButton.closest('.hero__nav');
    const open = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.querySelectorAll('.hero__links a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.closest('.hero__nav').classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

preloadImages('.card__img').then(() => {
  document.body.classList.remove('loading');
  init();
});
