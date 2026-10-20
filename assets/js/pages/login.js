/* ============================================================
   AVA · PÁGINA: LOGIN
   ============================================================ */
(function (global) {
  'use strict';

  const { esc, icon, $ } = global.AVA.ui;

  const PROFILES = [
    { key: 'aluno',       label: 'Aluno',       icon: 'user',     hint: 'Acesso completo ao ambiente acadêmico' },
    { key: 'professor',   label: 'Professor',   icon: 'users',    hint: 'Turmas, notas e materiais sob sua responsabilidade' },
    { key: 'coordenacao', label: 'Coordenação', icon: 'building', hint: 'Indicadores, turmas e gestão do curso' }
  ];

  const DEMO = {
    aluno:       { user: 'ana.nogueira', pass: '123456' },
    professor:   { user: 'm.alves',      pass: '123456' },
    coordenacao: { user: 'p.rocha',      pass: '123456' }
  };

  let activeProfile = 'aluno';

  function render(root) {
    root.innerHTML = `
      <div class="login-page">
        <button class="login-theme-btn" id="loginThemeBtn" type="button"
                title="Alternar tema" aria-label="Alternar tema claro/escuro">
          ${icon(global.AVA.store.state.theme === 'dark' ? 'sun' : 'moon')}
        </button>

        <section class="login-showcase">
          <div class="showcase-content">
            <div class="showcase-brand">
              <span class="brand-mark brand-mark-lg">${icon('cap')}</span>
              <div class="brand-text">
                <strong>AVA</strong>
                <span>Universidade Imperial</span>
              </div>
            </div>

            <h1 class="showcase-title">
              Sua universidade inteira<br><em>em um só lugar.</em>
            </h1>
            <p class="showcase-sub">
              Acompanhe disciplinas, notas, horário, financeiro e materiais didáticos
              com a mesma experiência do portal oficial — otimizada para desktop e celular.
            </p>

            <ul class="showcase-features">
              <li>${icon('book', 'icon-sm')}<span>Grade completa com materiais e fóruns</span></li>
              <li>${icon('wallet', 'icon-sm')}<span>Financeiro e segunda via de mensalidades</span></li>
              <li>${icon('bell', 'icon-sm')}<span>Avisos, mensagens e prazos em tempo real</span></li>
              <li>${icon('shield', 'icon-sm')}<span>Ambiente seguro e acessível</span></li>
            </ul>
          </div>
          <div class="showcase-glow"></div>
        </section>

        <section class="login-panel">
          <div class="login-card animate-scale">
            <header class="login-header">
              <h2>Entrar no AVA</h2>
              <p>Selecione seu perfil de acesso e entre com suas credenciais.</p>
            </header>

            <div class="profile-picker">
              <div class="profile-tabs" role="tablist" aria-label="Perfil de acesso">
                ${PROFILES.map((p) => `
                  <button class="profile-tab ${p.key === activeProfile ? 'active' : ''}"
                          role="tab" aria-selected="${p.key === activeProfile}"
                          data-profile="${p.key}" type="button">
                    ${icon(p.icon, 'icon-sm')}
                    <span>${esc(p.label)}</span>
                  </button>
                `).join('')}
              </div>

              <p class="profile-hint" id="profileHint">${esc(PROFILES[0].hint)}</p>
            </div>

            <form class="login-form" id="loginForm" novalidate>
              <div class="field">
                <label for="loginUser">Matrícula ou e-mail</label>
                <div class="input-group">
                  ${icon('user')}
                  <input class="input" type="text" id="loginUser" name="username"
                         placeholder="ana.nogueira" autocomplete="username" required>
                </div>
              </div>

              <div class="field">
                <label for="loginPass">Senha</label>
                <div class="input-group">
                  ${icon('lock')}
                  <input class="input" type="password" id="loginPass" name="password"
                         placeholder="••••••" autocomplete="current-password" required>
                  <button class="input-action" type="button" id="togglePass" aria-label="Mostrar senha">
                    ${icon('eye', 'icon-sm')}
                  </button>
                </div>
              </div>

              <div class="login-options">
                <label class="checkbox">
                  <input type="checkbox" id="remember" checked>
                  <span>Manter conectado</span>
                </label>
                <a href="#" id="forgotLink">Esqueci minha senha</a>
              </div>

              <div class="login-alert" id="loginAlert" hidden role="alert"></div>

              <button class="btn btn-primary btn-lg btn-block" type="submit" id="loginSubmit">
                ${icon('arrow-right', 'icon-sm')}
                <span>Entrar</span>
              </button>
            </form>

            <div class="login-demo">
              <div class="login-demo-head">
                ${icon('info', 'icon-sm')}
                <span>Acessos de demonstração</span>
              </div>
              <div class="login-demo-list" id="demoList"></div>
            </div>

            <footer class="login-footer">
              <span>© 2026 Universidade Imperial · Todos os direitos reservados.</span>
            </footer>
          </div>
        </section>
      </div>
    `;

    bind(root);
    renderDemoList(root);
  }

  function renderDemoList(root) {
    const list = $('#demoList', root);
    if (!list) return;
    const d = DEMO[activeProfile];
    list.innerHTML = `
      <button class="demo-item" type="button" data-fill>
        <span class="demo-key">Usuário</span>
        <code>${esc(d.user)}</code>
        <span class="demo-key">Senha</span>
        <code>${esc(d.pass)}</code>
        ${icon('arrow-right', 'icon-sm')}
      </button>
    `;
    list.querySelector('[data-fill]').addEventListener('click', () => {
      $('#loginUser', root).value = d.user;
      $('#loginPass', root).value = d.pass;
      showAlert(root, null);
      $('#loginSubmit', root).focus();
    });
  }

  function showAlert(root, message) {
    const box = $('#loginAlert', root);
    if (!box) return;
    if (!message) {
      box.hidden = true;
      box.innerHTML = '';
      return;
    }
    box.hidden = false;
    box.innerHTML = `${icon('alert', 'icon-sm')}<span>${esc(message)}</span>`;
  }

  function bind(root) {
    // Tema claro/escuro
    const themeBtn = $('#loginThemeBtn', root);
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const next = global.AVA.store.toggleTheme();
        themeBtn.innerHTML = icon(next === 'dark' ? 'sun' : 'moon');
      });
    }

    // Alternância de perfil
    root.querySelectorAll('[data-profile]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeProfile = btn.dataset.profile;
        root.querySelectorAll('[data-profile]').forEach((b) => {
          const on = b.dataset.profile === activeProfile;
          b.classList.toggle('active', on);
          b.setAttribute('aria-selected', String(on));
        });
        const p = PROFILES.find((x) => x.key === activeProfile);
        const hint = $('#profileHint', root);
        if (hint) hint.textContent = p.hint;
        showAlert(root, null);
        renderDemoList(root);
      });
    });

    // Mostrar/ocultar senha
    const toggle = $('#togglePass', root);
    const passInput = $('#loginPass', root);
    if (toggle && passInput) {
      toggle.addEventListener('click', () => {
        const showing = passInput.type === 'text';
        passInput.type = showing ? 'password' : 'text';
        toggle.innerHTML = icon(showing ? 'eye' : 'eye-off', 'icon-sm');
        toggle.setAttribute('aria-label', showing ? 'Mostrar senha' : 'Ocultar senha');
      });
    }

    // Esqueci senha
    const forgot = $('#forgotLink', root);
    if (forgot) {
      forgot.addEventListener('click', (e) => {
        e.preventDefault();
        global.AVA.ui.modal({
          title: 'Recuperar acesso',
          subtitle: 'Enviaremos um link para o e-mail cadastrado.',
          body: `
            <div class="field">
              <label for="recoverMail">E-mail institucional</label>
              <input class="input" type="email" id="recoverMail" placeholder="seu.nome@imperial.edu.br">
              <span class="hint">Use o e-mail vinculado à sua matrícula.</span>
            </div>
          `,
          footer: `<button class="btn btn-secondary" data-modal-close>Cancelar</button>
                   <button class="btn btn-primary" id="sendRecover">Enviar link</button>`,
          onMount(modalEl) {
            modalEl.querySelector('#sendRecover').addEventListener('click', () => {
              global.AVA.ui.closeModal();
              global.AVA.ui.toast('Se o e-mail estiver cadastrado, o link será enviado em instantes.', 'success', 'Solicitação enviada');
            });
          }
        });
      });
    }

    // Envio do formulário
    const form = $('#loginForm', root);
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = $('#loginUser', root).value.trim();
        const pass = $('#loginPass', root).value;
        const btn = $('#loginSubmit', root);

        if (!user || !pass) {
          showAlert(root, 'Preencha usuário e senha para continuar.');
          return;
        }

        btn.disabled = true;
        btn.innerHTML = `<span class="spinner"></span><span>Entrando…</span>`;

        setTimeout(() => {
          const result = global.AVA.store.login(user, pass, activeProfile);
          btn.disabled = false;
          btn.innerHTML = `${icon('arrow-right', 'icon-sm')}<span>Entrar</span>`;

          if (!result.ok) {
            showAlert(root, result.message);
            passInput.value = '';
            passInput.focus();
            return;
          }
          global.AVA.ui.toast(`Bem-vinda(o), ${global.AVA.ui.firstName(result.user.name)}!`, 'success', 'Acesso liberado');
          global.AVA.app.navigate('#/dashboard');
        }, 250);
      });
    }
  }

  global.AVA = global.AVA || {};
  global.AVA.pages = global.AVA.pages || {};
  global.AVA.pages.login = { render };
})(window);

