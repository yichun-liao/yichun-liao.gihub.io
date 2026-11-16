# Yi-Chun Liao — Retro Macintosh Personal Website & Studio CMS

A lightweight, 1984 Macintosh System 1.0–inspired personal portfolio featuring a Three.js boot sequence, multilingual routing (`en`, `zh_hant`, `zh_hans`), and a built-in **Portfolio Studio** visual editor powered by `data/site-content.json`.

---

## 1. Quick Start: Opening Portfolio Studio

You can edit text, add or reorder content blocks, and create new tabs visually using **Portfolio Studio** without writing HTML.

### Windows
Double-click **`Open_Portfolio_Studio.bat`** in the project root.  
It starts the local Python server and automatically opens `http://127.0.0.1:8765/studio/` in your browser.

### macOS
Double-click **`Open_Portfolio_Studio.command`** in Finder.  
*(If macOS blocks it the first time as an unidentified developer file, right-click `Open_Portfolio_Studio.command` → **Open**, or run `chmod +x Open_Portfolio_Studio.command` once in Terminal.)*

### Command Line (Windows / macOS / Linux)
```bash
python studio/server.py        # Windows (or python3 studio/server.py on macOS/Linux)
```
Optional flags:
- `--port 9000` — choose a custom port (defaults to `8765`, automatically picking the next free port if busy).
- `--no-open` — start the server without opening a browser tab automatically.

> **Automatic Backups:** Every time you click **Save Changes** (`Ctrl+S` / `Cmd+S`) in Portfolio Studio, `studio/server.py` automatically saves a timestamped snapshot to `data/backups/site-content.<timestamp>.json` (keeping the 20 most recent backups, git-ignored) before updating `data/site-content.json`.

---

## 2. Project Structure

```text
.
├── index.html                      # English homepage (/)
├── zh-hant/index.html              # Traditional Chinese homepage (/zh-hant/)
├── zh-hans/index.html              # Simplified Chinese homepage (/zh-hans/)
├── Open_Portfolio_Studio.bat       # Windows one-click Studio launcher
├── Open_Portfolio_Studio.command   # macOS one-click Studio launcher
├── data/
│   └── site-content.json           # Single source of truth for menus, tabs, and blocks
├── studio/
│   ├── index.html                  # Portfolio Studio visual editor UI
│   ├── studio.css                  # Studio retro Mac styling
│   ├── studio.js                   # Visual block/tab editor + live preview sync
│   └── server.py                   # Local HTTP server + /api/save endpoint
├── js/
│   ├── config.js                   # Retro SVG icon library (MAC_ICONS) & preview setup
│   ├── scene3d.js                  # Optimized Three.js 3D Macintosh boot animation
│   ├── renderer.js                 # JSON-to-HTML block renderer (SiteRenderer)
│   └── ui.js                       # Routing (?page=), desktop ring layout, & language switching
├── css/
│   └── style.css                   # Main site & block styles
├── pictures/
│   └── me.jpeg                     # Profile photo
├── archive/
│   └── legacy-pages/               # Archived pre-CMS HTML pages & drafts (unused by runtime)
├── CNAME                           # GitHub Pages custom domain (yichunliao.com)
├── .nojekyll                       # Disables Jekyll on GitHub Pages
├── robot.txt & sitemap.xml         # Search engine indexing metadata
└── .gitignore                      # Ignores .DS_Store, __pycache__, data/backups/
```

---

## 3. How to Edit `data/site-content.json` Manually

All navigation links, desktop icons, modal titles, and page blocks live in **`data/site-content.json`**.

### Top-Level Structure
```json
{
  "version": 1,
  "site": {
    "menuLinks": [
      {
        "id": "menu-home",
        "action": "home",
        "bold": true,
        "labels": { "en": "Home", "zh_hant": "首頁", "zh_hans": "首页" }
      },
      {
        "id": "menu-cv",
        "action": "page",
        "pageId": "cv",
        "bold": false,
        "labels": { "en": "CV", "zh_hant": "履歷", "zh_hans": "履历" }
      }
    ],
    "defaultCenterTabId": "about"
  },
  "tabs": [ ... ]
}
```
- `menuLinks[].action`: `"home"` returns to the desktop; `"page"` opens the tab matching `pageId`.
- `tabs[]`: Each tab appears as a circular icon on the desktop (when `"showInDesktop": true`) and can be opened via `?page=<id>`.

### Tab Object Format
```json
{
  "id": "projects",
  "icon": "projects",
  "isCenter": false,
  "showInDesktop": true,
  "labels": {
    "en": "Projects",
    "zh_hant": "專案作品",
    "zh_hans": "专案作品"
  },
  "pageTitle": {
    "en": "Projects // Showcase",
    "zh_hant": "專案作品 // 展示",
    "zh_hans": "专案作品 // 展示"
  },
  "blocks": {
    "en": [ ],
    "zh_hant": [ ],
    "zh_hans": [ ]
  }
}
```
- **Available `icon` names** (defined in `js/config.js` → `MAC_ICONS`):  
  `about`, `projects`, `research`, `cv`, `notes`, `contact`, `star`, `terminal`, `book`, `folder`, `globe`, `bolt`.
- **Center button**: Set `"isCenter": true` on one tab (normally `about`) to render it in the larger pulsing center circle. All other `"showInDesktop": true` tabs automatically arrange evenly in a circle around it.
- **Locale fallback**: If a newly added tab only fills `"blocks": { "en": [...] }`, `js/ui.js` falls back to `en` automatically when viewing another language until you translate it.

### Inline Formatting (Markdown-Lite)
Inside `rich_text` paragraphs (and other markdown-lite fields rendered by `js/renderer.js`), raw HTML is safely escaped and these inline formats are supported:
- `**bold text**` → `<strong>bold text</strong>`
- `[link label](https://example.com)` → `<a href="..." target="_blank" rel="noopener noreferrer">link label</a>` (supports `/relative`, `#anchor`, `http://`, `https://`, `mailto:`)
- Newlines (`\n`) → `<br>`

### Supported Block Types (`blocks.<lang>[]`)
Every block requires a unique `"id"` string and a `"type"` from the 8 built-in types below:

1. **`hero_profile`** — System Profile header card with avatar, tags, and action buttons:
   ```json
   {
     "id": "blk_about_hero",
     "type": "hero_profile",
     "topbarLeft": "BIO_VIEWER.APP // PROFILE_ID: CU-ECE",
     "statusBadge": "PHD RESEARCHER // ACTIVE",
     "avatar": "/pictures/me.jpeg",
     "name": "Yi-Chun Liao",
     "nameNote": "(廖翊鈞)",
     "role": "ECE Ph.D. Student @ University of Colorado Boulder",
     "tags": ["#Safety-Critical Control", "#Statistical System ID"],
     "actions": [
       { "label": "RESEARCH →", "style": "primary", "actionType": "page", "target": "research" },
       { "label": "GITHUB ↗", "style": "default", "actionType": "url", "target": "https://github.com/yichun-liao" }
     ]
   }
   ```

2. **`rich_text`** — Section heading with one or more paragraphs:
   ```json
   {
     "id": "blk_bio",
     "type": "rich_text",
     "heading": "01 // Executive Biography",
     "paragraphs": [
       "First paragraph with **bold emphasis** and a [link](https://example.com)."
     ]
   }
   ```

3. **`bento_grid`** — Multi-column retro module grid (`columns`: `1`, `2`, or `3`):
   ```json
   {
     "id": "blk_bento",
     "type": "bento_grid",
     "heading": "02 // Technical Expertise & Focus",
     "columns": 2,
     "items": [
       {
         "indexLabel": "MODULE 01 // SYSTEM ID",
         "title": "Statistical System Identification",
         "description": "Formulating mathematical state-space models from trajectory data."
       }
     ]
   }
   ```

4. **`quote_log`** — Terminal-styled highlight box with blockquote and commentary:
   ```json
   {
     "id": "blk_quote",
     "type": "quote_log",
     "headerBar": "TECHNICAL_APPROACH.LOG // CORE THESIS",
     "quote": "\"Data provides the model, but analytical structure provides the safety guarantees.\"",
     "body": "Supporting explanation text."
   }
   ```

5. **`cards_grid`** — Project/paper/highlight cards (`columns`: `1`, `2`, or `3`, optional `tags` & button):
   ```json
   {
     "id": "blk_tracks",
     "type": "cards_grid",
     "heading": "03 // Featured Tracks",
     "columns": 2,
     "items": [
       {
         "badge": "ECE PHD",
         "badgeStyle": "solid",
         "title": "Data-Driven Safety & System ID",
         "subtitle": "Safety-Critical Control & Safety Filters",
         "description": "Short summary of the project or research track.",
         "tags": ["CBFs", "MATLAB"],
         "buttonLabel": "EXPLORE RESEARCH →",
         "actionType": "page",
         "target": "research"
       }
     ]
   }
   ```
   *(Set `"badgeStyle"` to `"solid"` or `"outline"`, and `"actionType"` to `"page"`, `"url"`, or `"none"`.)*

6. **`status_notice`** — Retro status / coming-soon / download card:
   ```json
   {
     "id": "blk_cv_status",
     "type": "status_notice",
     "topBadge": "CV // PENDING PUBLICATION",
     "title": "Full CV & Resume Pending Release",
     "body": "Description text.",
     "innerLabel": "Release Timeline",
     "innerText": "PDF Download Available Upon Paper Acceptance",
     "innerIcon": "lock",
     "buttonText": "PDF CV (Available Upon Publication)",
     "buttonLocked": true,
     "buttonTooltip": "PDF version will be uploaded after paper publication",
     "buttonActionType": "none",
     "buttonTarget": ""
   }
   ```
   *(`innerIcon` options: `"lock"`, `"monitor"`, `"scale"`, `"pen"`.)*

7. **`contact_card`** — Interactive `DA_COMMUNICATOR.APP` card with copy-to-clipboard email, `mailto:`, social links, and footer note:
   ```json
   {
     "id": "blk_contact",
     "type": "contact_card",
     "topbarLeft": "DA_COMMUNICATOR.APP // v1.0",
     "statusBadge": "OPEN FOR COLLABORATION",
     "emailLabel": "PRIMARY CONTACT (EMAIL)",
     "email": "contact@yichunliao.com",
     "copyLabel": "COPY EMAIL",
     "copiedLabel": "COPIED! [✓]",
     "mailAppLabel": "MAIL APP",
     "mailto": "contact@yichunliao.com",
     "profilesLabel": "PROFILES & NETWORKS",
     "socialLinks": [
       { "label": "GITHUB ↗", "icon": "folder", "url": "https://github.com/yichun-liao" }
     ],
     "locationLabel": "Location:",
     "location": "Colorado, USA",
     "timezoneLabel": "Timezone:",
     "timezone": "Mountain Time (UTC-7 / MST)",
     "noteHeading": "INQUIRIES & INTERESTS",
     "noteBody": "Always open to discussions on system identification and research collaborations."
   }
   ```

8. **`custom_html`** — Raw HTML block for custom embeds (e.g., interactive widgets, KaTeX snippets, or media):
   ```json
   {
     "id": "blk_custom",
     "type": "custom_html",
     "heading": "Optional Heading",
     "html": "<p>Custom HTML content goes here.</p>"
   }
   ```

---

## 4. How to Add New Functionality

### A. Add a New Tab (No Code Required)
1. Open **Portfolio Studio** (`Open_Portfolio_Studio.bat` on Windows or `Open_Portfolio_Studio.command` on macOS).
2. Click **`+ Add New Tab`** in the left sidebar, pick an ID (e.g., `teaching`), labels, and a pixel icon.
3. Add content blocks in the center editor and click **Save Changes**.
4. The new circular button automatically appears on the desktop and becomes reachable at `/?page=teaching`.

*(Tip: If you want Google to index the new tab too, add `<url><loc>https://yichunliao.com/?page=teaching</loc></url>` to `sitemap.xml`.)*

### B. Add a New Desktop Pixel Icon
1. Add a crisp `16x16` `<svg>` entry to `MAC_ICONS` in **`js/config.js`**.
2. Add the same icon key and `<svg>` to `STUDIO_ICONS` in **`studio/studio.js`** so it appears in the Studio icon picker.

### C. Add a New Modular Block Type
1. **Render logic (`js/renderer.js`)**: Write a `renderMyBlock(block)` function using `escapeHtml` / `renderMarkdownLite` and register it in the `switch (block.type)` dispatcher inside `renderBlock()`.
2. **Styling (`css/style.css`)**: Add matching retro-Mac border/shadow classes (e.g., `.mac-my-block`).
3. **Studio UI (`studio/studio.js`)**:
   - Add `{ type: 'my_block', label: 'My Block', short: 'MY BLOCK' }` to `BLOCK_CATALOG`.
   - Add default template fields in `createDefaultBlock(type)`.
   - Add form inputs inside `renderBlockFields(block, onMutate)`.

### D. Add a New Language (e.g., Japanese `ja`)
1. Copy `index.html` to a new directory (e.g., `ja/index.html`), update `<html lang="ja">`, canonical/OG URLs, and `<select id="lang-select">` options across `index.html`, `zh-hant/index.html`, `zh-hans/index.html`, and `ja/index.html`.
2. Update `getInitialLang()` and `changeLanguage()` in **`js/ui.js`** to map `/ja` $\leftrightarrow$ `'ja'`.
3. Add `'ja'` to `TRANSLATIONS` in **`js/config.js`** and to `LANG_META` in **`studio/studio.js`**.

---

## 5. Deploying to GitHub Pages

After editing content in Portfolio Studio:
```bash
git add data/site-content.json
git commit -m "Update portfolio content"
git push origin main
```
GitHub Pages serves static files directly from the repository root (`CNAME` points to `yichunliao.com`), so no build step is needed.
