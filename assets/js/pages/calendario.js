/* ============================================================
   AVA · PÁGINA: CALENDÁRIO
   ============================================================ */
(function (global) {
  'use strict';

  const { esc, icon, $, dateBR, stat, emptyState } = global.AVA.ui;
  const D = global.AVA.DATA;

  let typeFilter = 'todas';

  const TYPE_BADGE = { prova: 'danger', prazo: 'warning', evento: 'purple', feriado: 'info', aula: 'brand' };
  const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

  function filtered() {
    const list = typeFilter === 'todas' ? D.events : D.events.filter((e) => e.type === typeFilter);
    return list.slice().sort((a, b) => (a.date > b.date ? 1 : -1));
  }

  function bodyHTML() {
    const list = filtered();
    if (!list.length) {
      return emptyState({ icon: 'calendar', color: 'info', title: 'Sem eventos', message: 'Nada programado para este filtro.' });
    }
    const byMonth = new Map();
    list.forEach((e) => {
      const key = e.date.slice(0, 7);
      if (!byMonth.has(key)) byMonth.set(key, []);
      byMonth.get(key).push(e);
    });
    return Array.from(byMonth.entries()).map(([key, events]) => {
      const [y, m] = key.split('-');
      return `
        <div class="card mb-4">
          <div class="card-head"><h3>${MONTHS[Number(m) - 1]} / ${y}</h3><p>${events.length} evento(s)</p></div>
          <div class="card-body flush">
            <div class="table-wrap">
              <table class="table">
                <tbody>
                  ${events.map((e) => {
                    const d = D.disciplines.find((x) => x.id === e.disciplineId);
                    const day = e.date.slice(8, 10);
                    return `
                      <tr>
                        <td style="width:72px;text-align:center">
                          <strong class="fs-xl block">${day}</strong>
                          <span class="fs-xs text-muted uppercase">${dateBR(e.date).split(' ')[2] || ''}</span>
                        </td>
                        <td>
                          <strong>${esc(e.title)}</strong>
                          ${d ? `<br><span class="fs-xs text-muted">${esc(d.code)} · ${esc(d.name)}</span>` : ''}
                        </td>
                        <td class="nowrap text-right">
                          <span class="badge badge-${TYPE_BADGE[e.type] || 'gray'}">${esc(D.eventTypes[e.type] || e.type)}</span>
                          <br><span class="fs-xs text-muted">${esc(e.location)}</span>
                        </td>
                      </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>`;
    }).join('');
  }

  function render(root) {
    root.dataset.live = 'false';
    const today = new Date().toISOString().slice(0, 10);
    const upcoming = D.events.filter((e) => e.date >= today && e.type !== 'feriado').length;

    root.innerHTML = `
      <div class="page page-calendario">
        <section class="stats-grid">
          ${stat({ icon: 'calendar-days', color: 'brand', value: String(upcoming), label: 'Próximos eventos' })}
          ${stat({ icon: 'alert', color: 'danger', value: String(D.events.filter((e) => e.type === 'prova').length), label: 'Provas no semestre' })}
          ${stat({ icon: 'clock', color: 'warning', value: String(D.events.filter((e) => e.type === 'prazo').length), label: 'Prazos de entrega' })}
        </section>

        <div class="card mt-4">
          <div class="card-head">
            <div class="tabs">
              ${['todas', 'prova', 'prazo', 'evento', 'feriado'].map((t) => `
                <button class="tab ${typeFilter === t ? 'active' : ''}" data-type="${t}">
                  ${t === 'todas' ? 'Todos' : esc(D.eventTypes[t])}
                </button>`).join('')}
            </div>
          </div>
          <div class="card-body" id="calBody">${bodyHTML()}</div>
        </div>
      </div>`;

    root.querySelectorAll('[data-type]').forEach((tab) => {
      tab.addEventListener('click', () => {
        typeFilter = tab.dataset.type;
        render(root);
      });
    });
  }

  global.AVA = global.AVA || {};
  global.AVA.pages = global.AVA.pages || {};
  global.AVA.pages.calendario = { render };
})(window);
