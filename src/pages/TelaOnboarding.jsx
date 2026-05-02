import React, { useState } from 'react'

const perguntas = [
  {
    id: 'receita',
    titulo: 'Quanto entra por mês?',
    subtitulo: 'Soma tudo: salário, freelas, aluguéis, qualquer fonte.',
    tipo: 'moeda',
    placeholder: 'Ex: 5000',
  },
  {
    id: 'gastos',
    titulo: 'Quanto você gasta por mês?',
    subtitulo: 'Estimativa honesta — aluguel, mercado, conta, lazer, tudo.',
    tipo: 'moeda',
    placeholder: 'Ex: 4200',
  },
  {
    id: 'tipoRenda',
    titulo: 'Sua renda é fixa ou variável?',
    subtitulo: 'Isso muda o nível de risco do seu caixa.',
    tipo: 'opcao',
    opcoes: [
      { valor: 'fixa',    label: 'Fixa',     desc: 'Salário CLT ou valor fixo todo mês' },
      { valor: 'variavel', label: 'Variável', desc: 'Freela, autônomo, comissão' },
      { valor: 'mista',   label: 'Mista',    desc: 'Parte fixa, parte variável' },
    ],
  },
  {
    id: 'problema',
    titulo: 'Qual é seu maior problema hoje?',
    subtitulo: 'Escolha o que mais te identifica.',
    tipo: 'opcao',
    opcoes: [
      { valor: 'a', label: 'O dinheiro acaba antes do mês' },
      { valor: 'b', label: 'Não sei para onde vai' },
      { valor: 'c', label: 'Ganho bem mas não sobra' },
      { valor: 'd', label: 'Minha renda é instável' },
    ],
  },
]

function InputMoeda({ valor, onChange, placeholder }) {
  const [raw, setRaw] = useState('')

  function handleChange(e) {
    const digits = e.target.value.replace(/\D/g, '')
    setRaw(digits)
    onChange(Number(digits))
  }

  const display = raw
    ? Number(raw).toLocaleString('pt-BR', { minimumFractionDigits: 0 })
    : ''

  return (
    <div style={{ position: 'relative' }}>
      <span style={{
        position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)',
        fontFamily: 'var(--fonte-titulo)',
        fontSize: 20, fontWeight: 700, color: '#48484a',
      }}>R$</span>
      <input
        type="tel"
        inputMode="numeric"
        value={display}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus
        style={{
          width: '100%',
          background: '#1c1c1e',
          border: '1.5px solid #2c2c2e',
          borderRadius: 14,
          padding: '20px 18px 20px 56px',
          fontSize: 28,
          fontFamily: 'var(--fonte-titulo)',
          fontWeight: 700,
          color: '#f5f2ed',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => e.target.style.borderColor = '#48484a'}
        onBlur={e => e.target.style.borderColor = '#2c2c2e'}
      />
    </div>
  )
}

function OpcaoCard({ opcao, selecionada, onSelect }) {
  return (
    <button
      onClick={() => onSelect(opcao.valor)}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '16px 18px',
        borderRadius: 14,
        background: selecionada ? '#f5f2ed' : '#1c1c1e',
        border: `1.5px solid ${selecionada ? '#f5f2ed' : '#2c2c2e'}`,
        color: selecionada ? '#0a0a0a' : '#f5f2ed',
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <span style={{
        fontFamily: 'var(--fonte-titulo)',
        fontSize: 15,
        fontWeight: 700,
      }}>{opcao.label}</span>
      {opcao.desc && (
        <span style={{
          fontSize: 13,
          color: selecionada ? '#48484a' : '#8e8e93',
          fontWeight: 300,
        }}>{opcao.desc}</span>
      )}
    </button>
  )
}

export default function TelaOnboarding({ onConcluir }) {
  const [etapa, setEtapa] = useState(0)
  const [respostas, setRespostas] = useState({})
  const perguntaAtual = perguntas[etapa]
  const progresso = ((etapa) / perguntas.length) * 100

  function handleValor(valor) {
    setRespostas(prev => ({ ...prev, [perguntaAtual.id]: valor }))
  }

  function podeAvancar() {
    const val = respostas[perguntaAtual.id]
    if (perguntaAtual.tipo === 'moeda') return val && val > 0
    return !!val
  }

  function avancar() {
    if (!podeAvancar()) return
    if (etapa < perguntas.length - 1) {
      setEtapa(e => e + 1)
    } else {
      // Adiciona temReserva padrão se não perguntado
      onConcluir({ ...respostas, temReserva: false })
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 480,
      margin: '0 auto',
      padding: '32px 20px 40px',
    }}>
      {/* Barra de progresso */}
      <div style={{ marginBottom: 40 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 10,
        }}>
          <span style={{ fontFamily: 'var(--fonte-titulo)', fontSize: 12, color: '#48484a', fontWeight: 600 }}>
            {etapa + 1} de {perguntas.length}
          </span>
          <button
            onClick={() => etapa > 0 ? setEtapa(e => e - 1) : null}
            style={{
              background: 'none', color: '#48484a', fontSize: 13,
              padding: '4px 8px', borderRadius: 8,
              opacity: etapa === 0 ? 0 : 1,
              transition: 'opacity 0.2s',
            }}
          >← Voltar</button>
        </div>
        <div style={{ height: 3, background: '#1c1c1e', borderRadius: 2 }}>
          <div style={{
            height: '100%',
            width: `${((etapa + 1) / perguntas.length) * 100}%`,
            background: '#f5f2ed',
            borderRadius: 2,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Pergunta */}
      <div key={etapa} style={{ flex: 1, animation: 'slideIn 0.35s ease forwards' }}>
        <h2 style={{
          fontFamily: 'var(--fonte-titulo)',
          fontSize: 'clamp(24px, 7vw, 32px)',
          fontWeight: 800,
          lineHeight: 1.15,
          marginBottom: 10,
          color: '#f5f2ed',
        }}>{perguntaAtual.titulo}</h2>

        <p style={{
          fontSize: 15, color: '#8e8e93', marginBottom: 32, fontWeight: 300,
        }}>{perguntaAtual.subtitulo}</p>

        {/* Input por tipo */}
        {perguntaAtual.tipo === 'moeda' && (
          <InputMoeda
            valor={respostas[perguntaAtual.id] || ''}
            onChange={handleValor}
            placeholder={perguntaAtual.placeholder}
          />
        )}

        {perguntaAtual.tipo === 'opcao' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {perguntaAtual.opcoes.map(opcao => (
              <OpcaoCard
                key={opcao.valor}
                opcao={opcao}
                selecionada={respostas[perguntaAtual.id] === opcao.valor}
                onSelect={handleValor}
              />
            ))}
          </div>
        )}
      </div>

      {/* Botão avançar */}
      <button
        onClick={avancar}
        disabled={!podeAvancar()}
        style={{
          marginTop: 32,
          width: '100%',
          padding: '18px 24px',
          background: podeAvancar() ? '#f5f2ed' : '#1c1c1e',
          color: podeAvancar() ? '#0a0a0a' : '#48484a',
          borderRadius: 16,
          fontFamily: 'var(--fonte-titulo)',
          fontSize: 16,
          fontWeight: 700,
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: `1.5px solid ${podeAvancar() ? '#f5f2ed' : '#2c2c2e'}`,
        }}
      >
        {etapa < perguntas.length - 1 ? 'Próximo' : 'Ver meu diagnóstico'}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 10h12M10 4l6 6-6 6"
            stroke={podeAvancar() ? '#0a0a0a' : '#48484a'}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}
