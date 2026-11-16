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

  const DOWNLOAD_SVG = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>';

  let blockInstanceSeq = 0;
  function nextInstanceId(prefix) {
    blockInstanceSeq += 1;
    return `mac_${prefix}_${blockInstanceSeq}`;
  }

  function buildTargetAttr(safeHref) {
    return /^https?:\/\//i.test(safeHref) ? ' target="_blank" rel="noopener noreferrer"' : '';
  }

  function collectUniqueValues(items, field) {
    const out = [];
    const seen = new Set();
    items.forEach((item) => {
      const val = String(item && item[field] ? item[field] : '').trim();
      if (val && !seen.has(val)) {
        seen.add(val);
        out.push(val);
      }
    });
    return out;
  }

  function renderFilterBar(filterLabel, allLabel, categories) {
    if (!categories.length && !filterLabel && !allLabel) return '';
    const labelText = filterLabel || 'FILTER:';
    const allText = allLabel || 'ALL';
    const catButtons = categories.map((cat) => `
      <button type="button" class="mac-filter-btn" data-filter-value="${escapeHtml(cat)}" aria-pressed="false" onclick="window.SiteShowcase && window.SiteShowcase.filterItems(this)">${escapeHtml(cat)}</button>
    `).join('');

    return `
      <div class="mac-filter-bar" role="group" aria-label="${escapeHtml(labelText)}">
        <span class="mac-filter-label">${escapeHtml(labelText)}</span>
        <button type="button" class="mac-filter-btn is-active" data-filter-all="1" aria-pressed="true" onclick="window.SiteShowcase && window.SiteShowcase.filterItems(this)">${escapeHtml(allText)}</button>
        ${catButtons}
      </div>
    `;
  }

  function renderTagsList(tags, extraClass) {
    const clean = Array.isArray(tags) ? tags.filter((t) => String(t ?? '').trim() !== '') : [];
    if (!clean.length) return '';
    const cls = extraClass ? `about-tags ${extraClass}` : 'about-tags';
    return `<div class="${cls}">${clean.map((t) => `<span class="about-tag">${escapeHtml(t)}</span>`).join('')}</div>`;
  }

  function copyTextWithFallback(text, onDone) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text).then(onDone).catch((err) => {
        console.error('Failed to copy text: ', err);
      });
      return;
    }

    try {
      const temp = document.createElement('textarea');
      temp.value = text;
      temp.style.position = 'fixed';
      temp.style.opacity = '0';
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
      onDone();
    } catch (err) {
      console.error('Fallback copy failed: ', err);
    }
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
      const targetAttr = buildTargetAttr(safeHref);
      return `<a href="${safeHref}"${targetAttr}>${label}</a>`;
    });

    // Parse **bold**, `code` spans and preserve line breaks
    return withLinks
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="mac-inline-code">$1</code>')
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

  function renderBlockHeading(heading) {
    return heading ? `<h3 class="about-section-title">${escapeHtml(heading)}</h3>` : '';
  }

  function renderSafeLink(url, label, className) {
    if (!label || !url) return '';
    const safeHref = escapeHtml(sanitizeUrl(url));
    const targetAttr = buildTargetAttr(safeHref);
    return `<a href="${safeHref}"${targetAttr} class="${className}">${escapeHtml(label)}</a>`;
  }

  function renderCvHeader(block) {
    const badgeHtml = block.statusBadge
      ? `<span class="about-status-badge">${escapeHtml(block.statusBadge)}</span>`
      : '';
    const titleHtml = block.title
      ? `<h3 class="mac-cv-header-title">${escapeHtml(block.title)}</h3>`
      : '';
    const subtitleHtml = block.subtitle
      ? `<div class="mac-cv-header-subtitle">${escapeHtml(block.subtitle)}</div>`
      : '';

    let downloadHtml = '';
    if (block.downloadUrl) {
      const safeDownloadHref = escapeHtml(sanitizeUrl(block.downloadUrl));
      const downloadLabel = escapeHtml(block.downloadLabel || 'DOWNLOAD CV (PDF)');
      let linkAttrs = '';
      if (block.openNewTab) {
        linkAttrs = ' target="_blank" rel="noopener noreferrer"';
      } else if (block.downloadFilename) {
        linkAttrs = ` download="${escapeHtml(block.downloadFilename)}"`;
      } else {
        linkAttrs = ' download';
      }
      downloadHtml = `<a href="${safeDownloadHref}"${linkAttrs} class="about-btn primary mac-cv-download-btn">${DOWNLOAD_SVG}<span>${downloadLabel}</span></a>`;
    }

    const secondaryHtml = renderSafeLink(block.secondaryUrl, block.secondaryLabel, 'about-btn');
    const actionsHtml = (downloadHtml || secondaryHtml)
      ? `<div class="mac-cv-header-actions">${downloadHtml}${secondaryHtml}</div>`
      : '';

    return `
      <div class="mac-cv-header">
        <div class="mac-cv-header-top">
          <div class="mac-cv-header-meta">
            ${titleHtml}
            ${subtitleHtml}
          </div>
          ${badgeHtml}
        </div>
        ${actionsHtml}
      </div>
    `;
  }

  function renderCvTimeline(block) {
    const headingHtml = renderBlockHeading(block.heading);
    const items = Array.isArray(block.items) ? block.items : [];
    const showRail = block.showTimelineRail !== false;
    const listCls = showRail ? 'mac-timeline-list has-rail' : 'mac-timeline-list no-rail';

    const itemsHtml = items.map((item) => {
      if (!item || typeof item !== 'object') return '';
      const badgeHtml = item.badge
        ? `<span class="about-card-badge solid">${escapeHtml(item.badge)}</span>`
        : '';
      const titleHtml = item.title
        ? `<strong class="mac-timeline-title">${escapeHtml(item.title)}</strong>`
        : '';
      const orgHtml = item.organization
        ? `<div class="mac-timeline-org">${escapeHtml(item.organization)}</div>`
        : '';
      const pills = [];
      if (item.period) {
        pills.push(`<span class="mac-cv-pill mac-cv-pill-period">${escapeHtml(item.period)}</span>`);
      }
      if (item.location) {
        pills.push(`<span class="mac-cv-pill mac-cv-pill-location">${escapeHtml(item.location)}</span>`);
      }
      const pillsHtml = pills.length
        ? `<div class="mac-timeline-pills">${pills.join('')}</div>`
        : '';
      const summaryHtml = item.summary
        ? `<p class="mac-timeline-summary">${renderMarkdownLite(item.summary)}</p>`
        : '';
      const bullets = Array.isArray(item.bullets)
        ? item.bullets.filter((b) => String(b ?? '').trim() !== '')
        : [];
      const bulletsHtml = bullets.length
        ? `<ul class="mac-timeline-bullets">${bullets.map((b) => `<li>${renderMarkdownLite(b)}</li>`).join('')}</ul>`
        : '';

      return `
        <div class="mac-timeline-item">
          ${showRail ? '<span class="mac-timeline-dot" aria-hidden="true"></span>' : ''}
          <div class="mac-timeline-card">
            <div class="mac-timeline-head">
              <div>
                ${titleHtml}
                ${orgHtml}
              </div>
              ${badgeHtml}
            </div>
            ${pillsHtml}
            ${summaryHtml}
            ${bulletsHtml}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="mac-timeline-block">
        ${headingHtml}
        <div class="${listCls}">
          ${itemsHtml}
        </div>
      </div>
    `;
  }

  function renderSkillsMatrix(block) {
    const headingHtml = renderBlockHeading(block.heading);
    const mode = block.displayMode === 'bars' || block.displayMode === 'pills' ? block.displayMode : 'both';
    const colsClass = getColsClass(block.columns);
    const showBars = mode === 'bars' || mode === 'both';
    const showPills = mode === 'pills' || mode === 'both';

    const skillBars = Array.isArray(block.skillBars) ? block.skillBars : [];
    let barsHtml = '';
    if (showBars && skillBars.length) {
      const barCards = skillBars.map((bar) => {
        if (!bar || typeof bar !== 'object') return '';
        const rawLevel = Number(bar.level);
        const pct = Number.isFinite(rawLevel) ? Math.max(0, Math.min(100, Math.round(rawLevel))) : 0;
        const filledSegs = Math.round(pct / 10);
        let segsHtml = '';
        for (let i = 0; i < 10; i++) {
          segsHtml += `<span class="mac-skill-seg${i < filledSegs ? ' is-filled' : ''}"></span>`;
        }

        const catHtml = bar.category
          ? `<span class="about-tag">${escapeHtml(bar.category)}</span>`
          : '';
        const noteHtml = bar.note
          ? `<p class="mac-skill-note">${renderMarkdownLite(bar.note)}</p>`
          : '';

        return `
          <div class="mac-skill-bar-card">
            <div class="mac-skill-bar-head">
              <strong class="mac-skill-label">${escapeHtml(bar.label || '')}</strong>
              <div class="mac-skill-meta">
                ${catHtml}
                <span class="mac-skill-pct">${pct}%</span>
              </div>
            </div>
            <div class="mac-skill-meter" role="progressbar" aria-label="${escapeHtml(bar.label || 'Skill level')}" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
              ${segsHtml}
            </div>
            ${noteHtml}
          </div>
        `;
      }).join('');

      barsHtml = `<div class="mac-skills-bars-grid ${colsClass}">${barCards}</div>`;
    }

    const skillGroups = Array.isArray(block.skillGroups) ? block.skillGroups : [];
    let pillsHtml = '';
    if (showPills && skillGroups.length) {
      const groupCards = skillGroups.map((group) => {
        if (!group || typeof group !== 'object') return '';
        const titleHtml = group.title
          ? `<strong class="about-bento-title">${escapeHtml(group.title)}</strong>`
          : '';
        const tagsHtml = renderTagsList(group.skills, 'mac-skill-group-tags');
        return `
          <div class="about-bento-card mac-skill-group-card">
            ${titleHtml}
            ${tagsHtml}
          </div>
        `;
      }).join('');

      pillsHtml = `<div class="about-bento-grid ${colsClass}">${groupCards}</div>`;
    }

    return `
      <div class="mac-skills-matrix-block">
        ${headingHtml}
        <div class="mac-skills-matrix-body">
          ${barsHtml}
          ${pillsHtml}
        </div>
      </div>
    `;
  }

  function renderProjectShowcase(block) {
    const instanceId = nextInstanceId('showcase');
    const headingHtml = renderBlockHeading(block.heading);
    const items = Array.isArray(block.items) ? block.items : [];
    const colsClass = getColsClass(block.columns);
    const categories = collectUniqueValues(items, 'category');
    const filterHtml = items.length ? renderFilterBar(block.filterLabel, block.allLabel, categories) : '';

    const detailPanels = [];
    const cardsHtml = items.map((item, idx) => {
      if (!item || typeof item !== 'object') return '';
      const cat = String(item.category || '').trim();
      const catHtml = cat ? `<span class="mac-card-category">${escapeHtml(cat)}</span>` : '';
      const badgeHtml = item.badge
        ? `<span class="about-card-badge solid">${escapeHtml(item.badge)}</span>`
        : '';
      const summaryHtml = item.summary
        ? `<p class="about-card-desc">${renderMarkdownLite(item.summary)}</p>`
        : '';
      const tagsHtml = renderTagsList(item.tags, 'about-card-tags');

      const detailMode = item.detailMode === 'url' || item.detailMode === 'page' ? item.detailMode : 'inline';
      const defaultLabel = detailMode === 'url' ? 'OPEN LINK ↗' : detailMode === 'page' ? 'OPEN PAGE →' : 'VIEW DETAILS →';
      const btnLabel = item.buttonLabel || defaultLabel;

      let btnHtml = '';
      if (detailMode === 'url') {
        btnHtml = item.target
          ? `<div>${renderSafeLink(item.target, btnLabel, 'about-btn')}</div>`
          : '';
      } else if (detailMode === 'page') {
        if (item.target) {
          const target = escapeAttrForOnclickString(item.target);
          btnHtml = `<div><button type="button" class="about-btn" onclick="window.openPortfolioPage && window.openPortfolioPage('${target}')">${escapeHtml(btnLabel)}</button></div>`;
        }
      } else {
        btnHtml = `<div><button type="button" class="about-btn" data-detail-index="${idx}" onclick="window.SiteShowcase && window.SiteShowcase.openDetail(this)">${escapeHtml(btnLabel)}</button></div>`;

        const detailTitle = item.detailTitle || item.title || '';
        const detailMeta = item.detailMeta || [cat, item.badge].filter(Boolean).join(' // ');
        const detailBody = item.detailBody || item.summary || '';
        const detailLinks = Array.isArray(item.detailLinks) ? item.detailLinks : [];
        const linksHtml = detailLinks
          .map((lnk) => renderSafeLink(lnk && lnk.url, lnk && lnk.label, 'about-btn'))
          .filter(Boolean)
          .join('');

        detailPanels.push(`
          <div class="mac-inline-detail-panel mac-hidden" data-detail-index="${idx}" hidden>
            <div class="mac-detail-header">
              <div class="mac-detail-meta-row">
                ${detailMeta ? `<span class="mac-detail-meta">${escapeHtml(detailMeta)}</span>` : ''}
                ${badgeHtml}
              </div>
              ${detailTitle ? `<h3 class="mac-detail-title">${escapeHtml(detailTitle)}</h3>` : ''}
              ${tagsHtml}
            </div>
            ${detailBody ? `<div class="mac-detail-body">${renderMarkdownLite(detailBody)}</div>` : ''}
            ${linksHtml ? `<div class="mac-detail-links">${linksHtml}</div>` : ''}
          </div>
        `);
      }

      return `
        <div class="about-highlight-card mac-showcase-card" data-filter-item="1" data-filter-category="${escapeHtml(cat)}">
          <div>
            ${(catHtml || badgeHtml) ? `<div class="mac-card-meta-row">${catHtml}${badgeHtml}</div>` : ''}
            <strong class="about-card-title">${escapeHtml(item.title || '')}</strong>
            ${summaryHtml}
            ${tagsHtml}
          </div>
          ${btnHtml}
        </div>
      `;
    }).join('');

    const detailViewHtml = detailPanels.length
      ? `
        <div class="mac-showcase-detail-view mac-hidden" hidden>
          <div class="mac-detail-topbar">
            <button type="button" class="about-btn mac-back-btn" onclick="window.SiteShowcase && window.SiteShowcase.closeDetail(this)">← BACK TO ALL</button>
          </div>
          ${detailPanels.join('')}
        </div>
      `
      : '';

    return `
      <div class="mac-showcase-block" data-showcase-id="${instanceId}">
        <div class="mac-showcase-list-view">
          ${headingHtml}
          ${filterHtml}
          <div class="about-highlight-grid ${colsClass}">
            ${cardsHtml}
          </div>
        </div>
        ${detailViewHtml}
      </div>
    `;
  }

  function renderPublicationsList(block) {
    const instanceId = nextInstanceId('pubs');
    const headingHtml = renderBlockHeading(block.heading);
    const items = Array.isArray(block.items) ? block.items : [];
    const pubTypes = collectUniqueValues(items, 'pubType');
    const filterHtml = items.length ? renderFilterBar(block.filterLabel, block.allLabel, pubTypes) : '';

    const cardsHtml = items.map((item) => {
      if (!item || typeof item !== 'object') return '';
      const pubType = String(item.pubType || '').trim();
      const pubTypeHtml = pubType ? `<span class="mac-pub-type-pill">${escapeHtml(pubType)}</span>` : '';
      const yearHtml = item.year ? `<span class="mac-cv-pill">${escapeHtml(item.year)}</span>` : '';
      const badgeHtml = item.statusBadge
        ? `<span class="about-card-badge solid">${escapeHtml(item.statusBadge)}</span>`
        : '';

      const titleHtml = item.title
        ? `<h4 class="mac-pub-title"><em>${escapeHtml(item.title)}</em></h4>`
        : '';
      const authorsHtml = item.authors
        ? `<div class="mac-pub-authors">${renderMarkdownLite(item.authors)}</div>`
        : '';
      const venueHtml = item.venue
        ? `<div class="mac-pub-venue">${renderMarkdownLite(item.venue)}</div>`
        : '';

      const links = Array.isArray(item.links) ? item.links : [];
      const linksHtml = links
        .map((lnk) => renderSafeLink(lnk && lnk.url, lnk && lnk.label, 'mac-pub-pill-btn'))
        .filter(Boolean)
        .join('');

      const rawBibtex = String(item.bibtex || '').trim();
      const hasBibtex = rawBibtex.length > 0;
      const bibtexBtnHtml = hasBibtex
        ? '<button type="button" class="mac-pub-pill-btn mac-bibtex-toggle" aria-expanded="false" onclick="window.SiteShowcase && window.SiteShowcase.toggleBibtex(this)">BIBTEX</button>'
        : '';
      const bibtexDrawerHtml = hasBibtex
        ? `
          <div class="mac-bibtex-drawer mac-hidden" hidden>
            <div class="mac-bibtex-toolbar">
              <span>BIBTEX ENTRY</span>
              <button type="button" class="mac-bibtex-copy-btn" data-copied-label="COPIED! [✓]" onclick="window.SiteShowcase && window.SiteShowcase.copyBibtex(this)">COPY</button>
            </div>
            <pre class="mac-bibtex-pre"><code>${escapeHtml(rawBibtex)}</code></pre>
          </div>
        `
        : '';

      const actionsRow = (linksHtml || bibtexBtnHtml)
        ? `<div class="mac-pub-actions">${linksHtml}${bibtexBtnHtml}</div>`
        : '';

      return `
        <article class="mac-pub-card" data-filter-item="1" data-filter-category="${escapeHtml(pubType)}">
          ${(pubTypeHtml || yearHtml || badgeHtml) ? `
            <div class="mac-pub-meta-row">
              <div class="mac-pub-meta-left">${pubTypeHtml}${yearHtml}</div>
              ${badgeHtml}
            </div>
          ` : ''}
          ${titleHtml}
          ${authorsHtml}
          ${venueHtml}
          ${actionsRow}
          ${bibtexDrawerHtml}
        </article>
      `;
    }).join('');

    return `
      <div class="mac-publications-block" data-showcase-id="${instanceId}">
        ${headingHtml}
        ${filterHtml}
        <div class="mac-publications-list">
          ${cardsHtml}
        </div>
      </div>
    `;
  }

  function renderNotesList(block) {
    const instanceId = nextInstanceId('notes');
    const headingHtml = renderBlockHeading(block.heading);
    const items = Array.isArray(block.items) ? block.items : [];
    const colsClass = getColsClass(block.columns);
    const categories = collectUniqueValues(items, 'category');
    const filterHtml = items.length ? renderFilterBar(block.filterLabel, block.allLabel, categories) : '';

    const detailPanels = [];
    const cardsHtml = items.map((item, idx) => {
      if (!item || typeof item !== 'object') return '';
      const cat = String(item.category || '').trim();
      const catHtml = cat ? `<span class="about-card-badge solid">${escapeHtml(cat)}</span>` : '';
      const dateHtml = item.date ? `<span class="mac-note-meta-item">${escapeHtml(item.date)}</span>` : '';
      const readTimeHtml = item.readTime ? `<span class="mac-note-meta-item">${escapeHtml(item.readTime)}</span>` : '';
      const summaryHtml = item.summary
        ? `<p class="about-card-desc">${renderMarkdownLite(item.summary)}</p>`
        : '';
      const tagsHtml = renderTagsList(item.tags, 'about-card-tags');

      const detailMode = item.detailMode === 'url' ? 'url' : 'inline';
      const btnLabel = item.buttonLabel || (detailMode === 'url' ? 'OPEN ARTICLE ↗' : 'READ NOTE →');

      let btnHtml = '';
      if (detailMode === 'url') {
        btnHtml = item.target
          ? `<div>${renderSafeLink(item.target, btnLabel, 'about-btn')}</div>`
          : '';
      } else {
        btnHtml = `<div><button type="button" class="about-btn" data-detail-index="${idx}" onclick="window.SiteShowcase && window.SiteShowcase.openDetail(this)">${escapeHtml(btnLabel)}</button></div>`;
        const bodyText = item.noteBody || item.summary || '';
        detailPanels.push(`
          <div class="mac-inline-detail-panel mac-hidden" data-detail-index="${idx}" hidden>
            <div class="mac-detail-header">
              <div class="mac-detail-meta-row">
                ${catHtml}
                <div class="mac-note-meta-group">${dateHtml}${readTimeHtml}</div>
              </div>
              ${item.title ? `<h3 class="mac-detail-title">${escapeHtml(item.title)}</h3>` : ''}
              ${tagsHtml}
            </div>
            ${bodyText ? `<div class="mac-detail-body mac-note-reader-body">${renderMarkdownLite(bodyText)}</div>` : ''}
          </div>
        `);
      }

      return `
        <article class="about-highlight-card mac-note-card" data-filter-item="1" data-filter-category="${escapeHtml(cat)}">
          <div>
            ${(catHtml || dateHtml || readTimeHtml) ? `
              <div class="mac-card-meta-row">
                ${catHtml}
                <div class="mac-note-meta-group">${dateHtml}${readTimeHtml}</div>
              </div>
            ` : ''}
            <strong class="about-card-title">${escapeHtml(item.title || '')}</strong>
            ${summaryHtml}
            ${tagsHtml}
          </div>
          ${btnHtml}
        </article>
      `;
    }).join('');

    const detailViewHtml = detailPanels.length
      ? `
        <div class="mac-showcase-detail-view mac-hidden" hidden>
          <div class="mac-detail-topbar">
            <button type="button" class="about-btn mac-back-btn" onclick="window.SiteShowcase && window.SiteShowcase.closeDetail(this)">← BACK TO ALL NOTES</button>
          </div>
          ${detailPanels.join('')}
        </div>
      `
      : '';

    return `
      <div class="mac-notes-block" data-showcase-id="${instanceId}">
        <div class="mac-showcase-list-view">
          ${headingHtml}
          ${filterHtml}
          <div class="about-highlight-grid mac-notes-grid ${colsClass}">
            ${cardsHtml}
          </div>
        </div>
        ${detailViewHtml}
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
      case 'cv_header':
        return renderCvHeader(block);
      case 'cv_timeline':
        return renderCvTimeline(block);
      case 'skills_matrix':
        return renderSkillsMatrix(block);
      case 'project_showcase':
        return renderProjectShowcase(block);
      case 'publications_list':
        return renderPublicationsList(block);
      case 'notes_list':
        return renderNotesList(block);
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

  function scrollPageContainerToTop(root) {
    const scroller = (root && root.closest('#pages-container')) || document.getElementById('pages-container');
    if (scroller) {
      scroller.scrollTop = 0;
    }
  }

  window.SiteShowcase = {
    filterItems: function (triggerBtn) {
      if (!(triggerBtn instanceof HTMLElement)) return;
      const root = triggerBtn.closest('[data-showcase-id]');
      if (!root) return;

      const isAll = triggerBtn.getAttribute('data-filter-all') === '1';
      const targetCategory = triggerBtn.getAttribute('data-filter-value') || '';

      root.querySelectorAll('.mac-filter-btn').forEach((btn) => {
        const active = btn === triggerBtn;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      root.querySelectorAll('[data-filter-item]').forEach((itemEl) => {
        const itemCat = itemEl.getAttribute('data-filter-category') || '';
        const visible = isAll || itemCat === targetCategory;
        itemEl.hidden = !visible;
        itemEl.classList.toggle('mac-hidden', !visible);
      });
    },

    openDetail: function (triggerBtn) {
      if (!(triggerBtn instanceof HTMLElement)) return;
      const root = triggerBtn.closest('[data-showcase-id]');
      if (!root) return;

      const idx = triggerBtn.getAttribute('data-detail-index');
      const listView = root.querySelector('.mac-showcase-list-view');
      const detailView = root.querySelector('.mac-showcase-detail-view');
      if (!listView || !detailView || idx === null) return;

      listView.hidden = true;
      listView.classList.add('mac-hidden');
      detailView.hidden = false;
      detailView.classList.remove('mac-hidden');

      detailView.querySelectorAll('.mac-inline-detail-panel').forEach((panel) => {
        const match = panel.getAttribute('data-detail-index') === idx;
        panel.hidden = !match;
        panel.classList.toggle('mac-hidden', !match);
      });

      scrollPageContainerToTop(root);
    },

    closeDetail: function (triggerBtn) {
      if (!(triggerBtn instanceof HTMLElement)) return;
      const root = triggerBtn.closest('[data-showcase-id]');
      if (!root) return;

      const listView = root.querySelector('.mac-showcase-list-view');
      const detailView = root.querySelector('.mac-showcase-detail-view');
      if (!listView || !detailView) return;

      detailView.hidden = true;
      detailView.classList.add('mac-hidden');
      detailView.querySelectorAll('.mac-inline-detail-panel').forEach((panel) => {
        panel.hidden = true;
        panel.classList.add('mac-hidden');
      });

      listView.hidden = false;
      listView.classList.remove('mac-hidden');

      scrollPageContainerToTop(root);
    },

    toggleBibtex: function (triggerBtn) {
      if (!(triggerBtn instanceof HTMLElement)) return;
      const card = triggerBtn.closest('.mac-pub-card');
      const drawer = card ? card.querySelector('.mac-bibtex-drawer') : null;
      if (!drawer) return;

      const willOpen = drawer.hidden || drawer.classList.contains('mac-hidden');
      drawer.hidden = !willOpen;
      drawer.classList.toggle('mac-hidden', !willOpen);
      triggerBtn.classList.toggle('is-open', willOpen);
      triggerBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    },

    copyBibtex: function (triggerBtn) {
      if (!(triggerBtn instanceof HTMLElement)) return;
      const drawer = triggerBtn.closest('.mac-bibtex-drawer');
      const codeEl = drawer ? drawer.querySelector('code') : null;
      const bibtexText = codeEl ? codeEl.textContent : '';
      if (!bibtexText) return;

      if (!triggerBtn.dataset.origText) {
        triggerBtn.dataset.origText = triggerBtn.textContent || 'COPY';
      }
      const copiedLabel = triggerBtn.getAttribute('data-copied-label') || 'COPIED! [✓]';

      copyTextWithFallback(bibtexText, () => {
        if (triggerBtn._copyTimer) {
          clearTimeout(triggerBtn._copyTimer);
        }
        triggerBtn.textContent = copiedLabel;
        triggerBtn._copyTimer = setTimeout(() => {
          triggerBtn.textContent = triggerBtn.dataset.origText || 'COPY';
          triggerBtn._copyTimer = null;
        }, 1500);
      });
    }
  };

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
    copyTextWithFallback(emailText, () => {
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
    });
  };

  window.SiteRenderer = {
    renderBlocks,
    renderBlock,
    renderMarkdownLite,
    escapeHtml
  };
})();
