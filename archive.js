(() => {
  'use strict';

  const grid = document.getElementById('archive-grid');
  if (!grid) return;
  const records = (Array.isArray(window.portfolioAchievements) ? window.portfolioAchievements : []).slice();
  const categoryNames = {
    engineering: 'Engineering & robotics', academics: 'Academics & science', academic: 'Academics',
    science: 'Science', sports: 'Sports', sport: 'Sports', community: 'Community',
    creative: 'Arts & language', leadership: 'Leadership', service: 'Leadership & service',
    'case-competitions': 'Case competitions', workshops: 'Workshops',
    qualification: 'Qualifications', qualifications: 'Qualifications'
  };
  const kindNames = {
    award: 'Awards & distinctions', participation: 'Participation',
    qualification: 'Qualifications', service: 'Service & leadership',
    recognition: 'Academic recognition', training: 'Workshops & training', record: 'Other records'
  };
  const state = { category: 'all', search: '', year: 'all', kind: 'all' };
  const form = document.getElementById('archive-filters');
  const categoryList = document.getElementById('archive-categories');
  const search = document.getElementById('archive-search');
  const year = document.getElementById('archive-year');
  const kind = document.getElementById('archive-kind');
  const count = document.getElementById('archive-count');
  const clear = document.getElementById('archive-clear');
  const empty = document.getElementById('archive-empty');
  const dialog = document.getElementById('certificate-dialog');
  let lastTrigger = null;
  let openRecord = null;

  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined && text !== null) element.textContent = text;
    return element;
  }

  function categoryName(category) {
    return categoryNames[category] || String(category || 'Other').replace(/[-_]/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  }

  function recordYear(record) {
    return record.year === null || record.year === undefined || record.year === '' ? 'undated' : String(record.year);
  }

  function recordKind(record) { return record.kind || 'record'; }
  function yearLabel(value) { return value === 'undated' ? 'Undated' : value; }
  function sources(record) { return Array.isArray(record.sources) ? record.sources : []; }
  function sourceLink(source) {
    const url = source.url || '';
    return source.page && !url.includes('#') ? `${url}#page=${source.page}` : url;
  }
  function citation(source) {
    if (source.status === 'pending') return source.pendingLabel || `${source.label || 'Certificate'} · pending`;
    return `${source.label || 'Source document'}${source.page ? ` · p. ${source.page}` : ''}`;
  }
  function resultText(record) { return record.result || kindNames[recordKind(record)] || 'Achievement record'; }
  function cleanSearch(value) { return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim(); }

  records.sort((a, b) => {
    const aYear = Number.parseInt(a.year, 10) || 0;
    const bYear = Number.parseInt(b.year, 10) || 0;
    return bYear - aYear;
  });

  const categories = [...new Set(records.map(record => record.category || 'other'))];
  const preferredOrder = ['engineering', 'academics', 'academic', 'science', 'workshops', 'sports', 'sport', 'community', 'creative', 'leadership', 'service', 'case-competitions'];
  categories.sort((a, b) => {
    const ai = preferredOrder.includes(a) ? preferredOrder.indexOf(a) : 999;
    const bi = preferredOrder.includes(b) ? preferredOrder.indexOf(b) : 999;
    return ai - bi || categoryName(a).localeCompare(categoryName(b));
  });
  ['all', ...categories].forEach(category => {
    const button = node('button', 'archive-category');
    const label = category === 'all' ? 'All entries' : categoryName(category);
    const total = category === 'all' ? records.length : records.filter(record => (record.category || 'other') === category).length;
    button.type = 'button';
    button.dataset.category = category;
    button.setAttribute('aria-pressed', String(category === 'all'));
    button.setAttribute('aria-label', `${label}, ${total} records`);
    button.append(document.createTextNode(label));
    const badge = node('span', '', total);
    badge.setAttribute('aria-hidden', 'true');
    button.append(badge);
    categoryList.append(button);
  });

  const years = [...new Set(records.map(recordYear))].sort((a, b) => {
    if (a === 'undated') return 1;
    if (b === 'undated') return -1;
    return Number.parseInt(b, 10) - Number.parseInt(a, 10);
  });
  years.forEach(value => {
    const option = node('option', '', yearLabel(value));
    option.value = value;
    year.append(option);
  });
  [...new Set(records.map(recordKind))].sort((a, b) => Object.keys(kindNames).indexOf(a) - Object.keys(kindNames).indexOf(b)).forEach(value => {
    const option = node('option', '', kindNames[value] || categoryName(value));
    option.value = value;
    kind.append(option);
  });
  document.getElementById('archive-total').textContent = String(records.length).padStart(2, '0');
  const datedYears = years.filter(value => value !== 'undated');
  const yearCount = document.getElementById('archive-years');
  yearCount.textContent = String(datedYears.length).padStart(2, '0');
  if (datedYears.length) yearCount.title = `${datedYears[datedYears.length - 1]}–${datedYears[0]}`;
  const initialQuery = new URLSearchParams(window.location.search);
  if (initialQuery.has('search')) state.search = initialQuery.get('search') || '';
  if (categories.includes(initialQuery.get('category'))) state.category = initialQuery.get('category');
  if (years.includes(initialQuery.get('year'))) state.year = initialQuery.get('year');
  if (records.some(record => recordKind(record) === initialQuery.get('kind'))) state.kind = initialQuery.get('kind');
  search.value = state.search;
  year.value = state.year;
  kind.value = state.kind;

  function documentPreview(source) {
    const preview = node('div', 'archive-document-preview');
    const pending = source?.status === 'pending';
    preview.append(node('span', 'archive-preview-monogram', pending ? source.placeholder || '—' : 'D.'));
    preview.append(node('span', 'archive-preview-rule'));
    preview.append(node('span', 'archive-preview-source', source && source.label ? source.label : 'Document record'));
    preview.append(node('span', 'archive-preview-label', pending ? source.pendingLabel || 'Certificate pending' : 'View original source'));
    return preview;
  }

  function createCard(record, index) {
    const card = node('article', 'archive-card');
    const primary = sources(record)[0];
    const preview = node('button', 'archive-card-preview');
    preview.type = 'button';
    preview.dataset.recordId = String(record.id);
    preview.setAttribute('aria-label', `View record: ${record.title}`);
    preview.setAttribute('aria-haspopup', 'dialog');
    preview.append(node('span', 'archive-card-number', String(index + 1).padStart(2, '0')));
    const imageSource = sources(record).find(source => source.thumbnail || source.image);
    if (imageSource) {
      const img = node('img');
      img.src = imageSource.thumbnail || imageSource.image;
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.width = 600;
      img.height = 420;
      img.addEventListener('error', () => img.replaceWith(documentPreview(primary)), { once: true });
      preview.append(img);
    } else preview.append(documentPreview(primary));
    const content = node('div', 'archive-card-content');
    const meta = node('p', 'archive-card-meta');
    meta.append(node('span', '', categoryName(record.category)), node('span', '', yearLabel(recordYear(record))));
    const title = node('h3');
    const titleButton = node('button', 'archive-card-title', record.title);
    titleButton.type = 'button';
    titleButton.dataset.recordId = String(record.id);
    titleButton.setAttribute('aria-haspopup', 'dialog');
    title.append(titleButton);
    const result = node('p', 'archive-card-result', resultText(record));
    result.dataset.kind = recordKind(record);
    const description = node('p', 'archive-card-description', record.description || 'See the original document for the complete record.');
    const source = node('div', 'archive-card-citation');
    if (primary && primary.url) {
      const additional = sources(record).filter(item => item.url).length - 1;
      const original = node('a', '', `${citation(primary)}${additional > 0 ? ` +${additional} source${additional > 1 ? 's' : ''}` : ''}`);
      original.href = sourceLink(primary);
      original.target = '_blank';
      original.rel = 'noopener';
      original.setAttribute('aria-label', `Open original source for ${record.title}: ${citation(primary)}`);
      source.append(original);
    } else source.append(node('span', '', 'Achievement record'));
    const arrow = node('span', '', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    source.append(arrow);
    content.append(meta, title, result, description, source);
    const pending = sources(record).find(item => item.status === 'pending');
    if (pending) content.insertBefore(node('p', 'archive-card-status', pending.pendingLabel || 'Certificate pending'), source);
    card.append(preview, content);
    return card;
  }

  function render() {
    const query = cleanSearch(state.search);
    const filtered = records.filter(record => {
      const haystack = cleanSearch([record.title, record.result, record.description, categoryName(record.category), record.year, ...sources(record).map(source => source.label)].filter(Boolean).join(' '));
      return (state.category === 'all' || (record.category || 'other') === state.category)
        && (state.year === 'all' || recordYear(record) === state.year)
        && (state.kind === 'all' || recordKind(record) === state.kind)
        && (!query || query.split(/\s+/).every(word => haystack.includes(word)));
    });
    grid.replaceChildren(...filtered.map(record => createCard(record, records.indexOf(record))));
    count.textContent = `Showing ${filtered.length} of ${records.length} achievement records`;
    clear.hidden = state.category === 'all' && state.year === 'all' && state.kind === 'all' && !state.search;
    empty.hidden = filtered.length !== 0;
    grid.hidden = filtered.length === 0;
    categoryList.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === state.category)));
    const url = new URL(window.location.href);
    Object.entries({ search: state.search.trim(), category: state.category, year: state.year, kind: state.kind }).forEach(([key, value]) => {
      if (value && value !== 'all') url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    });
    const location = `${url.pathname}${url.search}${url.hash}`;
    if (location !== `${window.location.pathname}${window.location.search}${window.location.hash}`) window.history.replaceState(window.history.state, '', location);
  }

  function resetFilters() {
    Object.assign(state, { category: 'all', search: '', year: 'all', kind: 'all' });
    form.reset();
    render();
  }

  form.addEventListener('submit', event => event.preventDefault());
  categoryList.addEventListener('click', event => {
    const button = event.target.closest('button[data-category]');
    if (!button) return;
    state.category = button.dataset.category;
    render();
  });
  search.addEventListener('input', () => { state.search = search.value; render(); });
  year.addEventListener('change', () => { state.year = year.value; render(); });
  kind.addEventListener('change', () => { state.kind = kind.value; render(); });
  clear.addEventListener('click', resetFilters);
  document.getElementById('archive-empty-clear').addEventListener('click', () => { resetFilters(); search.focus(); });

  function showSource(record, index) {
    const source = sources(record)[index];
    const preview = document.getElementById('certificate-preview');
    preview.replaceChildren();
    if (source && source.image) {
      const img = node('img');
      img.src = source.image;
      img.alt = `${record.title} — ${citation(source)}`;
      img.decoding = 'async';
      img.addEventListener('error', () => img.replaceWith(documentPreview(source)), { once: true });
      preview.append(img);
    } else preview.append(documentPreview(source));
    document.getElementById('certificate-citation').textContent = source ? citation(source) : 'Source document unavailable';
    const original = document.getElementById('certificate-original');
    original.hidden = !source || !source.url;
    if (source && source.url) original.href = sourceLink(source);
    else original.removeAttribute('href');
    const readNote = dialog.querySelector('.certificate-read-note');
    readNote.textContent = source?.status === 'pending'
      ? source.pendingMessage || 'The certificate will be added here once it is available.'
      : 'Open the original PDF for full resolution and surrounding context.';
    document.getElementById('certificate-source-nav').querySelectorAll('button').forEach((button, buttonIndex) => button.setAttribute('aria-pressed', String(buttonIndex === index)));
  }

  function showRecord(record, trigger) {
    openRecord = record;
    lastTrigger = trigger;
    document.getElementById('certificate-category').textContent = `${categoryName(record.category)} / ${yearLabel(recordYear(record))}`;
    document.getElementById('certificate-title').textContent = record.title;
    const result = document.getElementById('certificate-result');
    result.textContent = resultText(record);
    result.dataset.kind = recordKind(record);
    document.getElementById('certificate-description').textContent = record.description || 'See the original document for the complete record.';
    const note = document.getElementById('certificate-note');
    note.textContent = record.note || '';
    note.hidden = !record.note;
    const nav = document.getElementById('certificate-source-nav');
    nav.replaceChildren();
    nav.hidden = sources(record).length < 2;
    sources(record).forEach((source, index) => {
      const button = node('button', '', source.tabLabel || (sources(record).every(item => item.label === source.label) && source.page ? `Page ${source.page}` : `Source ${index + 1}${source.page ? ` · p. ${source.page}` : ''}`));
      button.type = 'button';
      button.setAttribute('aria-pressed', String(index === 0));
      button.setAttribute('aria-label', `${source.tabLabel ? `${source.tabLabel}: ` : ''}${citation(source)}`);
      button.addEventListener('click', () => { if (openRecord) showSource(openRecord, index); });
      nav.append(button);
    });
    showSource(record, 0);
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
  }

  grid.addEventListener('click', event => {
    const trigger = event.target.closest('button[data-record-id]');
    if (!trigger) return;
    const record = records.find(item => String(item.id) === trigger.dataset.recordId);
    if (record) showRecord(record, trigger);
  });
  dialog.querySelector('.certificate-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    openRecord = null;
    if (lastTrigger && lastTrigger.isConnected) lastTrigger.focus();
  });
  render();
})();
