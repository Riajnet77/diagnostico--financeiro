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
    return { nivel: 'vermelho', label: 'Ciclo crítico',  cor: '#dc2626', fundo: '#fef2f2', borda: '#fecaca' }
  if (dias <= 15 || percentual >= 95)
    return { nivel: 'vermelho', label: 'Ciclo de alerta', cor: '#dc2626', fundo: '#fef2f2', borda: '#fecaca' }
  if (dias <= 30 || percentual >= 85)
    return { nivel: 'amarelo',  label: 'Em transição',   cor: '#d97706', fundo: '#fffbeb', borda: '#fde68a' }
  return   { nivel: 'verde',   label: 'Ciclo saudável', cor: '#16a34a', fundo: '#f0fdf4', borda: '#bbf7d0' }
}

function gerarAnalise6Caixas(receita, respostas) {
  const { fixos, cartao, variaveis } = respostas
  const f = fixos     || {}
  const v = variaveis || {}
  const c = Number(cartao || 0)

  // Gastos por caixa — cartão é categoria separada
  const gastoEssencial = Number(f.aluguel||0) + Number(f.contasBasicas||0) + Number(f.internetCelular||0) + Number(f.planoSaude||0) + Number(f.parcelasCredito||0) + Number(v.alimentacao||0) + Number(v.transporte||0)
  const gastoEducacao  = Number(f.escolaFaculdade||0)
  const gastoLazer     = Number(v.lazer||0) + Number(v.roupasCompras||0) + Number(v.assinaturas||0)
  const gastoCartao    = c

  const pEssencial = receita > 0 ? Math.round((gastoEssencial / receita) * 100) : 0
  const pLazer     = receita > 0 ? Math.round((gastoLazer     / receita) * 100) : 0
  const pEducacao  = receita > 0 ? Math.round((gastoEducacao  / receita) * 100) : 0
  const pCartao    = receita > 0 ? Math.round((gastoCartao    / receita) * 100) : 0

  const idealEssencial = 55
  const idealLF        = 10
  const idealEducacao  = 10
  const idealReserva   = 10
  const idealLazer     = 10
  const idealDoacao    = 5

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
        ? `Seus essenciais consomem ${pEssencial}% da renda — ${pEssencial - idealEssencial}pp acima do ideal. Isso deixa pouco espaço para construir prosperidade.`
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
      descricao: 'Investimentos que trabalham por você enquanto dorme',
      alerta: 'Nenhum real está sendo destinado a construir liberdade financeira. Esse é o pilar que transforma renda em patrimônio.',
    },
    {
      nome: 'Educação',
      icone: '📚',
      idealPct: idealEducacao,
      idealValor: receita * (idealEducacao / 100),
      realPct: pEducacao,
      realValor: gastoEducacao,
      status: status(pEducacao, idealEducacao),
      descricao: 'Investimento em você — o ativo que nunca se deprecia',
      alerta: gastoEducacao === 0
        ? 'Sem investir em si mesmo, sua capacidade de gerar renda se mantém estagnada. Educação é o único investimento garantido.'
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
      descricao: 'Sua proteção contra os imprevistos da vida',
      alerta: 'Sem reserva, qualquer imprevisto vira dívida — e dívida vira ciclo vicioso. Esse é o primeiro passo para sair da escassez.',
    },
    {
      nome: 'Prazer Próspero',
      icone: '🎭',
      idealPct: idealLazer,
      idealValor: receita * (idealLazer / 100),
      realPct: pLazer,
      realValor: gastoLazer,
      status: gastoLazer === 0 ? 'zerado' : status(pLazer, idealLazer),
      descricao: 'Gastar sem culpa — prazer com estrutura não é luxo, é necessário',
      alerta: pLazer > idealLazer
        ? `Seus gastos com prazer estão em ${pLazer}% — acima do ideal. O prazer sem estrutura alimenta o ciclo vicioso.`
        : gastoLazer === 0
        ? 'Privar-se de prazer gera compulsão financeira. O método inclui 10% só para você gastar sem culpa.'
        : null,
    },
    {
      nome: 'Doação',
      icone: '🤝',
      idealPct: idealDoacao,
      idealValor: receita * (idealDoacao / 100),
      realPct: 0,
      realValor: 0,
      status: 'zerado',
      descricao: 'Dar e receber são a mesma energia — quem doa, atrai abundância',
      alerta: 'Quem não doa vive com medo de faltar. A doação é a prova de que você confia na abundância.',
    },
    ...(gastoCartao > 0 ? [{
      nome: 'Cartão de Crédito',
      icone: '💳',
      idealPct: 0,
      idealValor: 0,
      realPct: pCartao,
      realValor: gastoCartao,
      status: pCartao > 30 ? 'risco' : 'atencao',
      cor: '#dc2626', fundo: '#fef2f2', borda: '#fecaca',
      label: pCartao > 30 ? 'Risco alto' : 'Atenção',
      descricao: 'Fatura mensal — precisa ser pago com saldo das caixas',
      alerta: `Seu cartão compromete ${pCartao}% da renda. No Método, o cartão é pago com o saldo de cada caixa — nunca com dinheiro do próximo mês.`,
    }] : []),
  ]

  return caixas.map(c => ({ ...c, ...(statusCores[c.status] || {}) }))
}

export function gerarDiagnostico(respostas) {
  const { receita, tipoRenda, problema } = respostas
  const { totalFixos, totalCartao, totalVariaveis, totalGastos } = calcularTotais(respostas)

  const percentualGasto     = Math.round((totalGastos / receita) * 100)
  const percentualFixos     = Math.round((totalFixos  / receita) * 100)
  const percentualCartao    = Math.round((totalCartao / receita) * 100)
  const percentualVariaveis = Math.round((totalVariaveis / receita) * 100)
  const sobra               = receita - totalGastos
  const endividado          = sobra < 0
  const dias                = calcularDias(receita, totalGastos)
  const risco               = calcularRisco(dias, percentualGasto)

  const alertas = []
  if (percentualCartao > 30) alertas.push(`Seu cartão consome ${percentualCartao}% da sua renda — sinal claro do ciclo vicioso em ação.`)
  if (percentualFixos > 60)  alertas.push(`Seus compromissos fixos comprometem ${percentualFixos}% da renda — pouco espaço para prosperar.`)
  if (endividado)            alertas.push(`Você gasta ${formatarMoeda(Math.abs(sobra))} a mais do que ganha todo mês. Isso não é falta de dinheiro — é o ciclo vicioso operando.`)

  // Títulos por problema — linguagem de ciclo
  const titulos = {
    a: 'Você está no ciclo vicioso do aperto mensal.',
    b: 'Seu dinheiro some porque não tem destino — não porque é pouco.',
    c: 'Renda alta com mente de escassez: o ciclo mais silencioso.',
    d: 'Renda instável sem estrutura é uma armadilha que se reinventa todo mês.',
  }

  // Análise por perfil — linguagem de transformação
  const analises = {
    a: endividado
      ? `Você está gastando ${formatarMoeda(Math.abs(sobra))} a mais do que ganha — isso alimenta um ciclo que se aperta a cada mês. A boa notícia: esse ciclo tem um ponto de virada. O Método 6 Caixas começa exatamente aqui: identificando para onde vai cada real antes que ele suma.`
      : `Você compromete ${percentualGasto}% da renda e o dinheiro acaba antes do mês terminar. Esse é o ciclo vicioso clássico — não é sobre ganhar pouco, é sobre não ter estrutura de destino. Quando cada real tem um lugar, o ciclo quebra.`,
    b: `Você ganha ${formatarMoeda(receita)} e ${endividado ? 'ainda assim fica no vermelho' : `sobram apenas ${formatarMoeda(sobra)}`}. O dinheiro não some por acaso — ele segue o caminho de menor resistência. ${percentualCartao > 20 ? `O cartão de crédito é o maior dreno: ${percentualCartao}% da renda vai para lá, muitas vezes sem você perceber.` : 'Sem destino definido, cada real encontra o seu próprio caminho — e esse caminho raramente é a prosperidade.'}`,
    c: `Esse é o perfil mais comum entre quem ganha bem e ainda assim sente escassez. Você tem ${formatarMoeda(receita)} de receita mas ${endividado ? 'está no vermelho' : `compromete ${percentualGasto}%`}. A sensação de "não sobra nada" não é sobre o quanto você ganha — é sobre a relação que você tem com o dinheiro. Mente de escassez opera igual com R$3.000 ou R$30.000.`,
    d: `Renda variável exige um nível de estrutura maior, não menor. Com ${percentualGasto}% de comprometimento médio, qualquer mês abaixo da média vira crise. ${totalCartao > 0 ? `Com ${formatarMoeda(totalCartao)} no cartão todo mês independente do que entrar, você está construindo uma armadilha para os meses fracos.` : 'O primeiro passo é criar um caixa de proteção — antes de qualquer outra mudança.'}`,
  }

  // Insights por nível de risco — linguagem de ciclo
  const insights = {
    verde:    'Seu caixa tem fôlego. Agora é o momento de transformar esse fôlego em estrutura — antes que um imprevisto desfaça o que você construiu.',
    amarelo:  'Você está na zona de transição. Com o Método 6 Caixas, cada real passa a ter um destino antes de você gastar — e o ciclo de aperto começa a se inverter.',
    vermelho: endividado
      ? 'Você está no ciclo vicioso. A dor de mudar dura 3 meses. A dor de continuar nesse ciclo dura anos. O Método 6 Caixas começa com um plano de saída da dívida — não com regras impossíveis.'
      : 'Seu caixa está em risco real. Esse não é um problema de disciplina — é um problema de estrutura. O Método 6 Caixas cria essa estrutura, real por real.',
  }

  // CTA diferente para endividados
  const ctaTitulo = endividado
    ? 'Antes do Método, você precisa de um plano de saída.'
    : 'O Método 6 Caixas cria a estrutura que está faltando.'

  const ctaTexto = endividado
    ? `Com gastos acima da receita, aplicar o Método diretamente não funciona — porque os 50% de essenciais não cobrem os juros. O Método começa com um plano de transição de 3 a 6 meses para estabilizar o caixa. Depois, a estrutura se aplica naturalmente.`
    : `Uma planilha estruturada que dá um destino para cada real antes de você gastar — essenciais, prazer, liberdade financeira, reserva, educação e doação. Sem dieta financeira. Sem culpa. Com resultado.`

  return {
    dias: dias > 365 ? 365 : dias < 0 ? 0 : dias,
    diasTexto: dias > 365 ? '365+' : dias <= 0 ? '0' : String(dias),
    risco, percentualGasto, percentualFixos, percentualCartao, percentualVariaveis,
    sobra, receita, totalGastos, totalFixos, totalCartao, totalVariaveis,
    tipoRenda, problema, alertas, endividado,
    titulo:    titulos[problema]  || titulos['b'],
    analise:   analises[problema] || analises['b'],
    insight:   insights[risco.nivel],
    ctaTitulo, ctaTexto,
    analise6caixas: gerarAnalise6Caixas(receita, respostas),
    analiseRenda:   gerarAnaliseRenda(receita, totalGastos, totalFixos, totalVariaveis),
  }
}

export function gerarAnaliseRenda(receita, totalGastos, totalFixos, totalVariaveis) {
  const essenciais       = totalFixos + totalVariaveis * 0.6
  const percentualEssencial = Math.round((essenciais / receita) * 100)
  const rendaMinimaIdeal = Math.ceil(essenciais / 0.55 / 100) * 100
  const rendaFaltante    = Math.max(0, rendaMinimaIdeal - receita)

  let tipoProblema = 'organizacao'
  if (percentualEssencial > 70) tipoProblema = 'renda_critica'
  else if (percentualEssencial > 60) tipoProblema = 'renda_baixa'

  const mensagens = {
    organizacao: {
      titulo: 'Seu problema é de estrutura — não de renda.',
      corpo:  'Você tem renda suficiente para aplicar o Método 6 Caixas. O que falta é um sistema que dê destino a cada real antes de você gastar. Sem estrutura, até quem ganha bem vive com mente de escassez.',
      cor: '#d97706',
    },
    renda_baixa: {
      titulo: 'Sua renda está no limite para cobrir o básico.',
      corpo:  `Com ${formatarMoeda(receita)}/mês, seus essenciais já consomem mais de 60% da renda. Para ter fôlego real, você precisaria de mais ${formatarMoeda(rendaFaltante)}/mês — seja reduzindo custos fixos ou aumentando receita. O Método inclui estratégias para os dois caminhos.`,
      cor: '#dc2626',
    },
    renda_critica: {
      titulo: 'Reorganizar as caixas não resolve se não sobra nada para reorganizar.',
      corpo:  `Seus gastos essenciais consomem mais de 70% do que você ganha. Para o Método funcionar plenamente, você precisaria de pelo menos ${formatarMoeda(rendaMinimaIdeal)}/mês. Mas isso não significa esperar — o Método começa com um plano de transição que funciona exatamente nessa situação.`,
      cor: '#dc2626',
    },
  }

  return {
    tipoProblema,
    rendaMinimaIdeal,
    rendaFaltante,
    percentualEssencial,
    precisaAumentarRenda: tipoProblema !== 'organizacao',
    ...mensagens[tipoProblema],
  }
}

export function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(valor)
}
