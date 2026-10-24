'use strict';

(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  let storedTheme;
  try { storedTheme = localStorage.getItem('dibya-theme'); } catch { /* Storage can be disabled. */ }

  const applyTheme = theme => {
    root.dataset.theme = theme;
    toggle?.setAttribute('aria-pressed', String(theme === 'dark'));
    if (toggle) toggle.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#111b18' : '#f7f7f2');
  };
  // Keep the familiar light palette unless the visitor explicitly chooses night mode.
  applyTheme(storedTheme === 'dark' ? 'dark' : 'light');
  if (toggle) toggle.hidden = false;
  toggle?.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    try { localStorage.setItem('dibya-theme', theme); } catch { /* The toggle still works without persistence. */ }
  });
  window.addEventListener('storage', event => {
    if (event.key === 'dibya-theme') applyTheme(event.newValue === 'dark' ? 'dark' : 'light');
  });

  let scrollFrame;
  const updateReadingProgress = () => {
    const available = root.scrollHeight - innerHeight;
    root.style.setProperty('--reading-progress', String(available > 0 ? Math.max(0, Math.min(1, scrollY / available)) : 0));
    scrollFrame = null;
  };
  const requestProgressUpdate = () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateReadingProgress);
  };
  window.addEventListener('scroll', requestProgressUpdate, { passive: true });
  window.addEventListener('resize', requestProgressUpdate, { passive: true });
  window.addEventListener('load', requestProgressUpdate, { once: true });
  updateReadingProgress();

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionPreference.matches) return;

  // Content is always visible; this adds movement only when it first comes into view.
  if ('IntersectionObserver' in window) {
    const arrival = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal-arrival');
        arrival.unobserve(entry.target);
      });
    }, { threshold: .08 });
    document.querySelectorAll('.section-heading, .recognition-grid, .about-grid, .project-card, .timeline article, .education-grid, .archive-banner, .project-detail-block').forEach(element => arrival.observe(element));
  }

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.project-card').forEach(card => {
      let pointerFrame;
      card.addEventListener('pointermove', event => {
        if (pointerFrame) cancelAnimationFrame(pointerFrame);
        pointerFrame = requestAnimationFrame(() => {
          const bounds = card.getBoundingClientRect();
          card.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
          card.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
          pointerFrame = null;
        });
      });
      card.addEventListener('pointerleave', () => {
        if (pointerFrame) cancelAnimationFrame(pointerFrame);
        pointerFrame = null;
        card.style.removeProperty('--pointer-x');
        card.style.removeProperty('--pointer-y');
      });
    });
  }
})();
