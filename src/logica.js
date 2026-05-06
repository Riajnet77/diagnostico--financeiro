export const CONFIG = {
  CTA_URL: 'https://metodo6caixas.vercel.app',
  CTA_LABEL: 'Quero o Método 6 Caixas',
}

export function calcularTotais(respostas) {
  const { fixos, cartao, variaveis } = respostas
  const totalFixos     = Object.values(fixos     || {}).reduce((a, b) => a + (Number(b) || 0), 0)
  const totalCartao    = Number(cartao || 0)
  const totalVariaveis = Object.values(variaveis || {}).reduce((a, b) => a + (Number(b) || 0), 0)
  const totalGastos    = totalFixos + totalCartao + totalVariaveis
  return { totalFixos, totalCartao, totalVariaveis, totalGastos }
}

export function calcularDias(receita, totalGastos) {
  if (!totalGastos || totalGastos <= 0) return 999
  const sobra = receita - totalGastos
  if (sobra <= 0) return 0
  return Math.floor((sobra / totalGastos) * 30)
}

export function calcularRisco(dias, percentual) {
  if (dias <= 0 || percentual >= 100)
    return { nivel: 'vermelho', label: 'Risco crítico',  cor: '#dc2626', fundo: '#fef2f2', borda: '#fecaca' }
  if (dias <= 15 || percentual >= 95)
    return { nivel: 'vermelho', label: 'Risco alto',     cor: '#dc2626', fundo: '#fef2f2', borda: '#fecaca' }
  if (dias <= 30 || percentual >= 85)
    return { nivel: 'amarelo',  label: 'Atenção',        cor: '#d97706', fundo: '#fffbeb', borda: '#fde68a' }
  return   { nivel: 'verde',   label: 'Caixa saudável', cor: '#16a34a', fundo: '#f0fdf4', borda: '#bbf7d0' }
}

// Compara o que o usuário realmente gasta com o ideal do Método 6 Caixas
function gerarAnalise6Caixas(receita, respostas) {
  const { fixos, cartao, variaveis } = respostas
  const f = fixos     || {}
  const v = variaveis || {}
  const c = Number(cartao || 0)

  // Gastos diretos sem cartão
  const fixosEssencial   = Number(f.aluguel||0) + Number(f.contasBasicas||0) + Number(f.internetCelular||0) + Number(f.planoSaude||0) + Number(f.parcelasCredito||0)
  const fixosEducacao    = Number(f.escolaFaculdade||0)
  const variaveisEssencial = Number(v.alimentacao||0) + Number(v.transporte||0)
  const variaveisLazer   = Number(v.lazer||0) + Number(v.roupasCompras||0) + Number(v.assinaturas||0)

  // Distribui cartão conforme uso declarado pelo usuário
  const usoCartao = respostas.usoCartao || 'misto'
  const cartaoEssencial = usoCartao === 'essencial' ? c * 0.80 : usoCartao === 'lazer' ? c * 0.20 : c * 0.50
  const cartaoLazer     = usoCartao === 'essencial' ? c * 0.20 : usoCartao === 'lazer' ? c * 0.80 : c * 0.50

  // Totais por caixa
  const gastoEssencial = fixosEssencial + variaveisEssencial + cartaoEssencial
  const gastoLazer     = variaveisLazer + cartaoLazer
  const gastoEducacao  = fixosEducacao

  // Percentuais reais
  const pEssencial = receita > 0 ? Math.round((gastoEssencial / receita) * 100) : 0
  const pLazer     = receita > 0 ? Math.round((gastoLazer     / receita) * 100) : 0
  const pEducacao  = receita > 0 ? Math.round((gastoEducacao  / receita) * 100) : 0
  const pCartao    = receita > 0 ? Math.round((c / receita) * 100) : 0

  // Ideal do Método
  const idealEssencial = 55
  const idealLF        = 10
  const idealEducacao  = 10
  const idealReserva   = 10
  const idealLazer     = 10
  const idealDoacao    = 5

  // Status de cada caixa: ok, atencao, risco, zerado
  function status(real, ideal) {
    if (real === 0)          return 'zerado'
    if (real <= ideal)       return 'ok'
    if (real <= ideal * 1.2) return 'atencao'
    return 'risco'
  }

  const statusCores = {
    ok:      { cor: '#16a34a', fundo: '#f0fdf4', borda: '#bbf7d0', label: 'Dentro do ideal' },
    atencao: { cor: '#d97706', fundo: '#fffbeb', borda: '#fde68a', label: 'Acima do ideal' },
    risco:   { cor: '#dc2626', fundo: '#fef2f2', borda: '#fecaca', label: 'Muito acima' },
    zerado:  { cor: '#a3a3a3', fundo: '#f9f8f6', borda: '#e5e5e5', label: 'Não alocado' },
  }

  const caixas = [
    {
      nome: 'Necessidades Essenciais',
      icone: '🏠',
      idealPct: idealEssencial,
      idealValor: receita * (idealEssencial / 100),
      realPct: pEssencial,
      realValor: gastoEssencial,
      status: status(pEssencial, idealEssencial),
      descricao: 'Moradia, contas, alimentação, transporte',
      alerta: pEssencial > idealEssencial
        ? `Você compromete ${pEssencial}% com essenciais — ${pEssencial - idealEssencial}pp acima do ideal de ${idealEssencial}%.`
        : null,
    },
    {
      nome: 'Liberdade Financeira',
      icone: '📈',
      idealPct: idealLF,
      idealValor: receita * (idealLF / 100),
      realPct: 0,
      realValor: 0,
      status: 'zerado',
      descricao: 'Investimentos que geram renda passiva',
      alerta: 'Você não está alocando nada para construir liberdade financeira.',
    },
    {
      nome: 'Educação',
      icone: '📚',
      idealPct: idealEducacao,
      idealValor: receita * (idealEducacao / 100),
      realPct: 0,
      realValor: Number(f.escolaFaculdade || 0),
      status: Number(f.escolaFaculdade || 0) > 0 ? 'ok' : 'zerado',
      descricao: 'Cursos, livros, desenvolvimento pessoal',
      alerta: Number(f.escolaFaculdade || 0) === 0
        ? 'Sem investimento em educação, sua capacidade de gerar renda fica estagnada.'
        : null,
    },
    {
      nome: 'Reserva de Emergência',
      icone: '🛡️',
      idealPct: idealReserva,
      idealValor: receita * (idealReserva / 100),
      realPct: 0,
      realValor: 0,
      status: 'zerado',
      descricao: 'Proteção para imprevistos e meses fracos',
      alerta: 'Sem reserva, qualquer imprevisto vira dívida.',
    },
    {
      nome: 'Lazer',
      icone: '🎭',
      idealPct: idealLazer,
      idealValor: receita * (idealLazer / 100),
      realPct: pLazer,
      realValor: gastoLazer,
      status: gastoLazer === 0 ? 'zerado' : status(pLazer, idealLazer),
      descricao: 'Restaurantes, roupas, viagens, entretenimento',
      alerta: pLazer > idealLazer
        ? `Seus gastos com lazer consomem ${pLazer}% da renda — ${pLazer - idealLazer}pp acima do ideal.`
        : gastoLazer === 0 ? 'Nenhum gasto com lazer registrado.' : null,
    },
    {
      nome: 'Doação',
      icone: '🤝',
      idealPct: idealDoacao,
      idealValor: receita * (idealDoacao / 100),
      realPct: 0,
      realValor: 0,
      status: 'zerado',
      descricao: 'Contribuição para causas e pessoas',
      alerta: null,
    },
  ]

  return caixas.map(c => ({ ...c, ...statusCores[c.status] }))
}

export function gerarDiagnostico(respostas) {
  const { receita, tipoRenda, problema } = respostas
  const { totalFixos, totalCartao, totalVariaveis, totalGastos } = calcularTotais(respostas)

  const percentualGasto     = Math.round((totalGastos / receita) * 100)
  const percentualFixos     = Math.round((totalFixos  / receita) * 100)
  const percentualCartao    = Math.round((totalCartao / receita) * 100)
  const percentualVariaveis = Math.round((totalVariaveis / receita) * 100)
  const sobra               = receita - totalGastos
  const dias                = calcularDias(receita, totalGastos)
  const risco               = calcularRisco(dias, percentualGasto)

  const alertas = []
  if (percentualCartao > 30) alertas.push(`Seu cartão consome ${percentualCartao}% da sua renda.`)
  if (percentualFixos > 60)  alertas.push(`Seus fixos comprometem ${percentualFixos}% da renda.`)
  if (sobra < 0)             alertas.push(`Você gasta ${formatarMoeda(Math.abs(sobra))} a mais do que ganha.`)
  if (tipoRenda === 'variavel' && percentualGasto > 80) alertas.push('Renda variável com alto comprometimento é perigoso.')

  const titulos = {
    a: 'Seu dinheiro vai acabar antes do mês terminar.',
    b: 'Seu dinheiro some sem deixar rastro.',
    c: 'Você ganha bem — mas o dinheiro não aparece no fim do mês.',
    d: 'Renda instável sem estrutura é uma bomba-relógio.',
  }

  const analises = {
    a: `Você compromete ${percentualGasto}% da sua renda — sendo ${percentualFixos}% fixos e ${percentualCartao}% no cartão. ${sobra <= 0 ? 'Seu caixa já está negativo.' : `Sobram apenas ${formatarMoeda(sobra)} por mês.`} O dinheiro não está sumindo por acaso.`,
    b: `Você ganha ${formatarMoeda(receita)} e compromete ${percentualGasto}%. ${percentualCartao > 20 ? `Só no cartão já vão ${percentualCartao}% da sua renda.` : 'Sem destino definido para cada real, o dinheiro se dissolve.'}`,
    c: `Você tem ${formatarMoeda(receita)} de receita mas compromete ${percentualGasto}%. ${percentualCartao > 25 ? `O cartão é o principal vilão: ${percentualCartao}% da renda.` : 'Sem um método, a sensação de que não sobra nada vai continuar.'}`,
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
    titulo:  titulos[problema]  || titulos['b'],
    analise: analises[problema] || analises['b'],
    insight: insights[risco.nivel],
    analise6caixas: gerarAnalise6Caixas(receita, respostas),
    analiseRenda: gerarAnaliseRenda(receita, totalGastos, totalFixos, totalVariaveis, totalCartao),
  }
}

export function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(valor)
}

// Calcula se o problema é de renda insuficiente ou só de organização
export function gerarAnaliseRenda(receita, totalGastos, totalFixos, totalVariaveis, totalCartao) {
  const percentualEssencial = Math.round(((totalFixos + totalVariaveis * 0.6) / receita) * 100)
  
  // Renda mínima para os essenciais caberem em 55%
  const essenciais = totalFixos + (totalVariaveis * 0.6)
  const rendaMinimaIdeal = Math.ceil(essenciais / 0.55 / 100) * 100
  const rendaFaltante = Math.max(0, rendaMinimaIdeal - receita)

  // Renda necessária para ter as 6 caixas completas
  const rendaParaMetodoCompleto = Math.ceil(totalGastos / 0.55 / 100) * 100
  const faltaParaMetodoCompleto = Math.max(0, rendaParaMetodoCompleto - receita)

  // Tipo de problema
  let tipoProblema = 'organizacao' // só precisa organizar
  if (percentualEssencial > 70) tipoProblema = 'renda_critica'     // renda insuficiente
  else if (percentualEssencial > 60) tipoProblema = 'renda_baixa'  // renda apertada

  const mensagens = {
    organizacao: {
      titulo: 'Seu problema é de organização — não de renda.',
      corpo: `Você tem renda suficiente para aplicar o Método 6 Caixas. O que falta é estrutura: definir para onde vai cada real antes de gastar.`,
      cor: '#d97706',
    },
    renda_baixa: {
      titulo: 'Sua renda está no limite para cobrir o básico.',
      corpo: `Com ${formatarMoeda(receita)}/mês, seus essenciais já consomem mais de 60% da renda. Para ter fôlego real, você precisaria de mais ${formatarMoeda(rendaFaltante)}/mês — seja reduzindo custos fixos ou aumentando a receita.`,
      cor: '#dc2626',
    },
    renda_critica: {
      titulo: 'Seu problema não é só organização — é renda insuficiente.',
      corpo: `Seus gastos essenciais sozinhos já consomem mais de 70% do que você ganha. Reorganizar as caixas não resolve se não sobra nada para reorganizar. Para o Método funcionar, você precisaria de pelo menos ${formatarMoeda(rendaMinimaIdeal)}/mês — ${formatarMoeda(rendaFaltante)} a mais do que entra hoje.`,
      cor: '#dc2626',
    },
  }

  return {
    tipoProblema,
    rendaMinimaIdeal,
    rendaFaltante,
    rendaParaMetodoCompleto,
    faltaParaMetodoCompleto,
    percentualEssencial,
    precisaAumentarRenda: tipoProblema !== 'organizacao',
    ...mensagens[tipoProblema],
  }
}
