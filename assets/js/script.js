// CTAバー（FV通過後に表示）
(() => {
  const fv = document.querySelector('.p-fv');
  const ctaBar = document.querySelector('.p-cta-bar');
  if (!fv || !ctaBar) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      const show = !entry.isIntersecting;
      ctaBar.classList.toggle('is-visible', show);
      ctaBar.setAttribute('aria-hidden', String(!show));
      document.body.classList.toggle('is-cta-visible', show);
    },
    { threshold: 0 }
  );

  observer.observe(fv);
})();

// モバイルメニュー
(() => {
  const spNav = document.getElementById('sp-nav');
  const openBtn = document.querySelector('[data-sp-nav-open]');
  const closeTriggers = document.querySelectorAll('[data-sp-nav-close]');

  if (!spNav || !openBtn) return;

  function openSpNav() {
    spNav.classList.add('is-open');
    spNav.setAttribute('aria-hidden', 'false');
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeSpNav() {
    spNav.classList.remove('is-open');
    spNav.setAttribute('aria-hidden', 'true');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openSpNav);

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener('click', closeSpNav);
  });

  spNav.querySelectorAll('.p-sp-nav__list a, .p-sp-nav__logo').forEach((link) => {
    link.addEventListener('click', closeSpNav);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && spNav.classList.contains('is-open')) {
      closeSpNav();
    }
  });
})();

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

    const container = modal.querySelector('.p-modal__container');
    if (container) container.scrollTop = 0;

    const focusTarget = modal.querySelector('.p-modal__title');
    if (focusTarget) {
      focusTarget.setAttribute('tabindex', '-1');
      focusTarget.focus({ preventScroll: true });
    }
  }

  function closeModal(modal) {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('is-open');
    document.body.style.overflow = '';

    const container = modal.querySelector('.p-modal__container');
    if (container) container.scrollTop = 0;
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

// FAQ
(() => {
  const faqItems = document.querySelectorAll('.p-faq__item');

  faqItems.forEach((item) => {
    const summary = item.querySelector('.p-faq__trigger');
    const answer = item.querySelector('.p-faq__answer');

    if (!summary || !answer) return;

    summary.addEventListener('click', (e) => {
      e.preventDefault();

      const isOpen = item.open;

      // アニメーション中の状態をリセット
      answer.style.height = `${answer.scrollHeight}px`;

      if (isOpen) {
        requestAnimationFrame(() => {
          answer.style.height = '0px';
        });

        answer.addEventListener(
          'transitionend',
          (event) => {
            if (event.propertyName !== 'height') return;

            item.removeAttribute('open');
          },
          { once: true }
        );
      } else {
        item.setAttribute('open', '');

        answer.style.height = '0px';

        requestAnimationFrame(() => {
          answer.style.height = `${answer.scrollHeight}px`;
        });

        answer.addEventListener(
          'transitionend',
          (event) => {
            if (event.propertyName !== 'height') return;

            answer.style.height = 'auto';
          },
          { once: true }
        );
      }
    });
  });
})();