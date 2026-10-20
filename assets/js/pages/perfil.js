/* ============================================================
   AVA · PÁGINA: MEU PERFIL
   ============================================================ */
(function (global) {
  'use strict';

  const { esc, icon, avatar, modal, closeModal, toast } = global.AVA.ui;
  const D = global.AVA.DATA;
  const store = global.AVA.store;

  const ROLE_LABEL = { aluno: 'Aluno', professor: 'Professor', coordenacao: 'Coordenação' };

  const SETTINGS = [
    { key: 'emailNotifications', label: 'Notificações por e-mail', hint: 'Avisos de prazos e notas no seu e-mail' },
    { key: 'pushNotifications', label: 'Notificações push', hint: 'Alertas no navegador durante o uso' },
    { key: 'weeklyDigest', label: 'Resumo semanal', hint: 'E-mail toda segunda com o resumo da semana' },
    { key: 'autoSave', label: 'Salvamento automático', hint: 'Guarda rascunhos de mensagens e tarefas' }
  ];

  function fieldsFor(user) {
    if (user.tab === 'aluno') {
      return [
        ['RA', user.ra], ['CPF', user.cpf], ['Telefone', user.phone],
        ['Curso', user.course], ['Período', user.period + 'º'], ['Turno', user.shift],
        ['Campus', user.campus], ['Tutor', user.tutor], ['Ingresso', user.since]
      ];
    }
    if (user.tab === 'professor') {
      return [['Titulação', user.titulacao], ['Área', user.area], ['Departamento', user.departamento]];
    }
    return [['Titulação', user.titulacao], ['Departamento', user.departamento]];
  }

  function openPasswordModal() {
    modal({
      title: 'Alterar senha',
      body: `
        <div class="field"><label for="pwCurrent">Senha atual</label><input class="input" id="pwCurrent" type="password" /></div>
        <div class="field mt-4"><label for="pwNew">Nova senha</label><input class="input" id="pwNew" type="password" /><span class="hint">Mínimo de 6 caracteres.</span></div>
        <div class="field mt-4"><label for="pwConfirm">Confirmar nova senha</label><input class="input" id="pwConfirm" type="password" /></div>`,
      footer: `
        <button class="btn btn-secondary" data-cancel>Cancelar</button>
        <button class="btn btn-primary" data-save>Salvar senha</button>`,
      onMount(modalEl, close) {
        modalEl.querySelector('[data-cancel]').addEventListener('click', close);
        modalEl.querySelector('[data-save]').addEventListener('click', () => {
          const n = modalEl.querySelector('#pwNew').value;
          const c = modalEl.querySelector('#pwConfirm').value;
          if (n.length < 6) { toast('A nova senha precisa de ao menos 6 caracteres.', 'warning'); return; }
          if (n !== c) { toast('As senhas não conferem.', 'error'); return; }
          close();
          toast('Senha alterada com sucesso.', 'success');
        });
      }
    });
  }

  function render(root) {
    root.dataset.live = 'false';
    const user = store.currentUser() || D.users[0];
    const role = user.tab || 'aluno';
    const fields = fieldsFor(user);
    const s = store.state.settings;

    root.innerHTML = `
      <div class="page page-perfil">
        <div class="grid-sidebar-right">
          <div>
            <div class="card">
              <div class="card-body">
                <div class="flex items-center gap-4">
                  ${avatar(user.name, 'avatar-xl', user.avatarColor)}
                  <div class="flex-1">
                    <h3>${esc(user.name)}</h3>
                    <p class="fs-sm">${esc(user.email)}</p>
                    <div class="flex gap-4 mt-1">
                      <span class="badge badge-brand">${ROLE_LABEL[role] || esc(role)}</span>
                      <span class="badge badge-gray">${esc(D.institution.short)} · ${esc(D.institution.academicYear)}</span>
                    </div>
                  </div>
                  <button class="btn btn-secondary btn-sm" id="changePw">${icon('settings', 'icon-sm')} Alterar senha</button>
                </div>
              </div>
            </div>

            <div class="card mt-4">
              <div class="card-head"><h3>Dados cadastrais</h3></div>
              <div class="card-body flush">
                <div class="table-wrap">
                  <table class="table">
                    <tbody>
                      ${fields.map(([label, value]) => `
                        <tr><td class="text-muted fs-sm" style="width:34%">${esc(label)}</td><td><strong>${esc(String(value === undefined || value === null ? '—' : value))}</strong></td></tr>`).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-head"><h3>Preferências</h3><p>Salvas automaticamente</p></div>
            <div class="card-body">
              ${SETTINGS.map((item) => `
                <label class="switch mb-4" style="display:flex">
                  <input type="checkbox" data-setting="${item.key}" ${s[item.key] ? 'checked' : ''} />
                  <span class="switch-track"><span class="switch-thumb"></span></span>
                  <span>
                    <strong class="block fs-sm">${esc(item.label)}</strong>
                    <span class="fs-xs text-muted">${esc(item.hint)}</span>
                  </span>
                </label>`).join('')}
              <hr class="divider mt-2 mb-4" />
              <div class="flex items-center justify-between">
                <span class="fs-sm">Tema escuro</span>
                <button class="btn btn-soft btn-sm" id="toggleTheme">${icon(store.state.theme === 'dark' ? 'sun' : 'moon', 'icon-sm')} Alternar</button>
              </div>
              <hr class="divider mt-4 mb-4" />
              <button class="btn btn-ghost btn-sm btn-block text-danger" id="resetDemo">${icon('refresh', 'icon-sm')} Restaurar dados de demonstração</button>
            </div>
          </div>
        </div>
      </div>`;

    root.querySelectorAll('[data-setting]').forEach((input) => {
      input.addEventListener('change', () => {
        store.setSetting(input.dataset.setting, input.checked);
        toast('Preferência salva.', 'success');
      });
    });
    root.querySelector('#changePw').addEventListener('click', openPasswordModal);
    root.querySelector('#toggleTheme').addEventListener('click', () => {
      const theme = store.toggleTheme();
      toast(`Tema ${theme === 'dark' ? 'escuro' : 'claro'} ativado.`, 'info');
      render(root);
    });
    root.querySelector('#resetDemo').addEventListener('click', () => {
      store.reset();
      toast('Dados de demonstração restaurados.', 'info');
    });
  }

  global.AVA = global.AVA || {};
  global.AVA.pages = global.AVA.pages || {};
  global.AVA.pages.perfil = { render };
})(window);
