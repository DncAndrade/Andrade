/* ============================================================
   AVA · DADOS
   Dados de demonstração (mock) usados por todo o front-end.
   Substitua este arquivo por chamadas a uma API real no back-end.
   ============================================================ */
(function (global) {
  'use strict';

  const DATA = {
    institution: {
      name: 'Universidade Imperial',
      short: 'UI',
      campus: 'Campus São Paulo - Vila Mariana',
      academicYear: '2026.1',
      period: '1º semestre de 2026'
    },

    /* ---------- Usuários de demonstração ---------- */
    users: [
      {
        id: 'u1', role: 'aluno', tab: 'aluno',
        name: 'Ana Beatriz Nogueira', username: 'ana.nogueira',
        email: 'ana.nogueira@imperial.edu.br', password: '123456',
        ra: '20260345', cpf: '123.456.789-00',
        phone: '(11) 98888-1234',
        course: 'Engenharia de Software',
        period: 7, shift: 'Noturno', campus: 'São Paulo - Vila Mariana',
        tutor: 'Prof. Marcos Vinícius Alves',
        since: '2024/2',
        avatarColor: 'brand'
      },
      {
        id: 'u2', role: 'professor', tab: 'professor',
        name: 'Marcos Vinícius Alves', username: 'm.alves',
        email: 'marcos.alves@imperial.edu.br', password: '123456',
        titulacao: 'Doutor em Ciência da Computação',
        area: 'Engenharia de Software',
        departamento: 'Computação',
        avatarColor: 'purple'
      },
      {
        id: 'u3', role: 'coordenacao', tab: 'coordenacao',
        name: 'Patrícia Gomes Rocha', username: 'p.rocha',
        email: 'patricia.rocha@imperial.edu.br', password: '123456',
        titulacao: 'Mestre em Administração Educacional',
        departamento: 'Coordenação de Engenharia de Software',
        avatarColor: 'cyan'
      }
    ],

    /* ---------- Disciplinas do aluno ---------- */
    disciplines: [
      {
        id: 'd1', code: 'ENG101', name: 'Algoritmos e Estruturas de Dados',
        teacher: 'Marcos Vinícius Alves', teacherId: 'u2',
        credits: 6, hours: 80, room: 'Lab 302', slot: '1A',
        color: 'brand', status: 'ativa', progress: 62,
        description: 'Fundamentos de complexidade algorítmica, estruturas lineares e não lineares, análise de desempenho e implementação prática.',
        syllabus: [
          'Complexidade de algoritmos (notação Big-O)',
          'Listas encadeadas, pilhas e filas',
          'Árvores binárias e balanceamento',
          'Grafos e algoritmos de busca',
          'Ordenação e seleção'
        ],
        attachments: 14, activities: 6, forum: 23
      },
      {
        id: 'd2', code: 'ENG203', name: 'Banco de Dados Relacionais',
        teacher: 'Helena Castro Nunes', teacherId: 'u4',
        credits: 4, hours: 60, room: 'Sala 214', slot: '3B',
        color: 'purple', status: 'ativa', progress: 55,
        description: 'Modelagem relacional, SQL, normalização, índices e otimização de consultas em SGBDs.',
        syllabus: [
          'Modelo relacional e álgebra relacional',
          'SQL: DDL, DML e DCL',
          'Normalização até 3FN',
          'Índices e planos de execução',
          'Transações e concorrência'
        ],
        attachments: 11, activities: 5, forum: 18
      },
      {
        id: 'd3', code: 'MAT201', name: 'Cálculo Diferencial e Integral',
        teacher: 'Roberto Ayres Lima', teacherId: 'u5',
        credits: 6, hours: 80, room: 'Sala 108', slot: '2A',
        color: 'cyan', status: 'ativa', progress: 48,
        description: 'Limites, derivadas, integrais e suas aplicações em modelagem matemática e resolubilidade de problemas.',
        syllabus: [
          'Limites e continuidade',
          'Regras de derivação e regra da cadeia',
          'Aplicações da derivada',
          'Integrais definidas e indefinidas',
          'Técnicas de integração'
        ],
        attachments: 9, activities: 7, forum: 12
      },
      {
        id: 'd4', code: 'EST104', name: 'Estatística Aplicada',
        teacher: 'Carla Menezes Braga', teacherId: 'u6',
        credits: 4, hours: 60, room: 'Sala 305', slot: '5B',
        color: 'success', status: 'ativa', progress: 71,
        description: 'Métodos descritivos, inferência estatística, testes de hipótese e análise de regressão aplicada.',
        syllabus: [
          'Estatística descritiva e gráficos',
          'Probabilidade e distribuições',
          'Amostragem e intervalos de confiança',
          'Testes de hipótese',
          'Regressão linear simples'
        ],
        attachments: 8, activities: 4, forum: 9
      },
      {
        id: 'd5', code: 'HUM110', name: 'Ética e Legislação em TI',
        teacher: 'Fernanda Lopes Cardoso', teacherId: 'u7',
        credits: 2, hours: 30, room: 'Sala 012', slot: '6A',
        color: 'warning', status: 'ativa', progress: 88,
        description: 'Princípios éticos, LGPD, propriedade intelectual e responsabilidade profissional em tecnologia.',
        syllabus: [
          'Ética e comportamento profissional',
          'LGPD e proteção de dados',
          'Propriedade intelectual',
          'Responsabilidade técnica'
        ],
        attachments: 5, activities: 3, forum: 14
      },
      {
        id: 'd7', code: 'GES100', name: 'Gestão de Projetos de Software',
        teacher: 'Thiago Santana Vieira', teacherId: 'u8',
        credits: 4, hours: 60, room: 'Sala 220', slot: '7A',
        color: 'info', status: 'ativa', progress: 33,
        description: 'Ciclo de vida, estimativas, planejamento de sprints e gestão de riscos em projetos de software.',
        syllabus: [
          'Modelos de ciclo de vida',
          'Estimativas e cronograma',
          'Scrum e kanban',
          'Gestão de riscos',
          'Métricas de projeto'
        ],
        attachments: 7, activities: 4, forum: 11
      },
      {
        id: 'd8', code: 'FIS105', name: 'Física Experimental I',
        teacher: 'Yuri Batalha Silva', teacherId: 'u9',
        credits: 4, hours: 60, room: 'Lab de Física', slot: '8B',
        color: 'danger', status: 'ativa', progress: 26,
        description: 'Medição, incerteza experimental, cinemática vetorial e análise de dados em laboratório.',
        syllabus: [
          'Medição e incerteza',
          'Cinemática vetorial',
          'Movimento circular',
          'Leis de Newton',
          'Trabalho e energia'
        ],
        attachments: 6, activities: 5, forum: 8
      }
    ],

    /* ---------- Grade horária (por slot) ---------- */
    schedule: [
      { slot: '1A', day: 'Segunda',  start: '19:00', end: '20:40', disciplineId: 'd1', room: 'Lab 302' },
      { slot: '2A', day: 'Segunda',  start: '20:50', end: '22:30', disciplineId: 'd3', room: 'Sala 108' },
      { slot: '2B', day: 'Quarta',  start: '20:50', end: '22:30', disciplineId: 'd2', room: 'Sala 214' },
      { slot: '3A', day: 'Terça',    start: '19:00', end: '20:40', disciplineId: 'd4', room: 'Sala 305' },
      { slot: '3B', day: 'Quarta',  start: '19:00', end: '20:40', disciplineId: 'd2', room: 'Sala 214' },
      { slot: '4B', day: 'Quinta',  start: '20:50', end: '22:30', disciplineId: 'd1', room: 'Lab 302' },
      { slot: '5A', day: 'Sexta',    start: '19:00', end: '20:40', disciplineId: 'd5', room: 'Sala 012' },
      { slot: '5B', day: 'Sexta',    start: '20:50', end: '22:30', disciplineId: 'd4', room: 'Sala 305' },
      { slot: '6A', day: 'Segunda',  start: '20:50', end: '22:30', disciplineId: 'd5', room: 'Sala 012' },
      { slot: '6B', day: 'Sexta',    start: '19:00', end: '20:40', disciplineId: 'd7', room: 'Sala 220' },
      { slot: '7A', day: 'Terça',    start: '20:50', end: '22:30', disciplineId: 'd7', room: 'Sala 220' },
      { slot: '8A', day: 'Quarta',  start: '19:00', end: '20:40', disciplineId: 'd8', room: 'Lab de Física' },
      { slot: '8B', day: 'Quarta',  start: '20:50', end: '22:30', disciplineId: 'd8', room: 'Lab de Física' }
    ],

    weekDays: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],

    /* ---------- Avaliações ---------- */
    assessments: [
      { id: 'a1', disciplineId: 'd1', title: 'Prova 1 — Complexidade e listas',  type: 'prova',  date: '2026-03-24', weight: 30, score: 8.5,  max: 10 },
      { id: 'a2', disciplineId: 'd1', title: 'Trabalho em grupo — Árvores',      type: 'trabalho', date: '2026-04-08', weight: 20, score: 9.0, max: 10 },
      { id: 'a3', disciplineId: 'd1', title: 'Prova 2 — Grafos e ordenação',      type: 'prova',  date: '2026-05-19', weight: 30, score: null, max: 10 },
      { id: 'a4', disciplineId: 'd1', title: 'Participação em fórum',              type: 'participacao', date: '2026-06-15', weight: 20, score: 10, max: 10 },
      { id: 'a5', disciplineId: 'd2', title: 'Prova 1 — SQL básico',               type: 'prova',  date: '2026-03-26', weight: 35, score: 7.5,  max: 10 },
      { id: 'a6', disciplineId: 'd2', title: 'Laboratório — Modelagem relacional', type: 'laboratorio', date: '2026-04-15', weight: 25, score: 9.5, max: 10 },
      { id: 'a7', disciplineId: 'd2', title: 'Prova 2 — Normalização',             type: 'prova',  date: '2026-06-02', weight: 40, score: null, max: 10 },
      { id: 'a8', disciplineId: 'd3', title: 'Prova 1 — Limites e derivadas',      type: 'prova',  date: '2026-03-27', weight: 40, score: 6.0, max: 10 },
      { id: 'a9', disciplineId: 'd3', title: 'Lista de exercícios 3',              type: 'lista', date: '2026-04-10', weight: 20, score: 8.0, max: 10 },
      { id: 'a10', disciplineId: 'd3', title: 'Prova 2 — Integrais',                type: 'prova', date: '2026-05-27', weight: 40, score: null, max: 10 },
      { id: 'a11', disciplineId: 'd4', title: 'Trabalho — Análise exploratória',     type: 'trabalho', date: '2026-04-03', weight: 30, score: 9.0, max: 10 },
      { id: 'a12', disciplineId: 'd4', title: 'Prova 1 — Probabilidade',            type: 'prova', date: '2026-05-05', weight: 70, score: null, max: 10 },
      { id: 'a13', disciplineId: 'd5', title: 'Seminário — LGPD',                  type: 'seminario', date: '2026-03-20', weight: 50, score: 9.5, max: 10 },
      { id: 'a14', disciplineId: 'd5', title: 'Dissertação final',                 type: 'prova', date: '2026-06-18', weight: 50, score: null, max: 10 },
      { id: 'a18', disciplineId: 'd7', title: 'Prova 1 — PMBOK e ciclo de vida',    type: 'prova', date: '2026-04-22', weight: 40, score: 7.0, max: 10 },
      { id: 'a19', disciplineId: 'd7', title: 'Plano de gestão de projeto',         type: 'projeto', date: '2026-06-05', weight: 60, score: null, max: 10 },
      { id: 'a20', disciplineId: 'd8', title: 'Relatório de laboratório 1',         type: 'laboratorio', date: '2026-03-18', weight: 25, score: 8.8, max: 10 },
      { id: 'a21', disciplineId: 'd8', title: 'Prova 1 — Cinemática',              type: 'prova', date: '2026-05-08', weight: 50, score: null, max: 10 },
      { id: 'a22', disciplineId: 'd8', title: 'Relatório de laboratório 2',         type: 'laboratorio', date: '2026-06-16', weight: 25, score: null, max: 10 }
    ],

    assessmentTypes: {
      prova: 'Prova', trabalho: 'Trabalho', lista: 'Lista', laboratorio: 'Laboratório',
      projeto: 'Projeto', seminario: 'Seminário', participacao: 'Participação'
    },

    /* ---------- Financeiro ---------- */
    billing: {
      student: 'Ana Beatriz Nogueira',
      contract: 'Contrato 2026/1 — 874.552.318-10',
      dueDay: 10,
      plan: 'Mensalidade Mensal',
      discount: 'Bolsa Família — 10%',
      items: [
        { id: 'f1', label: 'Mensalidade — Engenharia de Software', category: 'Mensalidade', amount: 1290.00, due: '2026-02-10', status: 'pago',    paidAt: '2026-02-06', method: 'Boleto bancário' },
        { id: 'f2', label: 'Taxa de matrícula 2026/1',               category: 'Taxa',         amount: 320.00,  due: '2026-02-10', status: 'pago',    paidAt: '2026-02-06', method: 'Boleto bancário' },
        { id: 'f3', label: 'Mensalidade — Fevereiro/2026',             category: 'Mensalidade', amount: 1161.00, due: '2026-03-10', status: 'pago',    paidAt: '2026-03-05', method: 'Pix' },
        { id: 'f4', label: 'Mensalidade — Março/2026',                category: 'Mensalidade', amount: 1161.00, due: '2026-04-10', status: 'pago',    paidAt: '2026-04-08', method: 'Pix' },
        { id: 'f5', label: 'Mensalidade — Abril/2026',                category: 'Mensalidade', amount: 1161.00, due: '2026-05-10', status: 'pago',    paidAt: '2026-05-07', method: 'Boleto bancário' },
        { id: 'f6', label: 'Material didático — Livro Algoritmos',    category: 'Material',    amount: 189.90,  due: '2026-05-15', status: 'pago',    paidAt: '2026-05-11', method: 'Cartão de crédito' },
        { id: 'f7', label: 'Mensalidade — Maio/2026',                 category: 'Mensalidade', amount: 1161.00, due: '2026-06-10', status: 'pendente', paidAt: null,          method: null },
        { id: 'f8', label: 'Taxa de aproveitamento em laboratório',   category: 'Taxa',         amount: 75.00,   due: '2026-06-15', status: 'pendente', paidAt: null,          method: null },
        { id: 'f9', label: 'Mensalidade — Junho/2026',                category: 'Mensalidade', amount: 1161.00, due: '2026-07-10', status: 'pendente', paidAt: null,          method: null },
        { id: 'f10',label: 'Certificado de conclusão (provisório)',  category: 'Taxa',         amount: 45.00,   due: '2026-07-10', status: 'pendente', paidAt: null,          method: null }
      ],
      paymentMethods: [
        { id: 'pm1', brand: 'mastercard', last4: '4417', label: 'Mastercard final 4417', type: 'Crédito' },
        { id: 'pm2', brand: 'visa',       last4: '9930', label: 'Visa final 9930',        type: 'Débito' }
      ]
    },

    /* ---------- Tarefas ---------- */
    tasks: [
      { id: 't1', title: 'Entregar lista 3 de Cálculo',               disciplineId: 'd3', due: '2026-04-10', priority: 'alta',      status: 'pendente',     notes: 'Exercícios 12 a 24 do capítulo 4.' },
      { id: 't2', title: 'Submeter relatório do laboratório de Física', disciplineId: 'd8', due: '2026-04-12', priority: 'alta',      status: 'pendente',     notes: 'Enviar PDF com tabelas de incerteza.' },
      { id: 't4', title: 'Fazer plano de gestão de projeto',           disciplineId: 'd7', due: '2026-06-05', priority: 'media',     status: 'pendente',     notes: '' },
      { id: 't5', title: 'Ler capítulo 6 — Normalização',            disciplineId: 'd2', due: '2026-05-25', priority: 'media',     status: 'pendente',     notes: '' },
      { id: 't6', title: 'Revisar slides da aula de Grafos',         disciplineId: 'd1', due: '2026-05-18', priority: 'baixa',     status: 'pendente',     notes: '' },
      { id: 't7', title: 'Participar do fórum de discussão',         disciplineId: 'd1', due: '2026-05-10', priority: 'baixa',     status: 'pendente',     notes: '' },
      { id: 't8', title: 'Preparar seminário sobre LGPD',            disciplineId: 'd5', due: '2026-03-18', priority: 'media',     status: 'concluida',    notes: '' },
      { id: 't9', title: 'Resolver exercícios de vetores',           disciplineId: 'd8', due: '2026-03-12', priority: 'media',     status: 'concluida',    notes: '' },
      { id: 't10',title: 'Assistir à aula gravada de SQL',           disciplineId: 'd2', due: '2026-03-08', priority: 'baixa',     status: 'concluida',    notes: '' }
    ],

    /* ---------- Avisos ---------- */
    notices: [
      { id: 'n1', title: 'Prazo de entrega do trabalho final',        category: 'Acadêmico',  date: '2026-05-28', priority: 'alta',   author: 'Coordenação', body: 'Informamos que o prazo de entrega do trabalho de conclusão foi prorrogado para 18/06/2026. O envio deve ser realizado pelo portal, na aba "Documentos".', pinned: true,  read: false },
      { id: 'n2', title: 'Nova data para-Nonlinear e GE',            category: 'Geral',     date: '2026-05-20', priority: 'media',  author: 'Secretaria',  body: 'Por determinação da reitoria, as atividades não-Lineares foram transferidas para o dia 19/06. Att: Secretaria Acadêmica.', pinned: false, read: false },
      { id: 'n3', title: 'Reajuste de horários — semana de 08/06',    category: 'Acadêmico',  date: '2026-05-18', priority: 'alta',   author: 'Coordenação', body: 'Nas aulas de segunda-feira, a turma de Engenharia de Software será transferida para a sala 220. O ajuste vale apenas para aquela semana.', pinned: false, read: false },
      { id: 'n4', title: 'Biblioteca: nova base de dados Elsevier',   category: 'Biblioteca', date: '2026-05-15', priority: 'baixa',  author: 'Biblioteca',  body: 'A biblioteca passa a oferecer acesso à base "Elsevier Engineering Village" com 12 assinaturas simultâneas.', pinned: false, read: true },
      { id: 'n5', title: 'Regulamento de estágio 2026/2',             category: 'Estágio',   date: '2026-05-12', priority: 'media',  author: 'Coordenação', body: 'Divulgado o regulamento de estágio para o período 2026/2. A assinatura de Termo de Compromisso passa a ser digital.', pinned: false, read: true },
      { id: 'n6', title: 'Convocação — reunião de turma',            category: 'Acadêmico',  date: '2026-05-10', priority: 'media',  author: 'Coordenação', body: 'Reunião com os representantes de turma na sala 220, às 19h. Pauta: plano de ensino, avaliação e dificuldades do RED.', pinned: false, read: true },
      { id: 'n7', title: 'Manutenção programada do portal',            category: 'Geral',     date: '2026-05-08', priority: 'baixa',  author: 'TI',          body: 'O portal ficará indisponível no dia 12/06, das 22h às 23h, para manutenção programada.', pinned: false, read: true }
    ],

    /* ---------- Mensagens ---------- */
    conversations: [
      {
        id: 'c1', name: 'Marcos Vinícius Alves', role: 'Professor — ENG101', initials: 'MV', online: true, unread: 2,
        messages: [
          { id: 'm1', from: 'them', text: 'Olá, Ana! Tudo bem? Estou avisando sobre a correção da Prova 1 de Algoritmos.', time: '2026-03-25T14:02' },
          { id: 'm2', from: 'me',   text: 'Oi, professor! Tudo ótimo. Vi que já foram lançadas as notas no portal.', time: '2026-03-25T14:20' },
          { id: 'm3', from: 'them', text: 'Sim! Suas questões de análise de complexidade ficaram ótimas. Se quiser revisar, deixei um feedback no fórum.', time: '2026-03-25T14:22' },
          { id: 'm4', from: 'them', text: 'Aproveito para lembrar do prazo da Prova 2 — Grafos e ordenação: 19/05.', time: '2026-03-25T14:23' }
        ]
      },
      {
        id: 'c2', name: 'Secretaria Acadêmica', role: 'Serviço ao aluno', initials: 'SA', online: true, unread: 0,
        messages: [
          { id: 'm5', from: 'them', text: 'Boa tarde! Seu comprovante de matrícula de 2026/1 já está disponível na área Documentos.', time: '2026-03-20T10:15' },
          { id: 'm6', from: 'me',   text: 'Muito obrigada! Vou buscar agora mesmo.', time: '2026-03-20T11:02' }
        ]
      },
      {
        id: 'c3', name: 'Grupo do Projeto 2', role: '4 participantes', initials: 'GP', online: false, unread: 5,
        messages: [
          { id: 'm7', from: 'them', text: 'Pessoal, o deadline interno do front-end continua sexta?', time: '2026-05-18T19:44' },
          { id: 'm8', from: 'me',   text: 'Sim, sexta às 23h59. Vou fechar a parte de componentes hoje.', time: '2026-05-18T19:50' },
          { id: 'm9', from: 'them', text: 'Perfeito. Vou cuidar do back-end mock.', time: '2026-05-18T19:52' }
        ]
      },
      {
        id: 'c4', name: 'Helena Castro Nunes', role: 'Professora — ENG203', initials: 'HC', online: false, unread: 0,
        messages: [
          { id: 'm10', from: 'them', text: 'Ana, seu laboratório de modelagem relacional ficou 9,5. Excelente trabalho!', time: '2026-04-16T09:30' }
        ]
      },
      {
        id: 'c5', name: 'Biblioteca Central', role: 'Atendimento', initials: 'BC', online: false, unread: 1,
        messages: [
          { id: 'm11', from: 'them', text: 'O seu pedido de reserva do livro "Fundamentos de Algoritmos" foi aprovado.', time: '2026-05-14T11:05' }
        ]
      }
    ],

    /* ---------- Materiais das disciplinas ---------- */
    materials: [
      { id: 'm1', disciplineId: 'd1', title: 'Aula 01 — Introdução à complexidade', type: 'Slides',  size: '2,4 MB', date: '2026-02-10', teacher: 'Marcos Vinícius Alves', downloads: 38 },
      { id: 'm2', disciplineId: 'd1', title: 'Lista de exercícios — Capítulo 1',    type: 'PDF',     size: '780 KB', date: '2026-02-17', teacher: 'Marcos Vinícius Alves', downloads: 41 },
      { id: 'm3', disciplineId: 'd1', title: 'Gravação da aula de Grafos',           type: 'Vídeo',   size: '182 MB', date: '2026-05-12', teacher: 'Marcos Vinícius Alves', downloads: 27 },
      { id: 'm4', disciplineId: 'd1', title: 'Apostila — Árvores binárias',          type: 'PDF',     size: '3,1 MB', date: '2026-04-05', teacher: 'Marcos Vinícius Alves', downloads: 35 },
      { id: 'm5', disciplineId: 'd2', title: 'Script de criação do banco de dados',  type: 'Código',  size: '12 KB',  date: '2026-03-02', teacher: 'Helena Castro Nunes',   downloads: 29 },
      { id: 'm6', disciplineId: 'd2', title: 'Slides — Normalização até 3FN',         type: 'Slides',  size: '1,8 MB', date: '2026-04-14', teacher: 'Helena Castro Nunes',   downloads: 33 },
      { id: 'm7', disciplineId: 'd2', title: 'Modelagem — ER do projeto de e-commerce', type: 'PDF', size: '940 KB', date: '2026-03-25', teacher: 'Helena Castro Nunes', downloads: 22 },
      { id: 'm8', disciplineId: 'd3', title: 'Vídeo — Integrais por substituição',    type: 'Vídeo',   size: '96 MB',  date: '2026-04-22', teacher: 'Roberto Ayres Lima',   downloads: 31 },
      { id: 'm9', disciplineId: 'd3', title: 'Exercícios — Capítulo 4 (integrais)',  type: 'PDF',     size: '620 KB', date: '2026-05-06', teacher: 'Roberto Ayres Lima',   downloads: 44 },
      { id: 'm10',disciplineId: 'd4', title: 'Planilha de dados — Enem 2025',         type: 'Planilha',size: '4,5 MB', date: '2026-03-18', teacher: 'Carla Menezes Braga',   downloads: 19 },
      { id: 'm11',disciplineId: 'd4', title: 'Slides — Testes de hipótese',           type: 'Slides',  size: '2,0 MB', date: '2026-04-20', teacher: 'Carla Menezes Braga',   downloads: 26 },
      { id: 'm12',disciplineId: 'd5', title: 'Lei Geral de Proteção de Dados (PDG)', type: 'Documento',size: '1,2 MB', date: '2026-02-25', teacher: 'Fernanda Lopes Cardoso',downloads: 30 },
      { id: 'm15',disciplineId: 'd7', title: 'Template — Plano de gestão de projeto', type: 'Documento',size: '640 KB', date: '2026-03-20', teacher: 'Thiago Santana Vieira',downloads: 21 },
      { id: 'm16',disciplineId: 'd8', title: 'Roteiro de laboratório — Incerteza',    type: 'PDF',     size: '1,1 MB', date: '2026-02-28', teacher: 'Yuri Batalha Silva',   downloads: 18 }
    ],

    /* ---------- Calendário acadêmico ---------- */
    events: [
      { id: 'e1', title: 'Início das aulas — 1º semestre 2026',   date: '2026-02-09', type: 'aula',    disciplineId: null, location: 'Campus Vila Mariana' },
      { id: 'e2', title: 'Feriado — Carnaval',                     date: '2026-02-16', type: 'feriado', disciplineId: null, location: '—' },
      { id: 'e3', title: 'Semana de provas — 1ª avaliação',      date: '2026-03-23', type: 'prova',   disciplineId: null, location: 'Salas de aula' },
      { id: 'e4', title: 'Entrega do relatório de laboratório 1', date: '2026-04-12', type: 'prazo',   disciplineId: 'd8', location: 'Portal AVA' },
      { id: 'e5', title: 'Seminário — LGPD',                       date: '2026-03-20', type: 'evento',  disciplineId: 'd5', location: 'Sala 012' },
      { id: 'e6', title: 'Reunião de representantes de turma',     date: '2026-05-10', type: 'evento',  disciplineId: null, location: 'Sala 220' },
      { id: 'e7', title: 'Feriado — Corpus Christi',               date: '2026-06-04', type: 'feriado', disciplineId: null, location: '—' },
      { id: 'e8', title: 'Prova 2 — Grafos e ordenação',           date: '2026-05-19', type: 'prova',   disciplineId: 'd1', location: 'Lab 302' },
      { id: 'e9', title: 'Prazo final do trabalho de conclusão',  date: '2026-06-18', type: 'prazo',   disciplineId: null, location: 'Portal AVA' },
      { id: 'e10',title: 'Conselho de classe',                    date: '2026-06-25', type: 'evento',  disciplineId: null, location: 'Auditório' },
      { id: 'e11',title: 'Fim das aulas do 1º semestre',           date: '2026-06-30', type: 'aula',    disciplineId: null, location: 'Campus Vila Mariana' },
      { id: 'e12',title: 'Prova 2 — Integrais',                    date: '2026-05-27', type: 'prova',   disciplineId: 'd3', location: 'Sala 108' }
    ],
    eventTypes: {
      aula: 'Aula', prova: 'Prova', prazo: 'Prazo', evento: 'Evento', feriado: 'Feriado'
    },

    /* ---------- Documentos do aluno ---------- */
    documents: [
      { id: 'doc1', title: 'Comprovante de matrícula 2026/1',       type: 'Matrícula',   format: 'PDF',  size: '284 KB', date: '2026-02-04', status: 'valido',     code: 'MAT-2026-1-87455' },
      { id: 'doc2', title: 'Contrato de prestação de serviços',     type: 'Contrato',    format: 'PDF',  size: '1,1 MB', date: '2026-02-04', status: 'valido',     code: 'CTR-2026-1-31810' },
      { id: 'doc3', title: 'Histórico escolar parcial',             type: 'Histórico',   format: 'PDF',  size: '412 KB', date: '2026-04-28', status: 'valido',     code: 'HIS-2026-1-03452' },
      { id: 'doc4', title: 'Declaração de matrícula em dia',        type: 'Declaração',  format: 'PDF',  size: '96 KB',  date: '2026-05-20', status: 'valido',     code: 'DEC-2026-1-12907' },
      { id: 'doc5', title: 'Comprovante de endereço',                type: 'Identidade',  format: 'PDF',  size: '150 KB', date: '2026-02-04', status: 'valido',     code: 'END-2026-1-00771' },
      { id: 'doc6', title: 'Termo de estágio — versão 2025',         type: 'Estágio',     format: 'DOCX', size: '220 KB', date: '2025-08-14', status: 'vencido',    code: 'EST-2025-2-44310' },
      { id: 'doc7', title: 'Requerimento de bolsa de pesquisa 2026', type: 'Requerimento',format: 'PDF',  size: '188 KB', date: '2026-04-11', status: 'em-analise', code: 'REQ-2026-1-55021' },
      { id: 'doc8', title: 'Diploma de ensino médio',                 type: 'Diploma',     format: 'PDF',  size: '2,3 MB', date: '2024-12-20', status: 'valido',     code: 'DIP-2024-2-99310' }
    ],

    /* ---------- Biblioteca ---------- */
    library: {
      loans: [
        { id: 'l1', title: 'Fundamentos de Algoritmos',       author: 'Cormen, T. H. et al.', isbn: '978-85-221-4407-4', category: 'Computação', due: '2026-06-12', status: 'emprestado' },
        { id: 'l2', title: 'Banco de Dados Relacionais',       author: 'Heuser, C. A.',         isbn: '978-85-203-3998-8', category: 'Computação', due: '2026-05-30', status: 'emprestado' },
        { id: 'l3', title: 'Introdução à Ciência da Computação', author: 'Brookshear, J. P.',  isbn: '978-85-385-4200-2', category: 'Computação', due: '2026-04-10', status: 'devolvido' },
        { id: 'l4', title: 'Cálculo — Volume 1',               author: 'James Stewart',       isbn: '978-85-221-3580-1', category: 'Matemática', due: '2026-06-25', status: 'reservado' }
      ],
      reservations: 2,
      availableHours: '08:00 às 22:00',
      sections: [
        { name: 'Acervo Geral',         icon: 'library',   items: '18.420 títulos', desc: 'Coleções de ciências humanas, exatas e naturais.' },
        { name: 'Acervo de Computação', icon: 'grid',      items: '2.310 títulos',  desc: 'Livros, periódicos e normas técnicas da área de TI.' },
        { name: 'Periódicos',            icon: 'book',      items: '640 títulos',    desc: 'Revistas científicas com acesso online via Portal CAPES.' },
        { name: 'Multimeia',             icon: 'video',     items: '1.200 itens',    desc: 'DVDs, CDs e conteúdos em streaming.' },
        { name: 'Acervo de Estágio',     icon: 'briefcase', items: '420 títulos',   desc: 'Guias, relatórios e referências para estágios.' },
        { name: 'Mapas e Atlas',         icon: 'pin',       items: '310 itens',      desc: 'Acervo geográfico e cartográfico digital.' }
      ],
      bases: [
        { name: 'Elsevier Engineering Village', access: 'Assinatura institucional', status: 'ativo' },
        { name: 'ACM Digital Library',           access: 'Assinatura institucional', status: 'ativo' },
        { name: 'IEEE Xplore',                   access: 'Assinatura institucional', status: 'ativo' },
        { name: 'Portal CAPES',                  access: 'Via proxy da biblioteca',  status: 'ativo' },
        { name: 'SciELO',                       access: 'Acesso livre',             status: 'ativo' }
      ]
    },

    /* ---------- Área do professor ---------- */
    professor: {
      disciplines: ['d1'],
      classes: [
        { code: 'ENG101', name: 'Algoritmos e Estruturas de Dados', students: 42, avg: 7.8, room: 'Lab 302', studentsList: ['Ana Beatriz Nogueira', 'Bruno Cardoso Menezes', 'Camila Duarte Reis', 'Diego Ferraz Alves', 'Eduarda Prado Lima', 'Felipe Rocha Torres', 'Gabriela Nunes Souza', 'Henrique Salles Braga'] }
      ],
      pending: 3
    },

    /* ---------- Área da coordenação ---------- */
    coordination: {
      totalStudents: 128, activeStudents: 124, avgAge: 24,
      byShift: [
        { label: 'Matutino', value: 42 }, { label: 'Vespertino', value: 46 }, { label: 'Noturno', value: 40 }
      ],
      byCourse: [
        { label: 'Engenharia de Software', value: 68 },
        { label: 'Análise e Desenvolvimento de Sistemas', value: 42 },
        { label: 'Ciência da Computação', value: 18 }
      ],
      indicators: [
        { label: 'Taxa de aprovação',    value: '87,4%', delta: '+2,1%',  trend: 'up',   icon: 'trend' },
        { label: 'Alunos em risco',      value: '9',      delta: '-3',     trend: 'down', icon: 'alert' },
        { label: 'Evasão no semestre',   value: '1,8%',   delta: '-0,4%',  trend: 'down', icon: 'user-check' },
        { label: 'Carga horária média',  value: '28h',    delta: 'estável',trend: 'flat', icon: 'clock' }
      ],
      pendingDocs: 7,
      schedules: [
        { code: 'ENG101', teacher: 'Marcos Vinícius Alves',   students: 42, occupancy: 88, status: 'ok' },
        { code: 'ENG203', teacher: 'Helena Castro Nunes',    students: 38, occupancy: 79, status: 'ok' },
        { code: 'MAT201', teacher: 'Roberto Ayres Lima',     students: 51, occupancy: 96, status: 'atencao' },
        { code: 'EST104', teacher: 'Carla Menezes Braga',     students: 29, occupancy: 61, status: 'ok' },
        { code: 'HUM110', teacher: 'Fernanda Lopes Cardoso', students: 44, occupancy: 92, status: 'atencao' },
        { code: 'GES100', teacher: 'Thiago Santana Vieira',  students: 33, occupancy: 69, status: 'ok' },
        { code: 'FIS105', teacher: 'Yuri Batalha Silva',      students: 40, occupancy: 83, status: 'ok' }
      ]
    }
  };

  global.AVA = global.AVA || {};
  global.AVA.DATA = DATA;
})(window);
