// スティッキーヘッダー & ページトップボタン（FV通過後〜FAQ通過前に表示）
(() => {
  const header = document.querySelector('.l-header');
  const headerSpacer = document.querySelector('.l-header-spacer');
  const toTop = document.querySelector('.p-to-top');
  const fv = document.querySelector('.p-fv');
  const faq = document.querySelector('#faq');
  if (!fv || !faq) return;

  const desktopMq = window.matchMedia('(min-width: 1101px)');
  let pastFv = false;
  let pastFaq = false;

  function updateToTop() {
    if (!toTop) return;

    const show = desktopMq.matches && pastFv && !pastFaq;
    toTop.classList.toggle('is-visible', show);
    toTop.setAttribute('aria-hidden', String(!show));
  }

  function showStickyHeader() {
    header.classList.remove('is-sticky-visible');
    void header.offsetHeight;

    requestAnimationFrame(() => {
      header.classList.add('is-sticky-visible');
    });
  }

  function deactivateSticky() {
    if (!header || !headerSpacer) return;

    header.classList.remove('is-sticky', 'is-sticky-visible', 'is-hidden');
    headerSpacer.classList.remove('is-active');
    headerSpacer.style.removeProperty('--header-spacer-height');
  }

  function activateSticky() {
    if (!header || !headerSpacer) return;

    const isFirstSticky = !header.classList.contains('is-sticky');

    if (isFirstSticky) {
      headerSpacer.style.setProperty('--header-spacer-height', `${header.offsetHeight}px`);
      headerSpacer.classList.add('is-active');
      header.classList.add('is-sticky');
      void header.offsetHeight;
    }

    if (pastFaq) {
      header.classList.remove('is-sticky-visible');
      header.classList.add('is-hidden');
      return;
    }

    header.classList.remove('is-hidden');

    if (isFirstSticky || !header.classList.contains('is-sticky-visible')) {
      showStickyHeader();
    }
  }

  function updateHeader() {
    if (!header || !headerSpacer || !desktopMq.matches || !pastFv) {
      deactivateSticky();
      return;
    }

    activateSticky();
  }

  function updateVisibility() {
    updateHeader();
    updateToTop();
  }

  const fvObserver = new IntersectionObserver(
    ([entry]) => {
      pastFv = !entry.isIntersecting;
      updateVisibility();
    },
    { threshold: 0 }
  );

  const faqObserver = new IntersectionObserver(
    ([entry]) => {
      pastFaq = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      updateVisibility();
    },
    { threshold: 0 }
  );

  fvObserver.observe(fv);
  faqObserver.observe(faq);
  desktopMq.addEventListener('change', updateVisibility);

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();

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
  const panelsWrap = document.querySelector('.p-villa__panels');
  const panels = document.querySelectorAll('[data-villa-panel]');
  const TRANSITION_MS = 450;

  if (!tabs.length || !panels.length || !panelsWrap) return;

  let isSwitching = false;

  function setPanelState(panel, isActive) {
    panel.classList.toggle('is-active', isActive);
    panel.setAttribute('aria-hidden', String(!isActive));
    panel.inert = !isActive;
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.villaTab;
      const currentPanel = panelsWrap.querySelector('.p-villa__panel.is-active');
      const nextPanel = panelsWrap.querySelector(`[data-villa-panel="${target}"]`);

      if (!nextPanel || currentPanel === nextPanel || isSwitching) return;

      isSwitching = true;
      panelsWrap.classList.add('is-switching');

      tabs.forEach((item) => {
        const isActive = item.dataset.villaTab === target;
        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-selected', String(isActive));
        item.tabIndex = isActive ? 0 : -1;
      });

      setPanelState(currentPanel, false);
      setPanelState(nextPanel, true);

      window.setTimeout(() => {
        isSwitching = false;
        panelsWrap.classList.remove('is-switching');
      }, TRANSITION_MS);
    });
  });
})();

// ギャラリー画像切り替え（ヴィラ・ダイニング共通）
(() => {
  function getImageData(img) {
    return {
      src: img.getAttribute('src') || '',
      alt: img.getAttribute('alt') || '',
      width: img.getAttribute('width'),
      height: img.getAttribute('height')
    };
  }

  function createImage(data) {
    const img = document.createElement('img');
    img.src = data.src;
    img.alt = data.alt;
    if (data.width) img.setAttribute('width', data.width);
    if (data.height) img.setAttribute('height', data.height);
    img.decoding = 'async';
    return img;
  }

  function getCurrentImg(mainImage) {
    return mainImage.querySelector('img:last-child');
  }

  function switchMainImage(mainImage, targetData) {
    if (mainImage.classList.contains('is-switching')) return;

    const currentImg = getCurrentImg(mainImage);
    if (!currentImg || currentImg.getAttribute('src') === targetData.src) return;

    const nextImg = createImage(targetData);
    nextImg.classList.add('is-entering');
    mainImage.classList.add('is-switching');
    mainImage.appendChild(nextImg);

    const startTransition = () => {
      requestAnimationFrame(() => {
        currentImg.classList.add('is-leaving');
        nextImg.classList.remove('is-entering');
      });
    };

    if (nextImg.complete) {
      startTransition();
    } else {
      nextImg.addEventListener('load', startTransition, { once: true });
      nextImg.addEventListener('error', startTransition, { once: true });
    }

    let ended = 0;

    function onTransitionEnd(event) {
      if (event.propertyName !== 'opacity') return;

      ended += 1;
      if (ended < 2) return;

      currentImg.removeEventListener('transitionend', onTransitionEnd);
      nextImg.removeEventListener('transitionend', onTransitionEnd);
      currentImg.remove();
      nextImg.classList.remove('is-leaving', 'is-entering');
      mainImage.classList.remove('is-switching');
    }

    currentImg.addEventListener('transitionend', onTransitionEnd);
    nextImg.addEventListener('transitionend', onTransitionEnd);
  }

  function initImageGallery({ containers, mainImageSelector, itemSelector, mainItemAttr }) {
    containers.forEach((container) => {
      const mainImage = container.querySelector(mainImageSelector);
      const galleryItems = container.querySelectorAll(itemSelector);
      const defaultImg = mainImage?.querySelector('img');

      if (!mainImage || !defaultImg || !galleryItems.length) return;

      const defaultData = getImageData(defaultImg);
      const displaySize = {
        width: defaultData.width,
        height: defaultData.height
      };

      const clearActive = () => {
        galleryItems.forEach((galleryItem) => {
          galleryItem.classList.remove('is-active');
        });
      };

      const setActiveBySrc = (src) => {
        galleryItems.forEach((galleryItem) => {
          const itemSrc = galleryItem.querySelector('img')?.getAttribute('src') || '';
          galleryItem.classList.toggle('is-active', itemSrc === src);
        });
      };

      galleryItems.forEach((item) => {
        const galleryImg = item.querySelector('img');
        if (!galleryImg) return;

        const galleryData = {
          src: galleryImg.getAttribute('src') || '',
          alt: galleryImg.getAttribute('alt') || '',
          ...displaySize
        };

        item.setAttribute('role', 'button');
        item.tabIndex = 0;

        const isMainItem = item.hasAttribute(mainItemAttr);

        const activate = () => {
          const currentSrc = getCurrentImg(mainImage)?.getAttribute('src') || '';

          if (isMainItem) {
            if (currentSrc === defaultData.src) return;

            clearActive();
            switchMainImage(mainImage, defaultData);
            return;
          }

          if (currentSrc === galleryData.src) {
            clearActive();
            switchMainImage(mainImage, defaultData);
            return;
          }

          setActiveBySrc(galleryData.src);
          switchMainImage(mainImage, galleryData);
        };

        item.addEventListener('click', activate);
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            activate();
          }
        });
      });
    });
  }

  initImageGallery({
    containers: document.querySelectorAll('.p-villa__panel'),
    mainImageSelector: '.p-villa__main-image',
    itemSelector: '.p-villa__gallery-item',
    mainItemAttr: 'data-villa-main'
  });

  const diningBody = document.querySelector('.p-dining__body');
  if (diningBody) {
    initImageGallery({
      containers: [diningBody],
      mainImageSelector: '.p-dining__main-image',
      itemSelector: '.p-dining__gallery-item, .p-dining__thumbs-item',
      mainItemAttr: 'data-gallery-main'
    });
  }
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

// conceptセクション（テキスト固定・スクロール連動で画像を順番に表示）
(() => {
  const concept = document.querySelector('[data-concept]');
  if (!concept) return;

  const stage = concept.querySelector('.p-concept__stage');
  const revealOrder = [
    '.p-concept__img--1',
    '.p-concept__img--2',
    '.p-concept__img--4',
    '.p-concept__img--3',
    '.p-concept__img--5',
  ]
    .map((selector) => concept.querySelector(selector))
    .filter(Boolean);

  if (!stage || !revealOrder.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    revealOrder.forEach((img) => img.classList.add('is-visible'));
    return;
  }

  let ticking = false;

  function updateConceptImages() {
    const rect = concept.getBoundingClientRect();
    const scrollRange = concept.offsetHeight - stage.offsetHeight;
    const count = revealOrder.length;

    if (scrollRange <= 0) {
      revealOrder.forEach((img) => img.classList.add('is-visible'));
      return;
    }

    // ピンが始まる前（セクション上端がビューポート内）では画像を非表示
    if (rect.top > 0) {
      revealOrder.forEach((img) => img.classList.remove('is-visible'));
      return;
    }

    const scrolled = Math.max(0, Math.min(scrollRange, -rect.top));
    const progress = scrolled / scrollRange;

    revealOrder.forEach((img, index) => {
      const revealAt = (index + 1) / (count + 1);
      img.classList.toggle('is-visible', progress >= revealAt);
    });
  }

  function onConceptScroll() {
    if (ticking) return;

    ticking = true;
    requestAnimationFrame(() => {
      updateConceptImages();
      ticking = false;
    });
  }

  window.addEventListener('scroll', onConceptScroll, { passive: true });
  window.addEventListener('resize', onConceptScroll, { passive: true });
  updateConceptImages();
})();
