/* ============================================================
   AVA · PÁGINA: TAREFAS
   ============================================================ */
(function (global) {
  'use strict';

  const { esc, icon, $, dateBR, relativeDate, toISO, stat, emptyState, toast, modal, confirm } = global.AVA.ui;
  const store = global.AVA.store;

  let filter = 'pendentes';

  const PRIO = { alta: 'danger', media: 'warning', baixa: 'gray' };
  const PRIO_LABEL = { alta: 'Alta', media: 'Média', baixa: 'Baixa' };

  function listHTML() {
    const today = toISO();
    let list = store.state.tasks;
    if (filter === 'pendentes') list = list.filter((t) => t.status !== 'concluida');
    else if (filter === 'concluidas') list = list.filter((t) => t.status === 'concluida');

    list = list.slice().sort((a, b) => {
      const oa = (a.status !== 'concluida' && a.due && a.due < today) ? 0 : 1;
      const ob = (b.status !== 'concluida' && b.due && b.due < today) ? 0 : 1;
      if (oa !== ob) return oa - ob;
      return (a.due || '9999') < (b.due || '9999') ? -1 : 1;
    });

    if (!list.length) {
      return emptyState({ icon: 'check-square', color: 'success', title: 'Tudo em dia!', message: 'Nenhuma tarefa nesta categoria.' });
    }

    return `
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Tarefa</th><th>Prazo</th><th>Prioridade</th><th>Status</th><th></th></tr></thead>
          <tbody>
            ${list.map((t) => {
              const d = global.AVA.DATA.disciplines.find((x) => x.id === t.disciplineId);
              const done = t.status === 'concluida';
              const overdue = !done && t.due && t.due < today;
              return `
                <tr class="${done ? 'text-muted' : ''}">
                  <td>
                    <strong style="${done ? 'text-decoration:line-through' : ''}">${esc(t.title)}</strong>
                    ${d ? `<br><span class="fs-xs text-muted">${esc(d.code)} · ${esc(d.name)}</span>` : ''}
                    ${t.notes ? `<br><span class="fs-xs text-muted">${esc(t.notes)}</span>` : ''}
                  </td>
                  <td class="nowrap ${overdue ? 'text-danger' : ''}">
                    ${t.due ? dateBR(t.due) : '—'}<br>
                    <span class="fs-xs text-muted">${t.due ? relativeDate(t.due) : ''}</span>
                  </td>
                  <td><span class="badge badge-${PRIO[t.priority] || 'gray'}">${PRIO_LABEL[t.priority] || esc(t.priority)}</span></td>
                  <td><span class="badge badge-${done ? 'success' : overdue ? 'danger' : 'info'}">${done ? 'Concluída' : overdue ? 'Atrasada' : 'Pendente'}</span></td>
                  <td class="text-right nowrap">
                    <button class="btn btn-ghost btn-sm" data-toggle="${t.id}" title="${done ? 'Reabrir' : 'Concluir'}">${icon(done ? 'refresh' : 'check-square', 'icon-sm')}</button>
                    <button class="btn btn-ghost btn-sm" data-remove="${t.id}" title="Excluir">${icon('trash', 'icon-sm')}</button>
                  </td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>`;
  }

  function openNewTask() {
    modal({
      title: 'Nova tarefa',
      body: `
        <div class="field">
          <label for="ntTitle">Título</label>
          <input class="input" id="ntTitle" placeholder="Ex.: Revisar capítulo 4" />
        </div>
        <div class="form-row mt-4">
          <div class="field">
            <label for="ntDue">Prazo</label>
            <input class="input" id="ntDue" type="date" />
          </div>
          <div class="field">
            <label for="ntPrio">Prioridade</label>
            <select class="select" id="ntPrio">
              <option value="baixa">Baixa</option>
              <option value="media" selected>Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>
        </div>`,
      footer: `
        <button class="btn btn-secondary" data-cancel>Cancelar</button>
        <button class="btn btn-primary" data-save>${icon('plus', 'icon-sm')} Criar tarefa</button>`,
      onMount(modalEl, close) {
        modalEl.querySelector('[data-cancel]').addEventListener('click', close);
        modalEl.querySelector('[data-save]').addEventListener('click', () => {
          const title = modalEl.querySelector('#ntTitle').value.trim();
          if (!title) {
            toast('Informe um título para a tarefa.', 'warning');
            return;
          }
          store.addTask({
            title,
            due: modalEl.querySelector('#ntDue').value || null,
            priority: modalEl.querySelector('#ntPrio').value
          });
          close();
          toast('Tarefa criada com sucesso.', 'success');
        });
      }
    });
  }

  function render(root) {
    root.dataset.live = 'true';
    const today = toISO();
    const all = store.state.tasks;
    const pend = all.filter((t) => t.status !== 'concluida');
    const late = pend.filter((t) => t.due && t.due < today).length;

    root.innerHTML = `
      <div class="page page-tarefas">
        <section class="stats-grid">
          ${stat({ icon: 'check-square', color: 'warning', value: String(pend.length), label: 'Pendências' })}
          ${stat({ icon: 'alert', color: late ? 'danger' : 'success', value: String(late), label: 'Atrasadas' })}
          ${stat({ icon: 'award', color: 'success', value: String(all.length - pend.length), label: 'Concluídas' })}
          <div class="flex items-center justify-end">
            <button class="btn btn-primary" id="newTask">${icon('plus', 'icon-sm')} Nova tarefa</button>
          </div>
        </section>

        <div class="card mt-4">
          <div class="card-head">
            <div class="tabs">
              <button class="tab ${filter === 'pendentes' ? 'active' : ''}" data-tab="pendentes">Pendentes <span class="badge badge-warning">${pend.length}</span></button>
              <button class="tab ${filter === 'concluidas' ? 'active' : ''}" data-tab="concluidas">Concluídas <span class="badge badge-gray">${all.length - pend.length}</span></button>
              <button class="tab ${filter === 'todas' ? 'active' : ''}" data-tab="todas">Todas <span class="badge badge-gray">${all.length}</span></button>
            </div>
          </div>
          <div class="card-body flush" id="taskList">${listHTML()}</div>
        </div>
      </div>`;

    $('#newTask', root).addEventListener('click', openNewTask);

    root.querySelectorAll('[data-tab]').forEach((tab) => {
      tab.addEventListener('click', () => {
        filter = tab.dataset.tab;
        render(root);
      });
    });

    const pageEl = root.querySelector('.page');
    if (pageEl) pageEl.addEventListener('click', (e) => {
      const tog = e.target.closest('[data-toggle]');
      if (tog) {
        const t = store.toggleTask(tog.dataset.toggle);
        if (t) toast(t.status === 'concluida' ? 'Tarefa concluída!' : 'Tarefa reaberta.', 'success');
        return;
      }
      const rm = e.target.closest('[data-remove]');
      if (rm) {
        const task = store.state.tasks.find((x) => x.id === rm.dataset.remove);
        confirm({
          title: 'Excluir tarefa',
          message: `Excluir "${task ? task.title : ''}"? Esta ação não pode ser desfeita.`,
          confirmText: 'Excluir',
          danger: true
        }).then((ok) => {
          if (!ok) return;
          store.removeTask(rm.dataset.remove);
          toast('Tarefa excluída.', 'info');
        });
      }
    });
  }

  global.AVA = global.AVA || {};
  global.AVA.pages = global.AVA.pages || {};
  global.AVA.pages.tarefas = { render };
})(window);
