/* ============================================================
   AVA · APP
   Shell da aplicação, roteamento por hash e navegação.
   ============================================================ */
(function (global) {
  'use strict';

  const { $, $$, esc, icon } = global.AVA.ui;
  const store = global.AVA.store;

  /* ---------- Rotas ---------- */
  const ROUTES = {
    aluno: [
      { group: 'Principal', items: [
        { path: '#/dashboard',   label: 'Início',      icon: 'home' },
        { path: '#/disciplinas', label: 'Disciplinas', icon: 'book' },
        { path: '#/horario',     label: 'Horário',     icon: 'clock' },
        { path: '#/tarefas',     label: 'Tarefas',     icon: 'check-square' }
      ]},
      { group: 'Desempenho', items: [
        { path: '#/notas',       label: 'Notas',       icon: 'chart' },
        { path: '#/financeiro',  label: 'Financeiro',  icon: 'wallet' },
        { path: '#/calendario',  label: 'Calendário',  icon: 'calendar' }
      ]},
      { group: 'Content', items: [
        { path: '#/materiais',   label: 'Materiais',   icon: 'folder' },
        { path: '#/documentos',  label: 'Documentos',  icon: 'file' },
        { path: '#/biblioteca',  label: 'Biblioteca',  icon: 'library' }
      ]},
      { group: 'Comunicação', items: [
        { path: '#/mensagens',   label: 'Mensagens',   icon: 'message', badge: 'unread' },
        { path: '#/avisos',      label: 'Avisos',      icon: 'bell',    badge: 'notices' }
      ]},
      { group: 'Conta', items: [
        { path: '#/perfil',      label: 'Meu perfil',  icon: 'user' },
        { path: '#/ajuda',       label: 'Ajuda & Suporte', icon: 'help' }
      ]}
    ],
    professor: [
      { group: 'Principal', items: [
        { path: '#/dashboard',  label: 'Início',        icon: 'home' },
        { path: '#/turmas',     label: 'Minhas turmas', icon: 'users' },
        { path: '#/tarefas',    label: 'Atividades',    icon: 'check-square' },
        { path: '#/notas',      label: 'Notas',         icon: 'chart' }
      ]},
      { group: 'Acadêmico', items: [
        { path: '#/materiais',  label: 'Materiais',     icon: 'folder' },
        { path: '#/calendario', label: 'Calendário',    icon: 'calendar' },
        { path: '#/mensagens',  label: 'Mensagens',     icon: 'message', badge: 'unread' }
      ]},
      { group: 'Conta', items: [
        { path: '#/perfil',     label: 'Meu perfil',    icon: 'user' },
        { path: '#/ajuda',      label: 'Ajuda & Suporte', icon: 'help' }
      ]}
    ],
    coordenacao: [
      { group: 'Principal', items: [
        { path: '#/dashboard',  label: 'Início',       icon: 'home' },
        { path: '#/turmas',     label: 'Turmas',       icon: 'users' },
        { path: '#/notas',      label: 'Desempenho',   icon: 'chart' },
        { path: '#/calendario', label: 'Calendário',   icon: 'calendar' }
      ]},
      { group: 'Gestão', items: [
        { path: '#/disciplinas', label: 'Disciplinas', icon: 'book' },
        { path: '#/tarefas',     label: 'Solicitações', icon: 'clipboard' },
        { path: '#/mensagens',   label: 'Mensagens',   icon: 'message', badge: 'unread' }
      ]},
      { group: 'Conta', items: [
        { path: '#/perfil',     label: 'Meu perfil',   icon: 'user' },
        { path: '#/ajuda',      label: 'Ajuda & Suporte', icon: 'help' }
      ]}
    ]
  };

  /* ---------- Títulos das páginas ---------- */
  const TITLES = {
    '#/dashboard':   { title: 'Início',          sub: 'Visão geral do seu semestre' },
    '#/disciplinas': { title: 'Disciplinas',     sub: 'Grade, materiais e atividades' },
    '#/horario':     { title: 'Horário',         sub: 'Sua grade semanal de aulas' },
    '#/tarefas':     { title: 'Tarefas',         sub: 'Pendências e entregas' },
    '#/notas':       { title: 'Notas',           sub: 'Desempenho acadêmico' },
    '#/financeiro':  { title: 'Financeiro',      sub: 'Mensalidades, taxas e comprovantes' },
    '#/calendario':  { title: 'Calendário',      sub: 'Prazos, provas e eventos' },
    '#/materiais':   { title: 'Materiais',       sub: 'Slides, listas e gravações' },
    '#/documentos':  { title: 'Documentos',      sub: 'Documentos acadêmicos' },
    '#/biblioteca':  { title: 'Biblioteca',      sub: 'Acervo, empréstimos e bases' },
    '#/mensagens':   { title: 'Mensagens',       sub: 'Conversas com professores e serviços' },
    '#/avisos':      { title: 'Avisos',          sub: 'Comunicados oficiais' },
    '#/turmas':      { title: 'Turmas',          sub: 'Gestão de salas e alunos' },
    '#/perfil':      { title: 'Meu perfil',      sub: 'Dados cadastrais e preferências' },
    '#/ajuda':       { title: 'Ajuda & Suporte', sub: 'Central de atendimento' }
  };

  let shell = null;

  function roleLabel(role) {
    return { aluno: 'Aluno', professor: 'Professor', coordenacao: 'Coordenação' }[role] || 'Visitante';
  }

  function badgeType(kind) {
    return kind === 'unread' ? '' : 'soft';
  }

  /* ---------- Render do shell ---------- */
  function renderShell() {
    const app = $('#app');
    const user = store.currentUser();
    const role = (user && user.tab) || 'aluno';
    const nav = ROUTES[role] || ROUTES.aluno;

    app.innerHTML = `
      <a class="skip-link" href="#conteudo">Ir para o conteúdo</a>
      <div class="app-shell">
        <aside class="sidebar" id="sidebar">
          <div class="sidebar-brand">
            <span class="brand-mark">${icon('cap')}</span>
            <div class="brand-text">
              <strong>AVA</strong>
              <span>${esc(global.AVA.DATA.institution.short)}</span>
            </div>
            <button class="icon-btn sidebar-toggle sidebar-toggle-inside" id="sidebarToggle" aria-label="Abrir menu">
              ${icon('menu')}
            </button>
          </div>

          <nav class="sidebar-nav" aria-label="Navegação principal">
            ${nav.map((g) => `
              <div class="nav-group">
                <p class="nav-group-title">${esc(g.group)}</p>
                ${g.items.map((item) => `
                  <a class="nav-item" href="${item.path}" data-route="${item.path}" data-tip="${esc(item.label)}" title="${esc(item.label)}">
                    ${icon(item.icon)}
                    <span class="nav-item-label">${esc(item.label)}</span>
                    ${item.badge ? `<span class="nav-badge ${badgeType(item.badge)} hidden" data-badge="${item.badge}"></span>` : ''}
                  </a>
                `).join('')}
              </div>
            `).join('')}
          </nav>

          <div class="sidebar-footer">
            <button class="sidebar-user" id="userMenuBtn" type="button">
              ${global.AVA.ui.avatar(user ? user.name : 'A', 'avatar-sm', user && user.avatarColor)}
              <span class="sidebar-user-info">
                <strong>${esc(user ? user.name : 'Visitante')}</strong>
                <span>${esc(roleLabel(role))}</span>
              </span>
              ${icon('chev-down', 'icon-sm')}
            </button>
          </div>
        </aside>

        <div class="sidebar-overlay" id="sidebarOverlay"></div>

        <div class="app-body">
          <header class="topbar">
            <div class="topbar-left">
              <button class="icon-btn sidebar-toggle-mobile" id="sidebarToggleMobile" aria-label="Abrir menu">
                ${icon('menu')}
              </button>
              <div class="topbar-title">
                <h1 id="pageTitle">Início</h1>
                <p id="pageSub"></p>
              </div>
            </div>

            <div class="global-search">
              ${icon('search')}
              <input type="search" id="globalSearch" placeholder="Buscar no AVA…" aria-label="Buscar">
              <kbd>/</kbd>
            </div>

            <div class="topbar-actions">
              <button class="icon-btn" id="themeBtn" title="Alternar tema" aria-label="Alternar tema claro/escuro">
                ${icon('moon')}
              </button>
              <button class="icon-btn" id="messagesBtn" title="Mensagens" aria-label="Mensagens">
                ${icon('message')}
                <span class="count hidden" data-count="unread"></span>
              </button>
              <button class="icon-btn" id="noticesBtn" title="Avisos" aria-label="Avisos">
                ${icon('bell')}
                <span class="count hidden" data-count="notices"></span>
              </button>
              <button class="icon-btn" id="logoutBtn" title="Sair" aria-label="Sair do sistema">
                ${icon('logout')}
              </button>
            </div>
          </header>

          <main class="app-main" id="conteudo" tabindex="-1"></main>
        </div>
      </div>
    `;

    shell = { app, nav, role };
    bindShell();
    updateBadges();
    updateThemeIcon();
  }

  /* ---------- Binding do shell ---------- */
  function bindShell() {
    // Sidebar: hambúrguer (desktop recolhe, mobile abre/fecha)
    const sidebar = $('#sidebar');
    const overlay = $('#sidebarOverlay');
    const toggle = $('#sidebarToggle');
    const syncToggleIcon = () => {
      if (!toggle) return;
      const collapsed = document.body.classList.contains('sidebar-collapsed');
      toggle.innerHTML = icon(collapsed ? 'x' : 'menu');
      toggle.setAttribute('aria-label', collapsed ? 'Expandir menu' : 'Recolher menu');
      toggle.setAttribute('title', collapsed ? 'Expandir menu' : 'Recolher menu');
    };
    const closeSidebar = () => {
      if (sidebar) sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('show');
    };
    if (toggle) toggle.addEventListener('click', () => {
      const isMobile = window.matchMedia('(max-width: 900px)').matches;
      if (isMobile) {
        const open = sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('show', open);
      } else {
        document.body.classList.toggle('sidebar-collapsed');
        syncToggleIcon();
      }
    });
    syncToggleIcon();
    const toggleMobile = $('#sidebarToggleMobile');
    if (toggleMobile) toggleMobile.addEventListener('click', () => {
      const open = sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('show', open);
    });
    if (overlay) overlay.addEventListener('click', closeSidebar);

    // Navegação: fecha a sidebar no mobile
    $$('[data-route]').forEach((a) => {
      a.addEventListener('click', closeSidebar);
    });

    // Tema
    const themeBtn = $('#themeBtn');
    if (themeBtn) themeBtn.addEventListener('click', () => {
      const next = store.toggleTheme();
      updateThemeIcon();
      try {
        const label = next === 'dark' ? 'Modo escuro ativado' : 'Modo claro ativado';
        global.AVA.ui.toast(label + '.', 'info', 'Tema');
      } catch (e) { /* ignore */ }
    });

    // Atalhos de topo
    const msgBtn = $('#messagesBtn');
    if (msgBtn) msgBtn.addEventListener('click', () => navigate('#/mensagens'));
    const noticesBtn = $('#noticesBtn');
    if (noticesBtn) noticesBtn.addEventListener('click', () => navigate('#/avisos'));

    // Menu do usuário
    const userBtn = $('#userMenuBtn');
    if (userBtn) {
      userBtn.addEventListener('click', () => {
        const user = store.currentUser();
        global.AVA.ui.modal({
          title: user ? user.name : 'Visitante',
          subtitle: user ? roleLabel(shell.role) : '',
          body: `
            <div class="user-modal">
              ${global.AVA.ui.avatar(user ? user.name : 'A', 'avatar-xl', user && user.avatarColor)}
              <div class="user-modal-info">
                <strong>${esc(user ? user.name : '')}</strong>
                <span>${esc(user ? user.email : '')}</span>
              </div>
            </div>
            <div class="user-modal-actions">
              <a class="quick-card" href="#/perfil" data-modal-close>
                <span class="quick-icon accent-brand">${icon('user')}</span>
                <span class="quick-text"><strong>Meu perfil</strong><span>Dados e preferências</span></span>
                ${icon('chev-right', 'icon-sm')}
              </a>
              <a class="quick-card" href="#/ajuda" data-modal-close>
                <span class="quick-icon accent-info">${icon('help')}</span>
                <span class="quick-text"><strong>Ajuda & Suporte</strong><span>Central de atendimento</span></span>
                ${icon('chev-right', 'icon-sm')}
              </a>
            </div>
          `,
          footer: `<button class="btn btn-secondary" data-modal-close>Fechar</button>
                   <button class="btn btn-danger" id="modalLogout">${icon('logout', 'icon-sm')} Sair do sistema</button>`,
          onMount(modalEl) {
            modalEl.querySelector('#modalLogout').addEventListener('click', () => {
              global.AVA.ui.closeModal();
              doLogout();
            });
            modalEl.querySelectorAll('a[data-modal-close]').forEach((a) => {
              a.addEventListener('click', () => global.AVA.ui.closeModal());
            });
          }
        });
      });
    }

    // Sair
    const logoutBtn = $('#logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', doLogout);

    // Busca global
    const search = $('#globalSearch');
    if (search) {
      search.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const q = search.value.trim();
          if (q) {
            global.AVA.ui.toast(`Buscando por "${q}"…`, 'info', 'Busca global');
            navigate('#/disciplinas');
          }
        }
      });
    }

    // Atalho "/" para focar a busca
    document.addEventListener('keydown', (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      const typing = tag === 'input' || tag === 'textarea' || tag === 'select';
      if (e.key === '/' && !typing) {
        e.preventDefault();
        const s = $('#globalSearch');
        if (s) s.focus();
      }
    });
  }

  function doLogout() {
    global.AVA.ui.confirm({
      title: 'Sair do sistema',
      message: 'Você será desconectado do AVA. Deseja continuar?',
      confirmText: 'Sair',
      danger: true
    }).then((ok) => {
      if (!ok) return;
      store.logout();
      global.AVA.ui.toast('Sessão encerrada com segurança.', 'success', 'Até logo!');
      location.hash = '#/login';
    });
  }

  function updateThemeIcon() {
    const btn = $('#themeBtn');
    if (!btn) return;
    const isDark = store.state.theme === 'dark';
    btn.innerHTML = icon(isDark ? 'sun' : 'moon');
  }

  function updateBadges() {
    const unread = store.unreadMessages();
    const notices = store.unreadNotices();
    $$('[data-count="unread"]').forEach((n) => {
      n.textContent = unread > 99 ? '99+' : String(unread);
      n.classList.toggle('hidden', unread === 0);
    });
    $$('[data-count="notices"]').forEach((n) => {
      n.textContent = notices > 99 ? '99+' : String(notices);
      n.classList.toggle('hidden', notices === 0);
    });
    $$('[data-badge="unread"]').forEach((n) => {
      n.textContent = String(unread);
      n.classList.toggle('hidden', unread === 0);
    });
    $$('[data-badge="notices"]').forEach((n) => {
      n.textContent = String(notices);
      n.classList.toggle('hidden', notices === 0);
    });
  }

  /* ---------- Roteamento ---------- */
  const PAGE_MAP = {
    '#/dashboard':   'dashboard',
    '#/disciplinas': 'disciplinas',
    '#/horario':     'horario',
    '#/tarefas':     'tarefas',
    '#/notas':       'notas',
    '#/financeiro':  'financeiro',
    '#/calendario':  'calendario',
    '#/materiais':   'materiais',
    '#/documentos':  'documentos',
    '#/biblioteca':  'biblioteca',
    '#/mensagens':   'mensagens',
    '#/avisos':      'avisos',
    '#/turmas':      'turmas',
    '#/perfil':      'perfil',
    '#/ajuda':       'ajuda'
  };

  function currentRoute() {
    const hash = location.hash || '#/dashboard';
    const base = hash.split('?')[0];
    return PAGE_MAP[base] ? base : '#/dashboard';
  }

  function navigate(hash) {
    if (location.hash === hash) {
      route();
    } else {
      location.hash = hash;
    }
  }

  function route() {
    const app = $('#app');

    // Sem sessão → tela de login
    if (!store.isLoggedIn()) {
      if (location.hash !== '#/login') {
        location.replace('#/login');
        return;
      }
      global.AVA.pages.login.render(app);
      document.title = 'Entrar · AVA';
      return;
    }

    // Com sessão → shell da aplicação
    if (!shell) {
      renderShell();
    }

    const hash = currentRoute();
    const pageName = PAGE_MAP[hash];
    const page = global.AVA.pages[pageName];

    // Atualiza item ativo da sidebar
    $$('[data-route]').forEach((a) => {
      a.classList.toggle('active', a.dataset.route === hash);
    });

    // Atualiza título da topbar
    const meta = TITLES[hash] || { title: 'AVA', sub: '' };
    const titleEl = $('#pageTitle');
    const subEl = $('#pageSub');
    if (titleEl) titleEl.textContent = meta.title;
    if (subEl) subEl.textContent = meta.sub;
    document.title = meta.title + ' · AVA';

    // Renderiza a página
    const main = $('#conteudo');
    if (!main) return;
    main.innerHTML = '';
    main.classList.remove('home-root');
    document.body.classList.toggle('is-home', hash === '#/dashboard');

    if (!page) {
      main.innerHTML = global.AVA.ui.emptyState({
        icon: 'alert', color: 'warning',
        title: 'Página não encontrada',
        message: 'O endereço acessado não existe neste ambiente.'
      });
      return;
    }

    page.render(main);
    main.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  /* ---------- Boot ---------- */
  function start() {
    store.initTheme();
    route();
    window.addEventListener('hashchange', route);

    // Reage a mudanças de estado (badges, listas, etc.)
    store.subscribe((state, event) => {
      if (event === 'logout') {
        shell = null;
        route();
        return;
      }
      updateBadges();
      // Re-renderiza a página atual quando os dados relevantes mudam
      const main = $('#conteudo');
      if (main && main.dataset.live === 'true') {
        const hash = currentRoute();
        const page = global.AVA.pages[PAGE_MAP[hash]];
        if (page) page.render(main);
      }
    });
  }

  global.AVA = global.AVA || {};
  global.AVA.app = { navigate, route, start, currentRoute };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})(window);
