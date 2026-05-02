import React from 'react'

export default function TelaInicio({ onAvancar }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <header style={{
        padding: '20px 24px',
        borderBottom: '1px solid #e5e5e5',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: '#f97316',
        }} />
        <span style={{ fontWeight: 700, fontSize: 14, color: '#0f0f0f' }}>
          O Hábito da Economia
        </span>
        <span style={{ fontSize: 12, color: '#737373', marginLeft: 2 }}>
          · Gestão Financeira
        </span>
      </header>

      {/* Hero */}
      <main style={{
        flex: 1,
        maxWidth: 640,
        margin: '0 auto',
        padding: '60px 24px 48px',
        width: '100%',
        animation: 'fadeUp 0.5s ease forwards',
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-block',
          background: '#fff4ed',
          border: '1px solid #fed7aa',
          borderRadius: 9999,
          padding: '6px 14px',
          fontSize: 13,
          fontWeight: 600,
          color: '#f97316',
          marginBottom: 28,
        }}>
          Você se identifica com isso?
        </div>

        {/* Título */}
        <h1 style={{
          fontSize: 'clamp(32px, 8vw, 52px)',
          fontWeight: 800,
          lineHeight: 1.1,
          color: '#0f0f0f',
          marginBottom: 12,
          letterSpacing: '-0.02em',
        }}>
          Seu dinheiro acaba<br />
          <span style={{ color: '#f97316' }}>antes do mês terminar?</span>
        </h1>

        <p style={{
          fontSize: 18,
          color: '#525252',
          lineHeight: 1.65,
          marginBottom: 12,
          maxWidth: 520,
        }}>
          Você trabalha muito, mas no final do mês não sobra nada — e você não sabe exatamente para onde o dinheiro foi.
        </p>

        <p style={{
          fontSize: 16,
          color: '#f97316',
          fontWeight: 600,
          marginBottom: 44,
        }}>
          Este diagnóstico foi criado para resolver exatamente isso. 👇
        </p>

        {/* CTA principal */}
        <button
          onClick={onAvancar}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: '#f97316',
            color: '#ffffff',
            padding: '16px 32px',
            borderRadius: 12,
            fontSize: 17,
            fontWeight: 700,
            boxShadow: '0 4px 14px rgba(249,115,22,0.35)',
            transition: 'all 0.2s',
            marginBottom: 16,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#ea6c0a'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f97316'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          Fazer meu diagnóstico gratuito
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M4 10h12M10 4l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <p style={{ fontSize: 13, color: '#a3a3a3' }}>Leva menos de 2 minutos · Sem cadastro</p>

        {/* Divisor */}
        <div style={{ margin: '52px 0 40px', borderTop: '1px solid #e5e5e5' }} />

        {/* O que é */}
        <h2 style={{
          fontSize: 22, fontWeight: 700, color: '#0f0f0f', marginBottom: 8,
        }}>O que é o Método 6 Caixas?</h2>
        <p style={{ fontSize: 15, color: '#525252', marginBottom: 32 }}>
          Uma regra simples para dividir seu dinheiro todo mês
        </p>

        {/* Cards das 6 caixas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          marginBottom: 48,
        }}>
          {[
            { pct: '55%', nome: 'Viver',      cor: '#f97316' },
            { pct: '10%', nome: 'Investir',   cor: '#16a34a' },
            { pct: '10%', nome: 'Sonhos',     cor: '#2563eb' },
            { pct: '10%', nome: 'Educação',   cor: '#7c3aed' },
            { pct: '10%', nome: 'Lazer',      cor: '#db2777' },
            { pct: '5%',  nome: 'Doação',     cor: '#0891b2' },
          ].map((c, i) => (
            <div key={i} style={{
              background: '#f9f8f6',
              border: '1px solid #e5e5e5',
              borderRadius: 12,
              padding: '16px 14px',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: 22, fontWeight: 800, color: c.cor, marginBottom: 2,
              }}>{c.pct}</div>
              <div style={{ fontSize: 13, color: '#525252', fontWeight: 500 }}>{c.nome}</div>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div style={{
          background: '#f9f8f6',
          border: '1px solid #e5e5e5',
          borderRadius: 16,
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          {[
            { texto: '"Finalmente entendi para onde ia meu dinheiro. Em 3 meses já tinha reserva de emergência."', nome: 'Mariana S.' },
            { texto: '"Como autônomo, esse método salvou meu caixa nos meses de baixa receita."', nome: 'Roberto M.' },
          ].map((t, i) => (
            <div key={i} style={{ borderBottom: i === 0 ? '1px solid #e5e5e5' : 'none', paddingBottom: i === 0 ? 16 : 0 }}>
              <p style={{ fontSize: 14, color: '#525252', fontStyle: 'italic', marginBottom: 6 }}>{t.texto}</p>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#f97316' }}>— {t.nome}</span>
            </div>
          ))}
        </div>

        {/* CTA secundário */}
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <button
            onClick={onAvancar}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#0f0f0f',
              color: '#ffffff',
              padding: '14px 28px',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
            onMouseLeave={e => e.currentTarget.style.background = '#0f0f0f'}
          >
            Começar agora — leva 2 minutos
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M10 4l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </main>
    </div>
  )
}
