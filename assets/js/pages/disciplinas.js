/* ============================================================
   AVA · PÁGINA: DISCIPLINAS
   ============================================================ */
(function (global) {
  'use strict';

  const { esc, icon, $, stat, progressBar, filterBy, modal, closeModal } = global.AVA.ui;
  const D = global.AVA.DATA;

  let query = '';

  function card(d) {
    return `
      <article class="card card-hover" data-disc-card>
        <div class="card-body">
          <div class="flex items-center justify-between gap-4 mb-2">
            <span class="badge badge-${d.color}">${esc(d.code)}</span>
            <span class="badge badge-${d.status === 'ativa' ? 'success' : 'gray'}">${esc(d.status === 'ativa' ? 'Ativa' : d.status)}</span>
          </div>
          <strong class="block">${esc(d.name)}</strong>
          <span class="text-soft fs-xs block mb-2">${icon('user', 'icon-sm')} ${esc(d.teacher)}</span>
          <div class="flex items-center justify-between fs-xs text-muted mb-1">
            <span>${esc(d.room)} · Slot ${esc(d.slot)} · ${d.credits} créditos</span>
            <span>${d.progress}%</span>
          </div>
          ${progressBar(d.progress, d.progress >= 70 ? 'success' : d.progress >= 40 ? 'info' : 'warning')}
          <div class="flex justify-end mt-4">
            <button class="btn btn-ghost btn-sm" data-details="${d.id}">${icon('book-open', 'icon-sm')} Detalhes</button>
          </div>
        </div>
      </article>`;
  }

  function listHTML() {
    const items = filterBy(D.disciplines, query, ['name', 'code', 'teacher']);
    if (!items.length) {
      return global.AVA.ui.emptyState({
        icon: 'search', color: 'warning',
        title: 'Nenhuma disciplina encontrada',
        message: 'Tente outro termo de busca.'
      });
    }
    return items.map(card).join('');
  }

  function openDetails(id) {
    const d = D.disciplines.find((x) => x.id === id);
    if (!d) return;
    modal({
      title: d.name,
      body: `
        <div class="flex items-center gap-2 mb-4">
          <span class="badge badge-${d.color}">${esc(d.code)}</span>
          <span class="text-soft fs-xs">${esc(d.teacher)} · ${d.hours}h · ${esc(d.room)}</span>
        </div>
        <p class="text-soft mb-4">${esc(d.description)}</p>
        <strong class="block mb-2">Conteúdo programático</strong>
        <ul class="mb-4">
          ${d.syllabus.map((s) => `<li class="flex items-center gap-4 fs-sm text-soft" style="padding:4px 0">${icon('check-square', 'icon-sm')} ${esc(s)}</li>`).join('')}
        </ul>
        <div class="flex gap-4 fs-xs text-muted">
          <span>${icon('folder', 'icon-sm')} ${d.attachments} materiais</span>
          <span>${icon('check-square', 'icon-sm')} ${d.activities} atividades</span>
          <span>${icon('message', 'icon-sm')} ${d.forum} posts no fórum</span>
        </div>`,
      footer: `<button class="btn btn-secondary" data-modal-close>Fechar</button>`,
      onMount(modalEl) {
        modalEl.querySelector('[data-modal-close]').addEventListener('click', closeModal);
      }
    });
  }

  function render(root) {
    root.dataset.live = 'false';
    root.innerHTML = `
      <div class="page page-disciplinas">
        <section class="stats-grid">
          ${stat({ icon: 'book', color: 'brand', value: String(D.disciplines.length), label: 'Disciplinas ativas', hint: D.disciplines.reduce((s, d) => s + d.credits, 0) + ' créditos no semestre' })}
          ${stat({ icon: 'folder', color: 'purple', value: String(D.materials.length), label: 'Materiais disponíveis' })}
          ${stat({ icon: 'check-square', color: 'warning', value: String(D.assessments.filter((a) => a.score === null).length), label: 'Avaliações pendentes' })}
        </section>

        <div class="card mt-4">
          <div class="card-head">
            <h3>Minhas disciplinas</h3>
            <div class="input-group" style="max-width:320px">
              ${icon('search', 'icon-sm')}
              <input class="input" id="discSearch" type="search" placeholder="Buscar por nome, código ou professor…" value="${esc(query)}" />
            </div>
          </div>
          <div class="card-body">
            <div class="grid-cards" id="discList">${listHTML()}</div>
          </div>
        </div>
      </div>`;

    const input = $('#discSearch', root);
    if (input) {
      input.addEventListener('input', () => {
        query = input.value;
        const list = $('#discList', root);
        if (list) list.innerHTML = listHTML();
      });
    }
    // delegação no .page (elemento substituído a cada render — evita listeners duplicados)
    const pageEl = root.querySelector('.page');
    if (pageEl) pageEl.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-details]');
      if (btn) openDetails(btn.dataset.details);
    });
  }

  global.AVA = global.AVA || {};
  global.AVA.pages = global.AVA.pages || {};
  global.AVA.pages.disciplinas = { render };
})(window);
