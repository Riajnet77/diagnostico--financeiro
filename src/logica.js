export const CONFIG = {
  CTA_URL: 'https://metodo6caixas.vercel.app',
  CTA_LABEL: 'Quero o Método 6 Caixas',
}

export function calcularDiasSobrevivencia(receita, gastos) {
  if (!gastos || gastos <= 0) return 999
  const saldo = receita - gastos
  if (saldo <= 0) return 0
  const mediaDiaria = gastos / 30
  return Math.floor(saldo / mediaDiaria)
}

export function calcularRisco(dias, percentualGasto) {
  if (dias <= 0 || percentualGasto >= 100)
    return { nivel: 'vermelho', label: 'Risco crítico', cor: '#dc2626', fundo: '#fef2f2', borda: '#fecaca' }
  if (dias <= 15 || percentualGasto >= 95)
    return { nivel: 'vermelho', label: 'Risco alto', cor: '#dc2626', fundo: '#fef2f2', borda: '#fecaca' }
  if (dias <= 30 || percentualGasto >= 85)
    return { nivel: 'amarelo', label: 'Atenção', cor: '#d97706', fundo: '#fffbeb', borda: '#fde68a' }
  return { nivel: 'verde', label: 'Caixa saudável', cor: '#16a34a', fundo: '#f0fdf4', borda: '#bbf7d0' }
}

export function gerarDiagnostico(respostas) {
  const { receita, gastos, tipoRenda, problema } = respostas
  const percentualGasto = Math.round((gastos / receita) * 100)
  const sobra = receita - gastos
  const dias = calcularDiasSobrevivencia(receita, gastos)
  const risco = calcularRisco(dias, percentualGasto)

  // Título personalizado por perfil
  const titulos = {
    a: 'Seu dinheiro vai acabar antes do mês terminar.',
    b: 'Seu dinheiro some sem deixar rastro.',
    c: 'Você ganha bem — mas o dinheiro não aparece no fim do mês.',
    d: 'Renda instável sem estrutura é uma bomba-relógio.',
  }

  // Análise detalhada
  const analises = {
    a: `Você compromete ${percentualGasto}% da sua renda com gastos. Com esse ritmo, ${sobra <= 0 ? 'seu caixa já está negativo' : `sobram apenas ${formatarMoeda(sobra)} por mês`}. O problema não é ganhar pouco — é não ter uma estrutura que proteja seu caixa antes de você gastar.`,
    b: `Você ganha ${formatarMoeda(receita)} e gasta ${formatarMoeda(gastos)}, comprometendo ${percentualGasto}% da sua renda. Sem uma divisão clara de destino para cada real, o dinheiro se dissolve em gastos invisíveis. Você não tem problema de renda — tem problema de organização.`,
    c: `Ganhar bem sem método é o perfil mais perigoso. Você tem ${formatarMoeda(receita)} de receita mas compromete ${percentualGasto}% com gastos. A sensação de que "não sobra nada" é real — e vai continuar enquanto não houver um destino definido para cada parte do seu dinheiro.`,
    d: `Renda variável sem estrutura significa que qualquer mês fraco vira crise. Você precisa de um caixa de proteção funcionando antes de qualquer outra coisa. Sem isso, um mês abaixo da média compromete tudo.`,
  }

  // Insight das 6 caixas
  const insights = {
    verde: 'Seu caixa ainda tem fôlego, mas sem uma estrutura de divisão, qualquer imprevisto pode mudar esse cenário rapidamente.',
    amarelo: 'Você está na zona de alerta. Com o Método 6 Caixas, você redistribui sua renda de forma que cada parte tenha um destino — e seu caixa para de apertar.',
    vermelho: 'Este é o diagnóstico que mais importa ter. Você precisa de uma estrutura agora — não amanhã. O Método 6 Caixas foi criado exatamente para sair desse nível.',
  }

  return {
    dias: dias > 365 ? 365 : dias < 0 ? 0 : dias,
    diasTexto: dias > 365 ? '365+' : dias <= 0 ? '0' : String(dias),
    risco,
    percentualGasto,
    sobra,
    receita,
    gastos,
    tipoRenda,
    problema,
    titulo: titulos[problema] || titulos['b'],
    analise: analises[problema] || analises['b'],
    insight: insights[risco.nivel],
    // Distribuição ideal das 6 caixas
    caixas: [
      { nome: 'Necessidades Essenciais', percentual: 55, valor: receita * 0.55, cor: '#f97316' },
      { nome: 'Liberdade Financeira',     percentual: 10, valor: receita * 0.10, cor: '#16a34a' },
      { nome: 'Educação',                 percentual: 10, valor: receita * 0.10, cor: '#2563eb' },
      { nome: 'Reserva de Emergência',    percentual: 10, valor: receita * 0.10, cor: '#7c3aed' },
      { nome: 'Lazer',                    percentual: 10, valor: receita * 0.10, cor: '#db2777' },
      { nome: 'Doação',                   percentual:  5, valor: receita * 0.05, cor: '#0891b2' },
    ],
  }
}

export function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(valor)
}
