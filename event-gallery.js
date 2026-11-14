'use strict';

// The homepage keeps the results concise; each record opens the complete story.
(() => {
  const grid = document.getElementById('event-grid');
  if (!grid) return;
  const events = Array.isArray(window.portfolioEvents) ? window.portfolioEvents : [];
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const cards = events.filter(event => event && typeof event.recordId === 'string' && event.recordId.trim()).map(event => {
    const card = element('a', 'event-card event-summary');
    card.href = `archive.html?record=${encodeURIComponent(event.recordId)}`;
    card.dataset.eventId = event.id;
    const meta = element('div', 'event-summary-meta');
    const year = element('time', '', String(event.year));
    year.dateTime = String(event.year);
    meta.append(element('span', 'event-result', event.result), year);
    const title = element('h3', '', event.title);
    card.append(meta, element('p', 'event-summary-discipline', event.discipline), title,
      element('p', 'event-outcome', event.team));
    const action = element('span', 'event-summary-cta', 'View achievement');
    const arrow = element('span', '', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    action.append(arrow);
    card.append(action);
    return card;
  });
  grid.replaceChildren(...cards);
})();
