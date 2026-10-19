'use strict';

(() => {
  const content = document.getElementById('project-content');
  if (!content) return;

  const projects = window.portfolioProjects || [];
  const slug = new URLSearchParams(window.location.search).get('project');
  const index = projects.findIndex(project => project.slug === slug);
  const loading = document.getElementById('project-loading');

  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function safeUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const url = new URL(value, document.baseURI);
      return ['http:', 'https:'].includes(url.protocol) ? url : null;
    } catch {
      return null;
    }
  }

  function link(label, value, className = '') {
    const url = safeUrl(value);
    if (!url) return null;
    const anchor = node('a', className);
    anchor.href = value;
    anchor.append(node('span', '', label));
    const arrow = node('span', 'project-link-icon', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    anchor.append(arrow);
    if (url.origin !== window.location.origin || url.pathname.toLowerCase().endsWith('.pdf')) {
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    }
    return anchor;
  }

  if (index === -1) {
    const missing = document.getElementById('project-not-found');
    missing.hidden = false;
    if (!slug) {
      missing.querySelector('h1').textContent = 'Choose a project.';
      document.title = 'Selected work — Shaheen Rahman Dibya';
    } else {
      document.title = 'Project not found — Shaheen Rahman Dibya';
    }
    loading.hidden = true;
    return;
  }

  const project = projects[index];
  const featured = projects.filter(item => item.featured !== false);
  const featuredIndex = featured.findIndex(item => item.slug === slug);
  document.title = `${project.title} — Shaheen Rahman Dibya`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', project.detail);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', project.detail);
  document.getElementById('project-category').textContent = featuredIndex < 0 ? project.label : `${String(featuredIndex + 1).padStart(2, '0')} / ${project.label}`;
  document.getElementById('project-title').textContent = project.title;
  document.getElementById('project-lead').textContent = project.description;
  document.getElementById('project-role').textContent = project.role;
  document.getElementById('project-context').textContent = project.context;
  document.getElementById('project-tools').replaceChildren(...project.tags.map(tag => node('span', '', tag)));
  document.getElementById('project-overview').replaceChildren(...project.overview.map(paragraph => node('p', '', paragraph)));
  document.getElementById('project-contribution').replaceChildren(node('p', '', project.contribution));
  document.getElementById('project-focus').replaceChildren(...project.focus.map(item => node('li', '', item)));

  const art = document.getElementById('project-art');
  art.classList.add(`project-visual-${project.art}`);
  const illustration = window.portfolioProjectIllustrations?.[project.art];
  if (project.cover?.src && safeUrl(project.cover.src)) {
    const image = node('img', 'project-cover');
    image.src = project.cover.src;
    image.alt = project.cover.alt || project.title;
    image.decoding = 'async';
    art.removeAttribute('aria-hidden');
    art.classList.add('has-project-cover');
    art.replaceChildren(image);
  } else if (illustration) {
    art.innerHTML = `<svg viewBox="0 0 480 280" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${illustration}</svg>`;
    art.append(node('span', 'project-visual-label', 'CONCEPT ILLUSTRATION'));
  } else art.hidden = true;

  document.getElementById('project-highlights').replaceChildren(...project.highlights.map(item => {
    const fact = node('div', 'project-fact');
    fact.append(node('strong', '', item.value), node('span', '', item.label));
    return fact;
  }));

  const report = project.resources?.find(resource => resource.kind === 'report' && safeUrl(resource.url));
  const repository = project.resources?.find(resource => resource.kind === 'repository' && safeUrl(resource.url));
  const actions = [
    report && link('Read report', report.url, 'button button-dark'),
    repository && link('View on GitHub', repository.url, 'text-link')
  ].filter(Boolean);
  if (actions.length) document.getElementById('project-actions').replaceChildren(...actions);

  const credits = project.credits || [];
  document.getElementById('project-credits-title').textContent = credits.length === 1 ? 'Project author' : 'Project team';
  document.getElementById('project-credits').replaceChildren(...credits.map(name => node('li', '', name)));
  document.getElementById('project-credits-section').hidden = !credits.length;

  if (project.launch?.instructions) {
    document.getElementById('project-launch-title').textContent = project.launch.label;
    document.getElementById('project-launch-instructions').textContent = project.launch.instructions;
    document.getElementById('project-launch-requirements').textContent = project.launch.requirements || '';
    document.getElementById('project-launch-section').hidden = false;
    if (project.launch.command) {
      document.getElementById('project-command').hidden = false;
      document.getElementById('project-launch-command').textContent = project.launch.command;
      document.getElementById('project-copy-command').addEventListener('click', async () => {
        const status = document.getElementById('project-copy-status');
        try {
          await navigator.clipboard.writeText(project.launch.command);
          status.textContent = 'Command copied. Paste it into MATLAB.';
        } catch {
          status.textContent = 'Please select and copy the command above.';
        }
      });
    }
  }

  const resourceTypes = {code: 'Source code', repository: 'GitHub repository', report: 'Project report', presentation: 'Presentation', demo: 'Demo', video: 'Video', files: 'Project files'};
  const resources = (project.resources || []).map(resource => {
    const anchor = link(resource.label, resource.url, 'project-resource');
    if (!anchor) return null;
    const copy = anchor.firstElementChild;
    copy.replaceChildren(
      node('small', '', resourceTypes[resource.kind] || 'Project resource'),
      node('strong', '', resource.label)
    );
    if (resource.description) copy.append(node('small', '', resource.description));
    const url = safeUrl(resource.url);
    if (url.origin === window.location.origin && /\.(dwg|pdsprj|docx)$/i.test(url.pathname)) {
      anchor.download = url.pathname.split('/').pop();
      anchor.lastElementChild.textContent = '↓';
    }
    return anchor;
  }).filter(Boolean);
  document.getElementById('project-resources').replaceChildren(...resources);
  document.getElementById('project-resources-section').hidden = !resources.length;

  const images = (project.gallery || []).filter(image => safeUrl(image.src));
  const dialog = document.getElementById('project-image-dialog');
  let activeImage = 0;
  let imageOpener;
  function showImage(imageIndex) {
    activeImage = imageIndex;
    const image = images[activeImage];
    const preview = document.querySelector('#project-image-preview img');
    preview.src = image.src;
    preview.alt = image.alt || project.title;
    document.getElementById('project-image-title').textContent = project.title;
    document.getElementById('project-image-caption').textContent = image.caption || preview.alt;
    document.getElementById('project-image-count').textContent = `${activeImage + 1} / ${images.length}`;
    document.getElementById('project-image-original').href = image.src;
    document.getElementById('project-image-previous').disabled = activeImage === 0;
    document.getElementById('project-image-next').disabled = activeImage === images.length - 1;
  }
  document.getElementById('project-image-previous').addEventListener('click', () => showImage(Math.max(0, activeImage - 1)));
  document.getElementById('project-image-next').addEventListener('click', () => showImage(Math.min(images.length - 1, activeImage + 1)));
  dialog.querySelector('.project-image-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => imageOpener?.focus({preventScroll: true}));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' && activeImage > 0) {
      event.preventDefault();
      showImage(activeImage - 1);
    } else if (event.key === 'ArrowRight' && activeImage < images.length - 1) {
      event.preventDefault();
      showImage(activeImage + 1);
    }
  });
  const gallery = images.map((image, imageIndex) => {
    const figure = node('figure', 'project-gallery-item');
    const button = node('button', 'project-gallery-open');
    button.type = 'button';
    button.setAttribute('aria-label', `Enlarge image ${imageIndex + 1}: ${image.alt || project.title}`);
    button.setAttribute('aria-haspopup', 'dialog');
    const img = node('img');
    img.src = image.src;
    img.alt = image.alt || `${project.title}, image ${imageIndex + 1}`;
    img.loading = 'lazy';
    img.decoding = 'async';
    button.append(img);
    button.addEventListener('click', () => {
      imageOpener = button;
      showImage(imageIndex);
      dialog.showModal();
    });
    figure.append(button);
    if (image.caption) figure.append(node('figcaption', '', image.caption));
    return figure;
  }).filter(Boolean);
  document.getElementById('project-gallery').replaceChildren(...gallery);
  document.getElementById('project-gallery-section').hidden = !gallery.length;

  const evidence = (project.evidence || []).map(source => link(source.label, source.url, 'project-evidence-link')).filter(Boolean);
  document.getElementById('project-evidence').replaceChildren(...evidence);

  const previous = featuredIndex > 0 ? featured[featuredIndex - 1] : null;
  const next = featuredIndex < featured.length - 1 ? featured[featuredIndex + 1] : null;
  const navigation = document.getElementById('project-nav');
  [
    {project: previous, label: 'Previous project', direction: 'previous'},
    {project: next, label: 'Next project', direction: 'next'}
  ].forEach(item => {
    const anchor = node('a', `project-pagination-link project-pagination-${item.direction}`);
    anchor.href = item.project ? `project.html?project=${encodeURIComponent(item.project.slug)}` : 'index.html#work';
    anchor.append(node('small', '', item.project ? item.label : 'Explore the collection'));
    const title = node('strong', '', item.project ? item.project.title : 'All selected work');
    anchor.append(title);
    const arrow = node('span', 'project-link-icon', item.direction === 'previous' ? '←' : '→');
    arrow.setAttribute('aria-hidden', 'true');
    anchor.append(arrow);
    navigation.append(anchor);
  });

  loading.hidden = true;
  content.hidden = false;
})();
