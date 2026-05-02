export const CONFIG = {
  CTA_URL: 'https://metodo6caixas.vercel.app',
  CTA_LABEL: 'Quero o Método 6 Caixas',
}

export function calcularTotais(respostas) {
  const { fixos, cartao, variaveis } = respostas

  const totalFixos = Object.values(fixos || {}).reduce((a, b) => a + (Number(b) || 0), 0)
  const totalCartao = Number(cartao || 0)
  const totalVariaveis = Object.values(variaveis || {}).reduce((a, b) => a + (Number(b) || 0), 0)
  const totalGastos = totalFixos + totalCartao + totalVariaveis

  return { totalFixos, totalCartao, totalVariaveis, totalGastos }
}

export function calcularDias(receita, totalGastos) {
  if (!totalGastos || totalGastos <= 0) return 999
  const sobra = receita - totalGastos
  if (sobra <= 0) return 0
  const mediaDiaria = totalGastos / 30
  return Math.floor(sobra / mediaDiaria)
}

export function calcularRisco(dias, percentual) {
  if (dias <= 0 || percentual >= 100)
    return { nivel: 'vermelho', label: 'Risco crítico',   cor: '#dc2626', fundo: '#fef2f2', borda: '#fecaca' }
  if (dias <= 15 || percentual >= 95)
    return { nivel: 'vermelho', label: 'Risco alto',      cor: '#dc2626', fundo: '#fef2f2', borda: '#fecaca' }
  if (dias <= 30 || percentual >= 85)
    return { nivel: 'amarelo',  label: 'Atenção',         cor: '#d97706', fundo: '#fffbeb', borda: '#fde68a' }
  return   { nivel: 'verde',   label: 'Caixa saudável',  cor: '#16a34a', fundo: '#f0fdf4', borda: '#bbf7d0' }
}

export function gerarDiagnostico(respostas) {
  const { receita, tipoRenda, problema } = respostas
  const { totalFixos, totalCartao, totalVariaveis, totalGastos } = calcularTotais(respostas)

  const percentualGasto   = Math.round((totalGastos / receita) * 100)
  const percentualFixos   = Math.round((totalFixos / receita) * 100)
  const percentualCartao  = Math.round((totalCartao / receita) * 100)
  const percentualVariaveis = Math.round((totalVariaveis / receita) * 100)
  const sobra             = receita - totalGastos
  const dias              = calcularDias(receita, totalGastos)
  const risco             = calcularRisco(dias, percentualGasto)

  // Alertas específicos
  const alertas = []
  if (percentualCartao > 30) alertas.push(`Seu cartão de crédito consome ${percentualCartao}% da sua renda — isso é o maior risco do seu caixa.`)
  if (percentualFixos > 60)  alertas.push(`Seus compromissos fixos já comprometem ${percentualFixos}% da sua renda — pouco espaço para respirar.`)
  if (sobra < 0)             alertas.push(`Você está gastando ${formatarMoeda(Math.abs(sobra))} a mais do que ganha todo mês.`)
  if (tipoRenda === 'variavel' && percentualGasto > 80) alertas.push('Renda variável com alto comprometimento é a combinação mais perigosa.')

  // Títulos por problema
  const titulos = {
    a: 'Seu dinheiro vai acabar antes do mês terminar.',
    b: 'Seu dinheiro some sem deixar rastro.',
    c: 'Você ganha bem — mas o dinheiro não aparece no fim do mês.',
    d: 'Renda instável sem estrutura é uma bomba-relógio.',
  }

  // Análise por problema
  const analises = {
    a: `Você compromete ${percentualGasto}% da sua renda com gastos — sendo ${percentualFixos}% fixos e ${percentualCartao}% no cartão. Com esse ritmo, ${sobra <= 0 ? 'seu caixa já está negativo' : `sobram apenas ${formatarMoeda(sobra)} por mês`}. O dinheiro não está sumindo por acaso: ele está sendo consumido por compromissos que cresceram mais rápido que a sua renda.`,
    b: `Você ganha ${formatarMoeda(receita)} e compromete ${percentualGasto}% com gastos. O problema não é falta de dinheiro — é falta de visibilidade. ${percentualCartao > 20 ? `Só no cartão de crédito já vão ${percentualCartao}% da sua renda, muitas vezes em gastos que você mal lembra.` : 'Sem um destino definido para cada real, o dinheiro se dissolve em pequenos gastos invisíveis.'}`,
    c: `Ganhar bem sem método é o perfil mais perigoso. Você tem ${formatarMoeda(receita)} de receita mas compromete ${percentualGasto}% com gastos. ${percentualCartao > 25 ? `O cartão de crédito é o principal vilão: ${percentualCartao}% da sua renda vai para lá todo mês.` : 'A sensação de que não sobra nada é real — e vai continuar enquanto não houver um destino definido para cada parte do seu dinheiro.'}`,
    d: `Renda variável com ${percentualGasto}% de comprometimento significa que qualquer mês abaixo da média vira crise. ${totalCartao > 0 ? `Com ${formatarMoeda(totalCartao)} fixos no cartão independente do que entrar, você não tem margem de segurança.` : 'Você precisa de um caixa de proteção funcionando antes de qualquer outra coisa.'}`,
  }

  const insights = {
    verde:    'Seu caixa ainda tem fôlego, mas sem estrutura de divisão, qualquer imprevisto muda esse cenário.',
    amarelo:  'Você está na zona de alerta. Com o Método 6 Caixas, cada real tem um destino antes de você gastar — e seu caixa para de apertar.',
    vermelho: 'Este é o diagnóstico que mais importa ter. Você precisa de uma estrutura agora — não amanhã. O Método 6 Caixas foi criado exatamente para sair desse nível.',
  }

  return {
    dias: dias > 365 ? 365 : dias < 0 ? 0 : dias,
    diasTexto: dias > 365 ? '365+' : dias <= 0 ? '0' : String(dias),
    risco,
    percentualGasto,
    percentualFixos,
    percentualCartao,
    percentualVariaveis,
    sobra,
    receita,
    totalGastos,
    totalFixos,
    totalCartao,
    totalVariaveis,
    tipoRenda,
    problema,
    alertas,
    titulo: titulos[problema] || titulos['b'],
    analise: analises[problema] || analises['b'],
    insight: insights[risco.nivel],
    caixas: [
      { nome: 'Necessidades Essenciais', percentual: 55, valor: receita * 0.55, cor: '#f97316' },
      { nome: 'Liberdade Financeira',    percentual: 10, valor: receita * 0.10, cor: '#16a34a' },
      { nome: 'Educação',                percentual: 10, valor: receita * 0.10, cor: '#2563eb' },
      { nome: 'Reserva de Emergência',   percentual: 10, valor: receita * 0.10, cor: '#7c3aed' },
      { nome: 'Lazer',                   percentual: 10, valor: receita * 0.10, cor: '#db2777' },
      { nome: 'Doação',                  percentual:  5, valor: receita * 0.05, cor: '#0891b2' },
    ],
  }
}

export function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(valor)
}
