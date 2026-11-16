/* ===================================================
   PORTFOLIO_STUDIO.APP // Visual CMS Application
=================================================== */

(() => {
  'use strict';

  const STORAGE_DRAFT_KEY = 'studio_draft_content';
  const LANG_META = {
    en: { label: 'EN', previewPath: '/?studio_preview=1', livePath: '/' },
    zh_hant: { label: '繁體中文', previewPath: '/zh-hant/?studio_preview=1', livePath: '/zh-hant/' },
    zh_hans: { label: '简体中文', previewPath: '/zh-hans/?studio_preview=1', livePath: '/zh-hans/' }
  };

  // All 12 crisp 16x16 retro pixel SVG icons matching js/config.js
  const STUDIO_ICONS = {
    about: '<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M6 1h4v1H6V1zm-1 2h6v1H5V3zm0 2h6v3H5V5zm1 3h4v1H6V8zm-3 3h10v1H3v-1zm-1 1h12v1H2v-1zm-1 1h14v2H1v-2z"/></svg>',
    projects: '<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M2 3h5v2h7v8H2V3zm1 1v7h10V5H6V4H3z"/></svg>',
    research: '<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M3 1h6l3 3v10H3V1zm1 1v11h7V5H9V2H4zm5 0v2h2V2H9zM5 10h1v2H5v-2zm2-3h1v5H7V7zm2-2h1v7H9V5z"/></svg>',
    cv: '<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M6 2h4v2H6V2zm1 1h2v1H7V3zM2 5h12v8H2V5zm1 1v1h10V6H3zm0 2v4h10V8H3z"/></svg>',
    notes: '<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M6 1h4v1H6V1zm-2 2h8v1H4V3zm-1 2h10v1H3V5zm0 2h10v1H3V7zm1 2h8v1H4V9zm1 2h6v1H5v-1zm1 2h4v1H6v-1z"/></svg>',
    contact: '<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M1 4h14v8H1V4zm1 1v1l5 3.5L12 6V5H2zm0 2.5V11h12V7.5L9 10H7L2 7.5z"/></svg>',
    star: '<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M7 1h2v2H7V1zM6 3h1v2H6V3zm3 0h1v2H9V3zM1 5h5v1H1V5zm9 0h5v1h-5V5zM2 6h1v1H2V6zm11 0h1v1h-1V6zM3 7h2v1H3V7zm8 0h2v1h-2V7zM4 8h1v4H4V8zm7 0h1v4h-1V8zM3 12h1v2H3v-2zm9 0h1v2h-1v-2zm-8 1h2v1H4v-1zm6 0h2v1h-2v-1zm-4-1h1v1H6v-1zm3 0h1v1H9v-1zm-2-1h2v1H7v-1z"/></svg>',
    terminal: '<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M1 2h14v12H1V2zm1 2v9h12V4H2zm2 2h1v1H4V6zm1 1h1v1H5V7zm1 1h1v1H6V8zM5 9h1v1H5V9zm-1 1h1v1H4v-1zm4 0h4v1H8v-1z"/></svg>',
    book: '<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M1 2h14v12H1V2zm1 1v10h5V3H2zm6 0v10h6V3H8zM3 5h3v1H3V5zm0 2h3v1H3V7zm0 2h3v1H3V9zm6-4h4v1H9V5zm0 2h4v1H9V7zm0 2h4v1H9V9z"/></svg>',
    folder: '<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path fill-rule="evenodd" d="M1 2h4v1h1v1h9v10H1V2zm1 1v2h12V4H5V3H2zm0 3v7h12V6H2z"/></svg>',
    globe: '<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M5 1h6v1H5V1zM3 2h2v1H3V2zm8 0h2v1h-2V2zM2 3h1v2H2V3zm11 0h1v2h-1V3zM1 5h1v6H1V5zm13 0h1v6h-1V5zM2 11h1v2H2v-2zm11 0h1v2h-1v-2zM3 13h2v1H3v-1zm8 0h2v1h-2v-1zm-6 1h6v1H5v-1zM3 4h10v1H3V4zM2 7h12v1H2V7zm1 4h10v1H3v-1zM5 2h1v3H5V2zm5 0h1v3h-1V2zM4 5h1v6H4V5zm7 0h1v6h-1V5zM5 11h1v3H5v-3zm5 0h1v3h-1v-3z"/></svg>',
    bolt: '<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M8 1h4v1h-1v1h-1v1H9v2h4v2h-1v1h-1v1h-1v2H8v1H7v1H5v1H4v-3h1v-2h1V8H3V6h1V5h1V4h1V2h2V1z"/></svg>'
  };

  const ICON_NAMES = Object.keys(STUDIO_ICONS);

  const BLOCK_CATALOG = [
    { type: 'rich_text', label: 'Rich Text', short: 'RICH TEXT' },
    { type: 'hero_profile', label: 'Hero Profile', short: 'HERO PROFILE' },
    { type: 'bento_grid', label: '2-Col Bento Grid', short: 'BENTO GRID' },
    { type: 'quote_log', label: 'Quote Log', short: 'QUOTE LOG' },
    { type: 'cards_grid', label: 'Cards Grid', short: 'CARDS GRID' },
    { type: 'status_notice', label: 'Status Notice', short: 'STATUS NOTICE' },
    { type: 'contact_card', label: 'Contact Card', short: 'CONTACT CARD' },
    { type: 'cv_header', label: 'CV Header & PDF', short: 'CV HEADER' },
    { type: 'cv_timeline', label: 'CV Timeline', short: 'CV TIMELINE' },
    { type: 'skills_matrix', label: 'Skills Visual', short: 'SKILLS VISUAL' },
    { type: 'project_showcase', label: 'Project Showcase', short: 'PROJECT SHOWCASE' },
    { type: 'publications_list', label: 'Publications', short: 'PUBLICATIONS' },
    { type: 'notes_list', label: 'Notes & Articles', short: 'NOTES & ARTICLES' },
    { type: 'custom_html', label: 'Custom HTML', short: 'CUSTOM HTML' }
  ];

  const BLOCK_TYPE_MAP = Object.fromEntries(BLOCK_CATALOG.map((b) => [b.type, b]));

  const state = {
    content: null,
    lang: 'en',
    selectedTabId: null,
    apiConnected: false,
    fileHandle: null,
    dirty: false,
    previewOpen: true,
    previewDesktopOnly: false,
    collapsedBlocks: new Set(),
    undoStack: [],
    lastTypingUndoAt: 0,
    dragTabIndex: null
  };

  // ===================================================
  // UTILITIES
  // ===================================================

  const $ = (id) => document.getElementById(id);

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function slugify(text) {
    return String(text || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'tab';
  }

  function uid(prefix = 'blk') {
    const rand = Math.random().toString(36).slice(2, 7);
    return `${prefix}_${Date.now().toString(36)}_${rand}`;
  }

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [key, val] of Object.entries(attrs)) {
      if (val === undefined || val === null) continue;
      if (key === 'className') node.className = val;
      else if (key === 'textContent') node.textContent = val;
      else if (key === 'innerHTML') node.innerHTML = val;
      else if (key === 'checked') node.checked = Boolean(val);
      else if (key === 'disabled') node.disabled = Boolean(val);
      else if (key === 'value') node.value = val;
      else if (key.startsWith('on') && typeof val === 'function') {
        node.addEventListener(key.slice(2).toLowerCase(), val);
      } else if (key === 'dataset' && typeof val === 'object') {
        Object.assign(node.dataset, val);
      } else {
        node.setAttribute(key, String(val));
      }
    }
    const list = Array.isArray(children) ? children : [children];
    for (const child of list) {
      if (child === null || child === undefined || child === false) continue;
      node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    }
    return node;
  }

  function showToast(message, type = 'info') {
    const container = $('toast-container');
    if (!container) return;
    const toast = el('div', {
      className: `toast ${type === 'ok' ? 'toast-ok' : type === 'error' ? 'toast-error' : ''}`,
      textContent: message
    });
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3400);
  }

  function askConfirm(message, confirmLabel = 'Confirm', danger = true) {
    return new Promise((resolve) => {
      const backdrop = $('confirm-modal');
      const msgEl = $('confirm-modal-message');
      const okBtn = $('btn-confirm-ok');
      const cancelBtn = $('btn-confirm-cancel');

      msgEl.textContent = message;
      okBtn.textContent = confirmLabel;
      okBtn.className = danger ? 'mac-btn mac-btn-danger' : 'mac-btn mac-btn-primary';
      backdrop.hidden = false;

      const cleanup = (result) => {
        backdrop.hidden = true;
        okBtn.removeEventListener('click', onOk);
        cancelBtn.removeEventListener('click', onCancel);
        backdrop.removeEventListener('click', onBackdrop);
        resolve(result);
      };

      const onOk = () => cleanup(true);
      const onCancel = () => cleanup(false);
      const onBackdrop = (e) => {
        if (e.target === backdrop) cleanup(false);
      };

      okBtn.addEventListener('click', onOk);
      cancelBtn.addEventListener('click', onCancel);
      backdrop.addEventListener('click', onBackdrop);
    });
  }

  function getIconSvg(iconName) {
    return STUDIO_ICONS[iconName] || STUDIO_ICONS.about;
  }

  function normalizeContentShape(raw) {
    const content = raw && typeof raw === 'object' ? deepClone(raw) : {};
    if (typeof content.version !== 'number') content.version = 1;
    if (!content.site || typeof content.site !== 'object') content.site = {};
    if (!Array.isArray(content.site.menuLinks)) content.site.menuLinks = [];
    if (!Array.isArray(content.tabs)) content.tabs = [];

    content.tabs.forEach((tab) => {
      if (!tab.labels || typeof tab.labels !== 'object') tab.labels = {};
      if (!tab.pageTitle || typeof tab.pageTitle !== 'object') tab.pageTitle = {};
      if (!tab.blocks || typeof tab.blocks !== 'object') tab.blocks = {};
      ['en', 'zh_hant', 'zh_hans'].forEach((lang) => {
        if (!Array.isArray(tab.blocks[lang])) tab.blocks[lang] = [];
      });
    });

    return content;
  }

  function getSelectedTab() {
    if (!state.content || !Array.isArray(state.content.tabs)) return null;
    return state.content.tabs.find((t) => t.id === state.selectedTabId) || state.content.tabs[0] || null;
  }

  function getTabDisplayLabel(tab, lang = state.lang) {
    if (!tab) return '';
    return tab.labels?.[lang] || tab.labels?.en || tab.id;
  }

  // ===================================================
  // UNDO, DIRTY STATE & LIVE PREVIEW SYNC
  // ===================================================

  function pushUndoSnapshot(isTyping = false) {
    if (!state.content) return;
    const now = Date.now();
    if (isTyping && now - state.lastTypingUndoAt < 1200 && state.undoStack.length > 0) {
      return;
    }
    if (isTyping) state.lastTypingUndoAt = now;

    const snapshot = JSON.stringify({
      content: state.content,
      selectedTabId: state.selectedTabId
    });
    const prev = state.undoStack[state.undoStack.length - 1];
    if (prev === snapshot) return;

    state.undoStack.push(snapshot);
    if (state.undoStack.length > 40) state.undoStack.shift();
    updateToolbarButtons();
  }

  function undoLastChange() {
    if (state.undoStack.length === 0) return;
    const raw = state.undoStack.pop();
    const parsed = JSON.parse(raw);
    state.content = normalizeContentShape(parsed.content);
    state.selectedTabId = parsed.selectedTabId;
    if (!getSelectedTab() && state.content.tabs.length > 0) {
      state.selectedTabId = state.content.tabs[0].id;
    }
    state.dirty = true;
    syncPreviewAndDraft();
    renderAll();
    showToast('Undid last change.');
  }

  function markChanged(options = {}) {
    const { rerender = false, sidebar = false } = options;
    state.dirty = true;
    updateToolbarButtons();
    syncPreviewAndDraft();
    if (sidebar) renderSidebar();
    if (rerender) renderEditor();
  }

  function syncPreviewAndDraft() {
    if (!state.content) return;
    try {
      localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(state.content));
    } catch (e) {
      // Ignore storage quota errors
    }

    const iframe = $('preview-iframe');
    if (iframe && iframe.contentWindow && state.previewOpen) {
      iframe.contentWindow.postMessage(
        {
          type: 'STUDIO_PREVIEW_UPDATE',
          content: state.content,
          activePageId: state.previewDesktopOnly ? null : state.selectedTabId,
          lang: state.lang
        },
        '*'
      );
    }
  }

  function updatePreviewRoute() {
    const meta = LANG_META[state.lang] || LANG_META.en;
    const routePill = $('preview-route-label');
    if (routePill) routePill.textContent = meta.previewPath;

    const openLive = $('btn-open-live');
    if (openLive) openLive.href = meta.livePath;

    const iframe = $('preview-iframe');
    if (iframe) {
      const currentAttr = iframe.getAttribute('src') || '';
      if (currentAttr !== meta.previewPath) {
        iframe.setAttribute('src', meta.previewPath);
      } else {
        syncPreviewAndDraft();
      }
    }
  }

  function updateToolbarButtons() {
    const dirtyBadge = $('dirty-badge');
    if (dirtyBadge) {
      dirtyBadge.textContent = state.dirty ? '* Unsaved' : 'Saved';
      dirtyBadge.className = `status-pill ${state.dirty ? 'status-dirty' : 'status-clean'}`;
    }

    const undoBtn = $('btn-undo');
    if (undoBtn) undoBtn.disabled = state.undoStack.length === 0;

    const copyBtn = $('btn-copy-from-en');
    const tab = getSelectedTab();
    const enCount = tab?.blocks?.en?.length || 0;
    if (copyBtn) {
      copyBtn.disabled = state.lang === 'en' || !tab || enCount === 0;
    }
  }

  function updateConnectionBadge() {
    const badge = $('connection-badge');
    if (!badge) return;
    if (state.apiConnected) {
      badge.textContent = 'Local API Connected';
      badge.className = 'status-pill status-connected';
      badge.title = 'Saving writes directly to data/site-content.json with rolling backups.';
    } else if (state.fileHandle) {
      badge.textContent = `Linked: ${state.fileHandle.name}`;
      badge.className = 'status-pill status-linked';
      badge.title = 'Saving writes directly to your linked local file.';
    } else {
      badge.textContent = 'Static / File Picker Mode';
      badge.className = 'status-pill status-static';
      badge.title = 'Run Open_Portfolio_Studio (.bat / .command) for instant save, or click Link Local File.';
    }
  }

  // ===================================================
  // API & FILE PERSISTENCE
  // ===================================================

  async function checkApiHealth() {
    try {
      const res = await fetch('/api/health', { cache: 'no-store' });
      if (!res.ok) throw new Error('Health check failed');
      const data = await res.json();
      state.apiConnected = Boolean(data && data.ok);
    } catch (e) {
      state.apiConnected = false;
    }
    updateConnectionBadge();
  }

  async function loadContentFromDisk(confirmIfDirty = false) {
    if (confirmIfDirty && state.dirty) {
      const ok = await askConfirm('Discard unsaved edits and reload from disk?', 'Reload', true);
      if (!ok) return;
    }

    try {
      let parsed = null;
      if (!state.apiConnected && state.fileHandle) {
        const file = await state.fileHandle.getFile();
        parsed = JSON.parse(await file.text());
      } else {
        const res = await fetch(`/data/site-content.json?t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        parsed = await res.json();
      }

      state.content = normalizeContentShape(parsed);
      if (!state.selectedTabId || !state.content.tabs.some((t) => t.id === state.selectedTabId)) {
        state.selectedTabId = state.content.tabs[0]?.id || null;
      }
      state.dirty = false;
      state.undoStack = [];
      syncPreviewAndDraft();
      renderAll();
      showToast('Loaded site-content.json', 'ok');
    } catch (err) {
      showToast(`Failed to load JSON: ${err.message}`, 'error');
      const root = $('editor-root');
      if (root && !state.content) {
        root.innerHTML = '';
        root.appendChild(
          el('div', { className: 'empty-state' }, [
            el('p', { textContent: `Could not load /data/site-content.json (${err.message}).` }),
            el('p', { textContent: 'Start studio/server.py (or Open_Portfolio_Studio) or use "Link Local File" to open data/site-content.json.' })
          ])
        );
      }
    }
  }

  async function linkLocalFile() {
    if (typeof window.showOpenFilePicker !== 'function') {
      showToast('File System Access API is not supported in this browser. Use Export JSON or studio/server.py.', 'error');
      return;
    }
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [{ description: 'JSON Files', accept: { 'application/json': ['.json'] } }],
        multiple: false
      });
      if (!handle) return;
      state.fileHandle = handle;
      updateConnectionBadge();

      const loadToo = !state.content || (await askConfirm(`Linked "${handle.name}". Load its contents into the editor now?`, 'Load File', false));
      if (loadToo) {
        const file = await handle.getFile();
        state.content = normalizeContentShape(JSON.parse(await file.text()));
        state.selectedTabId = state.content.tabs[0]?.id || null;
        state.dirty = false;
        state.undoStack = [];
        syncPreviewAndDraft();
        renderAll();
      }
      showToast(`Linked local file: ${handle.name}`, 'ok');
    } catch (err) {
      if (err.name !== 'AbortError') {
        showToast(`Could not link file: ${err.message}`, 'error');
      }
    }
  }

  function exportJsonDownload() {
    if (!state.content) return;
    const blob = new Blob([JSON.stringify(state.content, null, 2) + '\n'], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site-content.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Exported site-content.json', 'ok');
  }

  async function saveChanges() {
    if (!state.content) return;

    if (state.apiConnected) {
      try {
        const res = await fetch('/api/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state.content)
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error || `HTTP ${res.status}`);
        }
        state.dirty = false;
        updateToolbarButtons();
        syncPreviewAndDraft();
        showToast(`Saved! Backup: ${data.backup}`, 'ok');
        return;
      } catch (err) {
        showToast(`API Save failed: ${err.message}`, 'error');
        return;
      }
    }

    if (state.fileHandle) {
      try {
        const writable = await state.fileHandle.createWritable();
        await writable.write(JSON.stringify(state.content, null, 2) + '\n');
        await writable.close();
        state.dirty = false;
        updateToolbarButtons();
        syncPreviewAndDraft();
        showToast(`Saved directly to ${state.fileHandle.name}`, 'ok');
        return;
      } catch (err) {
        showToast(`File write failed: ${err.message}`, 'error');
        return;
      }
    }

    showToast('No Local API or Linked File. Downloading JSON instead...', 'info');
    exportJsonDownload();
  }

  // ===================================================
  // DEFAULT BLOCK FACTORY
  // ===================================================

  function createDefaultBlock(type, tabId) {
    const id = uid(`blk_${slugify(tabId)}_${type}`);
    switch (type) {
      case 'hero_profile':
        return {
          id,
          type: 'hero_profile',
          topbarLeft: 'BIO_VIEWER.APP // PROFILE',
          statusBadge: 'ONLINE // ACTIVE',
          avatar: '/pictures/me.jpeg',
          name: 'Yi-Chun Liao',
          nameNote: '',
          role: 'Role or Headline',
          tags: ['#TagOne', '#TagTwo'],
          actions: [
            { label: 'LEARN MORE →', style: 'primary', actionType: 'page', target: tabId || 'about' }
          ]
        };
      case 'rich_text':
        return {
          id,
          type: 'rich_text',
          heading: 'Section Heading',
          paragraphs: ['Write your paragraph here. Use **bold text** or [links](https://example.com).']
        };
      case 'bento_grid':
        return {
          id,
          type: 'bento_grid',
          heading: 'Highlights Grid',
          columns: 2,
          items: [
            { indexLabel: '01', title: 'First Card', description: 'Describe this focus area or milestone.' },
            { indexLabel: '02', title: 'Second Card', description: 'Describe another focus area or milestone.' }
          ]
        };
      case 'quote_log':
        return {
          id,
          type: 'quote_log',
          headerBar: 'PHILOSOPHY.LOG',
          quote: '"A concise guiding principle or quote."',
          body: 'Optional supporting commentary beneath the quote.'
        };
      case 'cards_grid':
        return {
          id,
          type: 'cards_grid',
          heading: 'Featured Items',
          columns: 2,
          items: [
            {
              badge: 'FEATURED',
              badgeStyle: 'solid',
              title: 'Card Title',
              subtitle: 'Subtitle / Context',
              description: 'Summary of this project, paper, or experience.',
              tags: ['Tag A', 'Tag B'],
              buttonLabel: 'VIEW →',
              actionType: 'none',
              target: ''
            }
          ]
        };
      case 'status_notice':
        return {
          id,
          type: 'status_notice',
          topBadge: 'STATUS // IN PROGRESS',
          title: 'Section Title',
          body: 'Describe what is coming soon or what this status card highlights.',
          innerLabel: 'SYSTEM NOTE',
          innerText: 'Additional detail inside the inset box.',
          innerIcon: 'monitor',
          buttonText: 'COMING SOON',
          buttonLocked: true,
          buttonTooltip: 'Under construction',
          buttonActionType: 'none',
          buttonTarget: ''
        };
      case 'contact_card':
        return {
          id,
          type: 'contact_card',
          topbarLeft: 'DA_COMMUNICATOR.APP // v1.0',
          statusBadge: 'ONLINE',
          emailLabel: 'DIRECT EMAIL',
          email: 'contact@yichunliao.com',
          copyLabel: 'COPY EMAIL',
          copiedLabel: 'COPIED!',
          mailAppLabel: 'OPEN MAIL APP',
          mailto: 'contact@yichunliao.com',
          profilesLabel: 'PROFILES',
          socialLinks: [
            { label: 'GitHub', icon: 'folder', url: 'https://github.com/yichun-liao' },
            { label: 'LinkedIn', icon: 'badge', url: 'https://linkedin.com/in/yichun-liao' }
          ],
          locationLabel: 'LOCATION',
          location: 'Colorado, USA',
          timezoneLabel: 'TIMEZONE',
          timezone: 'Mountain Time (UTC-7 / MST)',
          noteHeading: 'INQUIRIES',
          noteBody: 'Feel free to reach out for research collaborations or opportunities.'
        };
      case 'cv_header':
        return {
          id,
          type: 'cv_header',
          title: 'Curriculum Vitae',
          subtitle: 'Last Updated: November 2026 // Ph.D. Researcher, CU Boulder',
          statusBadge: 'CV // PDF READY',
          downloadLabel: 'DOWNLOAD CV (PDF)',
          downloadUrl: '/assets/YiChun_Liao_CV.pdf',
          downloadFilename: 'YiChun_Liao_CV.pdf',
          openNewTab: true,
          secondaryLabel: 'GOOGLE SCHOLAR ↗',
          secondaryUrl: 'https://scholar.google.com/'
        };
      case 'cv_timeline':
        return {
          id,
          type: 'cv_timeline',
          heading: '01 // Education & Research Experience',
          showTimelineRail: true,
          items: [
            {
              title: 'Ph.D. in Electrical & Computer Engineering',
              organization: 'University of Colorado Boulder',
              period: '2023 – Present',
              location: 'Boulder, CO, USA',
              badge: 'CURRENT',
              summary: 'Researching **safety-critical control** and **statistical system identification** for autonomous cyber-physical systems.',
              bullets: [
                'Developed data-driven Control Barrier Function (CBF) synthesis pipelines under bounded uncertainty.',
                'Co-authored conference and journal manuscripts on formal safety verification.'
              ]
            },
            {
              title: 'M.S. in Electrical Engineering',
              organization: 'National Taiwan University',
              period: '2020 – 2022',
              location: 'Taipei, Taiwan',
              badge: 'M.S.',
              summary: 'Focused on robust nonlinear control and real-time trajectory optimization.',
              bullets: [
                'Implemented hardware-in-the-loop simulation benchmarks in MATLAB/Simulink and C++.'
              ]
            }
          ]
        };
      case 'skills_matrix':
        return {
          id,
          type: 'skills_matrix',
          heading: '02 // Technical Skills & Competencies',
          displayMode: 'both',
          columns: 2,
          skillBars: [
            { label: 'Control Theory & CBFs', category: 'THEORY', level: 92, note: 'Safety filters, Lyapunov & barrier certificates' },
            { label: 'System Identification', category: 'STATISTICS', level: 88, note: 'Subspace ID, nonparametric & kernel methods' },
            { label: 'Python / PyTorch / JAX', category: 'COMPUTING', level: 85, note: 'Scientific computing & differentiable optimization' },
            { label: 'MATLAB / Simulink / C++', category: 'SIMULATION', level: 90, note: 'Real-time control & HIL verification' }
          ],
          skillGroups: [
            {
              title: 'Control & Verification',
              skills: ['Control Barrier Functions', 'MPC', 'Lyapunov Stability', 'Reachability Analysis', 'Convex Optimization']
            },
            {
              title: 'Languages & Tooling',
              skills: ['Python', 'MATLAB', 'C++', 'Julia', 'CasADi', 'CVXPY', 'Git', 'LaTeX']
            }
          ]
        };
      case 'project_showcase':
        return {
          id,
          type: 'project_showcase',
          heading: 'Featured Engineering & Research Projects',
          filterLabel: 'FILTER:',
          allLabel: 'ALL',
          columns: 2,
          items: [
            {
              category: 'CONTROL',
              badge: 'OPEN SOURCE',
              title: 'Data-Driven Safety Filter Toolbox',
              summary: 'Modular MATLAB & Python framework for synthesizing Control Barrier Functions from noisy trajectory data.',
              tags: ['CBFs', 'System ID', 'QP'],
              buttonLabel: 'INSPECT PROJECT →',
              detailMode: 'inline',
              detailTitle: 'Data-Driven Safety Filter Toolbox',
              detailMeta: 'Category: Control // Status: Active // Stack: MATLAB, Python, CasADi',
              detailBody: '**Overview**\nConstructs provably safe quadratic-program safety filters directly from finite-sample system rollouts.\n\n**Key Highlights**\n- Tight statistical error bounds integrated into CBF constraints.\n- Tested on 2D/3D autonomous navigation and inverted pendulum benchmarks.',
              detailLinks: [
                { label: 'GITHUB REPO ↗', url: 'https://github.com/yichun-liao' },
                { label: 'DOCS ↗', url: 'https://yichunliao.com' }
              ],
              target: ''
            },
            {
              category: 'SYSTEMS',
              badge: 'WEB / 3D',
              title: 'Macintosh 1984 Web Desktop & CMS',
              summary: 'Interactive Three.js retro workstation with a JSON-driven Portfolio Studio and multi-language routing.',
              tags: ['Three.js', 'Vanilla JS', 'Retro UI'],
              buttonLabel: 'VIEW LIVE →',
              detailMode: 'inline',
              detailTitle: 'Macintosh 1984 Web Desktop & CMS',
              detailMeta: 'Category: Systems // Status: Shipped // Zero Build Step',
              detailBody: '**Overview**\nA fast, zero-dependency personal site combining a 3D Macintosh boot animation with a live visual CMS.\n\n**Architecture**\n- Single source of truth in data/site-content.json.\n- Real-time postMessage preview in Portfolio Studio.',
              detailLinks: [
                { label: 'SOURCE ↗', url: 'https://github.com/yichun-liao' }
              ],
              target: ''
            }
          ]
        };
      case 'publications_list':
        return {
          id,
          type: 'publications_list',
          heading: 'Selected Publications & Preprints',
          filterLabel: 'FILTER:',
          allLabel: 'ALL',
          items: [
            {
              pubType: 'CONFERENCE',
              year: '2026',
              statusBadge: 'UNDER REVIEW',
              authors: '**Yi-Chun Liao**, Co-Author Name',
              title: 'Safety-Critical Control Synthesis via Statistical System Identification',
              venue: 'IEEE Conference on Decision and Control (CDC)',
              bibtex: '@inproceedings{liao2026safety,\n  title={Safety-Critical Control Synthesis via Statistical System Identification},\n  author={Liao, Yi-Chun and Name, Co-Author},\n  booktitle={IEEE CDC},\n  year={2026}\n}',
              links: [
                { label: 'ARXIV ↗', url: 'https://arxiv.org/' },
                { label: 'CODE ↗', url: 'https://github.com/yichun-liao' }
              ]
            },
            {
              pubType: 'JOURNAL',
              year: '2025',
              statusBadge: 'PUBLISHED',
              authors: '**Yi-Chun Liao**, Advisor Name',
              title: 'Nonparametric Uncertainty Quantification for Autonomous Dynamical Systems',
              venue: 'IEEE Transactions on Automatic Control (TAC)',
              bibtex: '@article{liao2025nonparametric,\n  title={Nonparametric Uncertainty Quantification for Autonomous Dynamical Systems},\n  author={Liao, Yi-Chun and Name, Advisor},\n  journal={IEEE TAC},\n  year={2025}\n}',
              links: [
                { label: 'DOI ↗', url: 'https://ieeexplore.ieee.org/' }
              ]
            }
          ]
        };
      case 'notes_list':
        return {
          id,
          type: 'notes_list',
          heading: 'Technical Notes & Field Logs',
          filterLabel: 'FILTER:',
          allLabel: 'ALL',
          columns: 2,
          items: [
            {
              category: 'CONTROL',
              date: '2026-10-18',
              readTime: '6 MIN READ',
              title: 'Intuition Behind Control Barrier Functions',
              summary: 'A concise walkthrough of forward invariance, Nagumo conditions, and QP-based safety filters.',
              tags: ['CBFs', 'Safety', 'Notes'],
              buttonLabel: 'READ NOTE →',
              detailMode: 'inline',
              noteBody: '**Why Barrier Functions?**\nGiven a safe set C = {x : h(x) >= 0}, we want every trajectory starting inside C to stay inside C for all future time.\n\n**Key Takeaways**\n- Enforce dh/dt >= -alpha(h(x)) via a lightweight quadratic program.\n- Combine nominal performance controllers with minimal-intervention safety filters.',
              target: ''
            },
            {
              category: 'SYSTEMS',
              date: '2026-09-04',
              readTime: '4 MIN READ',
              title: 'Designing Zero-Build Retro Interfaces',
              summary: 'Lessons learned building crisp 1-bit shadows, pixel icons, and fast static sites without bundlers.',
              tags: ['UI', 'WebPerf', 'Retro'],
              buttonLabel: 'READ NOTE →',
              detailMode: 'inline',
              noteBody: '**Constraints Breed Clarity**\nUsing plain HTML, CSS custom properties, and modular vanilla JS keeps bundle size tiny and maintenance effortless.\n\n**Tips**\n- Use shape-rendering: crispEdges on pixel SVGs.\n- Keep interactive state scoped to the component root.',
              target: ''
            }
          ]
        };
      case 'custom_html':
        return {
          id,
          type: 'custom_html',
          heading: 'Custom HTML Block',
          html: '<div style="padding:12px; border:2px solid #000;">Custom HTML content</div>'
        };
      default:
        return { id, type: 'rich_text', heading: 'New Block', paragraphs: [''] };
    }
  }

  // ===================================================
  // LEFT SIDEBAR: TABS & MENU BAR
  // ===================================================

  function moveArrayItem(arr, index, delta) {
    const next = index + delta;
    if (next < 0 || next >= arr.length) return false;
    const [item] = arr.splice(index, 1);
    arr.splice(next, 0, item);
    return true;
  }

  function renderSidebar() {
    renderTabsList();
    renderMenuLinksList();
  }

  function renderTabsList() {
    const listEl = $('tabs-list');
    if (!listEl || !state.content) return;
    listEl.innerHTML = '';

    const tabs = state.content.tabs;
    if (tabs.length === 0) {
      listEl.appendChild(el('div', { className: 'empty-state', textContent: 'No tabs yet. Add one above.' }));
      return;
    }

    tabs.forEach((tab, index) => {
      const isSelected = tab.id === state.selectedTabId;
      const row = el('div', {
        className: `tab-row ${isSelected ? 'selected' : ''}`,
        draggable: 'true',
        onClick: (e) => {
          if (e.target.closest('button') || e.target.closest('input') || e.target.closest('label')) return;
          state.selectedTabId = tab.id;
          syncPreviewAndDraft();
          renderSidebar();
          renderEditor();
          updateToolbarButtons();
        }
      });

      row.addEventListener('dragstart', (e) => {
        state.dragTabIndex = index;
        row.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(index));
      });
      row.addEventListener('dragend', () => {
        state.dragTabIndex = null;
        row.classList.remove('dragging');
        listEl.querySelectorAll('.tab-row').forEach((n) => n.classList.remove('drag-over'));
      });
      row.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        row.classList.add('drag-over');
      });
      row.addEventListener('dragleave', () => row.classList.remove('drag-over'));
      row.addEventListener('drop', (e) => {
        e.preventDefault();
        row.classList.remove('drag-over');
        if (state.dragTabIndex === null || state.dragTabIndex === index) return;
        pushUndoSnapshot();
        const [moved] = tabs.splice(state.dragTabIndex, 1);
        tabs.splice(index, 0, moved);
        state.dragTabIndex = null;
        markChanged({ sidebar: true });
      });

      const topRow = el('div', { className: 'tab-row-top' }, [
        el('div', { className: 'tab-row-identity' }, [
          el('span', { className: 'tab-icon-box', innerHTML: getIconSvg(tab.icon) }),
          el('div', { className: 'tab-row-names' }, [
            el('div', { className: 'tab-row-label', textContent: getTabDisplayLabel(tab) }),
            el('div', { className: 'tab-row-id', textContent: `#${tab.id}` })
          ])
        ]),
        el('div', { className: 'tab-row-actions' }, [
          el('button', {
            type: 'button',
            className: 'mac-btn mac-btn-xs',
            textContent: '↑',
            title: 'Move tab up',
            disabled: index === 0,
            onClick: () => {
              pushUndoSnapshot();
              if (moveArrayItem(tabs, index, -1)) markChanged({ sidebar: true });
            }
          }),
          el('button', {
            type: 'button',
            className: 'mac-btn mac-btn-xs',
            textContent: '↓',
            title: 'Move tab down',
            disabled: index === tabs.length - 1,
            onClick: () => {
              pushUndoSnapshot();
              if (moveArrayItem(tabs, index, 1)) markChanged({ sidebar: true });
            }
          }),
          el('button', {
            type: 'button',
            className: 'mac-btn mac-btn-xs',
            textContent: '✕',
            title: 'Delete tab',
            onClick: async () => {
              const ok = await askConfirm(
                `Delete tab "${getTabDisplayLabel(tab)}" (#${tab.id}) across all languages?`,
                'Delete Tab',
                true
              );
              if (!ok) return;
              pushUndoSnapshot();
              tabs.splice(index, 1);
              if (state.content.site.defaultCenterTabId === tab.id) {
                state.content.site.defaultCenterTabId = tabs.find((t) => t.isCenter)?.id || tabs[0]?.id || '';
              }
              if (state.selectedTabId === tab.id) {
                state.selectedTabId = tabs[0]?.id || null;
              }
              markChanged({ sidebar: true, rerender: true });
              updateToolbarButtons();
            }
          })
        ])
      ]);

      const togglesRow = el('div', { className: 'tab-row-toggles' }, [
        el('label', { className: 'mini-check' }, [
          el('input', {
            type: 'checkbox',
            checked: tab.showInDesktop !== false,
            onChange: (e) => {
              pushUndoSnapshot();
              tab.showInDesktop = e.target.checked;
              markChanged({ rerender: tab.id === state.selectedTabId });
            }
          }),
          el('span', { textContent: 'Show on Desktop' })
        ]),
        el('label', { className: 'mini-check' }, [
          el('input', {
            type: 'checkbox',
            checked: Boolean(tab.isCenter),
            onChange: (e) => {
              pushUndoSnapshot();
              const checked = e.target.checked;
              tabs.forEach((t) => {
                t.isCenter = checked ? t.id === tab.id : false;
              });
              state.content.site.defaultCenterTabId = checked ? tab.id : '';
              markChanged({ sidebar: true, rerender: true });
            }
          }),
          el('span', { textContent: 'Center Button' })
        ])
      ]);

      row.appendChild(topRow);
      row.appendChild(togglesRow);
      listEl.appendChild(row);
    });
  }

  function renderMenuLinksList() {
    const listEl = $('menu-links-list');
    if (!listEl || !state.content) return;
    listEl.innerHTML = '';

    const menuLinks = state.content.site.menuLinks;
    if (menuLinks.length === 0) {
      listEl.appendChild(el('div', { className: 'empty-state', textContent: 'No top menu links.' }));
      return;
    }

    const tabs = state.content.tabs;

    menuLinks.forEach((link, idx) => {
      if (!link.labels || typeof link.labels !== 'object') link.labels = {};

      const card = el('div', { className: 'menu-link-row' });

      const head = el('div', { className: 'menu-link-head' }, [
        el('span', { className: 'menu-link-badge', textContent: link.id || `menu-${idx + 1}` }),
        el('div', { className: 'tab-row-actions' }, [
          el('button', {
            type: 'button',
            className: 'mac-btn mac-btn-xs',
            textContent: '↑',
            disabled: idx === 0,
            onClick: () => {
              pushUndoSnapshot();
              if (moveArrayItem(menuLinks, idx, -1)) markChanged({ sidebar: true });
            }
          }),
          el('button', {
            type: 'button',
            className: 'mac-btn mac-btn-xs',
            textContent: '↓',
            disabled: idx === menuLinks.length - 1,
            onClick: () => {
              pushUndoSnapshot();
              if (moveArrayItem(menuLinks, idx, 1)) markChanged({ sidebar: true });
            }
          }),
          el('button', {
            type: 'button',
            className: 'mac-btn mac-btn-xs',
            textContent: '✕',
            onClick: () => {
              pushUndoSnapshot();
              menuLinks.splice(idx, 1);
              markChanged({ sidebar: true });
            }
          })
        ])
      ]);

      const labelInput = el('input', {
        type: 'text',
        className: 'mac-input mac-input-sm',
        placeholder: `Label (${state.lang})`,
        value: link.labels[state.lang] ?? link.labels.en ?? '',
        onInput: (e) => {
          pushUndoSnapshot(true);
          link.labels[state.lang] = e.target.value;
          markChanged();
        }
      });

      const actionSelect = el('select', {
        className: 'mac-select mac-select-sm',
        onChange: (e) => {
          pushUndoSnapshot();
          link.action = e.target.value;
          if (link.action === 'page' && !link.pageId && tabs.length > 0) {
            link.pageId = tabs[0].id;
          }
          markChanged({ sidebar: true });
        }
      }, [
        el('option', { value: 'home', textContent: 'Go Home' }),
        el('option', { value: 'page', textContent: 'Open Tab' })
      ]);
      actionSelect.value = link.action === 'home' ? 'home' : 'page';

      const targetSelect = el('select', {
        className: 'mac-select mac-select-sm',
        disabled: link.action === 'home',
        onChange: (e) => {
          pushUndoSnapshot();
          link.pageId = e.target.value;
          markChanged();
        }
      }, tabs.map((t) => el('option', { value: t.id, textContent: `${getTabDisplayLabel(t)} (${t.id})` })));
      if (link.pageId) targetSelect.value = link.pageId;

      const boldToggle = el('label', { className: 'mini-check' }, [
        el('input', {
          type: 'checkbox',
          checked: Boolean(link.bold),
          onChange: (e) => {
            pushUndoSnapshot();
            link.bold = e.target.checked;
            markChanged();
          }
        }),
        el('span', { textContent: 'Bold' })
      ]);

      const grid = el('div', { className: 'menu-link-grid' }, [
        el('label', { className: 'field' }, [
          el('span', { className: 'field-label', textContent: `Label (${LANG_META[state.lang].label})` }),
          labelInput
        ]),
        el('label', { className: 'field' }, [
          el('span', { className: 'field-label', textContent: 'Action' }),
          actionSelect
        ]),
        link.action === 'page'
          ? el('label', { className: 'field' }, [
              el('span', { className: 'field-label', textContent: 'Target Tab' }),
              targetSelect
            ])
          : el('div', { className: 'field' }, [
              el('span', { className: 'field-label', textContent: 'Target' }),
              el('span', { className: 'field-hint', textContent: 'Desktop Home' })
            ]),
        el('div', { className: 'field', style: 'justify-content: flex-end;' }, [boldToggle])
      ]);

      card.appendChild(head);
      card.appendChild(grid);
      listEl.appendChild(card);
    });
  }

  // ===================================================
  // FORM FIELD HELPERS FOR BLOCK EDITOR
  // ===================================================

  function makeTextField(labelText, value, onChange, options = {}) {
    const { placeholder = '', hint = '', multiline = false, rows = 3, code = false, type = 'text', min, max } = options;
    const input = multiline
      ? el('textarea', {
          className: `mac-textarea ${code ? 'code-input' : ''}`,
          rows,
          placeholder,
          value: value ?? '',
          onInput: (e) => onChange(e.target.value)
        })
      : el('input', {
          type,
          className: 'mac-input',
          placeholder,
          value: value ?? '',
          min,
          max,
          onInput: (e) => onChange(e.target.value)
        });

    return el('label', { className: 'field' }, [
      el('span', { className: 'field-label', textContent: labelText }),
      input,
      hint ? el('span', { className: 'field-hint', textContent: hint }) : null
    ]);
  }

  function makeSelectField(labelText, value, choices, onChange) {
    const select = el(
      'select',
      {
        className: 'mac-select',
        onChange: (e) => onChange(e.target.value)
      },
      choices.map((c) => el('option', { value: c.value, textContent: c.label }))
    );
    select.value = value ?? choices[0]?.value ?? '';
    return el('label', { className: 'field' }, [
      el('span', { className: 'field-label', textContent: labelText }),
      select
    ]);
  }

  function makeCheckboxField(labelText, checked, onChange, hint = '') {
    return el('div', { className: 'field', style: 'justify-content: flex-end;' }, [
      el('label', { className: 'check-label' }, [
        el('input', {
          type: 'checkbox',
          checked: Boolean(checked),
          onChange: (e) => onChange(e.target.checked)
        }),
        el('span', { textContent: labelText })
      ]),
      hint ? el('span', { className: 'field-hint', textContent: hint }) : null
    ]);
  }

  function makeActionTargetField(labelText, actionType, targetValue, onChange) {
    const tabs = state.content?.tabs || [];
    if (actionType === 'page' && tabs.length > 0) {
      const choices = tabs.map((t) => ({ value: t.id, label: `${getTabDisplayLabel(t)} (${t.id})` }));
      if (targetValue && !tabs.some((t) => t.id === targetValue)) {
        choices.unshift({ value: targetValue, label: targetValue });
      }
      return makeSelectField(labelText, targetValue || tabs[0].id, choices, onChange);
    }
    return makeTextField(labelText, targetValue || '', onChange, {
      placeholder: actionType === 'url' ? 'https://...' : 'None'
    });
  }

  function makeReorderControls(arr, idx, onRerender) {
    return el('div', { className: 'tab-row-actions' }, [
      el('button', {
        type: 'button',
        className: 'mac-btn mac-btn-xs',
        textContent: '↑',
        disabled: idx === 0,
        onClick: () => {
          pushUndoSnapshot();
          if (moveArrayItem(arr, idx, -1)) {
            onRerender();
            markChanged();
          }
        }
      }),
      el('button', {
        type: 'button',
        className: 'mac-btn mac-btn-xs',
        textContent: '↓',
        disabled: idx === arr.length - 1,
        onClick: () => {
          pushUndoSnapshot();
          if (moveArrayItem(arr, idx, 1)) {
            onRerender();
            markChanged();
          }
        }
      }),
      el('button', {
        type: 'button',
        className: 'mac-btn mac-btn-xs',
        textContent: '✕',
        onClick: () => {
          pushUndoSnapshot();
          arr.splice(idx, 1);
          onRerender();
          markChanged();
        }
      })
    ]);
  }

  function makeStringListEditor(labelText, itemsArray, options = {}) {
    const { addLabel = '+ Add Item', placeholder = 'Enter text...', defaultItem = '' } = options;
    const section = el('div', { className: 'sublist-section' });

    const renderList = () => {
      section.innerHTML = '';
      section.appendChild(
        el('div', { className: 'sublist-header' }, [
          el('span', { className: 'field-label', textContent: labelText }),
          el('button', {
            type: 'button',
            className: 'mac-btn mac-btn-xs',
            textContent: addLabel,
            onClick: () => {
              pushUndoSnapshot();
              itemsArray.push(defaultItem);
              renderList();
              markChanged();
            }
          })
        ])
      );

      itemsArray.forEach((val, idx) => {
        section.appendChild(
          el('div', { className: 'sublist-item-row' }, [
            el('input', {
              type: 'text',
              className: 'mac-input mac-input-sm',
              placeholder,
              value: val ?? '',
              onInput: (e) => {
                pushUndoSnapshot(true);
                itemsArray[idx] = e.target.value;
                markChanged();
              }
            }),
            makeReorderControls(itemsArray, idx, renderList)
          ])
        );
      });
    };

    renderList();
    return section;
  }

  function makeLinksListEditor(labelText, linksArray, addLabel = '+ Add Link') {
    const section = el('div', { className: 'sublist-section' });

    const renderLinks = () => {
      section.innerHTML = '';
      section.appendChild(
        el('div', { className: 'sublist-header' }, [
          el('span', { className: 'field-label', textContent: labelText }),
          el('button', {
            type: 'button',
            className: 'mac-btn mac-btn-xs',
            textContent: addLabel,
            onClick: () => {
              pushUndoSnapshot();
              linksArray.push({ label: 'LINK ↗', url: 'https://' });
              renderLinks();
              markChanged();
            }
          })
        ])
      );

      linksArray.forEach((lnk, idx) => {
        section.appendChild(
          el('div', { className: 'sublist-item' }, [
            el('div', { className: 'sublist-item-head' }, [
              el('span', { className: 'sublist-index', textContent: `LINK #${idx + 1}` }),
              makeReorderControls(linksArray, idx, renderLinks)
            ]),
            el('div', { className: 'field-grid-2' }, [
              makeTextField('Label', lnk.label, (v) => {
                pushUndoSnapshot(true);
                lnk.label = v;
                markChanged();
              }),
              makeTextField('URL', lnk.url, (v) => {
                pushUndoSnapshot(true);
                lnk.url = v;
                markChanged();
              }, { placeholder: 'https://...' })
            ])
          ])
        );
      });
    };

    renderLinks();
    return section;
  }

  function makeTagChipsEditor(labelText, tagsArray, options = {}) {
    const { defaultTag = '#NewTag', addLabel = '+ Tag' } = typeof options === 'object' && options !== null ? options : {};
    const chipsWrap = el('div', { className: 'tag-chips-row' });

    const renderChips = () => {
      chipsWrap.innerHTML = '';
      tagsArray.forEach((tag, idx) => {
        const chip = el('span', { className: 'tag-chip-editor' }, [
          el('input', {
            type: 'text',
            value: tag,
            onInput: (e) => {
              pushUndoSnapshot(true);
              tagsArray[idx] = e.target.value;
              markChanged();
            }
          }),
          el('button', {
            type: 'button',
            title: 'Remove tag',
            textContent: '×',
            onClick: () => {
              pushUndoSnapshot();
              tagsArray.splice(idx, 1);
              renderChips();
              markChanged();
            }
          })
        ]);
        chipsWrap.appendChild(chip);
      });

      chipsWrap.appendChild(
        el('button', {
          type: 'button',
          className: 'mac-btn mac-btn-xs',
          textContent: addLabel,
          onClick: () => {
            pushUndoSnapshot();
            tagsArray.push(defaultTag);
            renderChips();
            markChanged();
          }
        })
      );
    };

    renderChips();
    return el('div', { className: 'sublist-section' }, [
      el('div', { className: 'sublist-header' }, [
        el('span', { className: 'field-label', textContent: labelText })
      ]),
      chipsWrap
    ]);
  }

  // ===================================================
  // BLOCK SPECIFIC EDITORS (All 14 Block Types)
  // ===================================================

  function renderBlockBody(block, onSummaryChange) {
    const container = el('div', { className: 'block-card-body' });

    switch (block.type) {
      case 'hero_profile': {
        if (!Array.isArray(block.tags)) block.tags = [];
        if (!Array.isArray(block.actions)) block.actions = [];

        container.appendChild(
          el('div', { className: 'field-grid-2' }, [
            makeTextField('Topbar Left', block.topbarLeft, (v) => {
              pushUndoSnapshot(true);
              block.topbarLeft = v;
              markChanged();
            }),
            makeTextField('Status Badge', block.statusBadge, (v) => {
              pushUndoSnapshot(true);
              block.statusBadge = v;
              markChanged();
            }),
            makeTextField('Name', block.name, (v) => {
              pushUndoSnapshot(true);
              block.name = v;
              onSummaryChange();
              markChanged();
            }),
            makeTextField('Name Note (e.g. Chinese name)', block.nameNote, (v) => {
              pushUndoSnapshot(true);
              block.nameNote = v;
              markChanged();
            }),
            makeTextField('Role / Headline', block.role, (v) => {
              pushUndoSnapshot(true);
              block.role = v;
              markChanged();
            }),
            makeTextField('Avatar Image Path / URL', block.avatar, (v) => {
              pushUndoSnapshot(true);
              block.avatar = v;
              markChanged();
            }, { placeholder: '/pictures/me.jpeg' })
          ])
        );

        container.appendChild(makeTagChipsEditor('Profile Tags', block.tags));

        // Actions list
        const actionsList = el('div', { className: 'sublist-section' });
        const renderActions = () => {
          actionsList.innerHTML = '';
          actionsList.appendChild(
            el('div', { className: 'sublist-header' }, [
              el('span', { className: 'field-label', textContent: 'Action Buttons' }),
              el('button', {
                type: 'button',
                className: 'mac-btn mac-btn-xs',
                textContent: '+ Add Action',
                onClick: () => {
                  pushUndoSnapshot();
                  block.actions.push({
                    label: 'NEW LINK →',
                    style: 'default',
                    actionType: 'page',
                    target: state.content.tabs[0]?.id || 'about'
                  });
                  renderActions();
                  markChanged();
                }
              })
            ])
          );

          block.actions.forEach((act, idx) => {
            const itemBox = el('div', { className: 'sublist-item' }, [
              el('div', { className: 'sublist-item-head' }, [
                el('span', { className: 'sublist-index', textContent: `ACTION #${idx + 1}` }),
                el('div', { className: 'tab-row-actions' }, [
                  el('button', {
                    type: 'button',
                    className: 'mac-btn mac-btn-xs',
                    textContent: '↑',
                    disabled: idx === 0,
                    onClick: () => {
                      pushUndoSnapshot();
                      if (moveArrayItem(block.actions, idx, -1)) {
                        renderActions();
                        markChanged();
                      }
                    }
                  }),
                  el('button', {
                    type: 'button',
                    className: 'mac-btn mac-btn-xs',
                    textContent: '↓',
                    disabled: idx === block.actions.length - 1,
                    onClick: () => {
                      pushUndoSnapshot();
                      if (moveArrayItem(block.actions, idx, 1)) {
                        renderActions();
                        markChanged();
                      }
                    }
                  }),
                  el('button', {
                    type: 'button',
                    className: 'mac-btn mac-btn-xs',
                    textContent: '✕',
                    onClick: () => {
                      pushUndoSnapshot();
                      block.actions.splice(idx, 1);
                      renderActions();
                      markChanged();
                    }
                  })
                ])
              ]),
              el('div', { className: 'field-grid-2' }, [
                makeTextField('Button Label', act.label, (v) => {
                  pushUndoSnapshot(true);
                  act.label = v;
                  markChanged();
                }),
                makeSelectField('Style', act.style || 'default', [
                  { value: 'primary', label: 'Primary (Black)' },
                  { value: 'default', label: 'Default (White)' }
                ], (v) => {
                  pushUndoSnapshot();
                  act.style = v;
                  markChanged();
                }),
                makeSelectField('Action Type', act.actionType || 'page', [
                  { value: 'page', label: 'Open Tab' },
                  { value: 'url', label: 'External URL' }
                ], (v) => {
                  pushUndoSnapshot();
                  act.actionType = v;
                  if (v === 'page' && (!act.target || act.target.startsWith('http'))) {
                    act.target = state.content.tabs[0]?.id || 'about';
                  }
                  renderActions();
                  markChanged();
                }),
                makeActionTargetField('Target', act.actionType || 'page', act.target, (v) => {
                  pushUndoSnapshot(true);
                  act.target = v;
                  markChanged();
                })
              ])
            ]);
            actionsList.appendChild(itemBox);
          });
        };
        renderActions();
        container.appendChild(actionsList);
        break;
      }

      case 'rich_text': {
        if (!Array.isArray(block.paragraphs)) block.paragraphs = [];
        container.appendChild(
          makeTextField('Section Heading', block.heading, (v) => {
            pushUndoSnapshot(true);
            block.heading = v;
            onSummaryChange();
            markChanged();
          })
        );

        const paraSection = el('div', { className: 'sublist-section' });
        const renderParagraphs = () => {
          paraSection.innerHTML = '';
          paraSection.appendChild(
            el('div', { className: 'sublist-header' }, [
              el('span', { className: 'field-label', textContent: 'Paragraphs (supports **bold** & [link](url))' }),
              el('button', {
                type: 'button',
                className: 'mac-btn mac-btn-xs',
                textContent: '+ Add Paragraph',
                onClick: () => {
                  pushUndoSnapshot();
                  block.paragraphs.push('');
                  renderParagraphs();
                  markChanged();
                }
              })
            ])
          );

          block.paragraphs.forEach((para, idx) => {
            paraSection.appendChild(
              el('div', { className: 'sublist-item' }, [
                el('div', { className: 'sublist-item-head' }, [
                  el('span', { className: 'sublist-index', textContent: `PARAGRAPH #${idx + 1}` }),
                  el('div', { className: 'tab-row-actions' }, [
                    el('button', {
                      type: 'button',
                      className: 'mac-btn mac-btn-xs',
                      textContent: '↑',
                      disabled: idx === 0,
                      onClick: () => {
                        pushUndoSnapshot();
                        if (moveArrayItem(block.paragraphs, idx, -1)) {
                          renderParagraphs();
                          markChanged();
                        }
                      }
                    }),
                    el('button', {
                      type: 'button',
                      className: 'mac-btn mac-btn-xs',
                      textContent: '↓',
                      disabled: idx === block.paragraphs.length - 1,
                      onClick: () => {
                        pushUndoSnapshot();
                        if (moveArrayItem(block.paragraphs, idx, 1)) {
                          renderParagraphs();
                          markChanged();
                        }
                      }
                    }),
                    el('button', {
                      type: 'button',
                      className: 'mac-btn mac-btn-xs',
                      textContent: '✕',
                      onClick: () => {
                        pushUndoSnapshot();
                        block.paragraphs.splice(idx, 1);
                        renderParagraphs();
                        markChanged();
                      }
                    })
                  ])
                ]),
                el('textarea', {
                  className: 'mac-textarea',
                  rows: 4,
                  value: para,
                  onInput: (e) => {
                    pushUndoSnapshot(true);
                    block.paragraphs[idx] = e.target.value;
                    markChanged();
                  }
                })
              ])
            );
          });
        };
        renderParagraphs();
        container.appendChild(paraSection);
        break;
      }

      case 'bento_grid': {
        if (!Array.isArray(block.items)) block.items = [];
        container.appendChild(
          el('div', { className: 'field-grid-2' }, [
            makeTextField('Grid Heading', block.heading, (v) => {
              pushUndoSnapshot(true);
              block.heading = v;
              onSummaryChange();
              markChanged();
            }),
            makeSelectField('Columns', String(block.columns || 2), [
              { value: '1', label: '1 Column' },
              { value: '2', label: '2 Columns' },
              { value: '3', label: '3 Columns' }
            ], (v) => {
              pushUndoSnapshot();
              block.columns = Number(v);
              markChanged();
            })
          ])
        );

        const itemsSection = el('div', { className: 'sublist-section' });
        const renderItems = () => {
          itemsSection.innerHTML = '';
          itemsSection.appendChild(
            el('div', { className: 'sublist-header' }, [
              el('span', { className: 'field-label', textContent: 'Bento Cards' }),
              el('button', {
                type: 'button',
                className: 'mac-btn mac-btn-xs',
                textContent: '+ Add Bento Card',
                onClick: () => {
                  pushUndoSnapshot();
                  const nextNum = String(block.items.length + 1).padStart(2, '0');
                  block.items.push({ indexLabel: nextNum, title: 'New Focus Area', description: '' });
                  renderItems();
                  markChanged();
                }
              })
            ])
          );

          block.items.forEach((item, idx) => {
            itemsSection.appendChild(
              el('div', { className: 'sublist-item' }, [
                el('div', { className: 'sublist-item-head' }, [
                  el('span', { className: 'sublist-index', textContent: `BENTO CARD #${idx + 1}` }),
                  el('div', { className: 'tab-row-actions' }, [
                    el('button', {
                      type: 'button',
                      className: 'mac-btn mac-btn-xs',
                      textContent: '↑',
                      disabled: idx === 0,
                      onClick: () => {
                        pushUndoSnapshot();
                        if (moveArrayItem(block.items, idx, -1)) {
                          renderItems();
                          markChanged();
                        }
                      }
                    }),
                    el('button', {
                      type: 'button',
                      className: 'mac-btn mac-btn-xs',
                      textContent: '↓',
                      disabled: idx === block.items.length - 1,
                      onClick: () => {
                        pushUndoSnapshot();
                        if (moveArrayItem(block.items, idx, 1)) {
                          renderItems();
                          markChanged();
                        }
                      }
                    }),
                    el('button', {
                      type: 'button',
                      className: 'mac-btn mac-btn-xs',
                      textContent: '✕',
                      onClick: () => {
                        pushUndoSnapshot();
                        block.items.splice(idx, 1);
                        renderItems();
                        markChanged();
                      }
                    })
                  ])
                ]),
                el('div', { className: 'field-grid-2' }, [
                  makeTextField('Index Label', item.indexLabel, (v) => {
                    pushUndoSnapshot(true);
                    item.indexLabel = v;
                    markChanged();
                  }, { placeholder: '01' }),
                  makeTextField('Card Title', item.title, (v) => {
                    pushUndoSnapshot(true);
                    item.title = v;
                    markChanged();
                  })
                ]),
                makeTextField('Description', item.description, (v) => {
                  pushUndoSnapshot(true);
                  item.description = v;
                  markChanged();
                }, { multiline: true, rows: 3 })
              ])
            );
          });
        };
        renderItems();
        container.appendChild(itemsSection);
        break;
      }

      case 'quote_log': {
        container.appendChild(
          makeTextField('Log Header Bar', block.headerBar, (v) => {
            pushUndoSnapshot(true);
            block.headerBar = v;
            onSummaryChange();
            markChanged();
          }, { placeholder: 'PHILOSOPHY.LOG' })
        );
        container.appendChild(
          makeTextField('Quote Text', block.quote, (v) => {
            pushUndoSnapshot(true);
            block.quote = v;
            markChanged();
          }, { multiline: true, rows: 2 })
        );
        container.appendChild(
          makeTextField('Supporting Body', block.body, (v) => {
            pushUndoSnapshot(true);
            block.body = v;
            markChanged();
          }, { multiline: true, rows: 3 })
        );
        break;
      }

      case 'cards_grid': {
        if (!Array.isArray(block.items)) block.items = [];
        container.appendChild(
          el('div', { className: 'field-grid-2' }, [
            makeTextField('Grid Heading', block.heading, (v) => {
              pushUndoSnapshot(true);
              block.heading = v;
              onSummaryChange();
              markChanged();
            }),
            makeSelectField('Columns', String(block.columns || 2), [
              { value: '1', label: '1 Column' },
              { value: '2', label: '2 Columns' },
              { value: '3', label: '3 Columns' }
            ], (v) => {
              pushUndoSnapshot();
              block.columns = Number(v);
              markChanged();
            })
          ])
        );

        const cardsSection = el('div', { className: 'sublist-section' });
        const renderCards = () => {
          cardsSection.innerHTML = '';
          cardsSection.appendChild(
            el('div', { className: 'sublist-header' }, [
              el('span', { className: 'field-label', textContent: 'Track / Showcase Cards' }),
              el('button', {
                type: 'button',
                className: 'mac-btn mac-btn-xs',
                textContent: '+ Add Card',
                onClick: () => {
                  pushUndoSnapshot();
                  block.items.push({
                    badge: 'NEW',
                    badgeStyle: 'solid',
                    title: 'Card Title',
                    subtitle: '',
                    description: '',
                    tags: [],
                    buttonLabel: 'EXPLORE →',
                    actionType: 'none',
                    target: ''
                  });
                  renderCards();
                  markChanged();
                }
              })
            ])
          );

          block.items.forEach((card, idx) => {
            if (!Array.isArray(card.tags)) card.tags = [];
            const cardBox = el('div', { className: 'sublist-item' }, [
              el('div', { className: 'sublist-item-head' }, [
                el('span', { className: 'sublist-index', textContent: `CARD #${idx + 1}` }),
                el('div', { className: 'tab-row-actions' }, [
                  el('button', {
                    type: 'button',
                    className: 'mac-btn mac-btn-xs',
                    textContent: '↑',
                    disabled: idx === 0,
                    onClick: () => {
                      pushUndoSnapshot();
                      if (moveArrayItem(block.items, idx, -1)) {
                        renderCards();
                        markChanged();
                      }
                    }
                  }),
                  el('button', {
                    type: 'button',
                    className: 'mac-btn mac-btn-xs',
                    textContent: '↓',
                    disabled: idx === block.items.length - 1,
                    onClick: () => {
                      pushUndoSnapshot();
                      if (moveArrayItem(block.items, idx, 1)) {
                        renderCards();
                        markChanged();
                      }
                    }
                  }),
                  el('button', {
                    type: 'button',
                    className: 'mac-btn mac-btn-xs',
                    textContent: '✕',
                    onClick: () => {
                      pushUndoSnapshot();
                      block.items.splice(idx, 1);
                      renderCards();
                      markChanged();
                    }
                  })
                ])
              ]),
              el('div', { className: 'field-grid-2' }, [
                makeTextField('Badge', card.badge, (v) => {
                  pushUndoSnapshot(true);
                  card.badge = v;
                  markChanged();
                }),
                makeSelectField('Badge Style', card.badgeStyle || 'solid', [
                  { value: 'solid', label: 'Solid (Black)' },
                  { value: 'outline', label: 'Outline (White)' }
                ], (v) => {
                  pushUndoSnapshot();
                  card.badgeStyle = v;
                  markChanged();
                }),
                makeTextField('Title', card.title, (v) => {
                  pushUndoSnapshot(true);
                  card.title = v;
                  markChanged();
                }),
                makeTextField('Subtitle', card.subtitle, (v) => {
                  pushUndoSnapshot(true);
                  card.subtitle = v;
                  markChanged();
                })
              ]),
              makeTextField('Description', card.description, (v) => {
                pushUndoSnapshot(true);
                card.description = v;
                markChanged();
              }, { multiline: true, rows: 3 }),
              makeTagChipsEditor('Card Tags', card.tags),
              el('div', { className: 'field-grid-3' }, [
                makeTextField('Button Label', card.buttonLabel, (v) => {
                  pushUndoSnapshot(true);
                  card.buttonLabel = v;
                  markChanged();
                }),
                makeSelectField('Button Action', card.actionType || 'none', [
                  { value: 'none', label: 'None / Disabled' },
                  { value: 'page', label: 'Open Tab' },
                  { value: 'url', label: 'External URL' }
                ], (v) => {
                  pushUndoSnapshot();
                  card.actionType = v;
                  if (v === 'page' && (!card.target || card.target.startsWith('http'))) {
                    card.target = state.content.tabs[0]?.id || 'about';
                  }
                  renderCards();
                  markChanged();
                }),
                makeActionTargetField('Button Target', card.actionType || 'none', card.target, (v) => {
                  pushUndoSnapshot(true);
                  card.target = v;
                  markChanged();
                })
              ])
            ]);
            cardsSection.appendChild(cardBox);
          });
        };
        renderCards();
        container.appendChild(cardsSection);
        break;
      }

      case 'status_notice': {
        container.appendChild(
          el('div', { className: 'field-grid-2' }, [
            makeTextField('Top Badge', block.topBadge, (v) => {
              pushUndoSnapshot(true);
              block.topBadge = v;
              markChanged();
            }),
            makeTextField('Title', block.title, (v) => {
              pushUndoSnapshot(true);
              block.title = v;
              onSummaryChange();
              markChanged();
            })
          ])
        );
        container.appendChild(
          makeTextField('Body Copy', block.body, (v) => {
            pushUndoSnapshot(true);
            block.body = v;
            markChanged();
          }, { multiline: true, rows: 3 })
        );
        container.appendChild(
          el('div', { className: 'field-grid-3' }, [
            makeTextField('Inner Box Label', block.innerLabel, (v) => {
              pushUndoSnapshot(true);
              block.innerLabel = v;
              markChanged();
            }),
            makeTextField('Inner Box Text', block.innerText, (v) => {
              pushUndoSnapshot(true);
              block.innerText = v;
              markChanged();
            }),
            makeSelectField('Inner Icon', block.innerIcon || 'lock', [
              { value: 'lock', label: 'Lock (CV)' },
              { value: 'monitor', label: 'Monitor (Projects)' },
              { value: 'scale', label: 'Scale (Research)' },
              { value: 'pen', label: 'Pen (Notes)' }
            ], (v) => {
              pushUndoSnapshot();
              block.innerIcon = v;
              markChanged();
            })
          ])
        );
        container.appendChild(
          el('div', { className: 'field-grid-3' }, [
            makeTextField('Button Text', block.buttonText, (v) => {
              pushUndoSnapshot(true);
              block.buttonText = v;
              markChanged();
            }),
            makeSelectField('Button Action', block.buttonActionType || 'none', [
              { value: 'none', label: 'None' },
              { value: 'page', label: 'Open Tab' },
              { value: 'url', label: 'External URL' }
            ], (v) => {
              pushUndoSnapshot();
              block.buttonActionType = v;
              if (v === 'page' && (!block.buttonTarget || block.buttonTarget.startsWith('http'))) {
                block.buttonTarget = state.content.tabs[0]?.id || 'about';
              }
              markChanged({ rerender: true });
            }),
            makeActionTargetField('Button Target', block.buttonActionType || 'none', block.buttonTarget, (v) => {
              pushUndoSnapshot(true);
              block.buttonTarget = v;
              markChanged();
            })
          ])
        );
        container.appendChild(
          el('div', { className: 'field-grid-2' }, [
            makeTextField('Button Tooltip', block.buttonTooltip, (v) => {
              pushUndoSnapshot(true);
              block.buttonTooltip = v;
              markChanged();
            }),
            el('div', { className: 'field', style: 'justify-content: flex-end;' }, [
              el('label', { className: 'check-label' }, [
                el('input', {
                  type: 'checkbox',
                  checked: Boolean(block.buttonLocked),
                  onChange: (e) => {
                    pushUndoSnapshot();
                    block.buttonLocked = e.target.checked;
                    markChanged();
                  }
                }),
                el('span', { textContent: 'Button Locked (Show Padlock / Disabled)' })
              ])
            ])
          ])
        );
        break;
      }

      case 'contact_card': {
        if (!Array.isArray(block.socialLinks)) block.socialLinks = [];
        container.appendChild(
          el('div', { className: 'field-grid-2' }, [
            makeTextField('Topbar Left', block.topbarLeft, (v) => {
              pushUndoSnapshot(true);
              block.topbarLeft = v;
              markChanged();
            }),
            makeTextField('Status Badge', block.statusBadge, (v) => {
              pushUndoSnapshot(true);
              block.statusBadge = v;
              markChanged();
            }),
            makeTextField('Email Label', block.emailLabel, (v) => {
              pushUndoSnapshot(true);
              block.emailLabel = v;
              markChanged();
            }),
            makeTextField('Email Address', block.email, (v) => {
              pushUndoSnapshot(true);
              block.email = v;
              onSummaryChange();
              markChanged();
            }),
            makeTextField('Copy Button Label', block.copyLabel, (v) => {
              pushUndoSnapshot(true);
              block.copyLabel = v;
              markChanged();
            }),
            makeTextField('Copied Feedback Label', block.copiedLabel, (v) => {
              pushUndoSnapshot(true);
              block.copiedLabel = v;
              markChanged();
            }),
            makeTextField('Mail App Button Label', block.mailAppLabel, (v) => {
              pushUndoSnapshot(true);
              block.mailAppLabel = v;
              markChanged();
            }),
            makeTextField('Mailto Address', block.mailto, (v) => {
              pushUndoSnapshot(true);
              block.mailto = v;
              markChanged();
            }),
            makeTextField('Profiles Heading', block.profilesLabel, (v) => {
              pushUndoSnapshot(true);
              block.profilesLabel = v;
              markChanged();
            }),
            makeTextField('Location Label', block.locationLabel, (v) => {
              pushUndoSnapshot(true);
              block.locationLabel = v;
              markChanged();
            }),
            makeTextField('Location Value', block.location, (v) => {
              pushUndoSnapshot(true);
              block.location = v;
              markChanged();
            }),
            makeTextField('Timezone Label', block.timezoneLabel, (v) => {
              pushUndoSnapshot(true);
              block.timezoneLabel = v;
              markChanged();
            }),
            makeTextField('Timezone Value', block.timezone, (v) => {
              pushUndoSnapshot(true);
              block.timezone = v;
              markChanged();
            }),
            makeTextField('Note Heading', block.noteHeading, (v) => {
              pushUndoSnapshot(true);
              block.noteHeading = v;
              markChanged();
            })
          ])
        );
        container.appendChild(
          makeTextField('Note Body', block.noteBody, (v) => {
            pushUndoSnapshot(true);
            block.noteBody = v;
            markChanged();
          }, { multiline: true, rows: 3 })
        );

        const socialSection = el('div', { className: 'sublist-section' });
        const renderSocials = () => {
          socialSection.innerHTML = '';
          socialSection.appendChild(
            el('div', { className: 'sublist-header' }, [
              el('span', { className: 'field-label', textContent: 'Social / Profile Links' }),
              el('button', {
                type: 'button',
                className: 'mac-btn mac-btn-xs',
                textContent: '+ Add Profile Link',
                onClick: () => {
                  pushUndoSnapshot();
                  block.socialLinks.push({ label: 'Website', icon: 'link', url: 'https://' });
                  renderSocials();
                  markChanged();
                }
              })
            ])
          );

          block.socialLinks.forEach((soc, idx) => {
            socialSection.appendChild(
              el('div', { className: 'sublist-item' }, [
                el('div', { className: 'sublist-item-head' }, [
                  el('span', { className: 'sublist-index', textContent: `LINK #${idx + 1}` }),
                  el('div', { className: 'tab-row-actions' }, [
                    el('button', {
                      type: 'button',
                      className: 'mac-btn mac-btn-xs',
                      textContent: '↑',
                      disabled: idx === 0,
                      onClick: () => {
                        pushUndoSnapshot();
                        if (moveArrayItem(block.socialLinks, idx, -1)) {
                          renderSocials();
                          markChanged();
                        }
                      }
                    }),
                    el('button', {
                      type: 'button',
                      className: 'mac-btn mac-btn-xs',
                      textContent: '↓',
                      disabled: idx === block.socialLinks.length - 1,
                      onClick: () => {
                        pushUndoSnapshot();
                        if (moveArrayItem(block.socialLinks, idx, 1)) {
                          renderSocials();
                          markChanged();
                        }
                      }
                    }),
                    el('button', {
                      type: 'button',
                      className: 'mac-btn mac-btn-xs',
                      textContent: '✕',
                      onClick: () => {
                        pushUndoSnapshot();
                        block.socialLinks.splice(idx, 1);
                        renderSocials();
                        markChanged();
                      }
                    })
                  ])
                ]),
                el('div', { className: 'field-grid-3' }, [
                  makeTextField('Label', soc.label, (v) => {
                    pushUndoSnapshot(true);
                    soc.label = v;
                    markChanged();
                  }),
                  makeSelectField('Icon', soc.icon || 'link', [
                    { value: 'folder', label: 'Folder (GitHub)' },
                    { value: 'badge', label: 'Badge (LinkedIn)' },
                    { value: 'link', label: 'Link' }
                  ], (v) => {
                    pushUndoSnapshot();
                    soc.icon = v;
                    markChanged();
                  }),
                  makeTextField('URL', soc.url, (v) => {
                    pushUndoSnapshot(true);
                    soc.url = v;
                    markChanged();
                  })
                ])
              ])
            );
          });
        };
        renderSocials();
        container.appendChild(socialSection);
        break;
      }

      case 'cv_header': {
        container.appendChild(
          el('div', { className: 'field-grid-2' }, [
            makeTextField('Title', block.title, (v) => {
              pushUndoSnapshot(true);
              block.title = v;
              onSummaryChange();
              markChanged();
            }),
            makeTextField('Status Badge', block.statusBadge, (v) => {
              pushUndoSnapshot(true);
              block.statusBadge = v;
              markChanged();
            })
          ])
        );
        container.appendChild(
          makeTextField('Subtitle / Last Updated', block.subtitle, (v) => {
            pushUndoSnapshot(true);
            block.subtitle = v;
            markChanged();
          })
        );
        container.appendChild(
          el('div', { className: 'field-grid-2' }, [
            makeTextField('Download Button Label', block.downloadLabel, (v) => {
              pushUndoSnapshot(true);
              block.downloadLabel = v;
              markChanged();
            }, { placeholder: 'DOWNLOAD CV (PDF)' }),
            makeTextField('Download PDF URL', block.downloadUrl, (v) => {
              pushUndoSnapshot(true);
              block.downloadUrl = v;
              markChanged();
            }, { placeholder: '/assets/CV.pdf' }),
            makeTextField('Download Filename', block.downloadFilename, (v) => {
              pushUndoSnapshot(true);
              block.downloadFilename = v;
              markChanged();
            }, { placeholder: 'CV.pdf' }),
            makeCheckboxField('Open PDF in new tab', block.openNewTab !== false, (checked) => {
              pushUndoSnapshot();
              block.openNewTab = checked;
              markChanged();
            }),
            makeTextField('Secondary Button Label (optional)', block.secondaryLabel, (v) => {
              pushUndoSnapshot(true);
              block.secondaryLabel = v;
              markChanged();
            }),
            makeTextField('Secondary Button URL (optional)', block.secondaryUrl, (v) => {
              pushUndoSnapshot(true);
              block.secondaryUrl = v;
              markChanged();
            }, { placeholder: 'https://...' })
          ])
        );
        break;
      }

      case 'cv_timeline': {
        if (!Array.isArray(block.items)) block.items = [];
        container.appendChild(
          el('div', { className: 'field-grid-2' }, [
            makeTextField('Section Heading', block.heading, (v) => {
              pushUndoSnapshot(true);
              block.heading = v;
              onSummaryChange();
              markChanged();
            }),
            makeCheckboxField('Show Vertical Timeline Rail', block.showTimelineRail !== false, (checked) => {
              pushUndoSnapshot();
              block.showTimelineRail = checked;
              markChanged();
            })
          ])
        );

        const timelineSection = el('div', { className: 'sublist-section' });
        const renderEntries = () => {
          timelineSection.innerHTML = '';
          timelineSection.appendChild(
            el('div', { className: 'sublist-header' }, [
              el('span', { className: 'field-label', textContent: 'Timeline Entries' }),
              el('button', {
                type: 'button',
                className: 'mac-btn mac-btn-xs',
                textContent: '+ Add Entry',
                onClick: () => {
                  pushUndoSnapshot();
                  block.items.push({
                    title: 'Position or Degree',
                    organization: 'Institution / Company',
                    period: '2025 – Present',
                    location: '',
                    badge: '',
                    summary: '',
                    bullets: []
                  });
                  renderEntries();
                  onSummaryChange();
                  markChanged();
                }
              })
            ])
          );

          block.items.forEach((item, idx) => {
            if (!Array.isArray(item.bullets)) item.bullets = [];
            timelineSection.appendChild(
              el('div', { className: 'sublist-item' }, [
                el('div', { className: 'sublist-item-head' }, [
                  el('span', { className: 'sublist-index', textContent: `ENTRY #${idx + 1}` }),
                  makeReorderControls(block.items, idx, () => {
                    renderEntries();
                    onSummaryChange();
                  })
                ]),
                el('div', { className: 'field-grid-2' }, [
                  makeTextField('Title / Role / Degree', item.title, (v) => {
                    pushUndoSnapshot(true);
                    item.title = v;
                    markChanged();
                  }),
                  makeTextField('Organization', item.organization, (v) => {
                    pushUndoSnapshot(true);
                    item.organization = v;
                    markChanged();
                  }),
                  makeTextField('Period', item.period, (v) => {
                    pushUndoSnapshot(true);
                    item.period = v;
                    markChanged();
                  }, { placeholder: '2023 – Present' }),
                  makeTextField('Location', item.location, (v) => {
                    pushUndoSnapshot(true);
                    item.location = v;
                    markChanged();
                  }, { placeholder: 'Boulder, CO' }),
                  makeTextField('Badge (optional)', item.badge, (v) => {
                    pushUndoSnapshot(true);
                    item.badge = v;
                    markChanged();
                  }, { placeholder: 'CURRENT' })
                ]),
                makeTextField('Summary (supports **bold** & [link](url))', item.summary, (v) => {
                  pushUndoSnapshot(true);
                  item.summary = v;
                  markChanged();
                }, { multiline: true, rows: 2 }),
                makeStringListEditor('Bullet Highlights', item.bullets, {
                  addLabel: '+ Add Bullet',
                  placeholder: 'Key achievement or responsibility...'
                })
              ])
            );
          });
        };
        renderEntries();
        container.appendChild(timelineSection);
        break;
      }

      case 'skills_matrix': {
        if (!Array.isArray(block.skillBars)) block.skillBars = [];
        if (!Array.isArray(block.skillGroups)) block.skillGroups = [];
        container.appendChild(
          el('div', { className: 'field-grid-3' }, [
            makeTextField('Section Heading', block.heading, (v) => {
              pushUndoSnapshot(true);
              block.heading = v;
              onSummaryChange();
              markChanged();
            }),
            makeSelectField('Display Mode', block.displayMode || 'both', [
              { value: 'both', label: 'Bars + Pill Groups' },
              { value: 'bars', label: 'Bars Only' },
              { value: 'pills', label: 'Pill Groups Only' }
            ], (v) => {
              pushUndoSnapshot();
              block.displayMode = v;
              onSummaryChange();
              markChanged();
            }),
            makeSelectField('Pill Columns', String(block.columns || 2), [
              { value: '1', label: '1 Column' },
              { value: '2', label: '2 Columns' },
              { value: '3', label: '3 Columns' }
            ], (v) => {
              pushUndoSnapshot();
              block.columns = Number(v);
              markChanged();
            })
          ])
        );

        const barsSection = el('div', { className: 'sublist-section' });
        const renderSkillBars = () => {
          barsSection.innerHTML = '';
          barsSection.appendChild(
            el('div', { className: 'sublist-header' }, [
              el('span', { className: 'field-label', textContent: 'Skill Proficiency Bars (0–100%)' }),
              el('button', {
                type: 'button',
                className: 'mac-btn mac-btn-xs',
                textContent: '+ Add Skill Bar',
                onClick: () => {
                  pushUndoSnapshot();
                  block.skillBars.push({ label: 'New Skill', category: 'CORE', level: 85, note: '' });
                  renderSkillBars();
                  markChanged();
                }
              })
            ])
          );

          block.skillBars.forEach((bar, idx) => {
            barsSection.appendChild(
              el('div', { className: 'sublist-item' }, [
                el('div', { className: 'sublist-item-head' }, [
                  el('span', { className: 'sublist-index', textContent: `SKILL BAR #${idx + 1}` }),
                  makeReorderControls(block.skillBars, idx, renderSkillBars)
                ]),
                el('div', { className: 'field-grid-3' }, [
                  makeTextField('Skill Label', bar.label, (v) => {
                    pushUndoSnapshot(true);
                    bar.label = v;
                    markChanged();
                  }),
                  makeTextField('Category Tag', bar.category, (v) => {
                    pushUndoSnapshot(true);
                    bar.category = v;
                    markChanged();
                  }),
                  makeTextField('Level (0–100)', String(bar.level ?? 85), (v) => {
                    pushUndoSnapshot(true);
                    const num = Number(v);
                    bar.level = Number.isFinite(num) ? Math.max(0, Math.min(100, Math.round(num))) : 0;
                    markChanged();
                  }, { type: 'number', min: 0, max: 100 })
                ]),
                makeTextField('Note / Details (optional)', bar.note, (v) => {
                  pushUndoSnapshot(true);
                  bar.note = v;
                  markChanged();
                })
              ])
            );
          });
        };
        renderSkillBars();
        container.appendChild(barsSection);

        const groupsSection = el('div', { className: 'sublist-section' });
        const renderSkillGroups = () => {
          groupsSection.innerHTML = '';
          groupsSection.appendChild(
            el('div', { className: 'sublist-header' }, [
              el('span', { className: 'field-label', textContent: 'Skill Pill Groups' }),
              el('button', {
                type: 'button',
                className: 'mac-btn mac-btn-xs',
                textContent: '+ Add Skill Group',
                onClick: () => {
                  pushUndoSnapshot();
                  block.skillGroups.push({ title: 'Competency Group', skills: ['Skill A', 'Skill B'] });
                  renderSkillGroups();
                  markChanged();
                }
              })
            ])
          );

          block.skillGroups.forEach((grp, idx) => {
            if (!Array.isArray(grp.skills)) grp.skills = [];
            groupsSection.appendChild(
              el('div', { className: 'sublist-item' }, [
                el('div', { className: 'sublist-item-head' }, [
                  el('span', { className: 'sublist-index', textContent: `GROUP #${idx + 1}` }),
                  makeReorderControls(block.skillGroups, idx, renderSkillGroups)
                ]),
                makeTextField('Group Title', grp.title, (v) => {
                  pushUndoSnapshot(true);
                  grp.title = v;
                  markChanged();
                }),
                makeTagChipsEditor('Skills', grp.skills, { defaultTag: 'New Skill', addLabel: '+ Skill' })
              ])
            );
          });
        };
        renderSkillGroups();
        container.appendChild(groupsSection);
        break;
      }

      case 'project_showcase': {
        if (!Array.isArray(block.items)) block.items = [];
        container.appendChild(
          el('div', { className: 'field-grid-2' }, [
            makeTextField('Section Heading', block.heading, (v) => {
              pushUndoSnapshot(true);
              block.heading = v;
              onSummaryChange();
              markChanged();
            }),
            makeSelectField('Columns', String(block.columns || 2), [
              { value: '1', label: '1 Column' },
              { value: '2', label: '2 Columns' },
              { value: '3', label: '3 Columns' }
            ], (v) => {
              pushUndoSnapshot();
              block.columns = Number(v);
              markChanged();
            }),
            makeTextField('Filter Bar Label', block.filterLabel, (v) => {
              pushUndoSnapshot(true);
              block.filterLabel = v;
              markChanged();
            }, { placeholder: 'FILTER:' }),
            makeTextField('"All" Filter Label', block.allLabel, (v) => {
              pushUndoSnapshot(true);
              block.allLabel = v;
              markChanged();
            }, { placeholder: 'ALL' })
          ])
        );

        const projectsSection = el('div', { className: 'sublist-section' });
        const renderProjects = () => {
          projectsSection.innerHTML = '';
          projectsSection.appendChild(
            el('div', { className: 'sublist-header' }, [
              el('span', { className: 'field-label', textContent: 'Projects' }),
              el('button', {
                type: 'button',
                className: 'mac-btn mac-btn-xs',
                textContent: '+ Add Project',
                onClick: () => {
                  pushUndoSnapshot();
                  block.items.push({
                    category: 'RESEARCH',
                    badge: 'NEW',
                    title: 'New Project',
                    summary: '',
                    tags: [],
                    buttonLabel: 'INSPECT →',
                    detailMode: 'inline',
                    detailTitle: 'New Project',
                    detailMeta: '',
                    detailBody: '',
                    detailLinks: [],
                    target: ''
                  });
                  renderProjects();
                  onSummaryChange();
                  markChanged();
                }
              })
            ])
          );

          block.items.forEach((item, idx) => {
            if (!Array.isArray(item.tags)) item.tags = [];
            if (!Array.isArray(item.detailLinks)) item.detailLinks = [];
            const mode = item.detailMode || 'inline';
            projectsSection.appendChild(
              el('div', { className: 'sublist-item' }, [
                el('div', { className: 'sublist-item-head' }, [
                  el('span', { className: 'sublist-index', textContent: `PROJECT #${idx + 1}` }),
                  makeReorderControls(block.items, idx, () => {
                    renderProjects();
                    onSummaryChange();
                  })
                ]),
                el('div', { className: 'field-grid-3' }, [
                  makeTextField('Category (Filter Key)', item.category, (v) => {
                    pushUndoSnapshot(true);
                    item.category = v;
                    markChanged();
                  }, { placeholder: 'CONTROL' }),
                  makeTextField('Badge', item.badge, (v) => {
                    pushUndoSnapshot(true);
                    item.badge = v;
                    markChanged();
                  }),
                  makeTextField('Title', item.title, (v) => {
                    pushUndoSnapshot(true);
                    item.title = v;
                    markChanged();
                  })
                ]),
                makeTextField('Card Summary', item.summary, (v) => {
                  pushUndoSnapshot(true);
                  item.summary = v;
                  markChanged();
                }, { multiline: true, rows: 2 }),
                makeTagChipsEditor('Project Tags', item.tags, { defaultTag: 'Tag', addLabel: '+ Tag' }),
                el('div', { className: 'field-grid-3' }, [
                  makeTextField('Button Label', item.buttonLabel, (v) => {
                    pushUndoSnapshot(true);
                    item.buttonLabel = v;
                    markChanged();
                  }, { placeholder: 'INSPECT →' }),
                  makeSelectField('Detail Mode', mode, [
                    { value: 'inline', label: 'Inline Detail View' },
                    { value: 'url', label: 'External URL' },
                    { value: 'page', label: 'Open Tab' }
                  ], (v) => {
                    pushUndoSnapshot();
                    item.detailMode = v;
                    if (v === 'page' && (!item.target || item.target.startsWith('http'))) {
                      item.target = state.content.tabs[0]?.id || 'about';
                    }
                    renderProjects();
                    markChanged();
                  }),
                  makeActionTargetField('Target (for URL / Tab mode)', mode, item.target, (v) => {
                    pushUndoSnapshot(true);
                    item.target = v;
                    markChanged();
                  })
                ]),
                el('div', { className: 'field-grid-2' }, [
                  makeTextField('Inline Detail Title', item.detailTitle, (v) => {
                    pushUndoSnapshot(true);
                    item.detailTitle = v;
                    markChanged();
                  }),
                  makeTextField('Inline Detail Meta', item.detailMeta, (v) => {
                    pushUndoSnapshot(true);
                    item.detailMeta = v;
                    markChanged();
                  }, { placeholder: 'Category: ... // Status: ...' })
                ]),
                makeTextField('Inline Detail Body (Markdown-lite)', item.detailBody, (v) => {
                  pushUndoSnapshot(true);
                  item.detailBody = v;
                  markChanged();
                }, { multiline: true, rows: 4 }),
                makeLinksListEditor('Inline Detail Links', item.detailLinks, '+ Add Detail Link')
              ])
            );
          });
        };
        renderProjects();
        container.appendChild(projectsSection);
        break;
      }

      case 'publications_list': {
        if (!Array.isArray(block.items)) block.items = [];
        container.appendChild(
          el('div', { className: 'field-grid-3' }, [
            makeTextField('Section Heading', block.heading, (v) => {
              pushUndoSnapshot(true);
              block.heading = v;
              onSummaryChange();
              markChanged();
            }),
            makeTextField('Filter Bar Label', block.filterLabel, (v) => {
              pushUndoSnapshot(true);
              block.filterLabel = v;
              markChanged();
            }, { placeholder: 'FILTER:' }),
            makeTextField('"All" Filter Label', block.allLabel, (v) => {
              pushUndoSnapshot(true);
              block.allLabel = v;
              markChanged();
            }, { placeholder: 'ALL' })
          ])
        );

        const pubsSection = el('div', { className: 'sublist-section' });
        const renderPubs = () => {
          pubsSection.innerHTML = '';
          pubsSection.appendChild(
            el('div', { className: 'sublist-header' }, [
              el('span', { className: 'field-label', textContent: 'Publications' }),
              el('button', {
                type: 'button',
                className: 'mac-btn mac-btn-xs',
                textContent: '+ Add Publication',
                onClick: () => {
                  pushUndoSnapshot();
                  block.items.push({
                    pubType: 'CONFERENCE',
                    year: '2026',
                    statusBadge: 'PUBLISHED',
                    authors: '**Yi-Chun Liao**',
                    title: 'Paper Title',
                    venue: 'Conference or Journal Name',
                    bibtex: '',
                    links: []
                  });
                  renderPubs();
                  onSummaryChange();
                  markChanged();
                }
              })
            ])
          );

          block.items.forEach((pub, idx) => {
            if (!Array.isArray(pub.links)) pub.links = [];
            pubsSection.appendChild(
              el('div', { className: 'sublist-item' }, [
                el('div', { className: 'sublist-item-head' }, [
                  el('span', { className: 'sublist-index', textContent: `PUBLICATION #${idx + 1}` }),
                  makeReorderControls(block.items, idx, () => {
                    renderPubs();
                    onSummaryChange();
                  })
                ]),
                el('div', { className: 'field-grid-3' }, [
                  makeTextField('Publication Type', pub.pubType, (v) => {
                    pushUndoSnapshot(true);
                    pub.pubType = v;
                    markChanged();
                  }, { placeholder: 'JOURNAL / CONFERENCE / PREPRINT' }),
                  makeTextField('Year', pub.year, (v) => {
                    pushUndoSnapshot(true);
                    pub.year = v;
                    markChanged();
                  }, { placeholder: '2026' }),
                  makeTextField('Status Badge', pub.statusBadge, (v) => {
                    pushUndoSnapshot(true);
                    pub.statusBadge = v;
                    markChanged();
                  }, { placeholder: 'PUBLISHED / UNDER REVIEW' })
                ]),
                makeTextField('Authors (use **Name** to bold)', pub.authors, (v) => {
                  pushUndoSnapshot(true);
                  pub.authors = v;
                  markChanged();
                }),
                el('div', { className: 'field-grid-2' }, [
                  makeTextField('Paper Title', pub.title, (v) => {
                    pushUndoSnapshot(true);
                    pub.title = v;
                    markChanged();
                  }),
                  makeTextField('Venue / Journal', pub.venue, (v) => {
                    pushUndoSnapshot(true);
                    pub.venue = v;
                    markChanged();
                  })
                ]),
                makeTextField('BibTeX (leave empty to hide BIBTEX button)', pub.bibtex, (v) => {
                  pushUndoSnapshot(true);
                  pub.bibtex = v;
                  markChanged();
                }, { multiline: true, rows: 4, code: true }),
                makeLinksListEditor('Paper Action Links', pub.links, '+ Add Link')
              ])
            );
          });
        };
        renderPubs();
        container.appendChild(pubsSection);
        break;
      }

      case 'notes_list': {
        if (!Array.isArray(block.items)) block.items = [];
        container.appendChild(
          el('div', { className: 'field-grid-2' }, [
            makeTextField('Section Heading', block.heading, (v) => {
              pushUndoSnapshot(true);
              block.heading = v;
              onSummaryChange();
              markChanged();
            }),
            makeSelectField('Columns', String(block.columns || 2), [
              { value: '1', label: '1 Column' },
              { value: '2', label: '2 Columns' },
              { value: '3', label: '3 Columns' }
            ], (v) => {
              pushUndoSnapshot();
              block.columns = Number(v);
              markChanged();
            }),
            makeTextField('Filter Bar Label', block.filterLabel, (v) => {
              pushUndoSnapshot(true);
              block.filterLabel = v;
              markChanged();
            }, { placeholder: 'FILTER:' }),
            makeTextField('"All" Filter Label', block.allLabel, (v) => {
              pushUndoSnapshot(true);
              block.allLabel = v;
              markChanged();
            }, { placeholder: 'ALL' })
          ])
        );

        const notesSection = el('div', { className: 'sublist-section' });
        const renderNotes = () => {
          notesSection.innerHTML = '';
          notesSection.appendChild(
            el('div', { className: 'sublist-header' }, [
              el('span', { className: 'field-label', textContent: 'Notes & Articles' }),
              el('button', {
                type: 'button',
                className: 'mac-btn mac-btn-xs',
                textContent: '+ Add Note',
                onClick: () => {
                  pushUndoSnapshot();
                  block.items.push({
                    category: 'NOTES',
                    date: '2026-11-16',
                    readTime: '5 MIN READ',
                    title: 'New Note Title',
                    summary: '',
                    tags: [],
                    buttonLabel: 'READ NOTE →',
                    detailMode: 'inline',
                    noteBody: '',
                    target: ''
                  });
                  renderNotes();
                  onSummaryChange();
                  markChanged();
                }
              })
            ])
          );

          block.items.forEach((note, idx) => {
            if (!Array.isArray(note.tags)) note.tags = [];
            notesSection.appendChild(
              el('div', { className: 'sublist-item' }, [
                el('div', { className: 'sublist-item-head' }, [
                  el('span', { className: 'sublist-index', textContent: `NOTE #${idx + 1}` }),
                  makeReorderControls(block.items, idx, () => {
                    renderNotes();
                    onSummaryChange();
                  })
                ]),
                el('div', { className: 'field-grid-3' }, [
                  makeTextField('Category (Filter Key)', note.category, (v) => {
                    pushUndoSnapshot(true);
                    note.category = v;
                    markChanged();
                  }),
                  makeTextField('Date', note.date, (v) => {
                    pushUndoSnapshot(true);
                    note.date = v;
                    markChanged();
                  }, { placeholder: '2026-10-18' }),
                  makeTextField('Read Time', note.readTime, (v) => {
                    pushUndoSnapshot(true);
                    note.readTime = v;
                    markChanged();
                  }, { placeholder: '5 MIN READ' })
                ]),
                makeTextField('Note Title', note.title, (v) => {
                  pushUndoSnapshot(true);
                  note.title = v;
                  markChanged();
                }),
                makeTextField('Card Summary', note.summary, (v) => {
                  pushUndoSnapshot(true);
                  note.summary = v;
                  markChanged();
                }, { multiline: true, rows: 2 }),
                makeTagChipsEditor('Note Tags', note.tags, { defaultTag: 'Tag', addLabel: '+ Tag' }),
                el('div', { className: 'field-grid-3' }, [
                  makeTextField('Button Label', note.buttonLabel, (v) => {
                    pushUndoSnapshot(true);
                    note.buttonLabel = v;
                    markChanged();
                  }, { placeholder: 'READ NOTE →' }),
                  makeSelectField('Detail Mode', note.detailMode || 'inline', [
                    { value: 'inline', label: 'Inline Reader' },
                    { value: 'url', label: 'External URL' }
                  ], (v) => {
                    pushUndoSnapshot();
                    note.detailMode = v;
                    markChanged();
                  }),
                  makeTextField('Target URL (for URL mode)', note.target, (v) => {
                    pushUndoSnapshot(true);
                    note.target = v;
                    markChanged();
                  }, { placeholder: 'https://...' })
                ]),
                makeTextField('Inline Note Body (Markdown-lite)', note.noteBody, (v) => {
                  pushUndoSnapshot(true);
                  note.noteBody = v;
                  markChanged();
                }, { multiline: true, rows: 5 })
              ])
            );
          });
        };
        renderNotes();
        container.appendChild(notesSection);
        break;
      }

      case 'custom_html': {
        container.appendChild(
          makeTextField('Block Heading (optional)', block.heading, (v) => {
            pushUndoSnapshot(true);
            block.heading = v;
            onSummaryChange();
            markChanged();
          })
        );
        container.appendChild(
          makeTextField('Raw HTML Content', block.html, (v) => {
            pushUndoSnapshot(true);
            block.html = v;
            markChanged();
          }, { multiline: true, rows: 7, code: true })
        );
        break;
      }

      default:
        container.appendChild(
          el('div', { className: 'empty-state', textContent: `Unknown block type: ${block.type}` })
        );
    }

    return container;
  }

  function getBlockSummary(block) {
    if (!block) return '';
    switch (block.type) {
      case 'cv_header':
        return block.title || block.downloadLabel || block.id || '';
      case 'cv_timeline': {
        const count = Array.isArray(block.items) ? block.items.length : 0;
        return `${block.heading || 'CV Timeline'} (${count} ${count === 1 ? 'entry' : 'entries'})`;
      }
      case 'skills_matrix': {
        const mode = block.displayMode || 'both';
        return `${block.heading || 'Skills Matrix'} [${mode}]`;
      }
      case 'project_showcase': {
        const count = Array.isArray(block.items) ? block.items.length : 0;
        return `${block.heading || 'Project Showcase'} (${count} ${count === 1 ? 'project' : 'projects'})`;
      }
      case 'publications_list': {
        const count = Array.isArray(block.items) ? block.items.length : 0;
        return `${block.heading || 'Publications'} (${count} ${count === 1 ? 'paper' : 'papers'})`;
      }
      case 'notes_list': {
        const count = Array.isArray(block.items) ? block.items.length : 0;
        return `${block.heading || 'Notes & Articles'} (${count} ${count === 1 ? 'note' : 'notes'})`;
      }
      default:
        return (
          block.heading ||
          block.title ||
          block.name ||
          block.headerBar ||
          block.email ||
          block.id ||
          ''
        );
    }
  }

  // ===================================================
  // CENTER EDITOR PANE
  // ===================================================

  function renderEditor() {
    const root = $('editor-root');
    if (!root) return;
    root.innerHTML = '';

    const tab = getSelectedTab();
    if (!tab) {
      root.appendChild(el('div', { className: 'empty-state', textContent: 'Select or create a tab to begin editing.' }));
      return;
    }

    const lang = state.lang;
    if (!Array.isArray(tab.blocks[lang])) tab.blocks[lang] = [];
    const blocks = tab.blocks[lang];

    // 1. Tab Settings Card
    const iconSelect = el(
      'select',
      {
        className: 'mac-select',
        onChange: (e) => {
          pushUndoSnapshot();
          tab.icon = e.target.value;
          markChanged({ sidebar: true, rerender: true });
        }
      },
      ICON_NAMES.map((name) => el('option', { value: name, textContent: name }))
    );
    iconSelect.value = ICON_NAMES.includes(tab.icon) ? tab.icon : 'about';

    const metaCard = el('div', { className: 'editor-card' }, [
      el('div', { className: 'editor-card-header' }, [
        el('div', { className: 'tab-meta-top' }, [
          el('span', { className: 'tab-icon-box', innerHTML: getIconSvg(tab.icon) }),
          el('span', { className: 'id-chip', textContent: `TAB: #${tab.id}` }),
          el('span', { className: 'status-pill', textContent: `Editing ${LANG_META[lang].label}` })
        ]),
        el('div', { className: 'tab-row-toggles', style: 'margin-top:0; padding-top:0; border-top:none;' }, [
          el('label', { className: 'mini-check' }, [
            el('input', {
              type: 'checkbox',
              checked: tab.showInDesktop !== false,
              onChange: (e) => {
                pushUndoSnapshot();
                tab.showInDesktop = e.target.checked;
                markChanged({ sidebar: true });
              }
            }),
            el('span', { textContent: 'Show on Desktop' })
          ]),
          el('label', { className: 'mini-check' }, [
            el('input', {
              type: 'checkbox',
              checked: Boolean(tab.isCenter),
              onChange: (e) => {
                pushUndoSnapshot();
                const checked = e.target.checked;
                state.content.tabs.forEach((t) => {
                  t.isCenter = checked ? t.id === tab.id : false;
                });
                state.content.site.defaultCenterTabId = checked ? tab.id : '';
                markChanged({ sidebar: true });
              }
            }),
            el('span', { textContent: 'Center Button' })
          ])
        ])
      ]),
      el('div', { className: 'editor-card-body' }, [
        el('div', { className: 'field-grid-3' }, [
          makeTextField(`Tab Label (${LANG_META[lang].label})`, tab.labels[lang] ?? '', (v) => {
            pushUndoSnapshot(true);
            tab.labels[lang] = v;
            markChanged({ sidebar: true });
          }),
          makeTextField(`Page / Window Title (${LANG_META[lang].label})`, tab.pageTitle[lang] ?? '', (v) => {
            pushUndoSnapshot(true);
            tab.pageTitle[lang] = v;
            markChanged();
          }),
          el('label', { className: 'field' }, [
            el('span', { className: 'field-label', textContent: 'Desktop Icon' }),
            iconSelect
          ])
        ])
      ])
    ]);
    root.appendChild(metaCard);

    // 2. + Add Block Bar
    const addBar = el('div', { className: 'add-block-bar' }, [
      el('div', { className: 'add-block-title', textContent: `+ ADD BLOCK TO "${getTabDisplayLabel(tab).toUpperCase()}" (${LANG_META[lang].label})` }),
      el(
        'div',
        { className: 'add-block-buttons' },
        BLOCK_CATALOG.map((item) =>
          el('button', {
            type: 'button',
            className: 'mac-btn mac-btn-sm',
            textContent: `+ ${item.label}`,
            onClick: () => {
              pushUndoSnapshot();
              const newBlock = createDefaultBlock(item.type, tab.id);
              blocks.push(newBlock);
              state.collapsedBlocks.delete(newBlock.id);
              markChanged({ rerender: true });
              const cardEl = root.querySelector(`[data-block-id="${newBlock.id}"]`);
              if (cardEl) cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          })
        )
      )
    ]);
    root.appendChild(addBar);

    // 3. Copy from EN Helper Banner (when editing non-EN and currently empty)
    if (lang !== 'en' && blocks.length === 0 && (tab.blocks.en?.length || 0) > 0) {
      root.appendChild(
        el('div', { className: 'copy-en-banner' }, [
          el('div', {}, [
            el('strong', { textContent: `No ${LANG_META[lang].label} blocks yet.` }),
            el('div', { className: 'field-hint', textContent: `Clone the ${tab.blocks.en.length} English block(s) as a starting point for translation.` })
          ]),
          el('button', {
            type: 'button',
            className: 'mac-btn mac-btn-primary',
            textContent: 'Copy Blocks from EN',
            onClick: () => copyBlocksFromEn()
          })
        ])
      );
    }

    // 4. Blocks Stack
    const stack = el('div', { className: 'blocks-stack' });
    if (blocks.length === 0) {
      stack.appendChild(el('div', { className: 'empty-state', textContent: 'This tab has no blocks in the current language. Use the "+ Add Block" buttons above.' }));
    } else {
      blocks.forEach((block, idx) => {
        if (!block.id) block.id = uid(`blk_${tab.id}_${block.type}`);
        const isCollapsed = state.collapsedBlocks.has(block.id);
        const typeLabel = BLOCK_TYPE_MAP[block.type]?.short || block.type.toUpperCase();
        const summaryEl = el('span', { className: 'block-summary', textContent: getBlockSummary(block) });

        const card = el('div', {
          className: `block-card ${isCollapsed ? 'collapsed' : ''}`,
          dataset: { blockId: block.id }
        });

        const header = el('div', { className: 'block-card-header' }, [
          el('div', { className: 'block-card-left' }, [
            el('button', {
              type: 'button',
              className: 'mac-btn mac-btn-xs',
              textContent: isCollapsed ? '▸' : '▾',
              title: isCollapsed ? 'Expand block' : 'Collapse block',
              onClick: () => {
                if (state.collapsedBlocks.has(block.id)) state.collapsedBlocks.delete(block.id);
                else state.collapsedBlocks.add(block.id);
                card.classList.toggle('collapsed');
                header.querySelector('button').textContent = state.collapsedBlocks.has(block.id) ? '▸' : '▾';
              }
            }),
            el('span', { className: 'block-type-pill', textContent: typeLabel }),
            summaryEl
          ]),
          el('div', { className: 'block-card-controls' }, [
            el('button', {
              type: 'button',
              className: 'mac-btn mac-btn-xs',
              textContent: '↑',
              title: 'Move block up',
              disabled: idx === 0,
              onClick: () => {
                pushUndoSnapshot();
                if (moveArrayItem(blocks, idx, -1)) markChanged({ rerender: true });
              }
            }),
            el('button', {
              type: 'button',
              className: 'mac-btn mac-btn-xs',
              textContent: '↓',
              title: 'Move block down',
              disabled: idx === blocks.length - 1,
              onClick: () => {
                pushUndoSnapshot();
                if (moveArrayItem(blocks, idx, 1)) markChanged({ rerender: true });
              }
            }),
            el('button', {
              type: 'button',
              className: 'mac-btn mac-btn-xs',
              textContent: 'Duplicate',
              title: 'Duplicate block',
              onClick: () => {
                pushUndoSnapshot();
                const clone = deepClone(block);
                clone.id = uid(`blk_${slugify(tab.id)}_${block.type}`);
                blocks.splice(idx + 1, 0, clone);
                markChanged({ rerender: true });
              }
            }),
            el('button', {
              type: 'button',
              className: 'mac-btn mac-btn-xs',
              textContent: '✕',
              title: 'Delete block',
              onClick: async () => {
                const ok = await askConfirm(`Delete ${typeLabel} block?`, 'Delete', true);
                if (!ok) return;
                pushUndoSnapshot();
                blocks.splice(idx, 1);
                markChanged({ rerender: true });
              }
            })
          ])
        ]);

        card.appendChild(header);
        card.appendChild(
          renderBlockBody(block, () => {
            summaryEl.textContent = getBlockSummary(block);
          })
        );
        stack.appendChild(card);
      });
    }

    root.appendChild(stack);
  }

  function renderAll() {
    renderSidebar();
    renderEditor();
    updateToolbarButtons();
    updatePreviewRoute();
  }

  // ===================================================
  // COPY FROM EN & ADD NEW TAB MODAL
  // ===================================================

  async function copyBlocksFromEn() {
    const tab = getSelectedTab();
    if (!tab || state.lang === 'en') return;
    const enBlocks = tab.blocks?.en || [];
    if (enBlocks.length === 0) {
      showToast('English tab has no blocks to copy.', 'info');
      return;
    }

    const existing = tab.blocks[state.lang] || [];
    if (existing.length > 0) {
      const ok = await askConfirm(
        `Replace the ${existing.length} existing ${LANG_META[state.lang].label} block(s) with copies from English?`,
        'Copy & Replace',
        true
      );
      if (!ok) return;
    }

    pushUndoSnapshot();
    tab.blocks[state.lang] = enBlocks.map((b) => {
      const copy = deepClone(b);
      copy.id = uid(`blk_${slugify(tab.id)}_${copy.type}`);
      return copy;
    });
    if (!tab.labels[state.lang] && tab.labels.en) {
      tab.labels[state.lang] = tab.labels.en;
    }
    if (!tab.pageTitle[state.lang] && tab.pageTitle.en) {
      tab.pageTitle[state.lang] = tab.pageTitle.en;
    }
    markChanged({ sidebar: true, rerender: true });
    showToast(`Copied ${enBlocks.length} block(s) from EN.`, 'ok');
  }

  function initNewTabModal() {
    const backdrop = $('new-tab-modal');
    const form = $('new-tab-form');
    const idInput = $('new-tab-id');
    const enInput = $('new-tab-label-en');
    const hantInput = $('new-tab-label-hant');
    const hansInput = $('new-tab-label-hans');
    const iconGrid = $('new-tab-icon-grid');
    const showDesktopCheck = $('new-tab-show-desktop');
    const isCenterCheck = $('new-tab-is-center');
    const errBox = $('new-tab-error');

    let selectedIcon = 'star';
    let idManuallyEdited = false;

    const renderIconPicker = () => {
      iconGrid.innerHTML = '';
      ICON_NAMES.forEach((name) => {
        const btn = el('button', {
          type: 'button',
          className: `icon-choice-btn ${selectedIcon === name ? 'selected' : ''}`,
          onClick: () => {
            selectedIcon = name;
            renderIconPicker();
          }
        }, [
          el('span', { innerHTML: STUDIO_ICONS[name] }),
          el('span', { textContent: name })
        ]);
        iconGrid.appendChild(btn);
      });
    };

    const openModal = () => {
      idManuallyEdited = false;
      form.reset();
      showDesktopCheck.checked = true;
      isCenterCheck.checked = false;
      selectedIcon = 'star';
      errBox.hidden = true;
      renderIconPicker();
      backdrop.hidden = false;
      enInput.focus();
    };

    const closeModal = () => {
      backdrop.hidden = true;
    };

    enInput.addEventListener('input', () => {
      if (!idManuallyEdited) {
        idInput.value = slugify(enInput.value);
      }
    });
    idInput.addEventListener('input', () => {
      idManuallyEdited = idInput.value.trim().length > 0;
    });

    $('btn-open-new-tab').addEventListener('click', openModal);
    $('btn-close-new-tab-modal').addEventListener('click', closeModal);
    $('btn-cancel-new-tab').addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const tabId = idInput.value.trim().toLowerCase();
      const labelEn = enInput.value.trim();
      const labelHant = hantInput.value.trim() || labelEn;
      const labelHans = hansInput.value.trim() || labelEn;

      if (!/^[a-z0-9_-]+$/.test(tabId)) {
        errBox.textContent = 'Tab ID must contain only lowercase letters, numbers, "-" or "_".';
        errBox.hidden = false;
        return;
      }
      if (state.content.tabs.some((t) => t.id === tabId)) {
        errBox.textContent = `A tab with ID "${tabId}" already exists.`;
        errBox.hidden = false;
        return;
      }

      pushUndoSnapshot();
      const setAsCenter = isCenterCheck.checked;
      if (setAsCenter) {
        state.content.tabs.forEach((t) => {
          t.isCenter = false;
        });
        state.content.site.defaultCenterTabId = tabId;
      }

      const newTab = {
        id: tabId,
        icon: selectedIcon,
        isCenter: setAsCenter,
        showInDesktop: showDesktopCheck.checked,
        labels: {
          en: labelEn,
          zh_hant: labelHant,
          zh_hans: labelHans
        },
        pageTitle: {
          en: `${labelEn} // Portfolio`,
          zh_hant: `${labelHant} // 個人檔案`,
          zh_hans: `${labelHans} // 个人档案`
        },
        blocks: {
          en: [createDefaultBlock('rich_text', tabId)],
          zh_hant: [],
          zh_hans: []
        }
      };

      state.content.tabs.push(newTab);
      state.selectedTabId = tabId;
      closeModal();
      markChanged({ sidebar: true, rerender: true });
      updateToolbarButtons();
      showToast(`Created tab "${labelEn}" (#${tabId})`, 'ok');
    });
  }

  // ===================================================
  // TOOLBAR & PREVIEW BINDINGS
  // ===================================================

  function initToolbar() {
    document.querySelectorAll('.seg-btn[data-lang]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextLang = btn.dataset.lang;
        if (!nextLang || nextLang === state.lang) return;
        state.lang = nextLang;
        document.querySelectorAll('.seg-btn[data-lang]').forEach((b) => {
          b.classList.toggle('active', b.dataset.lang === nextLang);
        });
        renderSidebar();
        renderEditor();
        updateToolbarButtons();
        updatePreviewRoute();
      });
    });

    $('btn-copy-from-en').addEventListener('click', copyBlocksFromEn);
    $('btn-undo').addEventListener('click', undoLastChange);
    $('btn-reload').addEventListener('click', () => loadContentFromDisk(true));
    $('btn-link-file').addEventListener('click', linkLocalFile);
    $('btn-export-json').addEventListener('click', exportJsonDownload);
    $('btn-save').addEventListener('click', saveChanges);

    const setPreviewOpen = (open) => {
      state.previewOpen = open;
      const workspace = $('studio-workspace');
      const toggleBtn = $('btn-toggle-preview');
      workspace.classList.toggle('preview-hidden', !open);
      toggleBtn.classList.toggle('active', open);
      toggleBtn.textContent = open ? 'Preview: ON' : 'Preview: OFF';
      if (open) syncPreviewAndDraft();
    };

    $('btn-toggle-preview').addEventListener('click', () => setPreviewOpen(!state.previewOpen));
    $('btn-close-preview').addEventListener('click', () => setPreviewOpen(false));
    $('btn-preview-mode').addEventListener('click', () => {
      state.previewDesktopOnly = !state.previewDesktopOnly;
      const modeBtn = $('btn-preview-mode');
      if (modeBtn) {
        modeBtn.textContent = state.previewDesktopOnly ? 'View: Desktop' : 'View: Tab';
        modeBtn.classList.toggle('active', state.previewDesktopOnly);
      }
      syncPreviewAndDraft();
    });
    $('btn-refresh-preview').addEventListener('click', () => {
      const iframe = $('preview-iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.location.reload();
      }
    });

    $('preview-iframe').addEventListener('load', () => {
      syncPreviewAndDraft();
    });

    $('btn-add-menu-link').addEventListener('click', () => {
      if (!state.content) return;
      pushUndoSnapshot();
      const firstTabId = state.content.tabs[0]?.id || 'about';
      state.content.site.menuLinks.push({
        id: uid('menu'),
        action: 'page',
        pageId: firstTabId,
        bold: false,
        labels: {
          en: 'New Link',
          zh_hant: '新連結',
          zh_hans: '新链接'
        }
      });
      markChanged({ sidebar: true });
    });

    // Keyboard shortcuts: Ctrl/Cmd+S to save, Ctrl/Cmd+Z outside text inputs to undo
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveChanges();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        const tag = document.activeElement?.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault();
          undoLastChange();
        }
      }
    });

    window.addEventListener('beforeunload', (e) => {
      if (state.dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
  }

  // ===================================================
  // BOOT
  // ===================================================

  async function init() {
    initToolbar();
    initNewTabModal();
    await checkApiHealth();
    await loadContentFromDisk(false);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
