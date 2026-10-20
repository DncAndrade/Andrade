/* ============================================================
   AVA · ÍCONES
   Conjunto de ícones SVG (Lucide-like) renderizados inline.
   Uso: AVA.icon('home')  →  <svg class="icon">…</svg>
   ============================================================ */
(function (global) {
  'use strict';

  const PATHS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/>',
    book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v4H6.5A2.5 2.5 0 0 1 4 19.5z"/><path d="M8 7h8"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    wallet: '<path d="M3 7a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2"/><path d="M3 7v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3"/><path d="M21 10v6h-5a3 3 0 0 1 0-6z"/>',
    clipboard: '<path d="M9 4h6v3H9z"/><path d="M15 5.5h2A2 2 0 0 1 19 7.5V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7.5A2 2 0 0 1 7 5.5h2"/><path d="m9 13 2 2 4-4"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
    message: '<path d="M21 12a8 8 0 0 1-8 8H7l-4 3v-5.5A8 8 0 1 1 21 12z"/><path d="M8 11h8M8 15h5"/>',
    bell: '<path d="M18 9a6 6 0 1 0-12 0c0 6-2 7-2 7h16s-2-1-2-7"/><path d="M10.5 20a2 2 0 0 0 3 0"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    library: '<path d="M4 4v16M9 4v16"/><path d="M13 4h7v16h-7z"/><path d="M6 9h1M6 15h1M11 9h1M16 9h1"/>',
    'check-square': '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m8 12 3 3 5-6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 0 1 4.9.6c0 1.7-2.4 2-2.4 3.4"/><circle cx="12" cy="17" r=".8" fill="currentColor" stroke="none"/>',
    logout: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17 5 12l5-5"/><path d="M5 12h11"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    'chev-down': '<path d="m6 9 6 6 6-6"/>',
    'chev-right': '<path d="m9 6 6 6-6 6"/>',
    'chev-left': '<path d="m15 6-6 6 6 6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    download: '<path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M4 20h16"/>',
    upload: '<path d="M12 20V8"/><path d="m7 12 5-5 5 5"/><path d="M4 4h16"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>',
    phone: '<path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4 5.2 2 2 0 0 1 6 3z"/>',
    pin: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    trend: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    'book-open': '<path d="M12 6.5C10.5 5 8 4 3 4v14c5 0 7.5 1 9 2.5 1.5-1.5 4-2.5 9-2.5V4c-5 0-7.5 1-9 2.5z"/><path d="M12 6.5v14"/>',
    filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
    more: '<circle cx="6" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="18" cy="12" r="1.6" fill="currentColor" stroke="none"/>',
    eye: '<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.8"/>',
    'eye-off': '<path d="M4 4l16 16"/><path d="M9.9 5.7A9.9 9.9 0 0 1 12 5.5c6.4 0 10 6.5 10 6.5a17 17 0 0 1-3.3 4"/><path d="M6.3 8A17 17 0 0 0 2 12s3.6 6.5 10 6.5a10 10 0 0 0 3.4-.6"/>',
    'arrow-right': '<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>',
    'arrow-left': '<path d="M20 12H5"/><path d="m11 6-6 6 6 6"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.01"/>',
    'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.01"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    shield: '<path d="M12 3 5 6v6c0 4.5 3 8 7 9 4-1 7-4.5 7-9V6z"/><path d="m9 12 2 2 4-4"/>',
    cap: '<path d="M2 8.5 12 4l10 4.5-10 4.5z"/><path d="M6 10.8V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.2"/><path d="M22 8.5V14"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    grid: '<rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1.4" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.4" fill="currentColor" stroke="none"/>',
    printer: '<path d="M7 8V3h10v5"/><rect x="3" y="8" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.6 6.8-4.2M8.6 13.4l6.8 4.2"/>',
    trash: '<path d="M4 7h16"/><path d="M9 7V5h6v2"/><path d="M6 7l1 13h10l1-13"/><path d="M10 11v6M14 11v6"/>',
    edit: '<path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17z"/><path d="m15 6 3 3"/>',
    paperclip: '<path d="M20 11.5 12 19.5a5 5 0 0 1-7-7l8.5-8.5a3.5 3.5 0 0 1 5 5L10 17.5a2 2 0 0 1-3-3l7.5-7.5"/>',
    send: '<path d="M21 3 10.5 13.5"/><path d="M21 3 14 21l-3.5-7.5L3 10z"/>',
    video: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m16 11 6-4v10l-6-4z"/>',
    building: '<path d="M4 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17"/><path d="M15 9h4a1 1 0 0 1 1 1v11"/><path d="M3 21h18"/><path d="M8 7h3M8 11h3M8 15h3"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20"/><path d="M6 15h4"/>',
    receipt: '<path d="M5 3h14v18l-2.3-1.6-2.4 1.6-2.3-1.6L9.7 21l-2.4-1.6L5 21z"/><path d="M9 8h6M9 12h6"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 5.2a3.5 3.5 0 0 1 0 6.6"/><path d="M17.5 14.4A6.5 6.5 0 0 1 21.5 20"/>',
    'user-check': '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="m16.5 11.5 2 2 4-4"/>',
    bookmark: '<path d="M6 3h12v18l-6-4.5L6 21z"/>',
    external: '<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-1 5"/><path d="M20 4v7h-7"/>',
    print: '<path d="M7 9V3h10v6"/><path d="M5 9h14a2 2 0 0 1 2 2v6h-4"/><path d="M3 17V11a2 2 0 0 1 2-2"/><path d="M7 14h10v7H7z"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>',
    note: '<path d="M5 3h9l5 5v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5"/><path d="M8 13h8M8 17h5"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><path d="M3 12h18"/>',
    dollar: '<path d="M12 2v20"/><path d="M17 6.5c0-1.9-2.2-3-5-3s-5 1.1-5 3 2.2 2.6 5 3.2 5 1.3 5 3.3-2.2 3-5 3-5-1.1-5-3"/>',
    zap: '<path d="M13 2 4 14h6l-1 8 9-12h-6z"/>',
    'calendar-days': '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/><path d="M8 15h2M14 15h2M8 18h2"/>',
    'play-circle': '<circle cx="12" cy="12" r="9"/><path d="m10 8.5 5 3.5-5 3.5z" fill="currentColor" stroke="none"/>',
    headset: '<path d="M4 13a8 8 0 0 1 16 0"/><rect x="3" y="12" width="4" height="7" rx="1.5"/><rect x="17" y="12" width="4" height="7" rx="1.5"/><path d="M19 19a4 4 0 0 1-4 3h-2"/>',
    sparkle: '<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M18 16.5 18.8 19l2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>'
  };

  const ALIASES = {
    'inicio': 'home', 'notas': 'chart', 'financeira': 'wallet',
    'materiais': 'folder', 'tarefas': 'check-square', 'mensagens': 'message',
    'avisos': 'bell', 'documentos': 'file', 'perfil': 'user'
  };

  /**
   * Gera o markup de um ícone.
   * @param {string} name  nome do ícone (ver PATHS)
   * @param {string} [cls] classes extras
   */
  function icon(name, cls) {
    const key = ALIASES[name] || name;
    const body = PATHS[key];
    if (!body) return '';
    return `<svg class="icon ${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" aria-hidden="true">${body}</svg>`;
  }

  global.AVA = global.AVA || {};
  global.AVA.icon = icon;
  global.AVA.ICON_NAMES = Object.keys(PATHS);
})(window);
