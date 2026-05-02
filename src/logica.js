// Configuração global — troque o link quando a página de venda estiver pronta
export const CONFIG = {
  CTA_URL: 'https://metodo6caixas.vercel.app',
  CTA_LABEL: 'Quero o Método 6 Caixas',
}

// Calcula dias de sobrevivência do caixa
export function calcularDiasSobrevivencia(saldoTotal, gastosMes) {
  if (!gastosMes || gastosMes <= 0) return 999
  const mediaDiaria = gastosMes / 30
  return Math.floor(saldoTotal / mediaDiaria)
}

// Define nível de risco com base nos dias
export function calcularRisco(dias) {
  if (dias > 30) return { nivel: 'verde',   label: 'Caixa saudável',    cor: '#22c55e' }
  if (dias > 15) return { nivel: 'amarelo', label: 'Atenção necessária', cor: '#fbbf24' }
  return            { nivel: 'vermelho', label: 'Risco alto',           cor: '#f87171' }
}

// Mensagem do semáforo
export function mensagemSemaforo(nivel) {
  const msgs = {
    verde:    'Seu caixa está saudável. Você tem fôlego para planejar.',
    amarelo:  'Atenção: seu caixa pode apertar antes do fim do mês.',
    vermelho: 'Risco: você pode ficar sem dinheiro antes do fim do mês.',
  }
  return msgs[nivel]
}

// Gera diagnóstico completo a partir das respostas do onboarding
export function gerarDiagnostico(respostas) {
  const { receita, gastos, tipoRenda, temReserva, problema } = respostas

  const saldoDisponivel = receita - gastos
  const percentualGasto = gastos / receita
  const dias = calcularDiasSobrevivencia(saldoDisponivel > 0 ? saldoDisponivel : receita * 0.1, gastos)
  const risco = calcularRisco(dias)

  // Nível de desorganização
  let nivelDesorganizacao = 'baixo'
  if (percentualGasto > 0.95 || problema === 'a' || problema === 'd') nivelDesorganizacao = 'alto'
  else if (percentualGasto > 0.80 || problema === 'b' || problema === 'c') nivelDesorganizacao = 'medio'

  // Textos personalizados por perfil
  const textosPerfil = {
    baixo: {
      titulo: 'Você está organizado, mas pode estar deixando dinheiro na mesa.',
      subtitulo: 'Com um método claro, você pode fazer seu dinheiro trabalhar mais por você.',
    },
    medio: {
      titulo: 'Seu dinheiro some sem deixar rastro.',
      subtitulo: 'Você ganha, mas no final do mês a sensação é que não sobrou nada. Isso tem solução.',
    },
    alto: {
      titulo: 'Seu caixa está em risco real.',
      subtitulo: 'Sem uma estrutura clara, o dinheiro vai acabar antes do mês. Isso precisa mudar agora.',
    },
  }

  // Identificar o maior problema
  const problemas = {
    a: 'Seu dinheiro acaba antes do mês terminar — sinal claro de que os gastos essenciais estão desalinhados com a receita.',
    b: 'Você não sabe para onde vai o dinheiro — o problema não é ganhar pouco, é falta de visibilidade.',
    c: 'Você ganha bem mas não sobra — sem destino definido para cada real, o dinheiro some.',
    d: 'Renda instável exige um caixa de proteção — sem ele, qualquer mês fraco vira crise.',
  }

  return {
    dias,
    risco,
    saldoDisponivel,
    percentualGasto: Math.round(percentualGasto * 100),
    nivelDesorganizacao,
    titulo: textosPerfil[nivelDesorganizacao].titulo,
    subtitulo: textosPerfil[nivelDesorganizacao].subtitulo,
    problemaPrincipal: problemas[problema] || '',
    receita,
    gastos,
    tipoRenda,
    temReserva,
  }
}

// Formata moeda BRL
export function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor)
}
