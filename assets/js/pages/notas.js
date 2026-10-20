/* ============================================================
   AVA · PÁGINA: NOTAS
   ============================================================ */
(function (global) {
  'use strict';

  const { esc, dateBR, stat, progressBar } = global.AVA.ui;
  const D = global.AVA.DATA;

  function discAvg(items) {
    const scored = items.filter((a) => a.score !== null && a.score !== undefined);
    if (!scored.length) return null;
    const w = scored.reduce((s, a) => s + a.weight, 0);
    if (!w) return null;
    return (scored.reduce((s, a) => s + (a.score / a.max) * a.weight, 0) / w) * 10;
  }

  function render(root) {
    root.dataset.live = 'false';

    const allScored = D.assessments.filter((a) => a.score !== null && a.score !== undefined);
    const totalW = allScored.reduce((s, a) => s + a.weight, 0);
    const general = totalW
      ? (allScored.reduce((s, a) => s + (a.score / a.max) * a.weight, 0) / totalW) * 10
      : 0;
    const pendingCount = D.assessments.length - allScored.length;

    root.innerHTML = `
      <div class="page page-notas">
        <section class="stats-grid">
          ${stat({ icon: 'chart', color: 'purple', value: general.toFixed(1).replace('.', ','), label: 'Média geral', badge: general >= 8 ? 'Excelente' : general >= 6 ? 'Bom' : 'Atenção', badgeColor: general >= 8 ? 'success' : general >= 6 ? 'info' : 'warning' })}
          ${stat({ icon: 'check-square', color: 'success', value: String(allScored.length), label: 'Avaliações lançadas' })}
          ${stat({ icon: 'clock', color: 'warning', value: String(pendingCount), label: 'Aguardando nota' })}
        </section>

        <div class="grid-2 mt-4">
          ${D.disciplines.map((d) => {
            const items = D.assessments.filter((a) => a.disciplineId === d.id);
            const avg = discAvg(items);
            const color = avg === null ? 'gray' : avg >= 8 ? 'success' : avg >= 6 ? 'info' : 'warning';
            return `
              <div class="card">
                <div class="card-head">
                  <h3>${esc(d.code)} · ${esc(d.name)}</h3>
                  ${avg === null ? '<span class="badge badge-gray">Sem notas</span>' : `<span class="badge badge-${color}">${avg.toFixed(1).replace('.', ',')}</span>`}
                </div>
                <div class="card-body flush">
                  ${avg !== null ? `<div style="padding:var(--sp-4) var(--sp-5) 0">${progressBar(avg * 10, color)}</div>` : ''}
                  <div class="table-wrap">
                    <table class="table">
                      <thead><tr><th>Avaliação</th><th>Data</th><th class="num">Peso</th><th class="num">Nota</th></tr></thead>
                      <tbody>
                        ${items.map((a) => `
                          <tr>
                            <td>
                              <strong>${esc(a.title)}</strong><br>
                              <span class="badge badge-gray fs-xs">${esc(D.assessmentTypes[a.type] || a.type)}</span>
                            </td>
                            <td class="nowrap fs-xs">${dateBR(a.date)}</td>
                            <td class="num fs-xs">${a.weight}%</td>
                            <td class="num">
                              ${a.score === null || a.score === undefined
                                ? '<span class="badge badge-warning">Pendente</span>'
                                : `<strong>${a.score.toFixed(1).replace('.', ',')}</strong><span class="text-muted fs-xs">/${a.max}</span>`}
                            </td>
                          </tr>`).join('')}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>`;
  }

  global.AVA = global.AVA || {};
  global.AVA.pages = global.AVA.pages || {};
  global.AVA.pages.notas = { render };
})(window);
