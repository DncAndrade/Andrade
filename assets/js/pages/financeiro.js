/* ============================================================
   AVA · PÁGINA: FINANCEIRO
   ============================================================ */
(function (global) {
  'use strict';

  const { esc, icon, $, brl, dateBR, relativeDate, toISO, stat, toast, confirm } = global.AVA.ui;
  const store = global.AVA.store;

  function render(root) {
    root.dataset.live = 'true';
    const b = store.state.billing;
    const today = toISO();
    const pending = b.items.filter((f) => f.status !== 'pago');
    const paid = b.items.filter((f) => f.status === 'pago');
    const totalPending = pending.reduce((s, f) => s + f.amount, 0);
    const totalPaid = paid.reduce((s, f) => s + f.amount, 0);

    root.innerHTML = `
      <div class="page page-financeiro">
        <section class="stats-grid">
          ${stat({ icon: 'wallet', color: 'danger', value: brl(totalPending), label: 'Total em aberto', badge: pending.length ? pending.length + ' título(s)' : 'Em dia', badgeColor: pending.length ? 'danger' : 'success' })}
          ${stat({ icon: 'check-circle', color: 'success', value: brl(totalPaid), label: 'Total pago em 2026' })}
          ${stat({ icon: 'calendar', color: 'info', value: 'Dia ' + b.dueDay, label: 'Vencimento mensal', hint: b.discount })}
        </section>

        <div class="card mt-4">
          <div class="card-head">
            <h3>Comprovantes e títulos</h3>
            <div class="flex gap-4">
              <span class="badge badge-gray">${esc(b.plan)}</span>
              <span class="badge badge-gray">${esc(b.contract)}</span>
              ${pending.length ? `<button class="btn btn-primary btn-sm" id="payAll">${icon('dollar', 'icon-sm')} Pagar tudo</button>` : ''}
            </div>
          </div>
          <div class="card-body flush">
            <div class="table-wrap">
              <table class="table">
                <thead>
                  <tr><th>Descrição</th><th>Categoria</th><th>Vencimento</th><th class="num">Valor</th><th>Status</th><th></th></tr>
                </thead>
                <tbody>
                  ${b.items.map((f) => {
                    const overdue = f.status !== 'pago' && f.due < today;
                    return `
                      <tr>
                        <td><strong>${esc(f.label)}</strong>${f.paidAt ? `<br><span class="fs-xs text-muted">Pago em ${dateBR(f.paidAt)} · ${esc(f.method || '—')}</span>` : ''}</td>
                        <td><span class="badge badge-gray">${esc(f.category)}</span></td>
                        <td class="nowrap ${overdue ? 'text-danger' : ''}">${dateBR(f.due)}<br><span class="fs-xs text-muted">${relativeDate(f.due)}</span></td>
                        <td class="num"><strong>${brl(f.amount)}</strong></td>
                        <td><span class="badge badge-${f.status === 'pago' ? 'success' : overdue ? 'danger' : 'warning'}">${f.status === 'pago' ? 'Pago' : overdue ? 'Vencido' : 'Pendente'}</span></td>
                        <td class="text-right">
                          ${f.status !== 'pago'
                            ? `<button class="btn btn-soft btn-sm" data-pay="${f.id}">${icon('dollar', 'icon-sm')} Pagar</button>`
                            : icon('check-circle', 'icon-sm text-success')}
                        </td>
                      </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
          <div class="card-foot flex items-center justify-between">
            <span class="fs-xs text-muted">${icon('receipt', 'icon-sm')} Pagamentos via Pix, boleto ou cartão (demonstração)</span>
            <button class="btn btn-ghost btn-sm" id="receipts">${icon('download', 'icon-sm')} 2ª via dos comprovantes</button>
          </div>
        </div>
      </div>`;

    root.querySelectorAll('[data-pay]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = store.state.billing.items.find((f) => f.id === btn.dataset.pay);
        confirm({
          title: 'Confirmar pagamento',
          message: `Pagar ${item.label} no valor de ${brl(item.amount)} via Pix?`,
          confirmText: 'Pagar'
        }).then((ok) => {
          if (!ok) return;
          store.payBill(btn.dataset.pay, 'Pix');
          toast('Pagamento registrado com sucesso.', 'success', 'Título quitado');
        });
      });
    });

    const payAll = $('#payAll', root);
    if (payAll) {
      payAll.addEventListener('click', () => {
        confirm({
          title: 'Pagar todos os títulos',
          message: `Quitar ${pending.length} título(s) no total de ${brl(totalPending)} via Pix?`,
          confirmText: 'Pagar tudo'
        }).then((ok) => {
          if (!ok) return;
          const n = store.payAllPending('Pix');
          toast(`${n} título(s) quitado(s) com sucesso.`, 'success', 'Tudo em dia!');
        });
      });
    }

    const receipts = $('#receipts', root);
    if (receipts) {
      receipts.addEventListener('click', () => {
        toast('Os comprovantes foram gerados e enviados para o seu e-mail.', 'info', '2ª via solicitada');
      });
    }
  }

  global.AVA = global.AVA || {};
  global.AVA.pages = global.AVA.pages || {};
  global.AVA.pages.financeiro = { render };
})(window);
