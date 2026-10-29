'use strict';

(() => {
  const grid = document.getElementById('event-grid');
  const dialog = document.getElementById('event-dialog');
  if (!grid || !dialog) return;
  const events = window.portfolioEvents || [];
  const preview = document.querySelector('#event-preview img');
  const previous = document.getElementById('event-prev');
  const next = document.getElementById('event-next');
  let activeEvent;
  let imageIndex = 0;
  let opener;

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const renderImage = index => {
    imageIndex = index;
    const image = activeEvent.gallery[index];
    preview.src = image.src;
    preview.alt = image.alt;
    document.getElementById('event-title').textContent = `${activeEvent.title} · ${activeEvent.discipline}`;
    document.getElementById('event-caption').textContent = image.caption;
    document.getElementById('event-count').textContent = `${index + 1} / ${activeEvent.gallery.length}`;
    document.getElementById('event-original').href = image.src;
    previous.disabled = index === 0;
    next.disabled = index === activeEvent.gallery.length - 1;
  };
  const open = (event, index, button) => {
    activeEvent = event;
    opener = button;
    renderImage(index);
    dialog.showModal();
  };
  const imageButton = (event, image, index, className) => {
    const button = element('button', className);
    button.type = 'button';
    button.setAttribute('aria-label', `View ${event.title} photo ${index + 1}: ${image.alt}`);
    button.setAttribute('aria-haspopup', 'dialog');
    const img = element('img');
    img.src = image.src;
    img.alt = image.alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    button.append(img);
    button.addEventListener('click', () => open(event, index, button));
    return button;
  };

  for (const event of events) {
    const card = element('article', 'event-card');
    card.dataset.eventId = event.id;
    const cover = imageButton(event, event.gallery[0], 0, 'event-cover');
    const badge = element('span', 'event-result', event.result);
    badge.setAttribute('aria-hidden', 'true');
    cover.append(badge, element('span', 'event-enlarge', 'View gallery ↗'));
    const body = element('div', 'event-card-body');
    body.append(element('p', 'eyebrow', `${event.discipline} / ${event.year}`), element('h3', '', event.title));
    const outcome = element('p', 'event-outcome', `${event.result} · ${event.team}`);
    body.append(outcome);
    const thumbs = element('div', 'event-thumbs');
    event.gallery.slice(1).forEach((image, index) => thumbs.append(imageButton(event, image, index + 1, 'event-thumb')));
    body.append(thumbs);
    const links = element('div', 'event-card-links');
    const build = element('a', 'text-link', 'Explore the build ↗');
    build.href = `project.html?project=${encodeURIComponent(event.projectSlug)}`;
    const record = element('a', 'text-link', 'Award record ↗');
    record.href = `archive.html?search=${encodeURIComponent(event.archiveQuery)}`;
    links.append(build, record);
    body.append(links);
    card.append(cover, body);
    grid.append(card);
  }
  previous.addEventListener('click', () => { if (imageIndex > 0) renderImage(imageIndex - 1); });
  next.addEventListener('click', () => { if (imageIndex < activeEvent.gallery.length - 1) renderImage(imageIndex + 1); });
  dialog.querySelector('.event-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' && imageIndex > 0) {
      event.preventDefault();
      renderImage(imageIndex - 1);
    } else if (event.key === 'ArrowRight' && imageIndex < activeEvent.gallery.length - 1) {
      event.preventDefault();
      renderImage(imageIndex + 1);
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => opener?.focus({preventScroll: true}));
})();
