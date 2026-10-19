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
  document.title = `${project.title} — Shaheen Rahman Dibya`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', project.detail);
  document.getElementById('project-category').textContent = `${String(index + 1).padStart(2, '0')} / ${project.label}`;
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
  if (illustration) {
    art.innerHTML = `<svg viewBox="0 0 480 280" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${illustration}</svg>`;
    art.append(node('span', 'project-visual-label', 'CONCEPT ILLUSTRATION'));
  } else art.hidden = true;

  document.getElementById('project-highlights').replaceChildren(...project.highlights.map(item => {
    const fact = node('div', 'project-fact');
    fact.append(node('strong', '', item.value), node('span', '', item.label));
    return fact;
  }));

  const resourceTypes = {code: 'Source code', report: 'Project report', demo: 'Demo', video: 'Video', files: 'Project files'};
  const resources = (project.resources || []).map(resource => {
    const anchor = link(resource.label, resource.url, 'project-resource');
    if (!anchor) return null;
    const copy = anchor.firstElementChild;
    copy.replaceChildren(
      node('small', '', resourceTypes[resource.kind] || 'Project resource'),
      node('strong', '', resource.label)
    );
    if (resource.description) copy.append(node('small', '', resource.description));
    return anchor;
  }).filter(Boolean);
  document.getElementById('project-resources').replaceChildren(...resources);
  document.getElementById('project-resources-section').hidden = !resources.length;

  const gallery = (project.gallery || []).map((image, imageIndex) => {
    if (!safeUrl(image.src)) return null;
    const figure = node('figure', 'project-gallery-item');
    const img = node('img');
    img.src = image.src;
    img.alt = image.alt || `${project.title}, image ${imageIndex + 1}`;
    img.loading = 'lazy';
    img.decoding = 'async';
    figure.append(img);
    if (image.caption) figure.append(node('figcaption', '', image.caption));
    return figure;
  }).filter(Boolean);
  document.getElementById('project-gallery').replaceChildren(...gallery);
  document.getElementById('project-gallery-section').hidden = !gallery.length;

  const evidence = (project.evidence || []).map(source => link(source.label, source.url, 'project-evidence-link')).filter(Boolean);
  document.getElementById('project-evidence').replaceChildren(...evidence);

  const previous = index > 0 ? projects[index - 1] : null;
  const next = index < projects.length - 1 ? projects[index + 1] : null;
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
