// js/renderer.js
(function () {
  'use strict';

  const CONTACT_ICONS = {
    copy: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0iIzAwMDAwMCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01IDFoNnYyaDF2MTJINFYzaDFWMXptMSAydjFoNFYzSDZ6bS0xIDJoNnY4SDVWNXoiLz48L3N2Zz4=',
    mail: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0iIzAwMDAwMCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xIDNoMTR2MTBIMVYzem0yIDJ2MWw1IDMgNS0zVjVIM3ptMCAyLjV2My41aDEwVjcuNUw4IDEwLjUgMyA3LjV6Ii8+PC9zdmc+',
    folder: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0iIzAwMDAwMCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xIDNoNWwyIDJoN3Y4SDFWM3ptMiAydjZoMTBWN0g3LjE3TDUuMTcgNUgzeiIvPjwvc3ZnPg==',
    badge: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0iIzAwMDAwMCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01IDJoNnYyaDN2MTBIMlY0aDNWMnptMiAyaDJWM3g3djF6TTQgNnY2aDhWNkg0eiIvPjwvc3ZnPg==',
    link: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0iIzAwMDAwMCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik05IDJoNXY1aC0yVjUuNDFMNy40MSAxMCA2IDguNTkgMTAuNTkgNEg5VjJ6TTMgNGg0djJINVYxaC0yem0wIDBoMnY3aDd2MkgzVjR6TTQgMTJoOHYtM2gyVjE0SDJWNEg0djh6Ii8+PC9zdmc+',
    location: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0iIzAwMDAwMCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik02IDJoNHYyaDJ2NGgtMnYyaC0ydjRIOHYtNEg2VjhINFY0aDJWMnptMiAzSDd2MmgyVjVIN3oiLz48L3N2Zz4=',
    clock: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0iIzAwMDAwMCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01IDFoNnYxaDJ2MmgxdjZoLTF2MmgtMnYxSDV2LTFIM3YtMkgyVjRoMVYyaDJWMXptMSAydjEwaDRWM3g2em0yIDJ2M3gyVjdIOVY1SDh6Ii8+PC9zdmc+',
    info: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0iIzAwMDAwMCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01IDJoNnYxaDF2NGgtMXYyaC0xdjJINlY5SDVWN0g4VjNoMVYyem0yIDEwaDJ2MUg3di0xem0tMSAyaDR2MUg2di0xeG0xLTl2M3gyVjdIOVY1SDh6Ii8+PC9zdmc+'
  };

  const STATUS_SVGS = {
    lock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -3px; margin-right: 4px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',
    monitor: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -3px; margin-right: 4px;"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="20" x2="22" y2="20"></line></svg>',
    scale: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -3px; margin-right: 4px;"><path d="M6 18h12"></path><path d="M3 21h18"></path><path d="M12 3v12"></path><path d="M9 12a3 3 0 0 0 6 0"></path></svg>',
    pen: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -3px; margin-right: 4px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>'
  };

  const SMALL_LOCK_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';

  function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function sanitizeUrl(rawUrl) {
    if (!rawUrl) return '#';
    const trimmed = String(rawUrl).trim();
    if (!trimmed) return '#';
    if (trimmed.startsWith('/') || trimmed.startsWith('#') || trimmed.startsWith('./') || trimmed.startsWith('../')) {
      return trimmed;
    }
    const lower = trimmed.toLowerCase();
    if (lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('mailto:')) {
      return trimmed;
    }
    return '#';
  }

  function escapeAttrForOnclickString(value) {
    return escapeHtml(
      String(value || '')
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\r|\n/g, '')
    );
  }

  function renderMarkdownLite(text) {
    const escaped = escapeHtml(text);
    if (!escaped) return '';

    // Parse [label](url) first on escaped text
    const withLinks = escaped.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (_, label, rawHref) {
      const unescapedHref = rawHref
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      const safeHref = escapeHtml(sanitizeUrl(unescapedHref));
      const isExternal = /^https?:\/\//i.test(safeHref);
      const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${safeHref}"${targetAttr}>${label}</a>`;
    });

    // Parse **bold** spans and preserve line breaks
    return withLinks
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  function renderActionItem(action) {
    if (!action || !action.label) return '';
    const cls = action.style === 'primary' ? 'about-btn primary' : 'about-btn';
    const label = escapeHtml(action.label);

    if (action.actionType === 'page' && action.target) {
      const target = escapeAttrForOnclickString(action.target);
      return `<button type="button" class="${cls}" onclick="window.openPortfolioPage && window.openPortfolioPage('${target}')">${label}</button>`;
    }

    if (action.actionType === 'url' && action.target) {
      const href = escapeHtml(sanitizeUrl(action.target));
      const isExternal = /^https?:\/\//i.test(href);
      const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${href}"${targetAttr} class="${cls}">${label}</a>`;
    }

    return '';
  }

  function getColsClass(columns) {
    const n = Number(columns);
    if (n === 1) return 'mac-cols-1';
    if (n === 3) return 'mac-cols-3';
    return 'mac-cols-2';
  }

  function renderHeroProfile(block) {
    const avatarHtml = block.avatar
      ? `<img src="${escapeHtml(sanitizeUrl(block.avatar))}" alt="${escapeHtml(block.name || 'Profile Picture')}" width="104" height="104" decoding="async" class="about-avatar">`
      : '';

    const nameNoteHtml = block.nameNote
      ? ` <span class="about-name-note">${escapeHtml(block.nameNote)}</span>`
      : '';

    const roleHtml = block.role
      ? `<span class="about-role">${escapeHtml(block.role)}</span>`
      : '';

    const tags = Array.isArray(block.tags) ? block.tags : [];
    const tagsHtml = tags.length
      ? `<div class="about-tags">${tags.map((t) => `<span class="about-tag">${escapeHtml(t)}</span>`).join('')}</div>`
      : '';

    const actions = Array.isArray(block.actions) ? block.actions : [];
    const actionsHtml = actions.length
      ? `<div class="about-actions">${actions.map(renderActionItem).join('')}</div>`
      : '';

    const badgeHtml = block.statusBadge
      ? `<span class="about-status-badge">${escapeHtml(block.statusBadge)}</span>`
      : '';

    return `
      <div class="about-hero-card">
        <div class="about-card-topbar">
          <span>${escapeHtml(block.topbarLeft || '')}</span>
          ${badgeHtml}
        </div>
        <div class="about-hero-main">
          ${avatarHtml}
          <div class="about-identity">
            <div class="about-name">${escapeHtml(block.name || '')}${nameNoteHtml}</div>
            ${roleHtml}
            ${tagsHtml}
          </div>
        </div>
        ${actionsHtml}
      </div>
    `;
  }

  function renderRichText(block) {
    const headingHtml = block.heading
      ? `<h3 class="about-section-title">${escapeHtml(block.heading)}</h3>`
      : '';
    const paragraphs = Array.isArray(block.paragraphs) ? block.paragraphs : [];
    const bodyHtml = paragraphs.length
      ? `<div class="mac-rich-text-group">${paragraphs.map((p) => `<p class="about-bio-text">${renderMarkdownLite(p)}</p>`).join('')}</div>`
      : '';

    return `<div>${headingHtml}${bodyHtml}</div>`;
  }

  function renderBentoGrid(block) {
    const headingHtml = block.heading
      ? `<h3 class="about-section-title">${escapeHtml(block.heading)}</h3>`
      : '';
    const items = Array.isArray(block.items) ? block.items : [];
    const colsClass = getColsClass(block.columns);

    const cardsHtml = items.map((item) => `
      <div class="about-bento-card">
        ${item.indexLabel ? `<span class="about-bento-index">${escapeHtml(item.indexLabel)}</span>` : ''}
        ${item.title ? `<strong class="about-bento-title">${escapeHtml(item.title)}</strong>` : ''}
        ${item.description ? `<p class="about-bento-desc">${renderMarkdownLite(item.description)}</p>` : ''}
      </div>
    `).join('');

    return `
      <div>
        ${headingHtml}
        <div class="about-bento-grid ${colsClass}">
          ${cardsHtml}
        </div>
      </div>
    `;
  }

  function renderQuoteLog(block) {
    const headerHtml = block.headerBar
      ? `<div class="about-philosophy-header">${escapeHtml(block.headerBar)}</div>`
      : '';
    const quoteHtml = block.quote
      ? `<blockquote class="about-quote">${renderMarkdownLite(block.quote)}</blockquote>`
      : '';
    const bodyHtml = block.body
      ? `<p class="about-philosophy-text">${renderMarkdownLite(block.body)}</p>`
      : '';

    return `
      <div class="about-philosophy-box">
        ${headerHtml}
        <div class="about-philosophy-body">
          ${quoteHtml}
          ${bodyHtml}
        </div>
      </div>
    `;
  }

  function renderCardsGrid(block) {
    const headingHtml = block.heading
      ? `<h3 class="about-section-title">${escapeHtml(block.heading)}</h3>`
      : '';
    const items = Array.isArray(block.items) ? block.items : [];
    const colsClass = getColsClass(block.columns);

    const cardsHtml = items.map((item) => {
      const badgeCls = item.badgeStyle === 'outline' ? 'outline' : 'solid';
      const badgeHtml = item.badge
        ? `<span class="about-card-badge ${badgeCls}">${escapeHtml(item.badge)}</span>`
        : '';
      const subtitleHtml = item.subtitle
        ? `<span class="about-card-subtitle">${escapeHtml(item.subtitle)}</span>`
        : '';
      const descHtml = item.description
        ? `<p class="about-card-desc">${renderMarkdownLite(item.description)}</p>`
        : '';
      const tags = Array.isArray(item.tags) ? item.tags : [];
      const tagsHtml = tags.length
        ? `<div class="about-tags about-card-tags">${tags.map((t) => `<span class="about-tag">${escapeHtml(t)}</span>`).join('')}</div>`
        : '';

      let btnHtml = '';
      if (item.buttonLabel && item.actionType && item.actionType !== 'none') {
        if (item.actionType === 'page' && item.target) {
          const target = escapeAttrForOnclickString(item.target);
          btnHtml = `<div><button type="button" class="about-btn" onclick="window.openPortfolioPage && window.openPortfolioPage('${target}')">${escapeHtml(item.buttonLabel)}</button></div>`;
        } else if (item.actionType === 'url' && item.target) {
          const href = escapeHtml(sanitizeUrl(item.target));
          const isExternal = /^https?:\/\//i.test(href);
          const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
          btnHtml = `<div><a href="${href}"${targetAttr} class="about-btn">${escapeHtml(item.buttonLabel)}</a></div>`;
        }
      }

      return `
        <div class="about-highlight-card">
          <div>
            <div class="about-card-head">
              <strong class="about-card-title">${escapeHtml(item.title || '')}</strong>
              ${badgeHtml}
            </div>
            ${subtitleHtml}
            ${descHtml}
            ${tagsHtml}
          </div>
          ${btnHtml}
        </div>
      `;
    }).join('');

    return `
      <div>
        ${headingHtml}
        <div class="about-highlight-grid ${colsClass}">
          ${cardsHtml}
        </div>
      </div>
    `;
  }

  function renderStatusNotice(block) {
    const topBadgeHtml = block.topBadge
      ? `<div class="mac-status-badge-row"><span class="mac-status-top-badge">${escapeHtml(block.topBadge)}</span></div>`
      : '';
    const titleHtml = block.title
      ? `<h3 class="mac-status-title">${escapeHtml(block.title)}</h3>`
      : '';
    const bodyHtml = block.body
      ? `<p class="mac-status-body">${renderMarkdownLite(block.body)}</p>`
      : '';

    const innerIconSvg = STATUS_SVGS[block.innerIcon] || STATUS_SVGS.lock;
    const innerHtml = (block.innerLabel || block.innerText)
      ? `
        <div class="mac-status-inner">
          ${block.innerLabel ? `<div class="mac-status-inner-label">${escapeHtml(block.innerLabel)}</div>` : ''}
          <div class="mac-status-inner-text">${innerIconSvg} ${escapeHtml(block.innerText || '')}</div>
        </div>
      `
      : '';

    let buttonHtml = '';
    if (block.buttonText) {
      const tooltipAttr = block.buttonTooltip ? ` title="${escapeHtml(block.buttonTooltip)}"` : '';
      if (block.buttonLocked || block.buttonActionType === 'none' || !block.buttonActionType) {
        buttonHtml = `
          <div>
            <span class="mac-status-btn-locked"${tooltipAttr}>
              ${SMALL_LOCK_SVG}
              ${escapeHtml(block.buttonText)}
            </span>
          </div>
        `;
      } else if (block.buttonActionType === 'page' && block.buttonTarget) {
        const target = escapeAttrForOnclickString(block.buttonTarget);
        buttonHtml = `<div><button type="button" class="about-btn"${tooltipAttr} onclick="window.openPortfolioPage && window.openPortfolioPage('${target}')">${escapeHtml(block.buttonText)}</button></div>`;
      } else if (block.buttonActionType === 'url' && block.buttonTarget) {
        const href = escapeHtml(sanitizeUrl(block.buttonTarget));
        const isExternal = /^https?:\/\//i.test(href);
        const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
        buttonHtml = `<div><a href="${href}"${targetAttr} class="about-btn"${tooltipAttr}>${escapeHtml(block.buttonText)}</a></div>`;
      }
    }

    return `
      <div class="mac-status-notice">
        ${topBadgeHtml}
        <div class="mac-status-card">
          ${titleHtml}
          ${bodyHtml}
          ${innerHtml}
          ${buttonHtml}
        </div>
      </div>
    `;
  }

  function renderContactCard(block) {
    const email = block.email || '';
    const rawMailto = block.mailto || email;
    const mailtoHref = rawMailto
      ? (String(rawMailto).toLowerCase().startsWith('mailto:') ? rawMailto : `mailto:${rawMailto}`)
      : '#';

    const socialLinks = Array.isArray(block.socialLinks) ? block.socialLinks : [];
    const socialHtml = socialLinks.length
      ? `
        <div class="contact-section-title">${escapeHtml(block.profilesLabel || 'PROFILES & NETWORKS')}</div>
        <div class="social-grid">
          ${socialLinks.map((link) => {
            const iconUri = CONTACT_ICONS[link.icon] || CONTACT_ICONS.link;
            const href = escapeHtml(sanitizeUrl(link.url));
            return `
              <a href="${href}" target="_blank" rel="noopener noreferrer" class="btn-retro">
                <img src="${iconUri}" class="retro-icon" alt="" />
                ${escapeHtml(link.label || '')}
              </a>
            `;
          }).join('')}
        </div>
      `
      : '';

    const hasLoc = Boolean(block.locationLabel || block.location);
    const hasTz = Boolean(block.timezoneLabel || block.timezone);
    const locationParts = [];
    if (hasLoc) {
      locationParts.push(`<img src="${CONTACT_ICONS.location}" class="retro-icon" alt="" /> <strong>${escapeHtml(block.locationLabel || '')}</strong> ${escapeHtml(block.location || '')}`);
    }
    if (hasTz) {
      locationParts.push(`<img src="${CONTACT_ICONS.clock}" class="retro-icon" alt="" /> <strong>${escapeHtml(block.timezoneLabel || '')}</strong> ${escapeHtml(block.timezone || '')}`);
    }
    const locationHtml = locationParts.length
      ? `<div class="location-info"><div>${locationParts.join(' &nbsp;|&nbsp; ')}</div></div>`
      : '';

    const noteHtml = (block.noteHeading || block.noteBody)
      ? `
        <div class="contact-note-box">
          ${block.noteHeading ? `
            <strong class="contact-note-title">
              <img src="${CONTACT_ICONS.info}" class="retro-icon" style="width:16px; height:16px;" alt="" />
              ${escapeHtml(block.noteHeading)}
            </strong>
          ` : ''}
          ${block.noteBody ? `<p class="contact-note-body">${renderMarkdownLite(block.noteBody)}</p>` : ''}
        </div>
      `
      : '';

    const badgeHtml = block.statusBadge
      ? `<span class="badge-status">${escapeHtml(block.statusBadge)}</span>`
      : '';

    return `
      <div class="contact-container">
        <div class="contact-card">
          <div class="card-header-bar">
            <span>${escapeHtml(block.topbarLeft || 'DA_COMMUNICATOR.APP // v1.0')}</span>
            ${badgeHtml}
          </div>

          <div class="contact-section-title">${escapeHtml(block.emailLabel || 'PRIMARY CONTACT (EMAIL)')}</div>
          <div class="email-box">
            <span class="email-address" id="user-email-text">${escapeHtml(email)}</span>
            <div class="btn-group">
              <button type="button" class="btn-retro primary" id="copy-email-btn" data-copied-label="${escapeHtml(block.copiedLabel || 'COPIED! [✓]')}" onclick="window.copyEmailToClipboard && window.copyEmailToClipboard(this)">
                <img src="${CONTACT_ICONS.copy}" class="retro-icon" alt="" />
                ${escapeHtml(block.copyLabel || 'COPY EMAIL')}
              </button>
              <a href="${escapeHtml(sanitizeUrl(mailtoHref))}" class="btn-retro">
                <img src="${CONTACT_ICONS.mail}" class="retro-icon" alt="" />
                ${escapeHtml(block.mailAppLabel || 'MAIL APP')}
              </a>
            </div>
          </div>

          ${socialHtml}
          ${locationHtml}
        </div>
        ${noteHtml}
      </div>
    `;
  }

  function renderCustomHtml(block) {
    const headingHtml = block.heading
      ? `<h3 class="about-section-title">${escapeHtml(block.heading)}</h3>`
      : '';
    return `
      <div class="mac-custom-html-block">
        ${headingHtml}
        <div class="mac-custom-html-body">${block.html || ''}</div>
      </div>
    `;
  }

  function renderBlock(block) {
    if (!block || typeof block !== 'object') return '';
    switch (block.type) {
      case 'hero_profile':
        return renderHeroProfile(block);
      case 'rich_text':
        return renderRichText(block);
      case 'bento_grid':
        return renderBentoGrid(block);
      case 'quote_log':
        return renderQuoteLog(block);
      case 'cards_grid':
        return renderCardsGrid(block);
      case 'status_notice':
        return renderStatusNotice(block);
      case 'contact_card':
        return renderContactCard(block);
      case 'custom_html':
        return renderCustomHtml(block);
      default:
        return '';
    }
  }

  function renderBlocks(blocks, pageTitle) {
    const titleHtml = pageTitle
      ? `<h2 class="page-title">${escapeHtml(pageTitle)}</h2>`
      : '';

    const list = Array.isArray(blocks) ? blocks : [];
    const innerHtml = list.length
      ? list.map(renderBlock).join('')
      : '<p class="about-bio-text" style="color: #666;">No content blocks configured for this page yet.</p>';

    return `
      ${titleHtml}
      <div class="mac-blocks-container about-container page-body">
        ${innerHtml}
      </div>
    `;
  }

  window.copyEmailToClipboard = function (triggerBtn) {
    const btn = triggerBtn instanceof HTMLElement ? triggerBtn : document.getElementById('copy-email-btn');
    const card = btn ? btn.closest('.email-box') : null;
    const emailEl = (card && card.querySelector('.email-address')) || document.getElementById('user-email-text');
    const emailText = emailEl ? emailEl.innerText.trim() : '';

    if (!emailText || !btn) return;

    if (!btn.dataset.origHtml) {
      btn.dataset.origHtml = btn.innerHTML;
    }

    const copiedLabel = btn.getAttribute('data-copied-label') || 'COPIED! [✓]';
    const applyFeedback = () => {
      if (btn._copyTimer) {
        clearTimeout(btn._copyTimer);
      }
      btn.innerHTML = `<img src="${CONTACT_ICONS.copy}" class="retro-icon" alt="" /> ${escapeHtml(copiedLabel)}`;
      btn._copyTimer = setTimeout(() => {
        if (btn.dataset.origHtml) {
          btn.innerHTML = btn.dataset.origHtml;
        }
        btn._copyTimer = null;
      }, 1500);
    };

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(emailText).then(applyFeedback).catch((err) => {
        console.error('Failed to copy text: ', err);
      });
    } else {
      try {
        const temp = document.createElement('textarea');
        temp.value = emailText;
        temp.style.position = 'fixed';
        temp.style.opacity = '0';
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        applyFeedback();
      } catch (err) {
        console.error('Fallback copy failed: ', err);
      }
    }
  };

  window.SiteRenderer = {
    renderBlocks,
    renderBlock,
    renderMarkdownLite,
    escapeHtml
  };
})();
