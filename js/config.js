// js/config.js

const MAC_ICONS = {
  about: `<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M6 1h4v1H6V1zm-1 2h6v1H5V3zm0 2h6v3H5V5zm1 3h4v1H6V8zm-3 3h10v1H3v-1zm-1 1h12v1H2v-1zm-1 1h14v2H1v-2z"/></svg>`,
  projects: `<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M2 3h5v2h7v8H2V3zm1 1v7h10V5H6V4H3z"/></svg>`,
  research: `<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M3 1h6l3 3v10H3V1zm1 1v11h7V5H9V2H4zm5 0v2h2V2H9zM5 10h1v2H5v-2zm2-3h1v5H7V7zm2-2h1v7H9V5z"/></svg>`,
  cv: `<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M6 2h4v2H6V2zm1 1h2v1H7V3zM2 5h12v8H2V5zm1 1v1h10V6H3zm0 2v4h10V8H3z"/></svg>`,
  notes: `<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M6 1h4v1H6V1zm-2 2h8v1H4V3zm-1 2h10v1H3V5zm0 2h10v1H3V7zm1 2h8v1H4V9zm1 2h6v1H5v-1zm1 2h4v1H6v-1z"/></svg>`,
  contact: `<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" style="shape-rendering:crispEdges;"><path d="M1 4h14v8H1V4zm1 1v1l5 3.5L12 6V5H2zm0 2.5V11h12V7.5L9 10H7L2 7.5z"/></svg>`
};

// 🌐 獨立多語言翻譯字典（新增語言只需在這裡多加一個 key）
const TRANSLATIONS = {
  en: {
    about: 'About Me',
    projects: 'Projects',
    research: 'Research & Papers',
    cv: 'Curriculum Vitae',
    notes: 'Notes & Blog',
    contact: 'Contact'
  },
  zh_hant: {
    about: '關於我',
    projects: '專案作品',
    research: '學術研究',
    cv: '個人履歷',
    notes: '筆記與文章',
    contact: '聯絡方式'
  },
  zh_hans: {
    about: '关于我',
    projects: '专案作品',
    research: '学术研究',
    cv: '个人履历',
    notes: '笔记与文章',
    contact: '联繫方式'
  },
  // ja: {
  //   about: '自己紹介',
  //   projects: 'プロジェクト',
  //   research: '研究実績',
  //   cv: '職務経歴書',
  //   notes: '記事・筆記',
  //   contact: 'お問い合わせ'
  // }
};

// 📄 頁面結構定義（只保留 ID 與圖示，極度乾淨）
const PAGES = [
  { id: 'about', icon: MAC_ICONS.about },
  { id: 'projects', icon: MAC_ICONS.projects },
  { id: 'research', icon: MAC_ICONS.research },
  { id: 'cv', icon: MAC_ICONS.cv },
  { id: 'notes', icon: MAC_ICONS.notes },
  { id: 'contact', icon: MAC_ICONS.contact }
];