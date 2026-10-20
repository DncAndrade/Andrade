/* ============================================================
   AVA · PÁGINA: TURMAS (PROFESSOR / COORDENAÇÃO)
   ============================================================ */
(function (global) {
  'use strict';

  const { esc, icon, avatar, stat, progressBar, emptyState, modal, closeModal } = global.AVA.ui;
  const D = global.AVA.DATA;
  const store = global.AVA.store;

  function professorHTML(classes) {
    return `
      <section class="stats-grid">
        ${stat({ icon: 'users', color: 'brand', value: String(classes.length), label: 'Turmas ativas' })}
        ${stat({ icon: 'user-check', color: 'info', value: String(classes.reduce((s, c) => s + c.students, 0)), label: 'Alunos' })}
        ${stat({ icon: 'alert', color: D.professor.pending ? 'warning' : 'success', value: String(D.professor.pending), label: 'Correções pendentes' })}
      </section>
      <div class="grid-cards mt-4">
        ${classes.map((c) => `
          <article class="card card-hover">
            <div class="card-body">
              <div class="flex items-center justify-between gap-4 mb-2">
                <span class="badge badge-brand">${esc(c.code)}</span>
                <span class="badge badge-${c.avg >= 7 ? 'success' : 'warning'}">Média ${String(c.avg).replace('.', ',')}</span>
              </div>
              <strong class="block">${esc(c.name)}</strong>
              <span class="fs-xs text-muted">${c.students} alunos · ${esc(c.room)}</span>
              <div class="flex justify-end mt-4">
                <button class="btn btn-ghost btn-sm" data-class="${esc(c.code)}">${icon('users', 'icon-sm')} Ver alunos</button>
              </div>
            </div>
          </article>`).join('')}
      </div>`;
  }

  function coordHTML() {
    const c = D.coordination;
    return `
      <section class="stats-grid">
        ${stat({ icon: 'users', color: 'brand', value: String(c.totalStudents), label: 'Alunos matriculados', hint: c.activeStudents + ' ativos' })}
        ${stat({ icon: 'trend', color: 'success', value: c.indicators[0].value, label: c.indicators[0].label, hint: c.indicators[0].delta + ' no período' })}
        ${stat({ icon: 'alert', color: 'warning', value: c.indicators[1].value, label: c.indicators[1].label, hint: c.indicators[1].delta + ' no período' })}
        ${stat({ icon: 'file', color: c.pendingDocs ? 'danger' : 'success', value: String(c.pendingDocs), label: 'Documentos pendentes' })}
      </section>

      <div class="card mt-4">
        <div class="card-head"><h3>Ocupação das turmas</h3><p>${D.institution.period}</p></div>
        <div class="card-body flush">
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Turma</th><th>Professor</th><th class="num">Alunos</th><th>Ocupação</th><th>Status</th></tr></thead>
              <tbody>
                ${c.schedules.map((s) => `
                  <tr>
                    <td><strong>${esc(s.code)}</strong></td>
                    <td>${esc(s.teacher)}</td>
                    <td class="num">${s.students}</td>
                    <td style="min-width:160px">${progressBar(s.occupancy, s.status === 'ok' ? 'success' : 'warning')}<span class="fs-xs text-muted">${s.occupancy}%</span></td>
                    <td><span class="badge badge-${s.status === 'ok' ? 'success' : 'warning'}">${s.status === 'ok' ? 'Normal' : 'Atenção'}</span></td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="grid-2 mt-4">
        <div class="card">
          <div class="card-head"><h3>Alunos por turno</h3></div>
          <div class="card-body">
            ${c.byShift.map((s) => `
              <div class="mb-2">
                <div class="flex justify-between fs-sm"><span>${esc(s.label)}</span><strong>${s.value}</strong></div>
                ${progressBar((s.value / c.totalStudents) * 100, 'info')}
              </div>`).join('')}
          </div>
        </div>
        <div class="card">
          <div class="card-head"><h3>Alunos por curso</h3></div>
          <div class="card-body">
            ${c.byCourse.map((s) => `
              <div class="mb-2">
                <div class="flex justify-between fs-sm"><span>${esc(s.label)}</span><strong>${s.value}</strong></div>
                ${progressBar((s.value / c.totalStudents) * 100, 'brand')}
              </div>`).join('')}
          </div>
        </div>
      </div>`;
  }

  function openStudents(code) {
    const c = D.professor.classes.find((x) => x.code === code);
    if (!c) return;
    modal({
      title: `${c.code} — Lista de alunos`,
      body: `
        <p class="text-soft mb-4">${esc(c.name)} · ${c.students} alunos matriculados</p>
        <ul>
          ${c.studentsList.map((name) => `
            <li class="flex items-center gap-4" style="padding:var(--sp-2) 0;border-bottom:1px solid var(--border)">
              ${avatar(name, 'avatar-sm')}
              <strong class="fs-sm">${esc(name)}</strong>
            </li>`).join('')}
        </ul>`,
      footer: `<button class="btn btn-secondary" data-modal-close>Fechar</button>`,
      onMount(modalEl) {
        modalEl.querySelector('[data-modal-close]').addEventListener('click', closeModal);
      }
    });
  }

  function render(root) {
    root.dataset.live = 'false';
    const user = store.currentUser();
    const role = (user && user.tab) || 'aluno';

    if (role === 'aluno') {
      root.innerHTML = `<div class="page">${emptyState({
        icon: 'users', color: 'warning',
        title: 'Área restrita',
        message: 'A gestão de turmas está disponível para professores e coordenação.'
      })}</div>`;
      return;
    }

    root.innerHTML = `
      <div class="page page-turmas">
        ${role === 'coordenacao' ? coordHTML() : professorHTML(D.professor.classes)}
      </div>`;

    const pageEl = root.querySelector('.page');
    if (pageEl) pageEl.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-class]');
      if (btn) openStudents(btn.dataset.class);
    });
  }

  global.AVA = global.AVA || {};
  global.AVA.pages = global.AVA.pages || {};
  global.AVA.pages.turmas = { render };
})(window);
