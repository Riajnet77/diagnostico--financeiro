import React, { useState } from 'react'

const perguntas = [
  {
    id: 'receita',
    numero: '01',
    titulo: 'Quanto entra por mês?',
    subtitulo: 'Some tudo: salário, freelas, aluguéis, todas as fontes de renda.',
    tipo: 'moeda',
    placeholder: '0',
    dica: 'Use o valor líquido (o que cai na sua conta)',
  },
  {
    id: 'gastos',
    numero: '02',
    titulo: 'Quanto você gasta por mês?',
    subtitulo: 'Estimativa honesta: aluguel, mercado, contas, cartão, tudo.',
    tipo: 'moeda',
    placeholder: '0',
    dica: 'Inclua parcelas, assinaturas e gastos variáveis',
  },
  {
    id: 'tipoRenda',
    numero: '03',
    titulo: 'Sua renda é fixa ou variável?',
    subtitulo: 'Isso muda completamente o nível de risco do seu caixa.',
    tipo: 'opcao',
    opcoes: [
      { valor: 'fixa',     label: 'Renda fixa',    desc: 'Salário CLT ou valor fixo todo mês', icone: '💼' },
      { valor: 'variavel', label: 'Renda variável', desc: 'Freela, autônomo, comissão, MEI',    icone: '📊' },
      { valor: 'mista',    label: 'Renda mista',   desc: 'Parte fixa + parte variável',         icone: '⚖️' },
    ],
  },
  {
    id: 'problema',
    numero: '04',
    titulo: 'Qual é seu maior problema financeiro hoje?',
    subtitulo: 'Escolha o que mais descreve sua situação real.',
    tipo: 'opcao',
    opcoes: [
      { valor: 'a', label: 'O dinheiro acaba antes do mês terminar', icone: '📅' },
      { valor: 'b', label: 'Não sei para onde vai o dinheiro',       icone: '❓' },
      { valor: 'c', label: 'Ganho bem mas não sobra nada',           icone: '💸' },
      { valor: 'd', label: 'Tenho renda instável e vivo no limite',  icone: '📉' },
    ],
  },
]

function InputMoeda({ onChange, placeholder }) {
  const [display, setDisplay] = useState('')

  function handleChange(e) {
    const digits = e.target.value.replace(/\D/g, '')
    if (digits === '') { setDisplay(''); onChange(0); return; }
    const num = Number(digits)
    setDisplay(num.toLocaleString('pt-BR'))
    onChange(num)
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
        fontSize: 22, fontWeight: 700, color: '#a3a3a3', pointerEvents: 'none',
      }}>R$</div>
      <input
        type="tel"
        inputMode="numeric"
        value={display}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus
        style={{
          width: '100%',
          background: '#ffffff',
          border: '2px solid #e5e5e5',
          borderRadius: 12,
          padding: '20px 20px 20px 64px',
          fontSize: 32,
          fontWeight: 800,
          color: '#0f0f0f',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          letterSpacing: '-0.01em',
        }}
        onFocus={e => {
          e.target.style.borderColor = '#f97316'
          e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)'
        }}
        onBlur={e => {
          e.target.style.borderColor = '#e5e5e5'
          e.target.style.boxShadow = 'none'
        }}
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
        padding: '16px 20px',
        borderRadius: 12,
        background: selecionada ? '#fff4ed' : '#ffffff',
        border: `2px solid ${selecionada ? '#f97316' : '#e5e5e5'}`,
        color: '#0f0f0f',
        transition: 'all 0.15s',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        cursor: 'pointer',
      }}
      onMouseEnter={e => { if (!selecionada) e.currentTarget.style.borderColor = '#d4d4d4' }}
      onMouseLeave={e => { if (!selecionada) e.currentTarget.style.borderColor = '#e5e5e5' }}
    >
      {opcao.icone && (
        <span style={{ fontSize: 22, flexShrink: 0 }}>{opcao.icone}</span>
      )}
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 15, fontWeight: 700,
          color: selecionada ? '#f97316' : '#0f0f0f',
        }}>{opcao.label}</div>
        {opcao.desc && (
          <div style={{ fontSize: 13, color: '#737373', marginTop: 2 }}>{opcao.desc}</div>
        )}
      </div>
      {selecionada && (
        <div style={{
          width: 22, height: 22, borderRadius: '50%',
          background: '#f97316',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </button>
  )
}

export default function TelaOnboarding({ onConcluir }) {
  const [etapa, setEtapa] = useState(0)
  const [respostas, setRespostas] = useState({})
  const p = perguntas[etapa]

  function setValor(val) {
    setRespostas(prev => ({ ...prev, [p.id]: val }))
  }

  const podeAvancar = () => {
    const v = respostas[p.id]
    if (p.tipo === 'moeda') return v && v > 0
    return !!v
  }

  function avancar() {
    if (!podeAvancar()) return
    if (etapa < perguntas.length - 1) {
      setEtapa(e => e + 1)
    } else {
      onConcluir(respostas)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', flexDirection: 'column' }}>
      {/* Header com progresso */}
      <header style={{ padding: '20px 24px', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#0f0f0f' }}>O Hábito da Economia</span>
          <span style={{ fontSize: 13, color: '#737373' }}>
            {etapa + 1} de {perguntas.length}
          </span>
        </div>
        {/* Barra de progresso */}
        <div style={{ height: 4, background: '#f5f5f5', borderRadius: 2 }}>
          <div style={{
            height: '100%',
            width: `${((etapa + 1) / perguntas.length) * 100}%`,
            background: '#f97316',
            borderRadius: 2,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </header>

      {/* Conteúdo */}
      <main style={{
        flex: 1,
        maxWidth: 560,
        margin: '0 auto',
        padding: '48px 24px 40px',
        width: '100%',
      }}>
        <div key={etapa} style={{ animation: 'slideIn 0.3s ease forwards' }}>
          {/* Número da pergunta */}
          <div style={{
            fontSize: 12, fontWeight: 800, color: '#f97316',
            letterSpacing: '0.1em', marginBottom: 12,
          }}>{p.numero} / 04</div>

          <h2 style={{
            fontSize: 'clamp(22px, 6vw, 30px)',
            fontWeight: 800,
            color: '#0f0f0f',
            marginBottom: 8,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          }}>{p.titulo}</h2>

          <p style={{
            fontSize: 15, color: '#737373', marginBottom: 32, lineHeight: 1.5,
          }}>{p.subtitulo}</p>

          {/* Input */}
          {p.tipo === 'moeda' && (
            <>
              <InputMoeda onChange={setValor} placeholder={p.placeholder} />
              {p.dica && (
                <p style={{ fontSize: 13, color: '#a3a3a3', marginTop: 10 }}>
                  💡 {p.dica}
                </p>
              )}
            </>
          )}

          {p.tipo === 'opcao' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {p.opcoes.map(opcao => (
                <OpcaoCard
                  key={opcao.valor}
                  opcao={opcao}
                  selecionada={respostas[p.id] === opcao.valor}
                  onSelect={setValor}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer com botões */}
      <footer style={{
        padding: '16px 24px',
        borderTop: '1px solid #e5e5e5',
        background: '#ffffff',
        display: 'flex',
        gap: 10,
        maxWidth: 560,
        margin: '0 auto',
        width: '100%',
      }}>
        {etapa > 0 && (
          <button
            onClick={() => setEtapa(e => e - 1)}
            style={{
              padding: '14px 20px',
              borderRadius: 10,
              background: '#f5f5f5',
              color: '#525252',
              fontSize: 15,
              fontWeight: 600,
              border: '1px solid #e5e5e5',
              transition: 'background 0.15s',
            }}
          >← Voltar</button>
        )}
        <button
          onClick={avancar}
          disabled={!podeAvancar()}
          style={{
            flex: 1,
            padding: '14px 24px',
            borderRadius: 10,
            background: podeAvancar() ? '#f97316' : '#e5e5e5',
            color: podeAvancar() ? '#ffffff' : '#a3a3a3',
            fontSize: 15,
            fontWeight: 700,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: podeAvancar() ? '0 2px 8px rgba(249,115,22,0.3)' : 'none',
          }}
        >
          {etapa < perguntas.length - 1 ? 'Próxima pergunta' : 'Ver meu diagnóstico'}
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M4 10h12M10 4l6 6-6 6"
              stroke={podeAvancar() ? '#fff' : '#a3a3a3'}
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </footer>
    </div>
  )
}
