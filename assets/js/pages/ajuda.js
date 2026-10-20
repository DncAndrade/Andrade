/* ============================================================
   AVA · PÁGINA: AJUDA & SUPORTE
   ============================================================ */
(function (global) {
  'use strict';

  const { esc, icon, stat, modal, toast } = global.AVA.ui;
  const D = global.AVA.DATA;

  const FAQ = [
    { q: 'Esqueci minha senha, o que faço?', a: 'Na tela de login, clique em "Esqueci minha senha". Um link de redefinição será enviado para o e-mail cadastrado. Se não receber, contate a secretaria acadêmica.' },
    { q: 'Como entregar uma atividade?', a: 'Acesse Tarefas no menu lateral, use "Nova tarefa" para acompanhar o prazo e entregue pelo espaço da disciplina em Materiais. O professor recebe uma notificação automática.' },
    { q: 'Onde vejo minhas notas?', a: 'A página Notas mostra a média geral, o detalhamento por disciplina e o peso de cada avaliação. Notas lançadas aparecem em tempo real.' },
    { q: 'Como emitir uma 2ª via de boleto?', a: 'Em Financeiro, use o botão "2ª via dos comprovantes" no rodapé da tabela. O documento é enviado para o seu e-mail cadastrado.' },
    { q: 'Preciso de uma declaração de matrícula.', a: 'Solicite em Documentos → "Solicitar novo documento". Declarações em dia ficam disponíveis em até 24h úteis.' },
    { q: 'O portal está lento ou fora do ar.', a: 'Verifique a manutenção programada em Avisos. Se o problema persistir, abra um chamado abaixo ou ligue para o suporte técnico.' }
  ];

  const CONTACTS = [
    { icon: 'phone', title: 'Secretaria Acadêmica', info: '(11) 3456-7890 · seg a sex, 8h–18h', color: 'brand' },
    { icon: 'headset', title: 'Suporte técnico', info: 'suporte.ti@imperial.edu.br · (11) 3456-7899', color: 'info' },
    { icon: 'library', title: 'Biblioteca Central', info: D.library.availableHours + ' · biblioteca@imperial.edu.br', color: 'purple' }
  ];

  function openTicket() {
    modal({
      title: 'Abrir chamado',
      body: `
        <div class="field">
          <label for="tkSubject">Assunto</label>
          <input class="input" id="tkSubject" placeholder="Ex.: Falha ao acessar notas" />
        </div>
        <div class="field mt-4">
          <label for="tkMsg">Descrição</label>
          <textarea class="textarea" id="tkMsg" rows="4" placeholder="Descreva o problema com o máximo de detalhes…"></textarea>
          <span class="hint">O suporte responde em até 1 dia útil.</span>
        </div>`,
      footer: `
        <button class="btn btn-secondary" data-cancel>Cancelar</button>
        <button class="btn btn-primary" data-send>${icon('send', 'icon-sm')} Enviar chamado</button>`,
      onMount(modalEl, close) {
        modalEl.querySelector('[data-cancel]').addEventListener('click', close);
        modalEl.querySelector('[data-send]').addEventListener('click', () => {
          const subject = modalEl.querySelector('#tkSubject').value.trim();
          if (!subject) { toast('Informe o assunto do chamado.', 'warning'); return; }
          close();
          toast('Chamado #2026-0451 aberto com sucesso.', 'success', 'Suporte');
        });
      }
    });
  }

  function render(root) {
    root.dataset.live = 'false';
    root.innerHTML = `
      <div class="page page-ajuda">
        <section class="stats-grid">
          ${stat({ icon: 'headset', color: 'brand', value: '1 dia útil', label: 'Tempo de resposta', hint: 'Chamados técnicos' })}
          ${stat({ icon: 'book-open', color: 'info', value: String(FAQ.length), label: 'Dúvidas frequentes' })}
          ${stat({ icon: 'phone', color: 'purple', value: '(11) 3456-7890', label: 'Central de atendimento' })}
        </section>

        <div class="grid-sidebar-right mt-4">
          <div class="card">
            <div class="card-head"><h3>Dúvidas frequentes</h3></div>
            <div class="card-body">
              ${FAQ.map((item) => `
                <details class="faq-item mb-2">
                  <summary class="flex items-center gap-4 fs-sm">${icon('chev-right', 'icon-sm')}<strong>${esc(item.q)}</strong></summary>
                  <p class="fs-sm text-soft mt-2" style="padding-left:24px">${esc(item.a)}</p>
                </details>`).join('')}
            </div>
            <div class="card-foot flex items-center justify-between">
              <span class="fs-xs text-muted">Não encontrou o que precisa?</span>
              <button class="btn btn-primary btn-sm" id="openTicket">${icon('message', 'icon-sm')} Abrir chamado</button>
            </div>
          </div>

          <div>
            <div class="card">
              <div class="card-head"><h3>Contatos</h3></div>
              <div class="card-body flush">
                <ul>
                  ${CONTACTS.map((c) => `
                    <li class="flex items-center gap-4" style="padding:var(--sp-3) var(--sp-5);border-bottom:1px solid var(--border)">
                      <span class="quick-icon accent-${c.color}" style="display:inline-flex">${icon(c.icon)}</span>
                      <span class="flex-1">
                        <strong class="block fs-sm">${esc(c.title)}</strong>
                        <span class="fs-xs text-muted">${esc(c.info)}</span>
                      </span>
                    </li>`).join('')}
                </ul>
              </div>
            </div>

            <div class="card mt-4">
              <div class="card-head"><h3>Atalhos</h3></div>
              <div class="card-body">
                <div class="grid" style="gap:var(--sp-2)">
                  <a class="quick-card" href="#/notas"><span class="quick-icon accent-brand">${icon('chart')}</span><span class="quick-text"><strong>Minhas notas</strong><span>Desempenho acadêmico</span></span>${icon('chev-right', 'icon-sm')}</a>
                  <a class="quick-card" href="#/financeiro"><span class="quick-icon accent-success">${icon('wallet')}</span><span class="quick-text"><strong>Financeiro</strong><span>Boletos e comprovantes</span></span>${icon('chev-right', 'icon-sm')}</a>
                  <a class="quick-card" href="#/documentos"><span class="quick-icon accent-info">${icon('file')}</span><span class="quick-text"><strong>Documentos</strong><span>Declarações e históricos</span></span>${icon('chev-right', 'icon-sm')}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;

    root.querySelector('#openTicket').addEventListener('click', openTicket);
  }

  global.AVA = global.AVA || {};
  global.AVA.pages = global.AVA.pages || {};
  global.AVA.pages.ajuda = { render };
})(window);
