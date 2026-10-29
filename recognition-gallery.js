'use strict';

// The photographs remain ordinary full-size links when scripting is unavailable.
(() => {
  const dialog = document.getElementById('recognition-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const links = [...document.querySelectorAll('a.recognition-photo-link[data-gallery]')];
  const preview = document.querySelector('#recognition-preview img');
  const title = document.getElementById('recognition-title');
  const caption = document.getElementById('recognition-caption');
  const count = document.getElementById('recognition-count');
  const original = document.getElementById('recognition-original');
  const previous = document.getElementById('recognition-prev');
  const next = document.getElementById('recognition-next');
  let gallery = [];
  let index = 0;
  let opener;

  const show = position => {
    index = position;
    const link = gallery[index];
    preview.src = link.getAttribute('href');
    preview.alt = link.querySelector('img').alt;
    title.textContent = link.dataset.galleryTitle;
    caption.textContent = link.dataset.caption;
    count.textContent = `${index + 1} / ${gallery.length}`;
    original.href = link.getAttribute('href');
    previous.disabled = index === 0;
    next.disabled = index === gallery.length - 1;
  };

  links.forEach(link => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      gallery = links.filter(item => item.dataset.gallery === link.dataset.gallery);
      opener = link;
      show(gallery.indexOf(link));
      dialog.showModal();
    });
  });
  previous.addEventListener('click', () => { if (index > 0) show(index - 1); });
  next.addEventListener('click', () => { if (index < gallery.length - 1) show(index + 1); });
  dialog.querySelector('.recognition-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      show(index - 1);
    } else if (event.key === 'ArrowRight' && index < gallery.length - 1) {
      event.preventDefault();
      show(index + 1);
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => opener?.focus({preventScroll: true}));
})();
