// ========== ГЛОБАЛЬНЫЕ ХЕЛПЕРЫ ==========
document.addEventListener('DOMContentLoaded', () => {
  const isTablet = () => window.matchMedia('(max-width: 1024px)').matches;
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  // Размытие фона (не трогаем оверлеи)
  const toggleBlur = (enable, except = []) => {
    const exceptSet = new Set(except);
    [...document.body.children].forEach(el => {
      if (exceptSet.has(el)) return;
      el.classList.toggle('blur', !!enable);
    });
    document.body.classList.toggle('modal-open', !!enable);
  };

  // ========== МОДАЛКА ВХОДА ==========
  const loginButton = document.getElementById('loginButton');
  const loginModal  = document.getElementById('loginModal');

  if (loginButton && loginModal) {
    const loginClose = loginModal.querySelector('.close');

    loginButton.addEventListener('click', () => {
      loginModal.style.display = 'block';
      toggleBlur(true, [loginModal]);
    });

    loginClose?.addEventListener('click', () => {
      loginModal.style.display = 'none';
      toggleBlur(false);
    });

    window.addEventListener('click', (e) => {
      if (e.target === loginModal) {
        loginModal.style.display = 'none';
        toggleBlur(false);
      }
    });
  }

  // ========== МОДАЛКА СЕРВЕРА ==========
  const serverInfoModal = document.getElementById('serverInfoModal');
  if (serverInfoModal) {
    const serverClose       = serverInfoModal.querySelector('.close');
    const serverTitle       = serverInfoModal.querySelector('h3');
    const serverDescription = serverInfoModal.querySelectorAll('p');
    const serverVideo       = document.getElementById('serverVideo');
    const buyButton         = serverInfoModal.querySelector('.buy-button');

    const serversData = {
      SPm: {
        title: 'Вход на сервер СПм',
        desc1: 'На этом сервере проходят обходы, где игроки показывают свои постройки. Президент выбирается игроками.',
        desc2: 'Покупая доступ, вы получаете вход на сервер "СПм". Требуется лицензия Minecraft Java Edition и интернет.',
        video: 'https://www.youtube.com/embed/O3I611y8pDE',
        price: 555
      },
      SP: {
        title: 'Вход на сервер СП',
        desc1: '#СП - Это основной сервер, куда войти можно только с лицензией. За жизнью данного сервера следят большинство зрителей стримов от разных ютуберов. Игроки могут создавать свои города или вступать в общины.',
        desc2: 'Покупая данный товар, вы получаете доступ к игровому серверу "СП". Для входа и игры на данном сервере нужна лицензия Minecraft Java Edition и интернет.',
        video: 'https://www.youtube.com/embed/pF9CB4SnoTo',
        price: 3500
      }
    };

    const openServerModal = (key) => {
      const data = serversData[key];
      if (!data) return;
      if (serverTitle) serverTitle.textContent = data.title;
      if (serverDescription[0]) serverDescription[0].textContent = data.desc1;
      if (serverDescription[1]) serverDescription[1].textContent = data.desc2;
      if (serverVideo) serverVideo.src = data.video;
      if (buyButton) buyButton.textContent = `Приобрести за ${data.price}₽`;
      serverInfoModal.style.display = 'block';
      toggleBlur(true, [serverInfoModal]);
    };

    const closeServerModal = () => {
      serverInfoModal.style.display = 'none';
      if (serverVideo) serverVideo.src = '';
      toggleBlur(false);
    };

    serverClose?.addEventListener('click', closeServerModal);
    window.addEventListener('click', (e) => { if (e.target === serverInfoModal) closeServerModal(); });

    document.getElementById('SPmInfoBtn')?.addEventListener('click', () => openServerModal('SPm'));
    document.getElementById('SPInfoBtn')?.addEventListener('click', () => openServerModal('SP'));
  }

  // ========== КОПИРОВАНИЕ IP ==========
  const ipButton = document.getElementById('ipButton');
  if (ipButton) {
    ipButton.addEventListener('click', function () {
      navigator.clipboard.writeText('play.spworlds.ru').then(() => {
        this.classList.add('copied');
        setTimeout(() => this.classList.remove('copied'), 2000);
      });
    });
  }

  // ========== БУРГЕР-МЕНЮ ==========
  const burgerMenuBtn = document.getElementById('burgerMenuBtn');
  const nav = document.getElementById('mainNav');

  burgerMenuBtn?.addEventListener('click', () => {
    nav.classList.toggle('show');
  });
  if (burgerMenuBtn && nav) {
    burgerMenuBtn.addEventListener('click', () => {
      const current = getComputedStyle(nav).display;
      nav.style.display = (current === 'flex') ? 'none' : 'flex';
    });
  }

  // ========== МОБИЛЬНАЯ ПАНЕЛЬ «Контакты и Документы» ==========
  const showFooterBtn  = document.getElementById('showFooterBtn');
  const footerPanel    = document.getElementById('footerPanel');
  const footerCloseBtn = footerPanel?.querySelector('.footer-close-btn');

  const openFooter = () => {
    if (!footerPanel) return;
    footerPanel.classList.add('is-open');
    document.body.classList.add('modal-open');
    showFooterBtn?.setAttribute('aria-expanded', 'true');
    if (isTablet() && showFooterBtn) showFooterBtn.style.display = 'none';
  };

  const closeFooter = () => {
    if (!footerPanel) return;
    footerPanel.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    showFooterBtn?.setAttribute('aria-expanded', 'false');
    if (isTablet() && showFooterBtn) showFooterBtn.style.display = 'inline-flex';
  };

  if (showFooterBtn && footerPanel) {
    showFooterBtn.addEventListener('click', openFooter);
    footerCloseBtn?.addEventListener('click', closeFooter);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && footerPanel.classList.contains('is-open')) {
        closeFooter();
      }
    });

    const syncButtonVisibility = () => {
      if (!showFooterBtn) return;
      if (isTablet()) {
        if (!footerPanel.classList.contains('is-open')) {
          showFooterBtn.style.display = 'inline-flex';
        }
      } else {
        showFooterBtn.style.display = 'none';
        footerPanel.classList.remove('is-open');
        document.body.classList.remove('modal-open');
      }
    };

    window.addEventListener('resize', syncButtonVisibility);
    syncButtonVisibility();
  }

  // ========== ФИКС «ФУТЕР ВСЕГДА СНИЗУ» НА ПК ==========
  const ensureFooterAtBottom = () => {
    const existing = document.getElementById('footerSpacer');
    if (!footerPanel) { existing?.remove(); return; }

    if (!isTablet()) {
      if (!existing) {
        const spacer = document.createElement('div');
        spacer.id = 'footerSpacer';
        spacer.style.flex = '1 1 auto';
        spacer.style.minHeight = '1px';
        document.body.insertBefore(spacer, footerPanel);
      }
    } else {
      existing?.remove();
    }
  };

  ensureFooterAtBottom();
  window.addEventListener('resize', ensureFooterAtBottom);
});

// ========== КНОПКА "НАВЕРХ" ==========
const scrollBtn = document.getElementById("scrollTopBtn");

function toggleScrollBtn() {
  if (window.innerWidth <= 1024 && window.scrollY > 200) {
    scrollBtn.classList.add("show");
  } else {
    scrollBtn.classList.remove("show");
  }
}

window.addEventListener("scroll", toggleScrollBtn);
window.addEventListener("resize", toggleScrollBtn);

scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

