/* ============================================================
   AVA · STORE
   Estado central da aplicação com persistência em localStorage.
   ============================================================ */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'ava.state.v1';
  const THEME_KEY = 'ava.theme.v1';

  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  /* ---------- Estado inicial ---------- */
  function initialState() {
    const D = global.AVA.DATA;
    return {
      session: null,              // { userId, role, tab, name, email }
      theme: 'light',
      tasks: clone(D.tasks),
      notices: clone(D.notices),
      conversations: clone(D.conversations),
      billing: clone(D.billing),
      settings: {
        emailNotifications: true,
        pushNotifications: true,
        weeklyDigest: false,
        autoSave: true
      }
    };
  }

  let state = load();

  /* ---------- Persistência ---------- */
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return initialState();
      const saved = JSON.parse(raw);
      const base = initialState();
      // Mescla o salvo sobre a base para suportar novas versões do mock
      return Object.assign(base, saved, {
        settings: Object.assign(base.settings, saved.settings || {})
      });
    } catch (err) {
      console.warn('[AVA] Falha ao carregar o estado salvo, usando padrão.', err);
      return initialState();
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('[AVA] Não foi possível salvar o estado.', err);
    }
  }

  /* ---------- Assinantes (pub/sub) ---------- */
  const listeners = new Set();

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function emit(event) {
    listeners.forEach((fn) => {
      try { fn(state, event); } catch (err) { console.error(err); }
    });
  }

  function commit(event) {
    save();
    emit(event);
  }

  /* ---------- Sessão ---------- */
  function login(username, password, tab) {
    const users = global.AVA.DATA.users;
    const user = users.find((u) => {
      const query = String(username).trim().toLowerCase();
      const matchName = u.username.toLowerCase() === query;
      const matchMail = u.email.toLowerCase() === query;
      return (matchName || matchMail) && u.password === password && (!tab || u.tab === tab);
    });

    if (!user) return { ok: false, message: 'Usuário ou senha inválidos para este perfil de acesso.' };

    state.session = { userId: user.id, role: user.role, tab: user.tab, name: user.name, email: user.email };
    commit('login');
    return { ok: true, user: clone(user) };
  }

  function logout() {
    state.session = null;
    commit('logout');
  }

  function currentUser() {
    if (!state.session) return null;
    return global.AVA.DATA.users.find((u) => u.id === state.session.userId) || null;
  }

  function isLoggedIn() { return !!state.session; }

  /* ---------- Tema ---------- */
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* ignore */ }
    emit('theme');
  }

  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) { /* ignore */ }
    const prefersDark = global.matchMedia && global.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
  }

  function toggleTheme() {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
    return state.theme;
  }

  /* ---------- Tarefas ---------- */
  function addTask(task) {
    state.tasks.unshift(Object.assign({
      id: 't' + Date.now(),
      title: 'Nova tarefa',
      disciplineId: null,
      due: null,
      priority: 'media',
      status: 'pendente',
      notes: ''
    }, task));
    commit('tasks');
    return state.tasks[0];
  }

  function updateTask(id, patch) {
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return null;
    Object.assign(task, patch);
    commit('tasks');
    return task;
  }

  function removeTask(id) {
    const idx = state.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    state.tasks.splice(idx, 1);
    commit('tasks');
    return true;
  }

  function toggleTask(id) {
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return null;
    task.status = task.status === 'concluida' ? 'pendente' : 'concluida';
    commit('tasks');
    return task;
  }

  /* ---------- Avisos ---------- */
  function markNoticeRead(id) {
    const notice = state.notices.find((n) => n.id === id);
    if (!notice || notice.read) return false;
    notice.read = true;
    commit('notices');
    return true;
  }

  function markAllNoticesRead() {
    state.notices.forEach((n) => { n.read = true; });
    commit('notices');
  }

  function unreadNotices() {
    return state.notices.filter((n) => !n.read).length;
  }

  /* ---------- Mensagens ---------- */
  function sendMessage(conversationId, text) {
    const conv = state.conversations.find((c) => c.id === conversationId);
    if (!conv || !text.trim()) return null;
    const msg = {
      id: 'm' + Date.now(),
      from: 'me',
      text: text.trim(),
      time: new Date().toISOString()
    };
    conv.messages.push(msg);
    commit('messages');
    return msg;
  }

  function markConversationRead(conversationId) {
    const conv = state.conversations.find((c) => c.id === conversationId);
    if (!conv || !conv.unread) return false;
    conv.unread = 0;
    commit('messages');
    return true;
  }

  function unreadMessages() {
    return state.conversations.reduce((sum, c) => sum + (c.unread || 0), 0);
  }

  /* ---------- Financeiro ---------- */
  function payBill(id, method) {
    const item = state.billing.items.find((f) => f.id === id);
    if (!item || item.status === 'pago') return null;
    item.status = 'pago';
    item.paidAt = new Date().toISOString().slice(0, 10);
    item.method = method || 'Pix';
    commit('billing');
    return item;
  }

  function payAllPending(method) {
    const pending = state.billing.items.filter((f) => f.status !== 'pago');
    const today = new Date().toISOString().slice(0, 10);
    pending.forEach((f) => {
      f.status = 'pago';
      f.paidAt = today;
      f.method = method || 'Pix';
    });
    commit('billing');
    return pending.length;
  }

  /* ---------- Configurações ---------- */
  function setSetting(key, value) {
    state.settings[key] = value;
    commit('settings');
  }

  /* ---------- Reset ---------- */
  function reset() {
    state = initialState();
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
    commit('reset');
  }

  /* ---------- API pública ---------- */
  global.AVA = global.AVA || {};
  global.AVA.store = {
    get state() { return state; },
    subscribe, login, logout, currentUser, isLoggedIn,
    initTheme, applyTheme, toggleTheme,
    addTask, updateTask, removeTask, toggleTask,
    markNoticeRead, markAllNoticesRead, unreadNotices,
    sendMessage, markConversationRead, unreadMessages,
    payBill, payAllPending, setSetting, reset
  };
})(window);
