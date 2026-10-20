/* ============================================================
   AVA · UI
   Helpers de DOM, formatação, componentes reutilizáveis, modal e toast.
   ============================================================ */
(function (global) {
  'use strict';

  const icon = (name, cls) => global.AVA.icon(name, cls);

  /* ---------- DOM ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach((k) => {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else if (k === 'text') node.textContent = attrs[k];
        else if (k.startsWith('on') && typeof attrs[k] === 'function') {
          node.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
        } else if (attrs[k] !== null && attrs[k] !== undefined && attrs[k] !== false) {
          node.setAttribute(k, attrs[k]);
        }
      });
    }
    (Array.isArray(children) ? children : children ? [children] : []).forEach((c) => {
      if (c === null || c === undefined) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  /** Escapa texto para inserção segura em HTML. */
  function esc(str) {
    return String(str === null || str === undefined ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ---------- Formatação ---------- */
  function brl(value) {
    return (Number(value) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function dateBR(iso) {
    if (!iso) return '—';
    const d = new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''));
    if (isNaN(d)) return '—';
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function dateShort(iso) {
    if (!iso) return '—';
    const d = new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''));
    if (isNaN(d)) return '—';
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }

  function timeBR(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d)) return '';
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  function relativeDate(iso) {
    if (!iso) return '—';
    const target = new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''));
    if (isNaN(target)) return '—';
    const now = new Date();
    const diffDays = Math.round((target - now) / 86400000);
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    if (diffDays === -1) return 'Ontem';
    if (diffDays > 0 && diffDays < 30) return `Em ${diffDays} dias`;
    if (diffDays < 0 && diffDays > -30) return `Há ${Math.abs(diffDays)} dias`;
    return dateBR(iso);
  }

  function initials(name) {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function firstName(name) {
    return String(name || '').trim().split(/\s+/)[0] || '';
  }

  /** Data no formato YYYY-MM-DD de uma data local. */
  function toISO(date) {
    const d = date || new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return h;
  }

  /* ---------- Avatar ---------- */
  function avatar(name, cls, color) {
    const palette = ['brand', 'purple', 'cyan', 'success', 'warning', 'pink'];
    const c = color || palette[Math.abs(hash(String(name))) % palette.length];
    return `<span class="avatar ${cls || ''}" style="background:linear-gradient(135deg,var(--${c}-500,#6366f1),var(--${c}-700,#4338ca))" aria-hidden="true">${esc(initials(name))}</span>`;
  }

  /* ---------- Toast ---------- */
  const TOAST_ICONS = { success: 'check-circle', error: 'alert', warning: 'alert', info: 'info' };

  function toast(message, type, title) {
    const root = $('#toastRoot');
    if (!root) return;
    const kind = type || 'info';
    const node = el('div', { class: `toast ${kind}`, role: 'status' });
    node.innerHTML = `
      <span class="toast-icon">${icon(TOAST_ICONS[kind] || 'info')}</span>
      <div class="toast-body">
        <strong>${esc(title || (kind === 'error' ? 'Erro' : kind === 'success' ? 'Tudo certo' : 'Aviso'))}</strong>
        <span>${esc(message)}</span>
      </div>
      <button class="toast-close" aria-label="Fechar">${icon('x', 'icon-sm')}</button>
    `;
    const close = () => {
      node.style.opacity = '0';
      node.style.transform = 'translateX(20px)';
      node.style.transition = 'all .2s';
      setTimeout(() => node.remove(), 200);
    };
    node.querySelector('.toast-close').addEventListener('click', close);
    root.appendChild(node);
    setTimeout(close, 4200);
  }

  /* ---------- Modal ---------- */
  /**
   * Abre um modal.
   * @param {object} opts { title, subtitle, body, size, footer, onMount }
   */
  function modal(opts) {
    const root = $('#modalRoot');
    if (!root) return null;

    closeModal();

    const wrap = el('div', { class: 'modal-root open' });
    wrap.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal ${opts.size ? 'modal-' + opts.size : ''}" role="dialog" aria-modal="true" aria-label="${esc(opts.title || 'Janela')}">
        ${opts.title ? `
        <div class="modal-head">
          <div>
            <h3>${esc(opts.title)}</h3>
            ${opts.subtitle ? `<p>${esc(opts.subtitle)}</p>` : ''}
          </div>
          <button class="icon-btn" data-modal-close aria-label="Fechar">${icon('x')}</button>
        </div>` : ''}
        <div class="modal-body">${opts.body || ''}</div>
        ${opts.footer ? `<div class="modal-foot">${opts.footer}</div>` : ''}
      </div>
    `;

    root.appendChild(wrap);
    root.hidden = false;
    root.classList.add('open');

    const close = () => closeModal();
    wrap.querySelector('[data-modal-close]').addEventListener('click', close);
    wrap.querySelector('.modal-backdrop').addEventListener('click', close);
    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    document.body.style.overflow = 'hidden';

    if (typeof opts.onMount === 'function') opts.onMount(wrap.querySelector('.modal'), close);
    const focusTarget = wrap.querySelector('input, textarea, select, button.btn-primary');
    if (focusTarget) setTimeout(() => focusTarget.focus(), 60);

    return close;
  }

  function closeModal() {
    const root = $('#modalRoot');
    if (root) {
      root.innerHTML = '';
      root.classList.remove('open');
      root.hidden = true;
    }
    document.body.style.overflow = '';
  }

  /** Diálogo de confirmação. Retorna Promise<boolean>. */
  function confirm(opts) {
    return new Promise((resolve) => {
      let settled = false;
      const done = (value) => { if (!settled) { settled = true; resolve(value); } };

      modal({
        title: opts.title || 'Confirmar ação',
        body: `<p class="text-soft">${esc(opts.message || 'Deseja continuar?')}</p>`,
        footer: `
          <button class="btn btn-secondary" data-cancel>Cancelar</button>
          <button class="btn ${opts.danger ? 'btn-danger' : 'btn-primary'}" data-ok>${esc(opts.confirmText || 'Confirmar')}</button>
        `,
        onMount(modalEl, closeFn) {
          modalEl.querySelector('[data-cancel]').addEventListener('click', () => { done(false); closeFn(); });
          modalEl.querySelector('[data-ok]').addEventListener('click', () => { done(true); closeFn(); });
          modalEl.closest('.modal-root').addEventListener('keydown', (e) => {
            if (e.key === 'Escape') done(false);
          });
        }
      });
    });
  }

  /* ---------- Estados vazios ---------- */
  function emptyState(opts) {
    return `
      <div class="empty-state">
        <span class="empty-icon accent-${opts.color || 'brand'}">${icon(opts.icon || 'folder', 'icon-lg')}</span>
        <strong>${esc(opts.title || 'Nada por aqui')}</strong>
        <p>${esc(opts.message || 'Não há itens para exibir no momento.')}</p>
        ${opts.action ? `<button class="btn btn-primary btn-sm" data-empty-action>${icon('plus', 'icon-sm')} ${esc(opts.action)}</button>` : ''}
      </div>
    `;
  }

  /* ---------- Stat ---------- */
  function stat(opts) {
    return `
      <div class="stat">
        <div class="stat-top">
          <span class="stat-icon accent-${opts.color || 'brand'}">${icon(opts.icon || 'chart', 'icon-sm')}</span>
          ${opts.badge ? `<span class="badge badge-${opts.badgeColor || 'gray'}">${esc(opts.badge)}</span>` : ''}
        </div>
        <div class="stat-value">${esc(opts.value)}</div>
        <div class="stat-label">${esc(opts.label)}</div>
        ${opts.hint ? `<div class="stat-hint">${esc(opts.hint)}</div>` : ''}
      </div>
    `;
  }

  /* ---------- Barra de progresso ---------- */
  function progressBar(value, color) {
    const pct = Math.max(0, Math.min(100, Number(value) || 0));
    return `<div class="progress"><div class="progress-bar ${color || ''}" style="width:${pct}%"></div></div>`;
  }

  /* ---------- Utilidades de array ---------- */
  function groupBy(list, keyFn) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyFn(item);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
    });
    return map;
  }

  function sortBy(list, keyFn, dir) {
    const sign = dir === 'desc' ? -1 : 1;
    return list.slice().sort((a, b) => {
      const ka = keyFn(a);
      const kb = keyFn(b);
      if (ka === kb) return 0;
      if (ka === null || ka === undefined) return 1;
      if (kb === null || kb === undefined) return -1;
      return ka > kb ? sign : -sign;
    });
  }

  function filterBy(list, query, fields) {
    const q = String(query || '').trim().toLowerCase();
    if (!q) return list;
    return list.filter((item) => {
      return fields.some((f) => String(item[f] === undefined ? '' : item[f]).toLowerCase().includes(q));
    });
  }

  /* ---------- Exportação ---------- */
  global.AVA = global.AVA || {};
  global.AVA.ui = {
    $, $$, el, esc, icon,
    brl, dateBR, dateShort, timeBR, relativeDate, initials, firstName, toISO,
    avatar, toast, modal, closeModal, confirm,
    emptyState, stat, progressBar,
    groupBy, sortBy, filterBy
  };
})(window);
