'use strict';

(() => {
  const root = document.documentElement;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let frame = null;
  let listening = false;

  const reset = () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    root.style.removeProperty('--field-x');
    root.style.removeProperty('--field-y');
  };
  const move = event => {
    if (frame !== null) cancelAnimationFrame(frame);
    const x = event.clientX;
    const y = event.clientY;
    frame = requestAnimationFrame(() => {
      root.style.setProperty('--field-x', `${(x / innerWidth * 100).toFixed(2)}%`);
      root.style.setProperty('--field-y', `${(y / innerHeight * 100).toFixed(2)}%`);
      frame = null;
    });
  };
  const sync = () => {
    const enabled = !motion.matches && pointer.matches;
    if (enabled && !listening) {
      document.addEventListener('pointermove', move, { passive: true });
      document.addEventListener('pointerleave', reset);
      listening = true;
    } else if (!enabled && listening) {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', reset);
      listening = false;
      reset();
    }
  };
  motion.addEventListener('change', sync);
  pointer.addEventListener('change', sync);
  document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });
  sync();
})();
