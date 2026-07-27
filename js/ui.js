/* ===================================================
   UI INTERACTION, MULTI-LANG ROUTING & ASYNC FETCHING
=================================================== */
const floatingContainer = document.getElementById('floating-buttons-container');
const pagesContainer = document.getElementById('pages-container');
const windowContent = document.getElementById('window-content');
const desktopArea = document.getElementById('desktop-area');
const windowTitleText = document.getElementById('window-title-text');

// 🌐 語言狀態管理：優先從 URL 判斷，其次讀取 localStorage[cite: 3]
function getInitialLang() {
  const path = window.location.pathname;
  if (path.includes('/zh-hant')) return 'zh_hant';
  if (path.includes('/zh-hans')) return 'zh_hans';
  return localStorage.getItem('site_lang') || 'en';
}

let currentLang = getInitialLang();
let activePageId = null;

// 渲染桌面圓形按鈕
function renderUI() {
  floatingContainer.innerHTML = '';

  PAGES.forEach((page) => {
    // 1. 改成建立 <a> 標籤
    const btn = document.createElement('a');
    
    // 2. 加上標準 href 屬性（Google 爬蟲看得懂這個網址！）
    btn.href = `/pages/${currentLang}/${page.id}.html`;
    
    const isCenter = page.id === 'about';
    btn.className = `circle-btn ${isCenter ? 'center-btn label-bottom' : 'label-right'}`;
    btn.dataset.id = page.id;

    const pageLabel = TRANSLATIONS[currentLang]?.[page.id] || TRANSLATIONS['en'][page.id];

    btn.innerHTML = `
      <div class="icon">${page.icon}</div>
      <span class="label">${pageLabel}</span>
    `;

    // 3. 人類點擊時，阻止預設跳頁，改開你的 3D/Mac OS 彈窗！
    btn.onclick = (e) => {
      e.preventDefault(); // 阻止直接轉址
      loadAndOpenPage(page);
    };

    floatingContainer.appendChild(btn);
  });

  const langSelect = document.getElementById('lang-select');
  if (langSelect) langSelect.value = currentLang;
}

// 🌐 下拉選單觸發語言切換
window.changeLanguage = function(selectedLang) {
  currentLang = selectedLang;
  localStorage.setItem('site_lang', currentLang);

  const currentPath = window.location.pathname;
  const currentSearch = window.location.search; // 🎯 1. 抓取當前網址後面的 ?page=xxx 參數

  // 判斷目前是否在首頁（包含 / , /index.html , /zh-hant/ , /zh-hans/）
  const isHomePage = currentPath === '/' || 
                     currentPath === '/index.html' || 
                     currentPath.includes('/zh-hant') || 
                     currentPath.includes('/zh-hans');

  // 如果在首頁切換語言，直接做網址跳轉，並帶上原本的 ?page=xxx 參數
  if (isHomePage) {
    if (selectedLang === 'zh_hant' && !currentPath.includes('/zh-hant')) {
      window.location.href = `/zh-hant/${currentSearch}`; // 🎯 帶上參數
      return;
    } else if (selectedLang === 'zh_hans' && !currentPath.includes('/zh-hans')) {
      window.location.href = `/zh-hans/${currentSearch}`; // 🎯 帶上參數
      return;
    } else if (selectedLang === 'en' && (currentPath.includes('/zh-hant') || currentPath.includes('/zh-hans'))) {
      window.location.href = `/${currentSearch}`; // 🎯 帶上參數
      return;
    }
  }

  // 1. 重新渲染桌面按鈕標籤
  renderUI();

  // 2. 若目前有開啟中的視窗，立即重新加載新語言的 HTML 檔案（不新增 history 紀錄）
  if (activePageId) {
    const currentPage = PAGES.find(p => p.id === activePageId);
    if (currentPage) loadAndOpenPage(currentPage, false);
  }
};

// 非同步加載與開啟頁面
async function loadAndOpenPage(page, pushHistory = true) {
  try {
    activePageId = page.id;
    const pageLabel = TRANSLATIONS[currentLang]?.[page.id] || TRANSLATIONS['en'][page.id];
    
    windowTitleText.innerText = `PORTFOLIO_VIEWER.EXE // ${pageLabel.toUpperCase()}`;
    pagesContainer.innerHTML = `<div style="padding:20px; text-align:center;">Loading content...</div>`;
    
    windowContent.classList.add('active');
    floatingContainer.classList.add('is-hidden');

    // ✅ 動態抓取對應語言資料夾的 HTML（加斜線 / 確保從根目錄抓取）
    const filePath = `/pages/${currentLang}/${page.id}.html`;

    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const htmlContent = await response.text();
    pagesContainer.innerHTML = htmlContent;

    // 重新執行加載頁面內的 script[cite: 3]
    const scripts = pagesContainer.querySelectorAll('script');
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });

    if (pushHistory) {
      const currentPath = window.location.pathname; 
      history.pushState({ pageId: page.id }, '', `${currentPath}?page=${page.id}`);
    }

  } catch (error) {
    console.error('Error loading page:', error);
    pagesContainer.innerHTML = `
      <h2 class="page-title">Error Loading Page</h2>
      <div class="page-body">
        <p>Could not fetch file: <code>/pages/${currentLang}/${page.id}.html</code>.</p>
        <p>Please check if the file exists in the directory.</p>
      </div>
    `;
  }
}

// 返回主桌面
function goHome(pushHistory = true) {
  activePageId = null;
  windowContent.classList.remove('active');
  pagesContainer.innerHTML = '';
  floatingContainer.classList.remove('is-hidden');

  if (pushHistory && window.location.search) {
    const currentPath = window.location.pathname;
    history.pushState({}, '', currentPath);
  }
}

/* 浮動按鈕動畫邏輯 */
let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
desktopArea.addEventListener('mousemove', (e) => {
  const rect = desktopArea.getBoundingClientRect();
  mouseX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
  mouseY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
});

function animateFloatingButtons() {
  targetX += (mouseX - targetX) * 0.06;
  targetY += (mouseY - targetY) * 0.06;

  const buttons = Array.from(document.querySelectorAll('.circle-btn'));
  if (buttons.length === 0) return;

  const desktopRect = desktopArea.getBoundingClientRect();
  const radius = Math.min(desktopRect.width, desktopRect.height) * 0.26;

  const ringButtons = buttons.filter(btn => btn.dataset.id !== 'about');
  const centerBtn = buttons.find(btn => btn.dataset.id === 'about');

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

  requestAnimationFrame(animateFloatingButtons);
}

// 初始化
renderUI();
animateFloatingButtons();

document.getElementById('menu-home').addEventListener('click', goHome);
document.getElementById('close-window-btn').addEventListener('click', goHome);

document.getElementById('menu-cv')?.addEventListener('click', () => {
  const cvPage = PAGES.find(p => p.id === 'cv');
  if (cvPage) loadAndOpenPage(cvPage);
});

document.getElementById('menu-contact')?.addEventListener('click', () => {
  const contactPage = PAGES.find(p => p.id === 'contact');
  if (contactPage) loadAndOpenPage(contactPage);
});

setInterval(() => {
  const now = new Date();
  document.getElementById('clock').innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}, 1000);

// 🎯 1. 監聽瀏覽器的「上一頁 / 下一頁」按鈕
window.addEventListener('popstate', (event) => {
  const pageId = event.state?.pageId;
  if (pageId) {
    const targetPage = PAGES.find(p => p.id === pageId);
    if (targetPage) loadAndOpenPage(targetPage, false);
  } else {
    goHome(false);
  }
});

// 🎯 2. 初始化時檢查 URL 是否帶有 ?page=xxx 參數（讓 Google 爬蟲或直接輸入網址的人能直接開啟視窗）
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const initialPageId = urlParams.get('page');

  if (initialPageId) {
    const targetPage = PAGES.find(p => p.id === initialPageId);
    if (targetPage) loadAndOpenPage(targetPage, false);
  }
});