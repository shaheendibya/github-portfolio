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

  const projects = [
    {
      title: 'EV Longitudinal Dynamics', category: 'simulation', label: 'EV SYSTEMS · FORMULA IUT', art: 'ev',
      description: 'Understanding how an electric vehicle moves, one model at a time.',
      detail: 'An EV longitudinal dynamics model developed in MATLAB/Simulink through Formula IUT’s electrical sub-team.',
      contribution: 'Developed the vehicle dynamics model and contributed to electric kart motor-controller analysis as a Sub-Executive on the simulation team.',
      tags: ['MATLAB', 'Simulink', 'EV systems']
    },
    {
      title: 'SAP-1 8-bit Computer', category: 'hardware', label: 'DIGITAL ELECTRONICS · 2026', art: 'computer',
      description: 'A computer architecture, extended with a multiplier and BCD conversion.',
      detail: 'An 8-bit SAP-1 computer architecture designed and simulated in Proteus for the Digital Electronics Lab.',
      contribution: 'Worked in a six-member team to design and simulate the system, extending the architecture with a 4-bit multiplier and binary-coded decimal conversion.',
      tags: ['Proteus', 'Computer architecture', 'Digital electronics']
    },
    {
      title: 'Stock Market Crash Simulator', category: 'simulation', label: 'COMPUTATIONAL MODELING', art: 'market',
      description: 'Exploring uncertainty through stochastic models and statistical crash detection.',
      detail: 'A MATLAB-based stock-market simulator exploring stochastic price behavior and statistical crash detection.',
      contribution: 'Developed the simulator using Markov chains, Geometric Brownian Motion, and statistical crash detection.',
      tags: ['MATLAB', 'Markov chains', 'Stochastic modeling']
    },
    {
      title: 'Residential Electrical Services', category: 'design', label: 'ELECTRICAL DESIGN', art: 'building',
      description: 'Designing the electrical services of a four-storied residential building.',
      detail: 'An AutoCAD electrical services design covering the electrical requirements of a four-storied residential building.',
      contribution: 'Designed the electrical services, including load calculations, distribution, wiring, and protection.',
      tags: ['AutoCAD', 'Load calculations', 'Electrical protection']
    },
    {
      title: 'RC Racing & Soccerbot', category: 'hardware', label: 'ARDUINO ROBOTICS · TEAM PROJECTS', art: 'robotics',
      description: 'From the workbench to the competition floor. Three championship wins, built together.',
      detail: 'Collaborative Arduino robotics projects across RC racing and Soccerbot competitions.',
      contribution: 'Contributed to chassis design, wiring, soldering, and troubleshooting. The teams won Soccerbot at Intra IUT EEE Day 2025 and RC Racing at ACCELERATE 2025 and Techathon 2025.',
      tags: ['Arduino', 'Robotics', 'Team engineering']
    }
  ];

  const illustrations = {
    ev: '<path d="M98 174h278l-21-57c-4-12-15-20-28-20H186l-48 44-40 13z"/><path d="m176 103-36 39h187l-15-39M239 104v38"/><circle cx="158" cy="176" r="25"/><circle cx="324" cy="176" r="25"/><circle cx="158" cy="176" r="9"/><circle cx="324" cy="176" r="9"/><path d="M74 220h342M392 147h48m-10-9 10 9-10 9M70 145H34m9-9-9 9 9 9"/><text x="52" y="64">F = m · a</text><text x="368" y="64">EV</text><path d="m218 160 13-13-3 12h14l-15 15 4-14z"/>',
    computer: '<rect x="167" y="70" width="146" height="140" rx="5"/><rect x="190" y="94" width="100" height="91" rx="2"/><path d="M183 70V47m28 23V47m29 23V47m29 23V47m28 23V47M183 210v23m28-23v23m29-23v23m29-23v23m28-23v23M167 87h-25m25 27h-25m25 27h-25m25 27h-25m25 27h-25m171-108h25m-25 27h25m-25 27h25m-25 27h25m-25 27h25"/><text x="208" y="134">SAP-1</text><text x="216" y="163">8 BIT</text><path d="M82 93h35v48h25m196 0h34v47h31M82 188h33v-20h27"/><circle cx="77" cy="93" r="5"/><circle cx="408" cy="188" r="5"/>',
    market: '<path d="M69 55v171h345M75 187l24-10 17 15 21-31 24 8 20-39 19 19 20-15 21 27 17-51 17 18 20-27 22 38 23-14 21 45 19-12 18 38"/><path d="M75 154l24-11 17 10 21-18 24 4 20-19 19 15 20-10 21 11 17-28 17 11 20-14 22 21 23-9 21 20 19-8 18 12" stroke-dasharray="5 6" opacity=".45"/><path d="M69 100h345M69 160h345" opacity=".2"/><text x="326" y="69">P(t)</text><text x="60" y="247">0</text><text x="405" y="247">t</text>',
    building: '<path d="M151 225V58h171v167M139 225h195M136 58h202M180 225v-32h34v32m37-32h36v32"/><path d="M174 83h42v30h-42zm77 0h42v30h-42zm-77 54h42v30h-42zm77 0h42v30h-42z"/><path d="M115 58v167m-8-161 8-6 8 6m-16 155 8 6 8-6M351 85v85m-7-77 7-8 7 8"/><path d="m364 196 12-19-1 15h13l-16 23 3-19z"/><path d="M91 225h31M91 58h31"/><text x="41" y="151">4F</text>',
    robotics: '<rect x="168" y="97" width="143" height="91" rx="15"/><rect x="152" y="108" width="16" height="29" rx="4"/><rect x="152" y="153" width="16" height="29" rx="4"/><rect x="311" y="108" width="16" height="29" rx="4"/><rect x="311" y="153" width="16" height="29" rx="4"/><rect x="198" y="114" width="83" height="58" rx="4"/><circle cx="214" cy="130" r="6"/><circle cx="264" cy="130" r="6"/><path d="M219 153h41m-20-56V70m-19 0h38M113 103l-15-15M106 145H85m28 41-15 15m266-98 15-15m-8 57h21m-28 41 15 15"/><path d="M74 230h338" stroke-dasharray="9 7"/><text x="68" y="56">BUILD. TEST. RACE.</text>'
  };

  projects.forEach((project, index) => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.dataset.category = project.category;
    card.innerHTML = `<div class="project-visual project-visual-${project.art}" aria-hidden="true"><svg viewBox="0 0 480 280" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">${illustrations[project.art]}</svg><span class="project-visual-label">CONCEPT ILLUSTRATION / ${String(index + 1).padStart(2, '0')}</span></div><div class="project-body"><div class="project-category"><span>${project.label}</span><span class="project-number">0${index + 1}</span></div><h3 class="project-title"><button class="project-open" data-project="${index}" aria-haspopup="dialog">${project.title}</button></h3><p class="project-description">${project.description}</p><div class="project-card-bottom"><div class="tool-tags">${project.tags.map(tag => `<span>${tag}</span>`).join('')}</div><button class="project-open-arrow" data-project="${index}" aria-label="View ${project.title} details" aria-haspopup="dialog">↗</button></div></div>`;
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

  const dialog = document.getElementById('project-dialog');
  list.addEventListener('click', event => {
    const button = event.target.closest('[data-project]');
    if (!button) return;
    const project = projects[Number(button.dataset.project)];
    document.getElementById('dialog-category').textContent = project.label;
    document.getElementById('dialog-title').textContent = project.title;
    document.getElementById('dialog-description').textContent = project.detail;
    document.getElementById('dialog-contribution').textContent = project.contribution;
    document.getElementById('dialog-tags').replaceChildren(...project.tags.map(tag => {
      const span = document.createElement('span');
      span.textContent = tag;
      return span;
    }));
    dialog.showModal();
  });
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
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
