/* ============================================================
   AVA · PÁGINA: BIBLIOTECA
   ============================================================ */
(function (global) {
  'use strict';

  const { esc, icon, dateBR, relativeDate, toISO, stat, emptyState } = global.AVA.ui;
  const D = global.AVA.DATA;

  const LOAN_STATUS = {
    emprestado: { label: 'Emprestado', color: 'info' },
    devolvido: { label: 'Devolvido', color: 'success' },
    reservado: { label: 'Reservado', color: 'purple' }
  };

  function render(root) {
    root.dataset.live = 'false';
    const lib = D.library;
    const today = toISO();
    const active = lib.loans.filter((l) => l.status === 'emprestado').length;

    root.innerHTML = `
      <div class="page page-biblioteca">
        <section class="stats-grid">
          ${stat({ icon: 'library', color: 'brand', value: String(active), label: 'Empréstimos ativos' })}
          ${stat({ icon: 'bookmark', color: 'purple', value: String(lib.reservations), label: 'Reservas' })}
          ${stat({ icon: 'clock', color: 'info', value: lib.availableHours, label: 'Horário de funcionamento' })}
        </section>

        <div class="grid-2 mt-4">
          <div class="card">
            <div class="card-head"><h3>Meus empréstimos</h3></div>
            <div class="card-body flush">
              <div class="table-wrap">
                <table class="table">
                  <thead><tr><th>Livro</th><th>Devolução</th><th>Status</th></tr></thead>
                  <tbody>
                    ${lib.loans.map((l) => {
                      const st = LOAN_STATUS[l.status] || { label: l.status, color: 'gray' };
                      const overdue = l.status === 'emprestado' && l.due < today;
                      return `
                        <tr>
                          <td><strong>${esc(l.title)}</strong><br><span class="fs-xs text-muted">${esc(l.author)} · ${esc(l.category)}</span></td>
                          <td class="nowrap ${overdue ? 'text-danger' : ''}">${dateBR(l.due)}<br><span class="fs-xs text-muted">${relativeDate(l.due)}</span></td>
                          <td><span class="badge badge-${overdue ? 'danger' : st.color}">${overdue ? 'Atrasado' : st.label}</span></td>
                        </tr>`;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-head"><h3>Bases de dados digitais</h3><p>Acesso institucional</p></div>
            <div class="card-body flush">
              <ul>
                ${lib.bases.map((b) => `
                  <li class="flex items-center justify-between gap-4" style="padding:var(--sp-3) var(--sp-5);border-bottom:1px solid var(--border)">
                    <span>
                      <strong class="block fs-sm">${esc(b.name)}</strong>
                      <span class="fs-xs text-muted">${esc(b.access)}</span>
                    </span>
                    <span class="badge badge-${b.status === 'ativo' ? 'success' : 'gray'}">${b.status === 'ativo' ? 'Disponível' : 'Indisponível'}</span>
                  </li>`).join('')}
              </ul>
            </div>
          </div>
        </div>

        <div class="card mt-4">
          <div class="card-head"><h3>Acervo por seção</h3></div>
          <div class="card-body">
            <div class="grid-cards">
              ${lib.sections.map((s) => `
                <article class="card card-hover">
                  <div class="card-body">
                    <span class="quick-icon accent-brand mb-2" style="display:inline-flex">${icon(s.icon)}</span>
                    <strong class="block">${esc(s.name)}</strong>
                    <span class="badge badge-gray mt-1" style="display:inline-block">${esc(s.items)}</span>
                    <p class="fs-xs text-soft mt-1">${esc(s.desc)}</p>
                  </div>
                </article>`).join('')}
            </div>
          </div>
        </div>
      </div>`;
  }

  global.AVA = global.AVA || {};
  global.AVA.pages = global.AVA.pages || {};
  global.AVA.pages.biblioteca = { render };
})(window);
