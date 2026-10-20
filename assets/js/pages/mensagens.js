/* ============================================================
   AVA · PÁGINA: MENSAGENS
   ============================================================ */
(function (global) {
  'use strict';

  const { esc, icon, $, avatar, timeBR, dateShort, stat, emptyState } = global.AVA.ui;
  const store = global.AVA.store;

  let activeId = null;

  function convListHTML() {
    const convs = store.state.conversations;
    if (!convs.length) {
      return emptyState({ icon: 'message', color: 'info', title: 'Nenhuma conversa', message: 'Suas conversas aparecerão aqui.' });
    }
    return convs.map((c) => {
      const last = c.messages[c.messages.length - 1];
      return `
        <button class="conv-item ${c.id === activeId ? 'active' : ''}" data-conv="${c.id}">
          ${avatar(c.name, 'avatar-sm')}
          <span class="conv-body">
            <strong>${esc(c.name)}</strong>
            <span>${last ? esc(last.text) : ''}</span>
          </span>
          <span class="conv-meta">
            <span>${last ? timeBR(last.time) : ''}</span>
            ${c.unread ? `<span class="badge badge-brand">${c.unread}</span>` : ''}
          </span>
        </button>`;
    }).join('');
  }

  function threadHTML() {
    const c = store.state.conversations.find((x) => x.id === activeId);
    if (!c) {
      return emptyState({ icon: 'message', color: 'info', title: 'Selecione uma conversa', message: 'Escolha um contato na lista ao lado para ler e responder.' });
    }
    return `
      <div class="chat-head">
        ${avatar(c.name, 'avatar-sm')}
        <div class="flex-1">
          <strong class="block fs-sm">${esc(c.name)}</strong>
          <span class="fs-xs text-muted">${c.online ? '<span class="online-dot"></span> Online · ' : ''}${esc(c.role)}</span>
        </div>
        <span class="badge badge-gray">${c.messages.length} msg</span>
      </div>
      <div class="chat-area" id="chatArea">
        ${c.messages.map((m) => `
          <div class="chat-row ${m.from === 'me' ? 'is-me' : ''}">
            <div class="chat-bubble">
              ${esc(m.text)}
              <span class="chat-time">${dateShort(m.time.slice(0, 10))} · ${timeBR(m.time)}</span>
            </div>
          </div>`).join('')}
      </div>
      <div class="chat-composer">
        <input class="input" id="chatInput" placeholder="Escreva uma mensagem…" autocomplete="off" />
        <button class="btn btn-primary" id="chatSend" aria-label="Enviar">${icon('send', 'icon-sm')} Enviar</button>
      </div>`;
  }

  function bindThread(root) {
    const send = () => {
      const input = $('#chatInput', root);
      if (!input || !activeId) return;
      const text = input.value.trim();
      if (!text) return;
      store.sendMessage(activeId, text);
      input.value = '';
      const area = $('#chatArea', root);
      if (area) area.scrollTop = area.scrollHeight;
      input.focus();
    };
    const btn = $('#chatSend', root);
    if (btn) btn.addEventListener('click', send);
    const input = $('#chatInput', root);
    if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
  }

  function openConv(root, id) {
    activeId = id;
    store.markConversationRead(id);
    // re-render da página atual
    const page = global.AVA.pages.mensagens;
    if (page) page.render(root);
  }

  function render(root) {
    root.dataset.live = 'true';
    if (!activeId && store.state.conversations.length) activeId = store.state.conversations[0].id;

    const unread = store.unreadMessages();
    root.innerHTML = `
      <div class="page page-mensagens">
        <section class="stats-grid">
          ${stat({ icon: 'message', color: 'brand', value: String(store.state.conversations.length), label: 'Conversas' })}
          ${stat({ icon: 'bell', color: unread ? 'warning' : 'success', value: String(unread), label: 'Mensagens não lidas' })}
        </section>

        <div class="grid-sidebar-left mt-4">
          <div class="card">
            <div class="card-head"><h3>Conversas</h3></div>
            <div class="card-body flush" id="convList">${convListHTML()}</div>
          </div>
          <div class="card" id="thread">${threadHTML()}</div>
        </div>
      </div>`;

    root.querySelectorAll('[data-conv]').forEach((item) => {
      item.addEventListener('click', () => openConv(root, item.dataset.conv));
    });
    bindThread(root);
  }

  global.AVA = global.AVA || {};
  global.AVA.pages = global.AVA.pages || {};
  global.AVA.pages.mensagens = { render };
})(window);
