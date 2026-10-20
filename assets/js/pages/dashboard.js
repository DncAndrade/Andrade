/* ============================================================
   AVA · PÁGINA: DASHBOARD (ALUNO)
   ============================================================ */
(function (global) {
  'use strict';

  const { esc, icon, $, $$, brl, dateBR, dateShort, relativeDate, firstName, stat, progressBar, emptyState } = global.AVA.ui;
  const D = global.AVA.DATA;
  const store = global.AVA.store;

  /* Atalhos do painel — apenas os não duplicados do menu */
  const QUICK = [
    { path: '#/horario',     label: 'Quadro de Horários',  icon: 'calendar-days', color: 'brand',   hint: 'Acompanhe o horário das suas aulas' },
    { path: '#/disciplinas', label: 'Disciplinas e Notas', icon: 'book-open',     color: 'brand',   hint: 'Acompanhe suas disciplinas e notas' },
    { path: '#/calendario',  label: 'Estudar',             icon: 'play-circle',   color: 'brand',   hint: 'Acesse seu AVA' },
    { path: '#/ajuda',       label: 'Dúvidas e Orientações', icon: 'headset',     color: 'brand',   hint: 'Acessar base de conhecimento' }
  ];

  function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  function averageGrade() {
    const list = D.assessments.filter((a) => a.score !== null && a.score !== undefined);
    if (!list.length) return 0;
    const totalWeight = list.reduce((s, a) => s + a.weight, 0);
    const weighted = list.reduce((s, a) => s + (a.score / a.max) * a.weight, 0);
    return totalWeight ? (weighted / totalWeight) * 10 : 0;
  }

  function nextClassToday() {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const today = days[new Date().getDay()];
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();

    const todays = D.schedule
      .filter((s) => s.day === today)
      .map((s) => Object.assign({}, s, { discipline: D.disciplines.find((d) => d.id === s.disciplineId) }))
      .filter((s) => s.discipline)
      .sort((a, b) => toMin(a.start) - toMin(b.start));

    const next = todays.find((s) => toMin(s.end) >= nowMin) || todays[0];
    return next ? { item: next, discipline: next.discipline } : null;
  }

  function toMin(hhmm) {
    const p = String(hhmm).split(':');
    return (Number(p[0]) || 0) * 60 + (Number(p[1]) || 0);
  }

  function render(root) {
    const user = store.currentUser() || D.users[0];

    root.dataset.live = 'false';
    root.classList.add('home-root');
    root.innerHTML = `
      <div class="page page-dashboard portal-home">
        <section class="portal-welcome">
          <h2 class="portal-title">Olá, ${esc(firstName(user.name))}</h2>
          <p class="portal-sub">Seja bem-vindo(a) ao nosso Portal do Aluno! Aqui, você encontra as ferramentas necessárias para acompanhar sua trajetória acadêmica.</p>
        </section>

        <h3 class="portal-section-title">Acesso rápido</h3>
        <nav class="portal-grid" aria-label="Acesso rápido">
          ${QUICK.map((q, i) => `
            <a class="portal-card animate-up" style="animation-delay:${i * 60}ms" href="${q.path}">
              <span class="portal-card-icon">${icon(q.icon)}</span>
              <span class="portal-card-text">
                <strong>${esc(q.label)}</strong>
                <span>${esc(q.hint)}</span>
              </span>
            </a>
          `).join('')}
        </nav>
      </div>
    `;
  }

  /* ---------- Blocos ---------- */
  function renderProximasAulas() {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const today = days[new Date().getDay()];
    const order = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    const items = D.schedule
      .map((s) => Object.assign({}, s, { discipline: D.disciplines.find((d) => d.id === s.disciplineId) }))
      .filter((s) => s.discipline)
      .sort((a, b) => order.indexOf(a.day) - order.indexOf(b.day) || toMin(a.start) - toMin(b.start));

    return `
      <section class="card">
        <div class="card-head">
          <h3>Grade desta semana</h3>
          <a href="#/horario" class="btn btn-ghost btn-sm">Ver horário ${icon('arrow-right', 'icon-sm')}</a>
        </div>
        <div class="card-body flush">
          <ul class="agenda-list">
            ${items.map((s) => `
              <li class="agenda-item ${s.day === today ? 'is-today' : ''}">
                <span class="agenda-time">
                  <strong>${esc(s.start)}</strong>
                  <span>${esc(s.end)}</span>
                </span>
                <span class="agenda-line" style="background:var(--${s.discipline.color}-500,#6366f1)"></span>
                <span class="agenda-body">
                  <strong>${esc(s.discipline.name)}</strong>
                  <span>${esc(s.day)} · ${esc(s.room)}</span>
                </span>
                ${s.day === today ? '<span class="badge badge-success">Hoje</span>' : ''}
              </li>
            `).join('')}
          </ul>
        </div>
      </section>
    `;
  }

  function priorityClass(p) {
    return { alta: 'danger', media: 'warning', baixa: 'gray' }[p] || 'gray';
  }

  function renderTarefas(pending) {
    const list = pending.slice(0, 5);
    return `
      <section class="card">
        <div class="card-head">
          <h3>Próximas entregas</h3>
          <a href="#/tarefas" class="btn btn-ghost btn-sm" id="verTarefas">Ver todas ${icon('arrow-right', 'icon-sm')}</a>
        </div>
        <div class="card-body flush">
          ${list.length ? `
          <ul class="task-list">
            ${list.map((t) => {
              const d = D.disciplines.find((x) => x.id === t.disciplineId);
              return `
              <li class="task-item">
                <label class="checkbox">
                  <input type="checkbox" data-task-toggle="${esc(t.id)}">
                  <span class="task-info">
                    <strong>${esc(t.title)}</strong>
                    <span>${esc(d ? d.code : 'Geral')} · ${esc(relativeDate(t.due))}</span>
                  </span>
                </label>
                <span class="badge badge-${priorityClass(t.priority)}">${esc(t.priority)}</span>
              </li>`;
            }).join('')}
          </ul>` : `<div class="card-body">${emptyState({ icon: 'check-circle', color: 'success', title: 'Tudo em dia', message: 'Você não possui tarefas pendentes.' })}</div>`}
        </div>
      </section>
    `;
  }

  function renderAvisos() {
    const notices = store.state.notices.slice(0, 3);
    return `
      <section class="card">
        <div class="card-head">
          <h3>Avisos recentes</h3>
          <a href="#/avisos" class="btn btn-ghost btn-sm" id="verAvisos">Ver todos</a>
        </div>
        <div class="card-body flush">
          <ul class="notice-list">
            ${notices.map((n) => `
              <li class="notice-item ${n.read ? '' : 'is-unread'}">
                <span class="notice-dot ${n.read ? '' : 'is-active'}"></span>
                <span class="notice-body">
                  <strong>${esc(n.title)}</strong>
                  <span>${esc(n.author)} · ${esc(dateShort(n.date))}</span>
                </span>
                ${n.pinned ? icon('bookmark', 'icon-sm') : ''}
              </li>
            `).join('')}
          </ul>
        </div>
      </section>
    `;
  }

  function renderDesempenho() {
    const list = D.disciplines.map((d) => {
      const items = D.assessments.filter((a) => a.disciplineId === d.id && a.score !== null);
      if (!items.length) return null;
      const w = items.reduce((s, a) => s + a.weight, 0);
      const avg = items.reduce((s, a) => s + (a.score / a.max) * a.weight, 0) / w * 10;
      return { d, avg };
    }).filter(Boolean).sort((a, b) => b.avg - a.avg).slice(0, 4);

    return `
      <section class="card">
        <div class="card-head">
          <h3>Desempenho por disciplina</h3>
          <a href="#/notas" class="btn btn-ghost btn-sm">Notas</a>
        </div>
        <div class="card-body">
          <ul class="perf-list">
            ${list.map((p) => `
              <li class="perf-item">
                <div class="perf-top">
                  <strong>${esc(p.d.code)}</strong>
                  <span>${p.avg.toFixed(1).replace('.', ',')}</span>
                </div>
                ${progressBar(p.avg * 10, p.avg >= 8 ? 'success' : p.avg >= 6 ? 'info' : 'warning')}
                <span class="perf-name">${esc(p.d.name)}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </section>
    `;
  }

  function renderFinanceiroResumo(billing, openBills, total) {
    return `
      <section class="card">
        <div class="card-head">
          <h3>Situação financeira</h3>
          <a href="#/financeiro" class="btn btn-ghost btn-sm" id="verFinanceiro">Detalhes</a>
        </div>
        <div class="card-body">
          <div class="finance-summary">
            <div class="finance-amount">
              <span>Total em aberto</span>
              <strong>${brl(total)}</strong>
            </div>
            <span class="badge badge-${openBills.length ? 'danger' : 'success'}">
              ${openBills.length ? openBills.length + ' pendência(s)' : 'Em dia'}
            </span>
          </div>
          <ul class="mini-list">
            ${openBills.slice(0, 3).map((f) => `
              <li><span>${esc(f.label)}</span><strong>${brl(f.amount)}</strong></li>
            `).join('')}
          </ul>
          <p class="finance-note">${icon('info', 'icon-sm')} Vencimento todo dia ${billing.dueDay}. ${esc(billing.discount)}.</p>
        </div>
      </section>
    `;
  }

  global.AVA = global.AVA || {};
  global.AVA.pages = global.AVA.pages || {};
  global.AVA.pages.dashboard = { render };
})(window);

