/* ============================================================
   AVA · PÁGINA: AVISOS
   ============================================================ */
(function (global) {
  'use strict';

  const { esc, icon, $, dateBR, stat, emptyState, toast } = global.AVA.ui;
  const store = global.AVA.store;

  const PRIO = { alta: 'danger', media: 'warning', baixa: 'gray' };
  const PRIO_LABEL = { alta: 'Prioridade alta', media: 'Prioridade média', baixa: 'Prioridade baixa' };

  function sorted() {
    return store.state.notices.slice().sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      if (a.read !== b.read) return a.read ? 1 : -1;
      return a.date < b.date ? 1 : -1;
    });
  }

  function render(root) {
    root.dataset.live = 'true';
    const notices = sorted();
    const unread = store.unreadNotices();
    const pinned = notices.filter((n) => n.pinned).length;

    root.innerHTML = `
      <div class="page page-avisos">
        <section class="stats-grid">
          ${stat({ icon: 'bell', color: unread ? 'warning' : 'success', value: String(unread), label: 'Não lidos' })}
          ${stat({ icon: 'bookmark', color: 'info', value: String(pinned), label: 'Fixados' })}
          ${stat({ icon: 'mail', color: 'brand', value: String(notices.length), label: 'Comunicados totais' })}
          <div class="flex items-center justify-end">
            ${unread ? `<button class="btn btn-secondary" id="readAll">${icon('check-square', 'icon-sm')} Marcar todos como lidos</button>` : ''}
          </div>
        </section>

        <div class="card mt-4">
          <div class="card-head"><h3>Comunicados oficiais</h3></div>
          <div class="card-body">
            ${!notices.length
              ? emptyState({ icon: 'bell', color: 'info', title: 'Sem avisos', message: 'Nenhum comunicado no momento.' })
              : `<div class="grid-2">
                  ${notices.map((n) => `
                    <article class="card ${n.read ? '' : 'card-hover'}" style="${n.read ? 'opacity:.75' : ''}">
                      <div class="card-body">
                        <div class="flex items-center justify-between gap-4 mb-2">
                          <span class="badge badge-${PRIO[n.priority] || 'gray'}">${esc(n.category)}</span>
                          <span class="fs-xs text-muted nowrap">${icon('calendar', 'icon-sm')} ${dateBR(n.date)}</span>
                        </div>
                        <div class="flex items-center gap-4">
                          <strong class="flex-1">${n.pinned ? icon('bookmark', 'icon-sm text-brand') : ''} ${esc(n.title)}</strong>
                          ${n.read ? '' : '<span class="badge badge-brand">Novo</span>'}
                        </div>
                        <p class="fs-sm text-soft mt-1">${esc(n.body)}</p>
                        <div class="flex items-center justify-between mt-4">
                          <span class="fs-xs text-muted">${esc(n.author)} · ${PRIO_LABEL[n.priority] || ''}</span>
                          ${n.read ? '' : `<button class="btn btn-ghost btn-sm" data-read="${n.id}">${icon('check', 'icon-sm')} Marcar como lido</button>`}
                        </div>
                      </div>
                    </article>`).join('')}
                </div>`}
          </div>
        </div>
      </div>`;

    const readAll = $('#readAll', root);
    if (readAll) {
      readAll.addEventListener('click', () => {
        store.markAllNoticesRead();
        toast('Todos os avisos foram marcados como lidos.', 'success');
      });
    }
    const pageEl = root.querySelector('.page');
    if (pageEl) pageEl.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-read]');
      if (btn) {
        store.markNoticeRead(btn.dataset.read);
        toast('Aviso marcado como lido.', 'info');
      }
    });
  }

  global.AVA = global.AVA || {};
  global.AVA.pages = global.AVA.pages || {};
  global.AVA.pages.avisos = { render };
})(window);
