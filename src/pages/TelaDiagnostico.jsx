import React, { useState, useEffect } from 'react'
import { gerarDiagnostico, formatarMoeda, mensagemSemaforo, CONFIG } from '../logica.js'

function SemaforoIcon({ nivel }) {
  const cores = { verde: '#22c55e', amarelo: '#fbbf24', vermelho: '#f87171' }
  const cor = cores[nivel]
  return (
    <div style={{
      width: 80, height: 80, borderRadius: '50%',
      background: `${cor}15`,
      border: `2px solid ${cor}40`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 0 32px ${cor}20`,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: cor,
        boxShadow: `0 0 20px ${cor}`,
        animation: nivel === 'vermelho' ? 'pulse 1.5s ease-in-out infinite' : 'none',
      }} />
    </div>
  )
}

function MetricaCard({ label, valor, destaque }) {
  return (
    <div style={{
      background: '#1c1c1e',
      border: '1px solid #2c2c2e',
      borderRadius: 16,
      padding: '20px 18px',
      flex: 1,
    }}>
      <div style={{ fontSize: 12, color: '#8e8e93', marginBottom: 8, fontWeight: 500 }}>{label}</div>
      <div style={{
        fontFamily: 'var(--fonte-titulo)',
        fontSize: destaque ? 28 : 22,
        fontWeight: 800,
        color: destaque || '#f5f2ed',
        lineHeight: 1,
      }}>{valor}</div>
    </div>
  )
}

function BarraGasto({ percentual }) {
  const cor = percentual > 95 ? '#f87171' : percentual > 80 ? '#fbbf24' : '#22c55e'
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: '#8e8e93' }}>Comprometimento da renda</span>
        <span style={{
          fontFamily: 'var(--fonte-titulo)', fontWeight: 700, fontSize: 14, color: cor,
        }}>{percentual}%</span>
      </div>
      <div style={{ height: 6, background: '#2c2c2e', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${Math.min(percentual, 100)}%`,
          background: cor,
          borderRadius: 3,
          transition: 'width 1s ease',
        }} />
      </div>
    </div>
  )
}

export default function TelaDiagnostico({ respostas, onReiniciar }) {
  const [exibirEmail, setExibirEmail] = useState(false)
  const [email, setEmail] = useState('')
  const [emailEnviado, setEmailEnviado] = useState(false)
  const [animou, setAnimou] = useState(false)

  const d = gerarDiagnostico(respostas)

  useEffect(() => {
    setTimeout(() => setAnimou(true), 100)
  }, [])

  function handleCTA() {
    window.open(CONFIG.CTA_URL, '_blank')
  }

  function handleEmail(e) {
    e.preventDefault()
    if (email && email.includes('@')) {
      // Aqui conecta Supabase para salvar o lead
      console.log('Lead capturado:', { email, diagnostico: d })
      setEmailEnviado(true)
      setTimeout(() => handleCTA(), 1200)
    }
  }

  const diasExibir = d.dias > 365 ? '365+' : d.dias < 0 ? '0' : d.dias

  return (
    <div style={{
      minHeight: '100vh',
      maxWidth: 480,
      margin: '0 auto',
      padding: '32px 20px 60px',
      animation: 'fadeUp 0.5s ease forwards',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <SemaforoIcon nivel={d.risco.nivel} />
        <div style={{ marginTop: 16 }}>
          <div style={{
            display: 'inline-block',
            background: `${d.risco.cor}15`,
            border: `1px solid ${d.risco.cor}40`,
            borderRadius: 100,
            padding: '4px 14px',
            fontSize: 12,
            fontWeight: 600,
            color: d.risco.cor,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>{d.risco.label}</div>
        </div>
        <p style={{ fontSize: 14, color: '#8e8e93', fontWeight: 300 }}>
          {mensagemSemaforo(d.risco.nivel)}
        </p>
      </div>

      {/* Métrica principal — dias */}
      <div style={{
        background: '#1c1c1e',
        border: `1px solid ${d.risco.cor}30`,
        borderRadius: 20,
        padding: '28px 24px',
        textAlign: 'center',
        marginBottom: 16,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: `radial-gradient(ellipse at 50% 0%, ${d.risco.cor}08 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <div style={{
          fontFamily: 'var(--fonte-titulo)',
          fontSize: 'clamp(64px, 20vw, 96px)',
          fontWeight: 800,
          lineHeight: 1,
          color: d.risco.cor,
          marginBottom: 4,
        }}>{animou ? diasExibir : '—'}</div>
        <div style={{
          fontFamily: 'var(--fonte-titulo)',
          fontSize: 16, fontWeight: 600, color: '#8e8e93',
        }}>dias de caixa</div>
        <div style={{ fontSize: 13, color: '#48484a', marginTop: 8, fontWeight: 300 }}>
          com o ritmo de gastos atual
        </div>
      </div>

      {/* Métricas secundárias */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <MetricaCard label="Receita mensal" valor={formatarMoeda(d.receita)} />
        <MetricaCard label="Gastos mensais" valor={formatarMoeda(d.gastos)} />
      </div>

      {/* Barra de comprometimento */}
      <div style={{
        background: '#1c1c1e',
        border: '1px solid #2c2c2e',
        borderRadius: 16,
        padding: '18px 18px',
        marginBottom: 24,
      }}>
        <BarraGasto percentual={d.percentualGasto} />
      </div>

      {/* Diagnóstico textual */}
      <div style={{
        background: '#1c1c1e',
        border: '1px solid #2c2c2e',
        borderRadius: 20,
        padding: '24px 20px',
        marginBottom: 24,
      }}>
        <h3 style={{
          fontFamily: 'var(--fonte-titulo)',
          fontSize: 18, fontWeight: 800,
          color: '#f5f2ed', marginBottom: 10, lineHeight: 1.3,
        }}>{d.titulo}</h3>
        <p style={{ fontSize: 14, color: '#8e8e93', lineHeight: 1.65, fontWeight: 300 }}>
          {d.subtitulo}
        </p>
        {d.problemaPrincipal && (
          <div style={{
            marginTop: 16,
            paddingTop: 16,
            borderTop: '1px solid #2c2c2e',
            fontSize: 13,
            color: '#8e8e93',
            lineHeight: 1.6,
          }}>
            {d.problemaPrincipal}
          </div>
        )}
      </div>

      {/* CTA — Método 6 Caixas */}
      <div style={{
        background: '#f5f2ed',
        borderRadius: 20,
        padding: '24px 20px',
        marginBottom: 16,
      }}>
        <div style={{
          fontFamily: 'var(--fonte-titulo)',
          fontSize: 11, fontWeight: 700,
          color: '#48484a', letterSpacing: '0.1em',
          textTransform: 'uppercase', marginBottom: 8,
        }}>A solução</div>
        <h3 style={{
          fontFamily: 'var(--fonte-titulo)',
          fontSize: 20, fontWeight: 800,
          color: '#0a0a0a', marginBottom: 10, lineHeight: 1.3,
        }}>
          O Método 6 Caixas mostra onde cada real deve ir — antes de você gastar.
        </h3>
        <p style={{
          fontSize: 14, color: '#48484a',
          lineHeight: 1.6, marginBottom: 20, fontWeight: 300,
        }}>
          Uma planilha estruturada para organizar sua renda em 6 categorias e nunca mais ficar sem dinheiro antes do fim do mês.
        </p>

        {!exibirEmail ? (
          <button
            onClick={() => setExibirEmail(true)}
            style={{
              width: '100%',
              padding: '16px 20px',
              background: '#0a0a0a',
              color: '#f5f2ed',
              borderRadius: 14,
              fontFamily: 'var(--fonte-titulo)',
              fontSize: 15, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {CONFIG.CTA_LABEL}
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M10 4l6 6-6 6" stroke="#f5f2ed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ) : emailEnviado ? (
          <div style={{
            textAlign: 'center', padding: '16px',
            color: '#1a6b3c', fontFamily: 'var(--fonte-titulo)',
            fontWeight: 700, fontSize: 15,
          }}>
            ✓ Redirecionando...
          </div>
        ) : (
          <form onSubmit={handleEmail} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: 13, color: '#48484a', fontWeight: 400 }}>
              Deixe seu e-mail para receber o acesso (opcional):
            </p>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              style={{
                padding: '14px 16px',
                background: '#fff',
                border: '1.5px solid #d1d1d1',
                borderRadius: 12,
                fontSize: 15,
                color: '#0a0a0a',
                outline: 'none',
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={handleCTA}
                style={{
                  flex: 1, padding: '14px', borderRadius: 12,
                  background: 'transparent', border: '1.5px solid #c0bdb8',
                  color: '#48484a', fontSize: 13, fontWeight: 500,
                }}
              >Pular</button>
              <button
                type="submit"
                style={{
                  flex: 2, padding: '14px', borderRadius: 12,
                  background: '#0a0a0a', color: '#f5f2ed',
                  fontSize: 14, fontFamily: 'var(--fonte-titulo)', fontWeight: 700,
                }}
              >Acessar o Método →</button>
            </div>
          </form>
        )}
      </div>

      {/* Reiniciar */}
      <button
        onClick={onReiniciar}
        style={{
          width: '100%', padding: '14px',
          background: 'transparent', color: '#48484a',
          fontSize: 13, borderRadius: 12,
          border: '1px solid #2c2c2e',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#8e8e93'}
        onMouseLeave={e => e.currentTarget.style.color = '#48484a'}
      >
        Refazer diagnóstico
      </button>
    </div>
  )
}
