export const metrics = [
  { label: 'Oportunidades abertas', value: '28', change: '+12,5%', tone: 'positive' },
  { label: 'Orçamentos enviados', value: '16', change: '+8,2%', tone: 'positive' },
  { label: 'Aguardando retorno', value: '9', change: '3 precisam de atenção', tone: 'warning' },
  { label: 'Valor em negociação', value: 'R$ 8.450', change: ' nos últimos 30 dias', tone: 'neutral' },
]

export const pipeline = [
  { label: 'Novo contato', count: 8, color: '#64748b' },
  { label: 'Em preparação', count: 5, color: '#3b82f6' },
  { label: 'Enviado', count: 7, color: '#8b5cf6' },
  { label: 'Em negociação', count: 4, color: '#d97706' },
  { label: 'Aprovado', count: 4, color: '#0f9f79' },
]

export const recentQuotes = [
  { initials: 'MC', client: 'Mariana Costa', detail: 'Kit de peças personalizadas', value: 'R$ 480,00', status: 'Aguardando retorno', tone: 'warning', date: 'Hoje, 10:42' },
  { initials: 'RA', client: 'Rafael Almeida', detail: 'Placa em acrílico sob medida', value: 'R$ 320,00', status: 'Enviado', tone: 'info', date: 'Hoje, 09:18' },
  { initials: 'BF', client: 'Bruna Ferreira', detail: 'Lembranças personalizadas', value: 'R$ 890,00', status: 'Aprovado', tone: 'success', date: 'Ontem, 16:05' },
  { initials: 'JP', client: 'João Pedro', detail: 'Miniaturas personalizadas', value: 'R$ 210,00', status: 'Em negociação', tone: 'purple', date: 'Ontem, 14:30' },
]
