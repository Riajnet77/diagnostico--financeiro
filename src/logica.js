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
    return { nivel: 'vermelho', label: 'Risco crítico', cor: '#dc2626', fundo: '#fef2f2', borda: '#fecaca' }
  if (dias <= 15 || percentual >= 95)
    return { nivel: 'vermelho', label: 'Risco alto', cor: '#dc2626', fundo: '#fef2f2', borda: '#fecaca' }
  if (dias <= 30 || percentual >= 85)
    return { nivel: 'amarelo', label: 'Atenção', cor: '#d97706', fundo: '#fffbeb', borda: '#fde68a' }
  return { nivel: 'verde', label: 'Caixa saudável', cor: '#16a34a', fundo: '#f0fdf4', borda: '#bbf7d0' }
}

export function gerarDiagnostico(respostas) {
  const { receita, tipoRenda, problema } = respostas
  const { totalFixos, totalCartao, totalVariaveis, totalGastos } = calcularTotais(respostas)

  const percentualGasto     = Math.round((totalGastos / receita) * 100)
  const percentualFixos     = Math.round((totalFixos / receita) * 100)
  const percentualCartao    = Math.round((totalCartao / receita) * 100)
  const percentualVariaveis = Math.round((totalVariaveis / receita) * 100)
  const sobra               = receita - totalGastos
  const dias                = calcularDias(receita, totalGastos)
  const risco               = calcularRisco(dias, percentualGasto)

  const alertas = []
  if (percentualCartao > 30) alertas.push(`Seu cartão consome ${percentualCartao}% da sua renda.`)
  if (percentualFixos > 60)  alertas.push(`Seus fixos comprometem ${percentualFixos}% da renda.`)
  if (sobra < 0)             alertas.push(`Você gasta ${formatarMoeda(Math.abs(sobra))} a mais do que ganha.`)

  const titulos = {
    a: 'Seu dinheiro vai acabar antes do mês terminar.',
    b: 'Seu dinheiro some sem deixar rastro.',
    c: 'Você ganha bem — mas o dinheiro não aparece no fim do mês.',
    d: 'Renda instável sem estrutura é uma bomba-relógio.',
  }

  const analises = {
    a: `Você compromete ${percentualGasto}% da sua renda — sendo ${percentualFixos}% fixos e ${percentualCartao}% no cartão. ${sobra <= 0 ? 'Seu caixa já está negativo.' : `Sobram apenas ${formatarMoeda(sobra)} por mês.`} O dinheiro não está sumindo por acaso.`,
    b: `Você ganha ${formatarMoeda(receita)} e compromete ${percentualGasto}% com gastos. ${percentualCartao > 20 ? `Só no cartão já vão ${percentualCartao}% da sua renda.` : 'Sem destino definido para cada real, o dinheiro se dissolve.'}`,
    c: `Você tem ${formatarMoeda(receita)} de receita mas compromete ${percentualGasto}%. ${percentualCartao > 25 ? `O cartão é o principal vilão: ${percentualCartao}% da renda vai para lá.` : 'A sensação de que não sobra nada vai continuar sem um método.'}`,
    d: `Renda variável com ${percentualGasto}% de comprometimento: qualquer mês fraco vira crise. ${totalCartao > 0 ? `Com ${formatarMoeda(totalCartao)} no cartão todo mês, não há margem de segurança.` : 'Você precisa de um caixa de proteção agora.'}`,
  }

  const insights = {
    verde:    'Seu caixa ainda tem fôlego, mas sem estrutura qualquer imprevisto muda esse cenário.',
    amarelo:  'Você está na zona de alerta. Com o Método 6 Caixas, cada real tem um destino antes de você gastar.',
    vermelho: 'Você precisa de uma estrutura agora — não amanhã. O Método 6 Caixas foi criado exatamente para isso.',
  }

  return {
    dias: dias > 365 ? 365 : dias < 0 ? 0 : dias,
    diasTexto: dias > 365 ? '365+' : dias <= 0 ? '0' : String(dias),
    risco, percentualGasto, percentualFixos, percentualCartao, percentualVariaveis,
    sobra, receita, totalGastos, totalFixos, totalCartao, totalVariaveis,
    tipoRenda, problema, alertas,
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
