// ─────────────────────────────────────────────
//  CONFIGURAÇÃO — troque só estas duas linhas
// ─────────────────────────────────────────────
export const CONFIG = {
  CTA_URL: 'https://SEU-LINK-DE-VENDA-AQUI.com',
  CTA_LABEL: 'Quero o Método 6 Caixas',
  CTA_URL_DIVIDA: 'https://SEU-LINK-PLANO-DIVIDA-AQUI.com', // link alternativo para endividados
}

// ─────────────────────────────────────────────
//  UTILITÁRIOS
// ─────────────────────────────────────────────
export function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor || 0)
}

// ─────────────────────────────────────────────
//  NÍVEL DE RISCO
// ─────────────────────────────────────────────
function calcularRisco(dias, percentualGasto) {
  if (percentualGasto >= 100 || dias <= 10) {
    return {
      nivel: 'vermelho',
      label: 'Ciclo Crítico',
      cor: '#dc2626',
      fundo: '#fef2f2',
      borda: '#fecaca',
    }
  }
  if (dias <= 20 || percentualGasto >= 90) {
    return {
      nivel: 'amarelo',
      label: 'Ciclo de Risco',
      cor: '#d97706',
      fundo: '#fffbeb',
      borda: '#fde68a',
    }
  }
  return {
    nivel: 'verde',
    label: 'Ciclo Estável',
    cor: '#16a34a',
    fundo: '#f0fdf4',
    borda: '#bbf7d0',
  }
}

// ─────────────────────────────────────────────
//  ANÁLISE DE RENDA
// ─────────────────────────────────────────────
function calcularAnaliseRenda(receita, totalGastos) {
  const percentual = totalGastos > 0 ? (totalGastos / receita) * 100 : 0
  const rendaMinimaIdeal = totalGastos / 0.7 // gastos devem ser no máx 70% da renda
  const rendaFaltante = Math.max(0, rendaMinimaIdeal - receita)
  const precisaAumentarRenda = receita < rendaMinimaIdeal && totalGastos > 0

  let tipoProblema, titulo, corpo, cor

  if (totalGastos > receita) {
    tipoProblema = 'deficit'
    titulo = 'Suas despesas superam sua renda'
    corpo =
      'Você está num ciclo deficitário: cada mês fecha com saldo negativo, e isso tende a se acumular em forma de dívida. Antes de estruturar as 6 caixas, o passo zero é fechar esse buraco — e o Método mostra exatamente como fazer isso de forma progressiva.'
    cor = '#dc2626'
  } else if (percentual > 85) {
    tipoProblema = 'compressao'
    titulo = 'Sua renda está quase toda comprometida'
    corpo =
      'Você ganha e gasta praticamente o mesmo — sem margem para investir, poupar ou reagir a imprevistos. Esse padrão não é falta de disciplina: é um ciclo de compressão financeira. O Método 6 Caixas cria a estrutura para você ter destinos claros para cada parte da renda antes de gastar.'
    cor = '#d97706'
  } else if (percentual > 70) {
    tipoProblema = 'organizacao'
    titulo = 'Você tem margem — mas ela some sem destino'
    corpo =
      'Seu comprometimento de renda ainda está num nível administrável, mas sem estrutura o dinheiro "sobra" e desaparece. O Método 6 Caixas transforma essa sobra em patrimônio: cada real tem um destino antes de você tocar nele.'
    cor = '#f97316'
  } else {
    tipoProblema = 'otimizacao'
    titulo = 'Sua base financeira está saudável'
    corpo =
      'Você já tem uma boa proporção entre renda e gastos. O próximo nível é garantir que a margem que sobra esteja construindo algo — reserva, investimento, liberdade. O Método 6 Caixas faz isso de forma automática e sem esforço diário.'
    cor = '#16a34a'
  }

  return { tipoProblema, titulo, corpo, cor, rendaFaltante, rendaMinimaIdeal, precisaAumentarRenda }
}

// ─────────────────────────────────────────────
//  ANÁLISE 6 CAIXAS
// ─────────────────────────────────────────────
const CAIXAS_CONFIG = [
  {
    nome: 'Necessidades',
    descricao: 'Moradia, alimentação, transporte',
    icone: '🏠',
    idealPct: 55,
    campo: 'necessidades',
  },
  {
    nome: 'Lazer',
    descricao: 'Entretenimento, saídas, hobbies',
    icone: '🎯',
    idealPct: 10,
    campo: 'lazer',
  },
  {
    nome: 'Educação',
    descricao: 'Cursos, livros, desenvolvimento',
    icone: '📚',
    idealPct: 10,
    campo: 'educacao',
  },
  {
    nome: 'Reserva de Emergência',
    descricao: 'Proteção para imprevistos',
    icone: '🛡️',
    idealPct: 10,
    campo: 'reserva',
  },
  {
    nome: 'Investimentos',
    descricao: 'Construção de patrimônio',
    icone: '📈',
    idealPct: 10,
    campo: 'investimentos',
  },
  {
    nome: 'Generosidade',
    descricao: 'Doações, presentes, contribuições',
    icone: '❤️',
    idealPct: 5,
    campo: 'generosidade',
  },
]

function calcularAnalise6Caixas(respostas, receita) {
  return CAIXAS_CONFIG.map((caixa) => {
    const rawValor = parseFloat(respostas[caixa.campo]) || 0
    // lazer: se não preenchido, fica zero (não usa fallback)
    const realValor = rawValor
    const idealValor = (receita * caixa.idealPct) / 100
    const realPct = receita > 0 ? Math.round((realValor / receita) * 100) : 0
    const diff = realValor - idealValor

    let status, cor, fundo, borda, label, alerta

    if (realValor === 0) {
      status = 'zerado'
      cor = '#6b7280'
      fundo = '#f9fafb'
      borda = '#e5e7eb'
      label = 'Não alocado'
      alerta = `Nenhum valor destinado para ${caixa.nome.toLowerCase()} — esse destino está invisível no seu orçamento.`
    } else if (diff > idealValor * 0.3) {
      status = 'risco'
      cor = '#dc2626'
      fundo = '#fef2f2'
      borda = '#fecaca'
      label = `+${Math.round(((realValor - idealValor) / idealValor) * 100)}% acima`
      alerta = `${caixa.nome} está consumindo ${formatarMoeda(realValor - idealValor)} a mais do que o ideal.`
    } else if (diff < -idealValor * 0.3) {
      status = 'baixo'
      cor = '#d97706'
      fundo = '#fffbeb'
      borda = '#fde68a'
      label = `${Math.round(((idealValor - realValor) / idealValor) * 100)}% abaixo`
      alerta = `Você está investindo menos do que deveria em ${caixa.nome.toLowerCase()}.`
    } else {
      status = 'ok'
      cor = '#16a34a'
      fundo = '#f0fdf4'
      borda = '#bbf7d0'
      label = 'No caminho certo'
      alerta = null
    }

    return {
      ...caixa,
      realValor,
      idealValor,
      realPct,
      status,
      cor,
      fundo,
      borda,
      label,
      alerta,
    }
  })
}

// ─────────────────────────────────────────────
//  CALCULAR GASTOS (cartão separado das caixas)
// ─────────────────────────────────────────────
function calcularTotalGastos(respostas) {
  const caixasTotal = CAIXAS_CONFIG.reduce((acc, c) => {
    // lazer: só inclui se preenchido
    const val = parseFloat(respostas[c.campo]) || 0
    return acc + val
  }, 0)

  // cartão de crédito é separado — pode haver sobreposição com as caixas,
  // mas representa o padrão de uso real do usuário
  const cartao = parseFloat(respostas.cartao) || 0

  // Usa o maior entre a soma das caixas e a soma das caixas + cartão se cartão > 0
  // Lógica: cartão pode ser pago com o que já está nas caixas (necessidades/lazer),
  // então evitamos dupla contagem. Usamos cartão como proxy apenas se for maior.
  const totalSemCartao = caixasTotal
  const totalComCartao = Math.max(caixasTotal, cartao)

  // Se o usuário preencheu cartão, consideramos o maior valor como base real
  return cartao > 0 ? totalComCartao : totalSemCartao
}

// ─────────────────────────────────────────────
//  DIAGNÓSTICO — texto de ciclo e transformação
// ─────────────────────────────────────────────
function gerarTextoDiagnostico(risco, percentualGasto, dias, analiseRenda) {
  const { tipoProblema } = analiseRenda
  const endividado = percentualGasto >= 100 || tipoProblema === 'deficit'

  // Título e análise baseados no ciclo
  let titulo, analise

  if (endividado) {
    titulo = 'Você está num ciclo de déficit — e ele tem saída'
    analise =
      'Seus gastos superam sua renda, o que cria um ciclo que se auto-alimenta: falta dinheiro, você usa crédito, os juros aumentam os gastos do mês seguinte, e o ciclo continua. Isso não é falta de esforço — é estrutura. O primeiro passo é mapear esse ciclo com clareza e criar um plano de saída antes de aplicar o Método 6 Caixas.'
  } else if (risco.nivel === 'vermelho') {
    titulo = 'Seu dinheiro está num ciclo de esgotamento'
    analise =
      'Praticamente toda a sua renda vai para gastos imediatos — sem reserva, sem investimento, sem margem. Não é falta de força de vontade: é falta de estrutura. Quando o dinheiro não tem destino definido, ele some. O Método 6 Caixas quebra esse ciclo dando um endereço para cada real antes que você gaste.'
  } else if (risco.nivel === 'amarelo') {
    titulo = 'Você está no limiar — e pode virar dos dois lados'
    analise =
      'Seu caixa ainda se mantém positivo, mas a margem é pequena. Qualquer imprevisto — uma conta extra, um mês de venda fraca — pode empurrar você para o déficit. Esse é o momento certo de estruturar: quando ainda tem margem para criar o hábito sem pressão.'
  } else {
    titulo = 'Sua base está firme — agora é hora de construir'
    analise =
      'Você já tem o controle básico: gasta menos do que ganha. Mas "sobrar dinheiro" sem um destino definido raramente se transforma em patrimônio. O próximo ciclo é o virtuoso: cada real com um endereço, compondo ao longo do tempo.'
  }

  return { titulo, analise }
}

// ─────────────────────────────────────────────
//  CTA — diferenciado para endividados vs organizados
// ─────────────────────────────────────────────
function gerarCTA(percentualGasto, analiseRenda) {
  const endividado = percentualGasto >= 100 || analiseRenda.tipoProblema === 'deficit'

  if (endividado) {
    return {
      ctaTitulo: 'Antes do Método, existe um passo zero',
      ctaTexto:
        'Quem está com gastos maiores que a renda não pode aplicar o Método 6 Caixas diretamente — e tentar fazer isso sem sair do déficit não funciona. O Método inclui um plano de saída da dívida: um caminho de 3 a 6 meses para fechar o buraco e então estruturar as 6 caixas com a renda que você já tem.',
      ctaLabel: 'Ver o plano de saída da dívida',
      ctaUrl: CONFIG.CTA_URL_DIVIDA,
      ctaDestaque: true,
    }
  }

  return {
    ctaTitulo: 'O Método 6 Caixas resolve exatamente o que você acabou de ver.',
    ctaTexto:
      'Uma estrutura que divide sua renda em 6 destinos antes de você gastar — necessidades, lazer, educação, reserva, investimento e generosidade. Quando cada real tem um endereço, o ciclo muda.',
    ctaLabel: CONFIG.CTA_LABEL,
    ctaUrl: CONFIG.CTA_URL,
    ctaDestaque: false,
  }
}

// ─────────────────────────────────────────────
//  INSIGHT — frase de fechamento por nível
// ─────────────────────────────────────────────
function gerarInsight(risco, dias, percentualGasto) {
  if (percentualGasto >= 100) {
    return 'Todo ciclo tem um ponto de virada. O diagnóstico que você acabou de fazer é esse ponto — agora você enxerga o padrão com clareza. O próximo passo é estruturar a saída.'
  }
  if (risco.nivel === 'vermelho') {
    return `Com ${dias} dias de caixa, qualquer imprevisto pode fechar o mês no vermelho. Mas padrões que levaram anos para se formar podem ser revertidos em meses com a estrutura certa.`
  }
  if (risco.nivel === 'amarelo') {
    return `${dias} dias de caixa é uma margem que pode crescer — ou encolher. A diferença está em ter ou não uma estrutura que trabalha antes de você gastar.`
  }
  return `${dias} dias de caixa é um bom ponto de partida. Com as 6 caixas estruturadas, esse número cresce naturalmente mês a mês.`
}

// ─────────────────────────────────────────────
//  FUNÇÃO PRINCIPAL
// ─────────────────────────────────────────────
export function gerarDiagnostico(respostas) {
  const receita = parseFloat(respostas.receita) || 0
  const totalGastos = calcularTotalGastos(respostas)
  const sobra = receita - totalGastos
  const percentualGasto = receita > 0 ? Math.round((totalGastos / receita) * 100) : 0

  // Dias de caixa
  const gastosDiarios = totalGastos / 30
  const diasRaw = gastosDiarios > 0 ? Math.round(sobra / gastosDiarios) : 999
  const dias = Math.max(0, Math.min(diasRaw, 999))
  const diasTexto = dias >= 999 ? '∞' : String(dias)

  const risco = calcularRisco(dias, percentualGasto)
  const analiseRenda = calcularAnaliseRenda(receita, totalGastos)
  const analise6caixas = calcularAnalise6Caixas(respostas, receita)
  const { titulo, analise } = gerarTextoDiagnostico(risco, percentualGasto, dias, analiseRenda)
  const insight = gerarInsight(risco, dias, percentualGasto)
  const cta = gerarCTA(percentualGasto, analiseRenda)

  return {
    receita,
    totalGastos,
    sobra,
    percentualGasto,
    dias,
    diasTexto,
    risco,
    titulo,
    analise,
    insight,
    analiseRenda,
    analise6caixas,
    // CTA diferenciado
    ctaTitulo: cta.ctaTitulo,
    ctaTexto: cta.ctaTexto,
    ctaLabel: cta.ctaLabel,
    ctaUrl: cta.ctaUrl,
    ctaDestaque: cta.ctaDestaque,
  }
}
