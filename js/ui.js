/* ===================================================
   UI INTERACTION, MULTI-LANG ROUTING & ASYNC FETCHING
=================================================== */
const floatingContainer = document.getElementById('floating-buttons-container');
const pagesContainer = document.getElementById('pages-container');
const windowContent = document.getElementById('window-content');
const desktopArea = document.getElementById('desktop-area');
const windowTitleText = document.getElementById('window-title-text');

// 🌐 語言狀態管理
let currentLang = localStorage.getItem('site_lang') || 'en';
let activePageId = null;

// 渲染桌面圓形按鈕
function renderUI() {
  floatingContainer.innerHTML = '';

  PAGES.forEach((page) => {
    const btn = document.createElement('div');
    const isCenter = page.id === 'about';
    btn.className = `circle-btn ${isCenter ? 'center-btn label-bottom' : 'label-right'}`;
    btn.dataset.id = page.id;

    // 🌟 從 TRANSLATIONS 字典查表取得標籤（若找不到預設退回英文）
    const pageLabel = TRANSLATIONS[currentLang]?.[page.id] || TRANSLATIONS['en'][page.id];

    btn.innerHTML = `
      <div class="icon">${page.icon}</div>
      <span class="label">${pageLabel}</span>
    `;
    btn.onclick = () => loadAndOpenPage(page);
    floatingContainer.appendChild(btn);
  });

  // 同步下拉選單當前選中的選項
  const langSelect = document.getElementById('lang-select');
  if (langSelect) langSelect.value = currentLang;
}

// 🌐 下拉選單觸發語言切換
window.changeLanguage = function(selectedLang) {
  currentLang = selectedLang;
  localStorage.setItem('site_lang', currentLang);
  
  // 1. 重新渲染桌面按鈕標籤
  renderUI();

  // 2. 若目前有開啟中的視窗，立即重新加載新語言的 HTML 檔案
  if (activePageId) {
    const currentPage = PAGES.find(p => p.id === activePageId);
    if (currentPage) loadAndOpenPage(currentPage);
  }
};

// 非同步加載與開啟頁面
async function loadAndOpenPage(page) {
  try {
    activePageId = page.id;
    const pageLabel = TRANSLATIONS[currentLang]?.[page.id] || TRANSLATIONS['en'][page.id];
    
    windowTitleText.innerText = `PORTFOLIO_VIEWER.EXE // ${pageLabel.toUpperCase()}`;
    pagesContainer.innerHTML = `<div style="padding:20px; text-align:center;">Loading content...</div>`;
    
    windowContent.classList.add('active');
    floatingContainer.classList.add('is-hidden');

    // 動態抓取對應語言資料夾的 HTML（例：pages/zh/about.html）
    const filePath = `pages/${currentLang}/${page.id}.html`;

    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const htmlContent = await response.text();
    pagesContainer.innerHTML = htmlContent;

    // 重新執行加載頁面內的 script
    const scripts = pagesContainer.querySelectorAll('script');
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });

  } catch (error) {
    console.error('Error loading page:', error);
    pagesContainer.innerHTML = `
      <h2 class="page-title">Error Loading Page</h2>
      <div class="page-body">
        <p>Could not fetch file: <code>pages/${currentLang}/${page.id}.html</code>.</p>
        <p>Please check if the file exists in the directory.</p>
      </div>
    `;
  }
}

// 返回主桌面
function goHome() {
  activePageId = null;
  windowContent.classList.remove('active');
  pagesContainer.innerHTML = '';
  floatingContainer.classList.remove('is-hidden');
}

/* 浮動按鈕動畫邏輯 */
let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

// 1. Desktop Mouse Motion Listener
desktopArea.addEventListener('mousemove', (e) => {
  const rect = desktopArea.getBoundingClientRect();
  mouseX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
  mouseY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
});

// 2. Mobile Gyroscope Handler
function handleOrientation(e) {
  if (e.gamma === null || e.beta === null) return;

  const restingPitch = 45; // Assume user holds phone at ~45° incline
  const maxTilt = 30;      // 30° tilt reaches full intensity (-1 or +1)

  // Normalize gamma (left/right roll) & beta (front/back pitch) to [-1, 1] range
  mouseX = Math.max(-1, Math.min(1, e.gamma / maxTilt));
  mouseY = Math.max(-1, Math.min(1, (e.beta - restingPitch) / maxTilt));
}

// 3. Gyroscope Initialization (With iOS Permission Handler)
async function initGyroscope() {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission === 'granted') {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    } catch (err) {
      console.error('Gyroscope permission error:', err);
    }
  } else if ('DeviceOrientationEvent' in window) {
    window.addEventListener('deviceorientation', handleOrientation);
  }
}

// Trigger gyro permission request on first touch for iOS support
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
if (isMobile) {
  window.addEventListener('touchstart', initGyroscope, { once: true });
}

// 4. Animation Loop (Reuses mouseX & mouseY seamlessly)
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