/* ===================================================
   UI INTERACTION, MULTI-LANG ROUTING & ASYNC FETCHING
   (Production-Ready Version - Final Patch)
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

  // 只要網址是根目錄 yichunliao.com/，無條件回傳 'en'
  return 'en';
}

let currentLang = getInitialLang();
let activePageId = null;
let cachedButtons = []; 
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

window.addEventListener('resize', () => { cachedDesktopRect = null; });
window.addEventListener('scroll', () => { cachedDesktopRect = null; }, true);

function getTranslation(pageId) {
  if (typeof TRANSLATIONS === 'undefined') return pageId;
  return TRANSLATIONS[currentLang]?.[pageId] || TRANSLATIONS['en']?.[pageId] || pageId;
}

// 渲染桌面圓形按鈕
function renderUI() {
  const container = elements.floatingContainer;
  if (!container) return;
  container.innerHTML = '';

  if (typeof PAGES === 'undefined') return;

  PAGES.forEach((page) => {
    const btn = document.createElement('a');
    
    // 💡 修復：採用 URLSearchParams 安全組合網址參數，避免雙問號 Bug
    const url = new URL(window.location.href);
    url.searchParams.set('page', page.id);
    btn.href = `${url.pathname}?${url.searchParams.toString()}`;
    
    const isCenter = page.id === 'about';
    btn.className = `circle-btn ${isCenter ? 'center-btn label-bottom' : 'label-right'}`;
    btn.dataset.id = page.id;

    const pageLabel = getTranslation(page.id);

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

  cachedButtons = Array.from(container.querySelectorAll('.circle-btn'));

  const langSelect = getEl('lang-select');
  if (langSelect) langSelect.value = currentLang;
}

// 🌐 下拉選單觸發語言切換
window.changeLanguage = function(selectedLang) {
  currentLang = selectedLang;

  try {
    localStorage.setItem('site_lang_v2', currentLang);
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
      }, 10);
      return;
    }
  } else {
    let cleanPath = currentPath.replace(/^\/(zh-hant|zh-hans)/, '');
    let newPath = cleanPath;
    if (selectedLang === 'zh_hant') newPath = `/zh-hant${cleanPath}`;
    else if (selectedLang === 'zh_hans') newPath = `/zh-hans${cleanPath}`;

    history.pushState({ pageId: activePageId }, '', `${newPath}${currentSearch}`);
  }

  renderUI();

  if (activePageId && typeof PAGES !== 'undefined') {
    const currentPage = PAGES.find(p => p.id === activePageId);
    if (currentPage) loadAndOpenPage(currentPage, false);
  }
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
    const pageLabel = getTranslation(page.id);
    
    if (elements.windowTitleText) {
      elements.windowTitleText.innerText = `PORTFOLIO_VIEWER.EXE // ${pageLabel.toUpperCase()}`;
    }
    
    if (elements.pagesContainer) {
      elements.pagesContainer.innerHTML = `<div style="padding:20px; text-align:center;">Loading content...</div>`;
    }
    
    elements.windowContent?.classList.add('active');
    elements.floatingContainer?.classList.add('is-hidden');

    const filePath = `/pages/${currentLang}/${page.id}.html`;

    // 在 loadAndOpenPage 中 fetch HTML 時：
    const response = await fetch(filePath, { 
      signal: currentFetchController.signal,
      headers: { 'Accept-Language': currentLang } // 明確告知伺服器當前請求語系
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const htmlContent = await response.text();

    if (activePageId !== page.id) return;

    if (elements.pagesContainer) {
      elements.pagesContainer.innerHTML = htmlContent;

      const oldScripts = Array.from(elements.pagesContainer.querySelectorAll('script'));
      for (const oldScript of oldScripts) {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        
        if (oldScript.src) {
          await new Promise((resolve, reject) => {
            newScript.onload = resolve;
            newScript.onerror = () => reject(new Error(`Failed to load script: ${oldScript.src}`));
            newScript.src = oldScript.src;
            oldScript.parentNode.replaceChild(newScript, oldScript);
          });
        } else {
          // 💡 修復：將行內腳本包裹在 IIFE 中，避免二次開啟頁面時 const/let 變數重複宣告崩潰
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

  startAnimationOnce();
}

/* 浮動按鈕動畫邏輯 */
let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
let animFrameId = null;

function handleMouseMove(e) {
  const rect = getDesktopRect();
  if (!rect) return;
  mouseX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
  mouseY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
}

function animateFloatingButtons() {
  if (activePageId || cachedButtons.length === 0 || !elements.desktopArea) {
    animFrameId = null;
    return;
  }

  const desktopRect = getDesktopRect();
  if (!desktopRect || desktopRect.width === 0) {
    animFrameId = requestAnimationFrame(animateFloatingButtons);
    return;
  }

  targetX += (mouseX - targetX) * 0.06;
  targetY += (mouseY - targetY) * 0.06;

  const radius = Math.min(desktopRect.width, desktopRect.height) * 0.26;

  const ringButtons = cachedButtons.filter(btn => btn.dataset.id !== 'about');
  const centerBtn = cachedButtons.find(btn => btn.dataset.id === 'about');

  const moveAmount = 14; 

  if (centerBtn) {
    centerBtn.style.transform = `translate3d(${targetX * moveAmount}px, ${targetY * moveAmount}px, 0)`;
  }

  const totalRingButtons = ringButtons.length;
  ringButtons.forEach((btn, index) => {
    const angle = (index / totalRingButtons) * Math.PI * 2 - (Math.PI / 2);
    const baseX = Math.cos(angle) * radius;
    const baseY = Math.sin(angle) * radius;

    btn.style.transform = `translate3d(${baseX + (targetX * moveAmount)}px, ${baseY + (targetY * moveAmount)}px, 0)`;

    if (Math.cos(angle) < 0) {
      btn.classList.add('label-left');
      btn.classList.remove('label-right');
    } else {
      btn.classList.add('label-right');
      btn.classList.remove('label-left');
    }
  });

  animFrameId = requestAnimationFrame(animateFloatingButtons);
}

function startAnimationOnce() {
  if (!animFrameId && !activePageId) {
    animFrameId = requestAnimationFrame(animateFloatingButtons);
  }
}

// 初始化應用程式
function initApp() {
  elements.desktopArea?.addEventListener('mousemove', handleMouseMove);

  getEl('menu-home')?.addEventListener('click', (e) => { e.preventDefault(); goHome(true); });
  getEl('close-window-btn')?.addEventListener('click', (e) => { e.preventDefault(); goHome(true); });

  getEl('menu-cv')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof PAGES !== 'undefined') {
      const cvPage = PAGES.find(p => p.id === 'cv');
      if (cvPage) loadAndOpenPage(cvPage);
    }
  });

  getEl('menu-contact')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof PAGES !== 'undefined') {
      const contactPage = PAGES.find(p => p.id === 'contact');
      if (contactPage) loadAndOpenPage(contactPage);
    }
  });

  renderUI();
  startAnimationOnce();
  checkInitialUrl();
}

// 時鐘
setInterval(() => {
  const clockEl = getEl('clock');
  if (clockEl) {
    const now = new Date();
    clockEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}, 1000);

// 🎯 1. 監聽瀏覽器的「上一頁 / 下一頁」按鈕
window.addEventListener('popstate', (event) => {
  const pageId = event.state?.pageId;
  if (pageId && typeof PAGES !== 'undefined') {
    const targetPage = PAGES.find(p => p.id === pageId);
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
    const targetPage = PAGES.find(p => p.id === initialPageId);
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