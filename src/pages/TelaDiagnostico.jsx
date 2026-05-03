import React, { useState, useEffect } from 'react'
import { gerarDiagnostico, formatarMoeda, CONFIG } from '../logica.js'

function BadgeRisco({ risco }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: risco.fundo,
      border: `1px solid ${risco.borda}`,
      borderRadius: 9999,
      padding: '6px 16px',
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: risco.cor,
        animation: risco.nivel === 'vermelho' ? 'pulseRed 1.5s ease infinite' : 'none',
      }} />
      <span style={{ fontSize: 13, fontWeight: 700, color: risco.cor }}>
        {risco.label}
      </span>
    </div>
  )
}

function CardMetrica({ label, valor, destaque, corValor }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e5e5e5',
      borderRadius: 12,
      padding: '20px 18px',
      flex: 1,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      <div style={{ fontSize: 12, color: '#737373', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{
        fontSize: destaque ? 32 : 22,
        fontWeight: 800,
        color: corValor || '#0f0f0f',
        lineHeight: 1,
        letterSpacing: '-0.02em',
      }}>{valor}</div>
    </div>
  )
}

function BarraComprometimento({ percentual, risco }) {
  const [width, setWidth] = useState(0)
  useEffect(() => { setTimeout(() => setWidth(Math.min(percentual, 100)), 200) }, [percentual])

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e5e5e5',
      borderRadius: 12,
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#525252' }}>Comprometimento da renda</span>
        <span style={{ fontSize: 20, fontWeight: 800, color: risco.cor }}>{percentual}%</span>
      </div>
      <div style={{ height: 8, background: '#f5f5f5', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${width}%`,
          background: percentual > 95 ? '#dc2626' : percentual > 85 ? '#d97706' : '#16a34a',
          borderRadius: 4,
          transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <span style={{ fontSize: 11, color: '#a3a3a3' }}>0%</span>
        <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>Ideal: até 80%</span>
        <span style={{ fontSize: 11, color: '#a3a3a3' }}>100%</span>
      </div>
    </div>
  )
}

function CardCaixas({ caixas, receita }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e5e5e5',
      borderRadius: 16,
      padding: '24px 20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f0f0f', marginBottom: 4 }}>
          Como o Método dividiria sua renda
        </h3>
        <p style={{ fontSize: 13, color: '#737373' }}>
          Se você aplicasse o Método 6 Caixas com {formatarMoeda(receita)}/mês:
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {caixas.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: c.cor, flexShrink: 0,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0f0f0f' }}>{c.nome}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: c.cor }}>
                  {formatarMoeda(c.valor)}
                </span>
              </div>
              <div style={{ height: 4, background: '#f5f5f5', borderRadius: 2 }}>
                <div style={{
                  height: '100%', width: `${c.percentual}%`,
                  background: c.cor, borderRadius: 2, opacity: 0.7,
                }} />
              </div>
            </div>
            <span style={{ fontSize: 12, color: '#a3a3a3', width: 30, textAlign: 'right' }}>
              {c.percentual}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TelaDiagnostico({ respostas, onReiniciar }) {
  const [mostrarEmail, setMostrarEmail] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSalvo, setEmailSalvo] = useState(false)
  const [animouDias, setAnimouDias] = useState(false)

  const d = gerarDiagnostico(respostas)

  useEffect(() => { setTimeout(() => setAnimouDias(true), 300) }, [])

  function irParaMetodo() {
    window.open(CONFIG.CTA_URL, '_blank')
  }

  function salvarEmail(e) {
    e.preventDefault()
    if (email && email.includes('@')) {
      console.log('Lead:', { email, ...d })
      setEmailSalvo(true)
      setTimeout(irParaMetodo, 1000)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9f8f6' }}>
      {/* Header */}
      <header style={{
        background: '#ffffff',
        padding: '16px 24px',
        borderBottom: '1px solid #e5e5e5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: '#0f0f0f' }}>O Hábito da Economia</span>
        <BadgeRisco risco={d.risco} />
      </header>

      <main style={{
        maxWidth: 600,
        margin: '0 auto',
        padding: '32px 20px 60px',
        animation: 'fadeUp 0.5s ease forwards',
      }}>

        {/* Seção 1: Métrica principal */}
        <div style={{
          background: '#ffffff',
          border: `2px solid ${d.risco.borda}`,
          borderRadius: 20,
          padding: '32px 24px',
          textAlign: 'center',
          marginBottom: 16,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: 4, background: d.risco.cor,
          }} />
          <p style={{ fontSize: 14, color: '#737373', marginBottom: 8, fontWeight: 500 }}>
            Seu caixa dura aproximadamente
          </p>
          <div style={{
            fontSize: 'clamp(72px, 20vw, 100px)',
            fontWeight: 900,
            color: d.risco.cor,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            animation: animouDias ? 'countUp 0.5s ease forwards' : 'none',
            marginBottom: 4,
          }}>
            {d.diasTexto}
          </div>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#0f0f0f', marginBottom: 8 }}>
            dias
          </p>
          <p style={{ fontSize: 14, color: '#737373' }}>com o seu ritmo atual de gastos</p>
        </div>

        {/* Seção 2: Métricas */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <CardMetrica label="Receita mensal" valor={formatarMoeda(d.receita)} />
          <CardMetrica label="Gastos mensais" valor={formatarMoeda(d.totalGastos)} corValor={d.risco.cor} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <BarraComprometimento percentual={d.percentualGasto} risco={d.risco} />
        </div>

        {/* Seção 3: Diagnóstico personalizado */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e5e5',
          borderRadius: 16,
          padding: '24px 20px',
          marginBottom: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <div style={{
            fontSize: 11, fontWeight: 800, color: '#f97316',
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12,
          }}>Seu diagnóstico</div>
          <h3 style={{
            fontSize: 20, fontWeight: 800, color: '#0f0f0f',
            marginBottom: 14, lineHeight: 1.3, letterSpacing: '-0.01em',
          }}>{d.titulo}</h3>
          <p style={{
            fontSize: 15, color: '#525252', lineHeight: 1.7,
          }}>{d.analise}</p>
        </div>

        {/* Seção 4: Preview das 6 caixas */}
        <div style={{ marginBottom: 16 }}>
          <CardCaixas caixas={d.caixas} receita={d.receita} />
        </div>

        {/* Seção 5: Insight final */}
        <div style={{
          background: d.risco.fundo,
          border: `1px solid ${d.risco.borda}`,
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 24,
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>
            {d.risco.nivel === 'verde' ? '✅' : d.risco.nivel === 'amarelo' ? '⚠️' : '🚨'}
          </span>
          <p style={{ fontSize: 14, color: '#525252', lineHeight: 1.6 }}>{d.insight}</p>
        </div>

        {/* Seção 6: CTA */}
        <div style={{
          background: '#0f0f0f',
          borderRadius: 20,
          padding: '28px 24px',
          marginBottom: 12,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 800, color: '#f97316',
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12,
          }}>A solução</div>
          <h3 style={{
            fontSize: 20, fontWeight: 800, color: '#ffffff',
            marginBottom: 10, lineHeight: 1.3,
          }}>
            O Método 6 Caixas resolve exatamente o que você acabou de ver.
          </h3>
          <p style={{
            fontSize: 14, color: '#a3a3a3', lineHeight: 1.65, marginBottom: 24,
          }}>
            Uma planilha estruturada que divide sua renda em 6 destinos antes de você gastar — e faz seu dinheiro durar o mês inteiro.
          </p>

          {!mostrarEmail ? (
            <button
              onClick={() => setMostrarEmail(true)}
              style={{
                width: '100%', padding: '16px 24px',
                background: '#f97316', color: '#ffffff',
                borderRadius: 12, fontSize: 16, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: '0 4px 14px rgba(249,115,22,0.4)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#ea6c0a'}
              onMouseLeave={e => e.currentTarget.style.background = '#f97316'}
            >
              {CONFIG.CTA_LABEL}
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12M10 4l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ) : emailSalvo ? (
            <div style={{
              textAlign: 'center', padding: '16px',
              color: '#16a34a', fontWeight: 700, fontSize: 15,
            }}>✓ Abrindo o Método 6 Caixas...</div>
          ) : (
            <form onSubmit={salvarEmail} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontSize: 13, color: '#737373', marginBottom: 4 }}>
                Quer receber dicas sobre organização financeira? (opcional)
              </p>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                style={{
                  padding: '14px 16px',
                  background: '#1a1a1a',
                  border: '1px solid #2c2c2c',
                  borderRadius: 10,
                  fontSize: 15, color: '#ffffff', outline: 'none',
                }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={irParaMetodo}
                  style={{
                    flex: 1, padding: '13px', borderRadius: 10,
                    background: 'transparent', border: '1px solid #2c2c2c',
                    color: '#737373', fontSize: 13, fontWeight: 600,
                  }}
                >Pular</button>
                <button
                  type="submit"
                  style={{
                    flex: 2, padding: '13px', borderRadius: 10,
                    background: '#f97316', color: '#ffffff',
                    fontSize: 14, fontWeight: 700,
                  }}
                >Acessar o Método →</button>
              </div>
            </form>
          )}
        </div>

        {/* Refazer */}
        <button
          onClick={onReiniciar}
          style={{
            width: '100%', padding: '13px',
            background: 'transparent', color: '#a3a3a3',
            fontSize: 13, borderRadius: 10,
            border: '1px solid #e5e5e5',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#525252'}
          onMouseLeave={e => e.currentTarget.style.color = '#a3a3a3'}
        >
          Refazer diagnóstico com outros valores
        </button>
      </main>
    </div>
  )
}
