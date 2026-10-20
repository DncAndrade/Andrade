/* ============================================================
   AVA · PÁGINA: DOCUMENTOS
   ============================================================ */
(function (global) {
  'use strict';

  const { esc, icon, dateBR, stat, toast } = global.AVA.ui;
  const D = global.AVA.DATA;

  const STATUS = {
    valido: { label: 'Válido', color: 'success' },
    'em-analise': { label: 'Em análise', color: 'warning' },
    vencido: { label: 'Vencido', color: 'danger' }
  };

  function render(root) {
    root.dataset.live = 'false';
    const docs = D.documents.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
    const valid = docs.filter((d) => d.status === 'valido').length;
    const pending = docs.filter((d) => d.status === 'em-analise').length;
    const expired = docs.filter((d) => d.status === 'vencido').length;

    root.innerHTML = `
      <div class="page page-documentos">
        <section class="stats-grid">
          ${stat({ icon: 'file', color: 'brand', value: String(docs.length), label: 'Documentos' })}
          ${stat({ icon: 'check-circle', color: 'success', value: String(valid), label: 'Válidos' })}
          ${stat({ icon: 'clock', color: 'warning', value: String(pending), label: 'Em análise' })}
          ${stat({ icon: 'alert', color: 'danger', value: String(expired), label: 'Vencidos' })}
        </section>

        <div class="card mt-4">
          <div class="card-head">
            <h3>Documentos acadêmicos</h3>
            <button class="btn btn-secondary btn-sm" id="reqDoc">${icon('plus', 'icon-sm')} Solicitar novo documento</button>
          </div>
          <div class="card-body flush">
            <div class="table-wrap">
              <table class="table">
                <thead>
                  <tr><th>Documento</th><th>Tipo</th><th>Emissão</th><th>Código</th><th>Status</th><th></th></tr>
                </thead>
                <tbody>
                  ${docs.map((doc) => {
                    const st = STATUS[doc.status] || { label: doc.status, color: 'gray' };
                    return `
                      <tr>
                        <td><strong>${esc(doc.title)}</strong><br><span class="fs-xs text-muted">${esc(doc.format)} · ${esc(doc.size)}</span></td>
                        <td><span class="badge badge-gray">${esc(doc.type)}</span></td>
                        <td class="nowrap fs-xs">${dateBR(doc.date)}</td>
                        <td class="fs-xs nowrap"><code>${esc(doc.code)}</code></td>
                        <td><span class="badge badge-${st.color}">${st.label}</span></td>
                        <td class="text-right nowrap">
                          <button class="btn btn-ghost btn-sm" data-doc="${esc(doc.title)}">${icon('download', 'icon-sm')} Baixar</button>
                          ${doc.status === 'vencido' ? `<button class="btn btn-soft btn-sm" data-renew="${esc(doc.title)}">${icon('refresh', 'icon-sm')} Renovar</button>` : ''}
                        </td>
                      </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
          <div class="card-foot">
            <span class="fs-xs text-muted">${icon('info', 'icon-sm')} Documentos emitidos digitalmente possuem validade legal (Lei 14.063/2020).</span>
          </div>
        </div>
      </div>`;

    const pageEl = root.querySelector('.page');
    if (pageEl) pageEl.addEventListener('click', (e) => {
      const dl = e.target.closest('[data-doc]');
      if (dl) toast(`"${dl.dataset.doc}" baixado com sucesso.`, 'info', 'Documentos');
      const rn = e.target.closest('[data-renew]');
      if (rn) toast(`Solicitação de renovação de "${rn.dataset.renew}" enviada à secretaria.`, 'success');
    });
    const req = root.querySelector('#reqDoc');
    if (req) req.addEventListener('click', () => {
      toast('Registro de solicitação aberto — acompanhe o status na tabela.', 'info', 'Nova solicitação');
    });
  }

  global.AVA = global.AVA || {};
  global.AVA.pages = global.AVA.pages || {};
  global.AVA.pages.documentos = { render };
})(window);
