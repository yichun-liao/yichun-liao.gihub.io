/* ===================================================
   UI INTERACTION, MULTI-LANG ROUTING & ASYNC FETCHING
   (Optimized Idle-Stop rAF & Welcome Card Support)
=================================================== */

// 💡 動態 Getters 防範 <script> 於 <head> 載入時取得 null
const getEl = (id) => document.getElementById(id);

const elements = {
  get floatingContainer() { return getEl('floating-buttons-container'); },
  get pagesContainer() { return getEl('pages-container'); },
  get windowContent() { return getEl('window-content'); },
  get desktopArea() { return getEl('desktop-area'); },
  get windowTitleText() { return getEl('window-title-text'); }
};

// 🌐 語言狀態管理：100% 依據 URL 路徑，網址沒有語系就預設為英文 'en'
function getInitialLang() {
  const path = window.location.pathname;

  if (path.includes('/zh-hant')) return 'zh_hant';
  if (path.includes('/zh-hans')) return 'zh_hans';

  return 'en';
}

let currentLang = getInitialLang();
let activePageId = null;
let cachedCenterBtn = null;
let cachedRingButtons = [];
let currentFetchController = null;

// 快取 desktopRect
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

function getTranslation(key) {
  if (typeof TRANSLATIONS === 'undefined') return key;
  return TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS['en']?.[key] || key;
}

// 渲染桌面圓形按鈕
function renderUI() {
  const container = elements.floatingContainer;
  if (!container) return;
  container.innerHTML = '';
  cachedCenterBtn = null;
  cachedRingButtons = [];

  if (typeof PAGES === 'undefined') return;

  const ringPages = PAGES.filter((p) => p.id !== 'about');
  const totalRing = ringPages.length;
  let ringIndex = 0;

  PAGES.forEach((page) => {
    const btn = document.createElement('a');

    // 💡 採用 URLSearchParams 安全組合網址參數，避免雙問號 Bug
    const url = new URL(window.location.href);
    url.searchParams.set('page', page.id);
    btn.href = `${url.pathname}?${url.searchParams.toString()}`;

    const isCenter = page.id === 'about';
    const pageLabel = getTranslation(page.id);

    if (isCenter) {
      btn.className = 'circle-btn center-btn label-bottom';
      cachedCenterBtn = btn;
    } else {
      const angle = (ringIndex / totalRing) * Math.PI * 2 - (Math.PI / 2);
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const labelSideClass = cos < -0.01 ? 'label-left' : 'label-right';

      btn.className = `circle-btn ${labelSideClass}`;
      cachedRingButtons.push({ el: btn, cos, sin });
      ringIndex++;
    }

    btn.dataset.id = page.id;
    btn.innerHTML = `
      <div class="icon">${page.icon}</div>
      <span class="label">${pageLabel}</span>
    `;

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

// 🌐 下拉選單觸發語言切換
window.changeLanguage = function (selectedLang) {
  currentLang = selectedLang;

  try {
    localStorage.setItem('site_lang_v2', currentLang);
    sessionStorage.setItem('mac_boot_done', '1');
    document.cookie = `site_lang_v2=${currentLang}; path=/; max-age=31536000; SameSite=Lax`;
    document.cookie = `site_lang=${currentLang}; path=/; max-age=31536000; SameSite=Lax`;
  } catch (e) { /* ignore storage error */ }

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

  renderUI();

  if (activePageId && typeof PAGES !== 'undefined') {
    const currentPage = PAGES.find((p) => p.id === activePageId);
    if (currentPage) loadAndOpenPage(currentPage, false);
  }
};

// 全域頁面導航輔助函式（供頁面內按鈕呼叫）
window.openPortfolioPage = function (pageId) {
  if (typeof PAGES === 'undefined') return;
  const targetPage = PAGES.find((p) => p.id === pageId);
  if (targetPage) loadAndOpenPage(targetPage);
};

// 非同步加載與開啟頁面
async function loadAndOpenPage(page, pushHistory = true) {
  // 觸發舊頁面的清理鉤子（若有的話）
  if (typeof window.onPageUnmount === 'function') {
    try { window.onPageUnmount(); } catch (e) { console.error('Unmount error:', e); }
    window.onPageUnmount = null;
  }

  if (currentFetchController) {
    currentFetchController.abort();
  }
  currentFetchController = new AbortController();

  try {
    activePageId = page.id;
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }

    const pageLabel = getTranslation(page.id);

    if (elements.windowTitleText) {
      elements.windowTitleText.innerText = `PORTFOLIO_VIEWER.EXE // ${pageLabel.toUpperCase()}`;
    }

    if (elements.pagesContainer) {
      elements.pagesContainer.innerHTML = '<div style="padding:20px; text-align:center;">Loading content...</div>';
    }

    elements.windowContent?.classList.add('active');
    elements.floatingContainer?.classList.add('is-hidden');

    const filePath = `/pages/${currentLang}/${page.id}.html`;

    const response = await fetch(filePath, {
      signal: currentFetchController.signal,
      headers: { 'Accept-Language': currentLang }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const htmlContent = await response.text();

    if (activePageId !== page.id) return;

    if (elements.pagesContainer) {
      elements.pagesContainer.innerHTML = htmlContent;
      elements.pagesContainer.scrollTop = 0;

      const oldScripts = Array.from(elements.pagesContainer.querySelectorAll('script'));
      for (const oldScript of oldScripts) {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));

        if (oldScript.src) {
          await new Promise((resolve, reject) => {
            newScript.onload = resolve;
            newScript.onerror = () => reject(new Error(`Failed to load script: ${oldScript.src}`));
            newScript.src = oldScript.src;
            oldScript.parentNode.replaceChild(newScript, oldScript);
          });
        } else {
          // 💡 將行內腳本包裹在 IIFE 中，避免二次開啟頁面時 const/let 變數重複宣告崩潰
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
  } catch (error) {
    if (error.name === 'AbortError') return;
    if (activePageId !== page.id) return;

    console.error('Error loading page:', error);
    if (elements.pagesContainer) {
      elements.pagesContainer.innerHTML = `
        <h2 class="page-title">Error Loading Page</h2>
        <div class="page-body">
          <p>Could not fetch file: <code>/pages/${currentLang}/${page.id}.html</code>.</p>
          <p>Please check if the file exists in the directory.</p>
        </div>
      `;
    }
  } finally {
    currentFetchController = null;
  }
}

// 返回主桌面
function goHome(pushHistory = true) {
  const shouldPush = typeof pushHistory === 'boolean' ? pushHistory : true;

  // 觸發舊頁面的清理鉤子
  if (typeof window.onPageUnmount === 'function') {
    try { window.onPageUnmount(); } catch (e) { console.error('Unmount error:', e); }
    window.onPageUnmount = null;
  }

  if (currentFetchController) {
    currentFetchController.abort();
    currentFetchController = null;
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

// 初始化應用程式
function initApp() {
  elements.desktopArea?.addEventListener('mousemove', handleMouseMove, { passive: true });

  getEl('menu-home')?.addEventListener('click', (e) => { e.preventDefault(); goHome(true); });
  getEl('close-window-btn')?.addEventListener('click', (e) => { e.preventDefault(); goHome(true); });

  getEl('menu-cv')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof PAGES !== 'undefined') {
      const cvPage = PAGES.find((p) => p.id === 'cv');
      if (cvPage) loadAndOpenPage(cvPage);
    }
  });

  getEl('menu-contact')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof PAGES !== 'undefined') {
      const contactPage = PAGES.find((p) => p.id === 'contact');
      if (contactPage) loadAndOpenPage(contactPage);
    }
  });

  renderUI();
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
  const pageId = event.state?.pageId;
  if (pageId && typeof PAGES !== 'undefined') {
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

  if (initialPageId && typeof PAGES !== 'undefined') {
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
