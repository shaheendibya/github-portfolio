'use strict';

(() => {
  const navigation = document.querySelector('.desktop-nav');
  const menuButton = document.querySelector('.mobile-toggle');
  const closeMenu = () => {
    navigation?.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation');
  };
  menuButton?.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(expanded));
    menuButton.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
    navigation?.classList.toggle('is-open', expanded);
  });
  navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.header-inner')) closeMenu();
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });
  const year = document.getElementById('current-year');
  if (year) year.textContent = String(new Date().getFullYear());

  const emailButton = document.getElementById('copy-email');
  emailButton?.addEventListener('click', async () => {
    const status = document.getElementById('copy-status');
    try {
      await navigator.clipboard.writeText('shaheen.dibya17@gmail.com');
      status.textContent = 'Email copied. Let’s connect!';
    } catch {
      status.textContent = 'Please select and copy the email address above.';
    }
  });

  const list = document.getElementById('project-list');
  if (!list) return;

  const projects = window.portfolioProjects || [];
  const illustrations = window.portfolioProjectIllustrations || {};

  projects.forEach((project, index) => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.dataset.category = project.category;
    card.innerHTML = `<div class="project-visual project-visual-${project.art}" aria-hidden="true"><svg viewBox="0 0 480 280" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">${illustrations[project.art]}</svg><span class="project-visual-label">CONCEPT ILLUSTRATION / ${String(index + 1).padStart(2, '0')}</span></div><div class="project-body"><div class="project-category"><span>${project.label}</span><span class="project-number">0${index + 1}</span></div><h3 class="project-title"><a class="project-open" href="project.html?project=${encodeURIComponent(project.slug)}">${project.title}</a></h3><p class="project-description">${project.description}</p><div class="project-card-bottom"><div class="tool-tags">${project.tags.map(tag => `<span>${tag}</span>`).join('')}</div><a class="project-open-arrow" href="project.html?project=${encodeURIComponent(project.slug)}" aria-label="View ${project.title} project page">↗</a></div></div>`;
    if (project.cover?.src) {
      const visual = card.querySelector('.project-visual');
      const image = document.createElement('img');
      image.className = 'project-cover';
      image.src = project.cover.src;
      image.alt = project.cover.alt || project.title;
      image.loading = 'lazy';
      image.decoding = 'async';
      visual.removeAttribute('aria-hidden');
      visual.classList.add('has-project-cover');
      visual.replaceChildren(image);
    }
    list.append(card);
  });

  document.querySelectorAll('[data-project-filter]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-project-filter]').forEach(filter => {
        const selected = filter === button;
        filter.classList.toggle('active', selected);
        filter.setAttribute('aria-pressed', String(selected));
      });
      let count = 0;
      list.querySelectorAll('.project-card').forEach(card => {
        card.hidden = button.dataset.projectFilter !== 'all' && card.dataset.category !== button.dataset.projectFilter;
        if (!card.hidden) count++;
      });
      document.getElementById('project-count').textContent = `Showing ${count} project${count === 1 ? '' : 's'}`;
      list.classList.toggle('filtered', button.dataset.projectFilter !== 'all');
    });
  });

  if ('IntersectionObserver' in window) {
    const navLinks = Array.from(navigation.querySelectorAll('a[href^="#"]'));
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        navLinks.forEach(link => {
          const active = link.hash === `#${entry.target.id}`;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: '-15% 0px -60% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
  }
})();
