/* ===================================================
   UI INTERACTION, DATA-DRIVEN CMS RENDERING & ROUTING
   (Optimized Idle-Stop rAF & Studio Live Preview)
=================================================== */

const getEl = (id) => document.getElementById(id);

const elements = {
  get floatingContainer() { return getEl('floating-buttons-container'); },
  get pagesContainer() { return getEl('pages-container'); },
  get windowContent() { return getEl('window-content'); },
  get desktopArea() { return getEl('desktop-area'); },
  get windowTitleText() { return getEl('window-title-text'); },
  get menuLeft() { return document.querySelector('.menu-left'); }
};

const isStudioPreview = (() => {
  try {
    return new URLSearchParams(window.location.search).get('studio_preview') === '1';
  } catch (e) {
    return false;
  }
})();

// 🌐 語言狀態管理：依據 URL 路徑決定初始語系
function getInitialLang() {
  const path = window.location.pathname;
  if (path.includes('/zh-hant')) return 'zh_hant';
  if (path.includes('/zh-hans')) return 'zh_hans';
  return 'en';
}

let currentLang = getInitialLang();
let activePageId = null;
let siteContent = null;
let previewMessageReceived = false;
let cachedCenterBtn = null;
let cachedRingButtons = [];
let cachedDesktopRect = null;

function getDesktopRect() {
  const desktopArea = elements.desktopArea;
  if (!desktopArea) return null;
  if (!cachedDesktopRect || cachedDesktopRect.width === 0 || cachedDesktopRect.height === 0) {
    cachedDesktopRect = desktopArea.getBoundingClientRect();
  }
  return cachedDesktopRect;
}

window.addEventListener('resize', () => {
  cachedDesktopRect = null;
  positionButtons(true);
});
window.addEventListener('scroll', () => { cachedDesktopRect = null; }, true);

function resolveIconSvg(iconName) {
  if (typeof MAC_ICONS !== 'undefined' && iconName && MAC_ICONS[iconName]) {
    return MAC_ICONS[iconName];
  }
  if (typeof MAC_ICONS !== 'undefined') {
    return MAC_ICONS.about || '';
  }
  return '';
}

function getTranslation(key) {
  if (typeof TRANSLATIONS === 'undefined') return key;
  return TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS['en']?.[key] || key;
}

function syncGlobalsFromContent(content) {
  const nextTranslations = { en: {}, zh_hant: {}, zh_hans: {} };
  const tabs = Array.isArray(content?.tabs) ? content.tabs : [];

  const nextPages = tabs.map((tab) => {
    const labels = tab.labels || {};
    ['en', 'zh_hant', 'zh_hans'].forEach((loc) => {
      nextTranslations[loc][tab.id] = labels[loc] || labels.en || tab.id;
    });

    return {
      id: tab.id,
      iconKey: tab.icon || 'about',
      icon: resolveIconSvg(tab.icon),
      isCenter: Boolean(tab.isCenter),
      showInDesktop: tab.showInDesktop !== false,
      labels,
      pageTitle: tab.pageTitle || {},
      blocks: tab.blocks || {}
    };
  });

  if (typeof TRANSLATIONS !== 'undefined') {
    TRANSLATIONS.en = nextTranslations.en;
    TRANSLATIONS.zh_hant = nextTranslations.zh_hant;
    TRANSLATIONS.zh_hans = nextTranslations.zh_hans;
  } else {
    window.TRANSLATIONS = nextTranslations;
  }

  PAGES = nextPages;
  window.PAGES = nextPages;
}

function renderMenuBar() {
  const menuLeft = elements.menuLeft;
  const menuLinks = siteContent?.site?.menuLinks;
  if (!menuLeft || !Array.isArray(menuLinks)) return;

  menuLeft.innerHTML = '';

  menuLinks.forEach((item) => {
    if (!item) return;
    const span = document.createElement('span');
    span.className = 'menu-item';
    if (item.id) span.id = item.id;
    if (item.bold) span.style.fontWeight = 'bold';

    const labelText = item.labels?.[currentLang] || item.labels?.en || item.id || '';
    span.textContent = labelText;

    span.addEventListener('click', (e) => {
      e.preventDefault();
      if (item.action === 'home') {
        goHome(true);
      } else if (item.action === 'page' && item.pageId) {
        window.openPortfolioPage(item.pageId);
      } else if (item.action === 'url' && item.url) {
        const href = String(item.url).trim();
        if (/^https?:\/\//i.test(href)) {
          window.open(href, '_blank', 'noopener,noreferrer');
        } else if (href.startsWith('/')) {
          window.location.href = href;
        }
      }
    });

    menuLeft.appendChild(span);
  });
}

// 渲染桌面圓形按鈕
function renderUI() {
  const container = elements.floatingContainer;
  if (!container) return;
  container.innerHTML = '';
  cachedCenterBtn = null;
  cachedRingButtons = [];

  if (typeof PAGES === 'undefined' || !Array.isArray(PAGES)) return;

  const desktopTabs = PAGES.filter((p) => p.showInDesktop !== false);
  const centerTab = desktopTabs.find((p) => p.isCenter) || null;
  const ringTabs = desktopTabs.filter((p) => p !== centerTab);
  const totalRing = ringTabs.length;
  let ringIndex = 0;

  desktopTabs.forEach((page) => {
    const btn = document.createElement('a');

    // 採用 URLSearchParams 安全組合網址參數
    const url = new URL(window.location.href);
    url.searchParams.set('page', page.id);
    btn.href = `${url.pathname}?${url.searchParams.toString()}`;

    const isCenter = page === centerTab;
    const pageLabel = getTranslation(page.id);

    if (isCenter) {
      btn.className = 'circle-btn center-btn label-bottom';
      cachedCenterBtn = btn;
    } else {
      const angle = totalRing > 0
        ? (ringIndex / totalRing) * Math.PI * 2 - (Math.PI / 2)
        : 0;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const labelSideClass = cos < -0.01 ? 'label-left' : 'label-right';

      btn.className = `circle-btn ${labelSideClass}`;
      cachedRingButtons.push({ el: btn, cos, sin });
      ringIndex++;
    }

    btn.dataset.id = page.id;

    const iconDiv = document.createElement('div');
    iconDiv.className = 'icon';
    iconDiv.innerHTML = page.icon;

    const labelSpan = document.createElement('span');
    labelSpan.className = 'label';
    labelSpan.textContent = pageLabel;

    btn.appendChild(iconDiv);
    btn.appendChild(labelSpan);

    // 允許 Ctrl/Cmd/中鍵 開啟新分頁
    btn.onclick = (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      loadAndOpenPage(page);
    };

    container.appendChild(btn);
  });

  const langSelect = getEl('lang-select');
  if (langSelect) langSelect.value = currentLang;

  positionButtons(true);
}

function applySiteContent(content) {
  if (!content || typeof content !== 'object') return;
  siteContent = content;
  syncGlobalsFromContent(content);
  renderMenuBar();
  renderUI();
}

async function loadSiteContent() {
  if (isStudioPreview) {
    try {
      const draftRaw = localStorage.getItem('studio_draft_content');
      if (draftRaw) {
        const draft = JSON.parse(draftRaw);
        if (draft && Array.isArray(draft.tabs)) {
          applySiteContent(draft);
          return;
        }
      }
    } catch (e) {
      console.warn('Could not parse studio_draft_content, falling back to JSON file:', e);
    }
  }

  try {
    const response = await fetch('/data/site-content.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!previewMessageReceived) {
      applySiteContent(data);
    }
  } catch (error) {
    console.error('Failed to load /data/site-content.json:', error);
    renderUI();
  }
}

// 🌐 下拉選單觸發語言切換
window.changeLanguage = function (selectedLang) {
  currentLang = selectedLang;

  try {
    localStorage.setItem('site_lang_v2', currentLang);
    sessionStorage.setItem('mac_boot_done', '1');
    document.cookie = `site_lang_v2=${currentLang}; path=/; max-age=31536000; SameSite=Lax`;
    document.cookie = `site_lang=${currentLang}; path=/; max-age=31536000; SameSite=Lax`;
  } catch (e) { /* ignore storage error */ }

  if (!isStudioPreview) {
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    const normalizedPath = currentPath.replace(/\/index\.html$/, '').replace(/\/$/, '');
    const isHomePage = ['', '/zh-hant', '/zh-hans'].includes(normalizedPath);

    if (isHomePage) {
      let targetUrl = '';
      if (selectedLang === 'zh_hant' && !currentPath.includes('/zh-hant')) {
        targetUrl = `/zh-hant/${currentSearch}`;
      } else if (selectedLang === 'zh_hans' && !currentPath.includes('/zh-hans')) {
        targetUrl = `/zh-hans/${currentSearch}`;
      } else if (selectedLang === 'en' && (currentPath.includes('/zh-hant') || currentPath.includes('/zh-hans'))) {
        targetUrl = `/${currentSearch}`;
      }

      if (targetUrl) {
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 0);
        return;
      }
    } else {
      const cleanPath = currentPath.replace(/^\/(zh-hant|zh-hans)/, '');
      let newPath = cleanPath;
      if (selectedLang === 'zh_hant') newPath = `/zh-hant${cleanPath}`;
      else if (selectedLang === 'zh_hans') newPath = `/zh-hans${cleanPath}`;

      history.pushState({ pageId: activePageId }, '', `${newPath}${currentSearch}`);
    }
  }

  renderMenuBar();
  renderUI();

  if (activePageId && Array.isArray(PAGES)) {
    const currentPage = PAGES.find((p) => p.id === activePageId);
    if (currentPage) loadAndOpenPage(currentPage, false);
  }
};

// 全域頁面導航輔助函式（供頁面內按鈕呼叫）
window.openPortfolioPage = function (pageId) {
  if (!Array.isArray(PAGES)) return;
  const targetPage = PAGES.find((p) => p.id === pageId);
  if (targetPage) loadAndOpenPage(targetPage);
};

// 由 JSON 資料渲染並開啟頁面
function loadAndOpenPage(page, pushHistory = true, preserveScroll = false) {
  if (!page) return;

  if (typeof window.onPageUnmount === 'function') {
    try { window.onPageUnmount(); } catch (e) { console.error('Unmount error:', e); }
    window.onPageUnmount = null;
  }

  const prevScrollTop = preserveScroll && elements.pagesContainer ? elements.pagesContainer.scrollTop : 0;

  activePageId = page.id;
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }

  const pageLabel = getTranslation(page.id);
  const pageTitle = page.pageTitle?.[currentLang] || page.pageTitle?.en || pageLabel;

  if (elements.windowTitleText) {
    elements.windowTitleText.innerText = `PORTFOLIO_VIEWER.EXE // ${pageLabel.toUpperCase()}`;
  }

  elements.windowContent?.classList.add('active');
  elements.floatingContainer?.classList.add('is-hidden');

  if (elements.pagesContainer) {
    const localeBlocks = page.blocks && Array.isArray(page.blocks[currentLang]) && page.blocks[currentLang].length > 0
      ? page.blocks[currentLang]
      : (page.blocks?.en || []);

    if (window.SiteRenderer && typeof window.SiteRenderer.renderBlocks === 'function') {
      elements.pagesContainer.innerHTML = window.SiteRenderer.renderBlocks(localeBlocks, pageTitle);
    } else {
      elements.pagesContainer.innerHTML = '<div style="padding:20px; text-align:center;">Renderer unavailable.</div>';
    }

    elements.pagesContainer.scrollTop = preserveScroll ? prevScrollTop : 0;

    // 執行 custom_html 中可能內含的腳本
    const oldScripts = Array.from(elements.pagesContainer.querySelectorAll('script'));
    for (const oldScript of oldScripts) {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
      if (oldScript.src) {
        newScript.src = oldScript.src;
        oldScript.parentNode.replaceChild(newScript, oldScript);
      } else {
        newScript.textContent = `(function(){\n${oldScript.textContent}\n})();`;
        oldScript.parentNode.replaceChild(newScript, oldScript);
      }
    }
  }

  if (pushHistory) {
    const url = new URL(window.location.href);
    url.searchParams.set('page', page.id);
    if (window.location.search !== `?${url.searchParams.toString()}`) {
      history.pushState({ pageId: page.id }, '', `${url.pathname}?${url.searchParams.toString()}`);
    }
  }
}

// 返回主桌面
function goHome(pushHistory = true) {
  const shouldPush = typeof pushHistory === 'boolean' ? pushHistory : true;

  if (typeof window.onPageUnmount === 'function') {
    try { window.onPageUnmount(); } catch (e) { console.error('Unmount error:', e); }
    window.onPageUnmount = null;
  }

  activePageId = null;
  elements.windowContent?.classList.remove('active');
  if (elements.pagesContainer) elements.pagesContainer.innerHTML = '';
  elements.floatingContainer?.classList.remove('is-hidden');

  if (shouldPush && window.location.search) {
    const url = new URL(window.location.href);
    url.searchParams.delete('page');
    const newSearch = url.searchParams.toString();
    const newUrl = newSearch ? `${url.pathname}?${newSearch}` : url.pathname;
    history.pushState({}, '', newUrl);
  }

  positionButtons(true);
}

/* 浮動按鈕動畫邏輯（滑鼠靜止時自動休眠，零閒置消耗） */
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
let animFrameId = null;

function handleMouseMove(e) {
  if (activePageId) return;
  const rect = getDesktopRect();
  if (!rect || rect.width === 0 || rect.height === 0) return;
  mouseX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
  mouseY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
  startAnimationOnce();
}

function positionButtons(snapToTarget = false) {
  const desktopRect = getDesktopRect();
  if (!desktopRect || desktopRect.width === 0) return false;

  if (snapToTarget) {
    targetX = mouseX;
    targetY = mouseY;
  }

  const radius = Math.min(desktopRect.width, desktopRect.height) * 0.26;
  const moveAmount = 14;
  const offsetX = targetX * moveAmount;
  const offsetY = targetY * moveAmount;

  if (cachedCenterBtn) {
    cachedCenterBtn.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
  }

  for (let i = 0; i < cachedRingButtons.length; i++) {
    const item = cachedRingButtons[i];
    const x = item.cos * radius + offsetX;
    const y = item.sin * radius + offsetY;
    item.el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  return true;
}

function animateFloatingButtons() {
  if (activePageId || (!cachedCenterBtn && cachedRingButtons.length === 0) || !elements.desktopArea) {
    animFrameId = null;
    return;
  }

  const dx = mouseX - targetX;
  const dy = mouseY - targetY;

  targetX += dx * 0.08;
  targetY += dy * 0.08;

  const didPosition = positionButtons(false);
  if (!didPosition) {
    animFrameId = requestAnimationFrame(animateFloatingButtons);
    return;
  }

  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
    targetX = mouseX;
    targetY = mouseY;
    positionButtons(true);
    animFrameId = null;
    return;
  }

  animFrameId = requestAnimationFrame(animateFloatingButtons);
}

function startAnimationOnce() {
  if (!animFrameId && !activePageId) {
    animFrameId = requestAnimationFrame(animateFloatingButtons);
  }
}

// Studio 即時預覽 postMessage 監聽
window.addEventListener('message', (event) => {
  if (!isStudioPreview) return;
  if (event.origin !== window.location.origin && event.origin !== 'null') return;

  const payload = event.data;
  if (!payload || payload.type !== 'STUDIO_PREVIEW_UPDATE') return;

  previewMessageReceived = true;

  if (payload.lang && ['en', 'zh_hant', 'zh_hans'].includes(payload.lang)) {
    currentLang = payload.lang;
  }

  if (payload.content && Array.isArray(payload.content.tabs)) {
    applySiteContent(payload.content);
  } else {
    renderMenuBar();
    renderUI();
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'activePageId')) {
    if (payload.activePageId) {
      const targetPage = PAGES.find((p) => p.id === payload.activePageId);
      if (targetPage) {
        const samePage = activePageId === targetPage.id;
        loadAndOpenPage(targetPage, false, samePage);
      } else {
        goHome(false);
      }
    } else {
      goHome(false);
    }
  } else if (activePageId) {
    const currentPage = PAGES.find((p) => p.id === activePageId);
    if (currentPage) {
      loadAndOpenPage(currentPage, false, true);
    }
  }
});

// 初始化應用程式
async function initApp() {
  if (isStudioPreview) {
    const webgl = getEl('webgl-container');
    const macOs = getEl('mac-os');
    if (webgl) webgl.style.display = 'none';
    if (macOs) macOs.classList.add('active');
  }

  elements.desktopArea?.addEventListener('mousemove', handleMouseMove, { passive: true });
  getEl('close-window-btn')?.addEventListener('click', (e) => { e.preventDefault(); goHome(true); });

  // 靜態 HTML 選單後備綁定（在 JSON 載入完成前即生效）
  getEl('menu-home')?.addEventListener('click', (e) => { e.preventDefault(); goHome(true); });
  getEl('menu-cv')?.addEventListener('click', (e) => { e.preventDefault(); window.openPortfolioPage('cv'); });
  getEl('menu-contact')?.addEventListener('click', (e) => { e.preventDefault(); window.openPortfolioPage('contact'); });

  await loadSiteContent();
  checkInitialUrl();
}

// 時鐘（僅在分鐘變化時更新 DOM）
let lastClockText = '';
function updateClock() {
  const clockEl = getEl('clock');
  if (clockEl) {
    const now = new Date();
    const formatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (formatted !== lastClockText) {
      lastClockText = formatted;
      clockEl.innerText = formatted;
    }
  }
}
updateClock();
setInterval(updateClock, 5000);

// 🎯 1. 監聽瀏覽器的「上一頁 / 下一頁」按鈕
window.addEventListener('popstate', (event) => {
  const pageId = event.state?.pageId || new URLSearchParams(window.location.search).get('page');
  if (pageId && Array.isArray(PAGES)) {
    const targetPage = PAGES.find((p) => p.id === pageId);
    if (targetPage) loadAndOpenPage(targetPage, false);
  } else {
    goHome(false);
  }
});

// 🎯 2. 初始化時檢查 URL 是否帶有 ?page=xxx 參數
function checkInitialUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialPageId = urlParams.get('page');

  if (initialPageId && Array.isArray(PAGES)) {
    const targetPage = PAGES.find((p) => p.id === initialPageId);
    if (targetPage) {
      history.replaceState({ pageId: initialPageId }, '', window.location.href);
      loadAndOpenPage(targetPage, false);
    }
  }
}

// 安全啟動點
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
