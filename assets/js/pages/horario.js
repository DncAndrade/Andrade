/* ============================================================
   AVA · PÁGINA: HORÁRIO
   ============================================================ */
(function (global) {
  'use strict';

  const { esc, icon, stat } = global.AVA.ui;
  const D = global.AVA.DATA;

  const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  function toMin(hhmm) {
    const p = String(hhmm).split(':');
    return (Number(p[0]) || 0) * 60 + (Number(p[1]) || 0);
  }

  function render(root) {
    root.dataset.live = 'false';
    const today = DAYS[new Date().getDay()];
    const todayItems = D.schedule.filter((s) => s.day === today);

    const groups = D.weekDays
      .map((day) => ({
        day,
        items: D.schedule.filter((s) => s.day === day).sort((a, b) => toMin(a.start) - toMin(b.start))
      }))
      .filter((g) => g.items.length);

    root.innerHTML = `
      <div class="page page-horario">
        <section class="stats-grid">
          ${stat({ icon: 'calendar-days', color: 'brand', value: String(D.schedule.length), label: 'Aulas por semana' })}
          ${stat({ icon: 'book', color: 'purple', value: String(new Set(D.schedule.map((s) => s.disciplineId)).size), label: 'Disciplinas na grade' })}
          ${stat({
            icon: 'clock', color: 'info',
            value: today === 'Domingo' ? '—' : String(todayItems.length),
            label: 'Aulas hoje',
            hint: today === 'Domingo' ? 'Sem aulas aos domingos' : todayItems.map((s) => s.start).join(' · ')
          })}
        </section>

        <div class="card mt-4">
          <div class="card-head">
            <h3>Grade semanal</h3>
            <p>${esc(D.institution.period)} · ${esc(D.institution.campus)}</p>
          </div>
          <div class="card-body flush">
            <div class="table-wrap">
              <table class="table">
                <thead>
                  <tr><th>Dia</th><th>Horário</th><th>Disciplina</th><th>Sala</th></tr>
                </thead>
                <tbody>
                  ${groups.map((g) => g.items.map((s, i) => {
                    const d = D.disciplines.find((x) => x.id === s.disciplineId);
                    if (!d) return '';
                    const isToday = g.day === today;
                    return `
                      <tr class="${isToday ? 'is-today' : ''}">
                        <td class="nowrap">${i === 0 ? `<strong>${esc(g.day)}</strong>${isToday ? ' <span class="badge badge-brand">Hoje</span>' : ''}` : ''}</td>
                        <td class="nowrap">${esc(s.start)} – ${esc(s.end)}</td>
                        <td><strong>${esc(d.code)}</strong> <span class="text-soft">${esc(d.name)}</span></td>
                        <td class="nowrap">${esc(s.room)}</td>
                      </tr>`;
                  }).join('')).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>`;
  }

  global.AVA = global.AVA || {};
  global.AVA.pages = global.AVA.pages || {};
  global.AVA.pages.horario = { render };
})(window);
