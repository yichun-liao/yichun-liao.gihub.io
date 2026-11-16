// js/config.js

const MAC_ICONS = {
  about: `<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M6 1h4v1H6V1zm-1 2h6v1H5V3zm0 2h6v3H5V5zm1 3h4v1H6V8zm-3 3h10v1H3v-1zm-1 1h12v1H2v-1zm-1 1h14v2H1v-2z"/></svg>`,
  projects: `<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M2 3h5v2h7v8H2V3zm1 1v7h10V5H6V4H3z"/></svg>`,
  research: `<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M3 1h6l3 3v10H3V1zm1 1v11h7V5H9V2H4zm5 0v2h2V2H9zM5 10h1v2H5v-2zm2-3h1v5H7V7zm2-2h1v7H9V5z"/></svg>`,
  cv: `<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M6 2h4v2H6V2zm1 1h2v1H7V3zM2 5h12v8H2V5zm1 1v1h10V6H3zm0 2v4h10V8H3z"/></svg>`,
  notes: `<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M6 1h4v1H6V1zm-2 2h8v1H4V3zm-1 2h10v1H3V5zm0 2h10v1H3V7zm1 2h8v1H4V9zm1 2h6v1H5v-1zm1 2h4v1H6v-1z"/></svg>`,
  contact: `<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M1 4h14v8H1V4zm1 1v1l5 3.5L12 6V5H2zm0 2.5V11h12V7.5L9 10H7L2 7.5z"/></svg>`,
  star: `<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M7 1h2v2H7V1zM6 3h1v2H6V3zm3 0h1v2H9V3zM1 5h5v1H1V5zm9 0h5v1h-5V5zM2 6h1v1H2V6zm11 0h1v1h-1V6zM3 7h2v1H3V7zm8 0h2v1h-2V7zM4 8h1v4H4V8zm7 0h1v4h-1V8zM3 12h1v2H3v-2zm9 0h1v2h-1v-2zm-8 1h2v1H4v-1zm6 0h2v1h-2v-1zm-4-1h1v1H6v-1zm3 0h1v1H9v-1zm-2-1h2v1H7v-1z"/></svg>`,
  terminal: `<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M1 2h14v12H1V2zm1 2v9h12V4H2zm2 2h1v1H4V6zm1 1h1v1H5V7zm1 1h1v1H6V8zM5 9h1v1H5V9zm-1 1h1v1H4v-1zm4 0h4v1H8v-1z"/></svg>`,
  book: `<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M1 2h14v12H1V2zm1 1v10h5V3H2zm6 0v10h6V3H8zM3 5h3v1H3V5zm0 2h3v1H3V7zm0 2h3v1H3V9zm6-4h4v1H9V5zm0 2h4v1H9V7zm0 2h4v1H9V9z"/></svg>`,
  folder: `<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path fill-rule="evenodd" d="M1 2h4v1h1v1h9v10H1V2zm1 1v2h12V4H5V3H2zm0 3v7h12V6H2z"/></svg>`,
  globe: `<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M5 1h6v1H5V1zM3 2h2v1H3V2zm8 0h2v1h-2V2zM2 3h1v2H2V3zm11 0h1v2h-1V3zM1 5h1v6H1V5zm13 0h1v6h-1V5zM2 11h1v2H2v-2zm11 0h1v2h-1v-2zM3 13h2v1H3v-1zm8 0h2v1h-2v-1zm-6 1h6v1H5v-1zM3 4h10v1H3V4zM2 7h12v1H2V7zm1 4h10v1H3v-1zM5 2h1v3H5V2zm5 0h1v3h-1V2zM4 5h1v6H4V5zm7 0h1v6h-1V5zM5 11h1v3H5v-3zm5 0h1v3h-1v-3z"/></svg>`,
  bolt: `<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M8 1h4v1h-1v1h-1v1H9v2h4v2h-1v1h-1v1h-1v2H8v1H7v1H5v1H4v-3h1v-2h1V8H3V6h1V5h1V4h1V2h2V1z"/></svg>`
};

const ICON_NAMES = Object.keys(MAC_ICONS);

// Dynamic content stores populated when /data/site-content.json loads
var TRANSLATIONS = {
  en: {},
  zh_hant: {},
  zh_hans: {}
};

var PAGES = [];

window.MAC_ICONS = MAC_ICONS;
window.ICON_NAMES = ICON_NAMES;
window.TRANSLATIONS = TRANSLATIONS;
window.PAGES = PAGES;

// Skip 3D boot animation inside Studio live preview iframe
try {
  if (new URLSearchParams(window.location.search).get('studio_preview') === '1') {
    sessionStorage.setItem('mac_boot_done', '1');
  }
} catch (e) { /* ignore storage restrictions */ }
