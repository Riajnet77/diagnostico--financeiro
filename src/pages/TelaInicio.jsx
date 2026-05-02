import React from 'react'

export default function TelaInicio({ onAvancar }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '48px 20px 40px',
      maxWidth: 480,
      margin: '0 auto',
      animation: 'fadeUp 0.6s ease forwards',
    }}>
      {/* Logo / marca */}
      <div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: '#1c1c1e',
          border: '1px solid #2c2c2e',
          borderRadius: 100,
          padding: '6px 14px',
          marginBottom: 48,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 8px #22c55e',
          }} />
          <span style={{
            fontFamily: 'var(--fonte-titulo)',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: '#8e8e93',
            textTransform: 'uppercase',
          }}>Método 6 Caixas</span>
        </div>

        <h1 style={{
          fontFamily: 'var(--fonte-titulo)',
          fontSize: 'clamp(36px, 10vw, 52px)',
          fontWeight: 800,
          lineHeight: 1.05,
          color: '#f5f2ed',
          marginBottom: 24,
        }}>
          Seu dinheiro<br />
          <span style={{ color: '#f87171' }}>vai durar</span><br />
          até quando?
        </h1>

        <p style={{
          fontSize: 17,
          color: '#8e8e93',
          lineHeight: 1.6,
          marginBottom: 40,
          fontWeight: 300,
        }}>
          Responda 4 perguntas e descubra em quantos dias seu caixa vai acabar — e o que fazer antes que isso aconteça.
        </p>

        {/* Destaques */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 48 }}>
          {[
            '2 minutos para completar',
            'Diagnóstico personalizado',
            'Sem cadastro obrigatório',
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              color: '#8e8e93', fontSize: 14,
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#22c55e" strokeWidth="1.5"/>
                <path d="M5 8l2 2 4-4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onAvancar}
        style={{
          width: '100%',
          padding: '18px 24px',
          background: '#f5f2ed',
          color: '#0a0a0a',
          borderRadius: 16,
          fontFamily: 'var(--fonte-titulo)',
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: '0.01em',
          transition: 'transform 0.15s, opacity 0.15s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        Fazer meu diagnóstico
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 10h12M10 4l6 6-6 6" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}
