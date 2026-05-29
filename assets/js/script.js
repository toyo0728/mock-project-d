// dining モーダル
(() => {
  const openBtns = document.querySelectorAll('[data-modal-open]');
  const closeTriggers = document.querySelectorAll('[data-modal-close]');

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    const firstFocusable = modal.querySelector('button, [href], input, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) firstFocusable.focus();
  }

  function closeModal(modal) {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  openBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.modalOpen;
      openModal(id);
    });
  });

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const modal = trigger.closest('.p-modal');
      if (modal) closeModal(modal);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const openModal = document.querySelector('.p-modal.is-open');
    if (openModal) closeModal(openModal);
  });
})();

// ヴィラ タブ
(() => {
  const tabs = document.querySelectorAll('[data-villa-tab]');
  const panels = document.querySelectorAll('[data-villa-panel]');

  if (!tabs.length || !panels.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.villaTab;

      tabs.forEach((item) => {
        const isActive = item.dataset.villaTab === target;
        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-selected', String(isActive));
        item.tabIndex = isActive ? 0 : -1;
      });

      panels.forEach((panel) => {
        const isActive = panel.dataset.villaPanel === target;
        panel.classList.toggle('is-active', isActive);
        panel.hidden = !isActive;
      });
    });
  });
})();

// FAQ アコーディオン
(() => {
  const items = document.querySelectorAll('.p-faq__item');

  if (!items.length) return;

  items.forEach((item) => {
    const trigger = item.querySelector('.p-faq__trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      items.forEach((otherItem) => {
        otherItem.classList.remove('is-open');
        const otherTrigger = otherItem.querySelector('.p-faq__trigger');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
