/* ============================================================
   AVA · PÁGINA: MATERIAIS
   ============================================================ */
(function (global) {
  'use strict';

  const { esc, icon, $, dateBR, filterBy, emptyState, toast } = global.AVA.ui;
  const D = global.AVA.DATA;

  let query = '';
  let type = 'todos';

  const TYPES = ['todos'].concat(Array.from(new Set(D.materials.map((m) => m.type))));
  const TYPE_COLORS = { 'Slides': 'info', 'PDF': 'danger', 'Vídeo': 'purple', 'Código': 'success', 'Planilha': 'warning', 'Documento': 'brand' };

  function filtered() {
    let list = filterBy(D.materials, query, ['title', 'teacher', 'type']);
    if (type !== 'todos') list = list.filter((m) => m.type === type);
    return list.sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  function rowsHTML() {
    const list = filtered();
    if (!list.length) {
      return emptyState({ icon: 'folder', color: 'warning', title: 'Nenhum material', message: 'Ajuste a busca ou o filtro de tipo.' });
    }
    return `
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr><th>Material</th><th>Disciplina</th><th>Tipo</th><th>Data</th><th class="num">Tamanho</th><th></th></tr>
          </thead>
          <tbody>
            ${list.map((m) => {
              const d = D.disciplines.find((x) => x.id === m.disciplineId);
              return `
                <tr>
                  <td>
                    <strong>${esc(m.title)}</strong><br>
                    <span class="fs-xs text-muted">${esc(m.teacher)} · ${m.downloads} downloads</span>
                  </td>
                  <td class="nowrap"><span class="badge badge-${d ? d.color : 'gray'}">${esc(d ? d.code : '—')}</span></td>
                  <td><span class="badge badge-${TYPE_COLORS[m.type] || 'gray'}">${esc(m.type)}</span></td>
                  <td class="nowrap fs-xs">${dateBR(m.date)}</td>
                  <td class="num fs-xs nowrap">${esc(m.size)}</td>
                  <td class="text-right">
                    <button class="btn btn-soft btn-sm" data-download="${esc(m.title)}">${icon('download', 'icon-sm')} Baixar</button>
                  </td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>`;
  }

  function render(root) {
    root.dataset.live = 'false';
    root.innerHTML = `
      <div class="page page-materiais">
        <div class="card">
          <div class="card-head">
            <h3>Materiais didáticos</h3>
            <div class="flex items-center gap-4">
              <div class="input-group" style="max-width:300px">
                ${icon('search', 'icon-sm')}
                <input class="input" id="matSearch" type="search" placeholder="Buscar material ou professor…" value="${esc(query)}" />
              </div>
              <select class="select" id="matType" style="width:auto">
                ${TYPES.map((t) => `<option value="${esc(t)}" ${t === type ? 'selected' : ''}>${t === 'todos' ? 'Todos os tipos' : esc(t)}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="card-body flush" id="matList">${rowsHTML()}</div>
        </div>
      </div>`;

    const refresh = () => {
      const list = $('#matList', root);
      if (list) list.innerHTML = rowsHTML();
    };
    const input = $('#matSearch', root);
    if (input) input.addEventListener('input', () => { query = input.value; refresh(); });
    const select = $('#matType', root);
    if (select) select.addEventListener('change', () => { type = select.value; refresh(); });

    const pageEl = root.querySelector('.page');
    if (pageEl) pageEl.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-download]');
      if (btn) toast(`Download de "${btn.dataset.download}" iniciado.`, 'info', 'Materiais');
    });
  }

  global.AVA = global.AVA || {};
  global.AVA.pages = global.AVA.pages || {};
  global.AVA.pages.materiais = { render };
})(window);
