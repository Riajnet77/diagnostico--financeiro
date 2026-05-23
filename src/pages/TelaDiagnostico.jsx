import React, { useState, useEffect, useRef } from 'react'
import { gerarDiagnostico, formatarMoeda, CONFIG } from '../logica.js'

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

function ProjecaoAnual({ receita, totalGastos, risco }) {
  const sobra = receita - totalGastos
  const deficitario = sobra < 0
  const saldoAnual = sobra * 12
  const receitaAnual = receita * 12
  const gastosAnual = totalGastos * 12
  const [animado, setAnimado] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAnimado(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const mesesDados = MESES.map((mes, i) => {
    const r = receita * (0.95 + Math.sin(i * 0.9) * 0.05)
    const g = totalGastos * (0.97 + Math.cos(i * 0.7) * 0.03)
    return { mes, receita: r, gastos: g, saldo: r - g }
  })

  const maxVal = Math.max(...mesesDados.map(m => Math.max(m.receita, m.gastos)))

  return (
    <div ref={ref} style={{
      background: deficitario ? '#0a0a0a' : '#ffffff',
      border: `2px solid ${deficitario ? '#dc2626' : '#e5e5e5'}`,
      borderRadius: 20,
      padding: '24px 20px',
      marginBottom: 16,
      boxShadow: deficitario ? '0 0 40px rgba(220,38,38,0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {deficitario && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(220,38,38,0.1) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}/>
      )}

      <div style={{ marginBottom: 20, position: 'relative' }}>
        <div style={{
          fontSize: 11, fontWeight: 800,
          color: deficitario ? '#f87171' : '#f97316',
          letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6,
        }}>
          {deficitario ? '🚨 ALERTA — ' : '📊 '}Projeção 12 Meses
        </div>
        <h3 style={{
          fontSize: 17, fontWeight: 800,
          color: deficitario ? '#ffffff' : '#0f0f0f',
          lineHeight: 1.3,
        }}>
          {deficitario
            ? 'Esse ciclo vai acumular dívidas ao longo do ano'
            : 'Evolução do seu caixa ao longo do ano'}
        </h3>
      </div>

      <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 90, marginBottom: 6 }}>
        {mesesDados.map((m, i) => {
          const hR = animado ? (m.receita / maxVal) * 100 : 0
          const hG = animado ? (m.gastos  / maxVal) * 100 : 0
          const positivo = m.saldo >= 0
          return (
            <div key={i} style={{ flex: 1, display: 'flex', gap: 1, alignItems: 'flex-end', height: '100%' }}>
              <div style={{
                flex: 1,
                background: deficitario ? '#1f2937' : '#d1d5db',
                borderRadius: '2px 2px 0 0',
                height: `${hR}%`,
                transition: `height ${0.4 + i * 0.04}s cubic-bezier(0.4,0,0.2,1)`,
              }}/>
              <div style={{
                flex: 1,
                background: positivo ? '#f97316' : '#dc2626',
                borderRadius: '2px 2px 0 0',
                height: `${hG}%`,
                transition: `height ${0.5 + i * 0.04}s cubic-bezier(0.4,0,0.2,1)`,
                boxShadow: !positivo ? '0 0 6px rgba(220,38,38,0.6)' : 'none',
              }}/>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
        {mesesDados.map((m, i) => (
          <div key={i} style={{
            flex: 1, textAlign: 'center',
            fontSize: 9, fontWeight: 600,
            color: deficitario ? '#4b5563' : '#a3a3a3',
          }}>{m.mes}</div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        {[
          { cor: deficitario ? '#1f2937' : '#d1d5db', label: 'Receita' },
          { cor: deficitario ? '#dc2626' : '#f97316', label: 'Gastos' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: l.cor }}/>
            <span style={{ fontSize: 12, color: deficitario ? '#9ca3af' : '#737373' }}>{l.label}</span>
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: deficitario ? '#1f2937' : '#e5e5e5', marginBottom: 16 }}/>

      <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        <div style={{
          flex: 1, borderRadius: 12, padding: '14px 12px',
          background: deficitario ? '#111827' : '#f9f8f6',
          border: `1px solid ${deficitario ? '#1f2937' : '#e5e5e5'}`,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: deficitario ? '#6b7280' : '#a3a3a3', letterSpacing: '0.08em', marginBottom: 4 }}>RECEITA ANUAL</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: deficitario ? '#d1d5db' : '#0f0f0f' }}>{formatarMoeda(receitaAnual)}</div>
        </div>
        <div style={{
          flex: 1, borderRadius: 12, padding: '14px 12px',
          background: deficitario ? '#1a0808' : '#fff5f5',
          border: `1px solid ${deficitario ? '#7f1d1d' : '#fecaca'}`,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: deficitario ? '#fca5a5' : '#991b1b', letterSpacing: '0.08em', marginBottom: 4 }}>GASTOS ANUAIS</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: deficitario ? '#f87171' : '#dc2626' }}>{formatarMoeda(gastosAnual)}</div>
        </div>
      </div>

      <div style={{
        background: deficitario ? '#1a0808' : '#f0fdf4',
        border: `2px solid ${deficitario ? '#dc2626' : '#bbf7d0'}`,
        borderRadius: 14, padding: '18px 16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: deficitario ? '0 0 24px rgba(220,38,38,0.4)' : 'none',
      }}>
        <div>
          <div style={{
            fontSize: 12, fontWeight: 800, letterSpacing: '0.06em', marginBottom: 4,
            color: deficitario ? '#f87171' : '#16a34a',
          }}>
            {deficitario ? '⚠️ DÉFICIT ANUAL' : '✅ SALDO ANUAL'}
          </div>
          <div style={{ fontSize: 12, color: deficitario ? '#9ca3af' : '#737373' }}>
            {deficitario ? 'Dívida acumulada em 12 meses se o ciclo continuar' : 'Projeção de sobra ao final do ano'}
          </div>
        </div>
        <div style={{
          fontSize: 'clamp(20px,5vw,26px)', fontWeight: 900,
          color: deficitario ? '#f87171' : '#16a34a',
          letterSpacing: '-0.02em',
        }}>
          {deficitario ? '-' : '+'}{formatarMoeda(Math.abs(saldoAnual))}
        </div>
      </div>

      {deficitario && Math.abs(saldoAnual) > receita * 2 && (
        <div style={{
          marginTop: 10, background: '#7f1d1d',
          borderRadius: 10, padding: '12px 16px',
          display: 'flex', gap: 10,
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>🚨</span>
          <p style={{ fontSize: 13, color: '#fca5a5', lineHeight: 1.5, fontWeight: 600 }}>
            Em 12 meses esse ciclo acumula um déficit equivalente a {Math.round(Math.abs(saldoAnual) / receita)} meses de renda. Esse é o custo de manter o padrão atual.
          </p>
        </div>
      )}
    </div>
  )
}

function CardAnaliseRenda({ analiseRenda, receita }) {
  const { tipoProblema, titulo, corpo, cor, rendaFaltante, rendaMinimaIdeal, precisaAumentarRenda } = analiseRenda

  return (
    <div style={{
      background: tipoProblema === 'organizacao' ? '#fffbeb' : '#fff',
      border: `2px solid ${cor}`,
      borderRadius: 16,
      padding: '22px 20px',
      marginBottom: 16,
      boxShadow: precisaAumentarRenda ? `0 4px 20px ${cor}25` : 'none',
    }}>
      <div style={{
        fontSize: 11, fontWeight: 800, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: cor, marginBottom: 10,
      }}>
        {precisaAumentarRenda ? '🚨 Alerta de Renda' : '💡 Tipo de Ciclo'}
      </div>

      <h3 style={{
        fontSize: 17, fontWeight: 800, color: '#0f0f0f',
        marginBottom: 10, lineHeight: 1.3,
      }}>{titulo}</h3>

      <p style={{ fontSize: 14, color: '#525252', lineHeight: 1.7, marginBottom: precisaAumentarRenda ? 16 : 0 }}>
        {corpo}
      </p>

      {precisaAumentarRenda && (
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{
            flex: 1, background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: 10, padding: '14px 12px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, color: '#991b1b', fontWeight: 700, marginBottom: 4 }}>RENDA ATUAL</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#dc2626' }}>{formatarMoeda(receita)}</div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', color: '#a3a3a3', fontSize: 18, fontWeight: 700,
          }}>→</div>
          <div style={{
            flex: 1, background: '#f0fdf4', border: '1px solid #bbf7d0',
            borderRadius: 10, padding: '14px 12px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, color: '#166534', fontWeight: 700, marginBottom: 4 }}>RENDA IDEAL</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#16a34a' }}>{formatarMoeda(rendaMinimaIdeal)}</div>
          </div>
        </div>
      )}

      {precisaAumentarRenda && (
        <div style={{
          marginTop: 12, background: '#f9f8f6', borderRadius: 10,
          padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 16 }}>💡</span>
          <p style={{ fontSize: 13, color: '#525252', lineHeight: 1.5 }}>
            O Método 6 Caixas mostra como estruturar sua renda atual <strong>e</strong> como criar novas fontes de receita para chegar no nível ideal.
          </p>
        </div>
      )}
    </div>
  )
}

function BadgeRisco({ risco }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: risco.fundo, border: `1px solid ${risco.borda}`,
      borderRadius: 9999, padding: '6px 16px',
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: '50%', background: risco.cor,
        animation: risco.nivel === 'vermelho' ? 'pulseRed 1.5s ease infinite' : 'none',
      }}/>
      <span style={{ fontSize: 13, fontWeight: 700, color: risco.cor }}>{risco.label}</span>
    </div>
  )
}

function CardMetrica({ label, valor, corValor }) {
  return (
    <div style={{
      background: '#ffffff', border: '1px solid #e5e5e5',
      borderRadius: 12, padding: '20px 18px', flex: 1,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      <div style={{ fontSize: 12, color: '#737373', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: corValor || '#0f0f0f', lineHeight: 1, letterSpacing: '-0.02em' }}>{valor}</div>
    </div>
  )
}

function BarraComprometimento({ percentual, risco }) {
  const [width, setWidth] = useState(0)
  useEffect(() => { setTimeout(() => setWidth(Math.min(percentual, 100)), 200) }, [percentual])
  return (
    <div style={{ background: '#ffffff', border: '1px solid #e5e5e5', borderRadius: 12, padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#525252' }}>Comprometimento da renda</span>
        <span style={{ fontSize: 20, fontWeight: 800, color: risco.cor }}>{percentual}%</span>
      </div>
      <div style={{ height: 8, background: '#f5f5f5', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 4,
          width: `${width}%`,
          background: percentual > 95 ? '#dc2626' : percentual > 85 ? '#d97706' : '#16a34a',
          transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
        }}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <span style={{ fontSize: 11, color: '#a3a3a3' }}>0%</span>
        <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>Ideal: até 80%</span>
        <span style={{ fontSize: 11, color: '#a3a3a3' }}>100%</span>
      </div>
    </div>
  )
}

// Card de composição dos gastos (Fixos / Cartão / Variáveis)
function CardComposicaoGastos({ totalFixos, totalCartao, totalVariaveis, totalGastos }) {
  const itens = [
    { label: 'Fixos', valor: totalFixos, cor: '#525252', icone: '📌' },
    { label: 'Cartão', valor: totalCartao, cor: '#dc2626', icone: '💳' },
    { label: 'Variáveis', valor: totalVariaveis, cor: '#f97316', icone: '📊' },
  ]

  return (
    <div style={{ background: '#ffffff', border: '1px solid #e5e5e5', borderRadius: 16, padding: '24px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: '#f97316', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
        Composição dos Gastos
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f0f0f', marginBottom: 4 }}>
        De onde vem o que você gasta
      </h3>
      <p style={{ fontSize: 13, color: '#737373', marginBottom: 16 }}>
        Total: {formatarMoeda(totalGastos)}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {itens.map((item, i) => {
          const pct = totalGastos > 0 ? Math.round((item.valor / totalGastos) * 100) : 0
          return (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>{item.icone}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#0f0f0f' }}>{item.label}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: item.valor > 0 ? item.cor : '#d4d4d4' }}>
                    {item.valor > 0 ? formatarMoeda(item.valor) : 'R$ 0'}
                  </span>
                  <span style={{ fontSize: 12, color: '#a3a3a3', marginLeft: 6 }}>({pct}%)</span>
                </div>
              </div>
              <div style={{ height: 6, background: '#f5f5f5', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 3,
                  width: `${pct}%`,
                  background: item.cor,
                  opacity: item.valor > 0 ? 0.85 : 0.2,
                  transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
                }}/>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CardCaixas({ analise6caixas, receita }) {
  const zeradas = analise6caixas.filter(c => c.status === 'zerado').length
  const risco   = analise6caixas.filter(c => c.status === 'risco').length

  return (
    <div style={{ background: '#ffffff', border: '1px solid #e5e5e5', borderRadius: 16, padding: '24px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: '#f97316', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
        Diagnóstico das 6 Caixas
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f0f0f', marginBottom: 4 }}>
        Onde seu dinheiro está — vs onde deveria estar
      </h3>
      <p style={{ fontSize: 13, color: '#737373', marginBottom: 16 }}>
        Com base nos seus lançamentos de {formatarMoeda(receita)}/mês:
      </p>

      {(zeradas > 0 || risco > 0) && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: 10, padding: '12px 14px', marginBottom: 16,
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>🚨</span>
          <p style={{ fontSize: 13, color: '#991b1b', lineHeight: 1.5, fontWeight: 600 }}>
            {zeradas} {zeradas === 1 ? 'caixa sem nenhuma alocação' : 'caixas sem nenhuma alocação'}{risco > 0 ? ` e ${risco} ${risco === 1 ? 'acima do limite ideal' : 'acima do limite ideal'}` : ''}.
            Seu dinheiro está concentrado num único ciclo — sem construir reserva, investimento ou liberdade.
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {analise6caixas.map((c, i) => (
          <div key={i} style={{
            background: c.fundo,
            border: `1.5px solid ${c.borda}`,
            borderRadius: 12, padding: '14px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>{c.icone}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f0f0f' }}>{c.nome}</div>
                  <div style={{ fontSize: 11, color: '#737373' }}>{c.descricao}</div>
                </div>
              </div>
              <div style={{
                background: c.cor + '20', border: `1px solid ${c.cor}40`,
                borderRadius: 6, padding: '3px 8px',
                fontSize: 11, fontWeight: 700, color: c.cor, whiteSpace: 'nowrap',
              }}>{c.label}</div>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: '#a3a3a3', fontWeight: 600 }}>VOCÊ: {c.realPct}%</span>
                  <span style={{ fontSize: 10, color: '#a3a3a3', fontWeight: 600 }}>IDEAL: {c.idealPct}%</span>
                </div>
                <div style={{ height: 6, background: '#e5e5e5', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'absolute', height: '100%', width: `${c.idealPct}%`, background: '#d4d4d4', borderRadius: 3 }}/>
                  <div style={{
                    position: 'absolute', height: '100%',
                    width: `${Math.min(c.realPct, 100)}%`,
                    background: c.cor, borderRadius: 3, opacity: 0.85,
                  }}/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: c.cor }}>
                    {c.realValor > 0 ? formatarMoeda(c.realValor) : 'R$ 0'}
                  </span>
                  <span style={{ fontSize: 11, color: '#a3a3a3' }}>
                    ideal: {formatarMoeda(c.idealValor)}
                  </span>
                </div>
              </div>
            </div>

            {c.alerta && (
              <div style={{ marginTop: 8, fontSize: 12, color: c.cor, fontWeight: 600, lineHeight: 1.4 }}>
                → {c.alerta}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
//  BLOCO CTA — com Formspree + localStorage + validação real
// ─────────────────────────────────────────────
function BlocoCTA({ d, onIrParaMetodo }) {
  const [mostrarEmail, setMostrarEmail] = useState(false)
  const [email, setEmail] = useState(() => {
    // ✅ Carrega email do localStorage se existir
    return localStorage.getItem('email_lead_diagnostico') || ''
  })
  const [emailSalvo, setEmailSalvo] = useState(false)
  const [erroEmail, setErroEmail] = useState('')
  const [enviando, setEnviando] = useState(false)

  // ✅ Regex de email válido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  async function salvarEmail(e) {
    e.preventDefault()
    setErroEmail('')

    // ✅ Validação real
    if (!email) {
      setErroEmail('Digite seu email para continuar')
      return
    }
    if (!emailRegex.test(email)) {
      setErroEmail('Email inválido. Use formato: seu@email.com')
      return
    }

    setEnviando(true)

    try {
      // ✅ Envia para Formspree
      const response = await fetch('https://formspree.io/f/mzdwvaaw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          dias_sobrevivencia: d.dias,
          nivel_risco: d.risco.nivel,
          receita: d.receita,
          gastos: d.totalGastos,
          tipo_problema: d.analiseRenda.tipoProblema,
          data: new Date().toISOString()
        })
      })

      if (response.ok) {
        // ✅ Salva no localStorage para lembrar na próxima vez
        localStorage.setItem('email_lead_diagnostico', email)
        setEmailSalvo(true)
        setTimeout(onIrParaMetodo, 1500)
      } else {
        setErroEmail('Erro ao enviar. Tente novamente.')
      }
    } catch (err) {
      setErroEmail('Erro de conexão. Verifique sua internet.')
    } finally {
      setEnviando(false)
    }
  }

  const corBotao = d.ctaDestaque ? '#dc2626' : '#f97316'
  const corBotaoHover = d.ctaDestaque ? '#b91c1c' : '#ea6c0a'
  const corSombra = d.ctaDestaque ? 'rgba(220,38,38,0.4)' : 'rgba(249,115,22,0.4)'

  return (
    <div style={{
      background: '#0f0f0f',
      border: d.ctaDestaque ? '2px solid #dc2626' : 'none',
      borderRadius: 20, padding: '28px 24px', marginBottom: 12,
      boxShadow: d.ctaDestaque ? '0 0 32px rgba(220,38,38,0.2)' : 'none',
    }}>
      {d.ctaDestaque && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#7f1d1d', borderRadius: 9999, padding: '4px 12px',
          marginBottom: 12,
        }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#fca5a5', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            🚨 Passo zero identificado
          </span>
        </div>
      )}

      {!d.ctaDestaque && (
        <div style={{ fontSize: 11, fontWeight: 800, color: '#f97316', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
          A solução
        </div>
      )}

      <h3 style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', marginBottom: 10, lineHeight: 1.3 }}>
        {d.ctaTitulo}
      </h3>
      <p style={{ fontSize: 14, color: '#a3a3a3', lineHeight: 1.65, marginBottom: 24 }}>
        {d.ctaTexto}
      </p>

      {!mostrarEmail ? (
        <button
          onClick={() => setMostrarEmail(true)}
          style={{
            width: '100%', padding: '16px 24px', background: corBotao, color: '#ffffff',
            borderRadius: 12, fontSize: 16, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: `0 4px 14px ${corSombra}`, transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = corBotaoHover}
          onMouseLeave={e => e.currentTarget.style.background = corBotao}
        >
          {d.ctaLabel}
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M4 10h12M10 4l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      ) : emailSalvo ? (
        <div style={{ textAlign: 'center', padding: '16px', color: '#16a34a', fontWeight: 700, fontSize: 15 }}>
          ✓ Email salvo! Redirecionando para o Método 6 Caixas...
        </div>
      ) : (
        <form onSubmit={salvarEmail} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontSize: 13, color: '#737373', marginBottom: 4 }}>
            {email ? 'Email encontrado:' : 'Quer receber dicas sobre organização financeira? (opcional)'}
          </p>

          <input
            type="email"
            value={email}
            onChange={e => {
              setEmail(e.target.value)
              setErroEmail('')  // Limpa erro ao digitar
            }}
            placeholder="seu@email.com"
            disabled={enviando}
            style={{
              padding: '14px 16px', 
              background: erroEmail ? '#2a0808' : '#1a1a1a', 
              border: `1.5px solid ${erroEmail ? '#dc2626' : '#2c2c2c'}`,
              borderRadius: 10, fontSize: 15, color: '#ffffff', outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />

          {/* ✅ Feedback de erro */}
          {erroEmail && (
            <div style={{ 
              fontSize: 12, color: '#f87171', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6 
            }}>
              <span>⚠️</span> {erroEmail}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={onIrParaMetodo}
              disabled={enviando}
              style={{
                flex: 1, padding: '13px', borderRadius: 10,
                background: 'transparent', border: '1px solid #2c2c2c',
                color: '#737373', fontSize: 13, fontWeight: 600,
                opacity: enviando ? 0.5 : 1,
              }}
            >
              Pular
            </button>
            <button
              type="submit"
              disabled={enviando}
              style={{
                flex: 2, padding: '13px', borderRadius: 10,
                background: corBotao, color: '#ffffff', fontSize: 14, fontWeight: 700,
                opacity: enviando ? 0.7 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {enviando ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Enviando...
                </>
              ) : (
                'Acessar o Método →'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
//  TELA PRINCIPAL
// ─────────────────────────────────────────────
export default function TelaDiagnostico({ respostas, onReiniciar, onEditar }) {
  const [animouDias, setAnimouDias] = useState(false)

  const d = gerarDiagnostico(respostas)
  useEffect(() => { setTimeout(() => setAnimouDias(true), 300) }, [])

  function irParaMetodo() {
    // ✅ Salva dados do diagnóstico para o Passo Zero no Método 6 Caixas
    if (d.risco.nivel === 'vermelho' || d.analiseRenda.tipoProblema === 'deficit') {
      localStorage.setItem('diagnostico_perfil', 'endividado')
      localStorage.setItem('diagnostico_dados', JSON.stringify({
        receita: d.receita,
        totalGastos: d.totalGastos,
        totalFixos: d.totalFixos,
        totalVariaveis: d.totalVariaveis,
        totalCartao: d.totalCartao,
        deficitMensal: Math.max(0, d.totalGastos - d.receita),
        variaveis: {
          lazer: 0,
          alimentacao: 0,
          transporte: 0,
          assinaturas: 0,
          roupasCompras: 0,
          outros: 0
        }
      }))
    }
    window.open(d.ctaUrl, '_blank')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9f8f6' }}>
      <header style={{
        background: '#ffffff', padding: '16px 24px',
        borderBottom: '1px solid #e5e5e5',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: '#0f0f0f' }}>O Hábito da Economia</span>
        <BadgeRisco risco={d.risco} />
      </header>

      <main style={{ maxWidth: 600, margin: '0 auto', padding: '32px 20px 60px', animation: 'fadeUp 0.5s ease forwards' }}>

        {/* Dias de sobrevivência */}
        <div style={{
          background: '#ffffff', border: `2px solid ${d.risco.borda}`,
          borderRadius: 20, padding: '32px 24px', textAlign: 'center',
          marginBottom: 16, position: 'relative', overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: d.risco.cor }}/>
          <p style={{ fontSize: 14, color: '#737373', marginBottom: 8, fontWeight: 500 }}>Com esse ciclo de gastos, seu caixa dura</p>
          <div style={{
            fontSize: 'clamp(72px, 20vw, 100px)', fontWeight: 900, color: d.risco.cor,
            lineHeight: 1, letterSpacing: '-0.04em', marginBottom: 4,
            animation: animouDias ? 'countUp 0.5s ease forwards' : 'none',
          }}>{d.diasTexto}</div>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#0f0f0f', marginBottom: 8 }}>dias</p>
          <p style={{ fontSize: 14, color: '#737373' }}>sem mudança de estrutura</p>
        </div>

        {/* Métricas mensais */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <CardMetrica label="Receita mensal" valor={formatarMoeda(d.receita)} />
          <CardMetrica label="Gastos mensais" valor={formatarMoeda(d.totalGastos)} corValor={d.risco.cor} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <BarraComprometimento percentual={d.percentualGasto} risco={d.risco} />
        </div>

        {/* Diagnóstico */}
        <div style={{
          background: '#ffffff', border: '1px solid #e5e5e5',
          borderRadius: 16, padding: '24px 20px', marginBottom: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#f97316', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
            Seu diagnóstico
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f0f0f', marginBottom: 14, lineHeight: 1.3 }}>{d.titulo}</h3>
          <p style={{ fontSize: 15, color: '#525252', lineHeight: 1.7 }}>{d.analise}</p>
        </div>

        {/* Análise de renda */}
        <CardAnaliseRenda analiseRenda={d.analiseRenda} receita={d.receita} />

        {/* Projeção 12 meses */}
        <ProjecaoAnual receita={d.receita} totalGastos={d.totalGastos} risco={d.risco} />

        {/* Composição dos gastos */}
        <CardComposicaoGastos
          totalFixos={d.totalFixos}
          totalCartao={d.totalCartao}
          totalVariaveis={d.totalVariaveis}
          totalGastos={d.totalGastos}
        />

        {/* Preview das 6 caixas */}
        <div style={{ marginBottom: 16 }}>
          <CardCaixas analise6caixas={d.analise6caixas} receita={d.receita} />
        </div>

        {/* Insight */}
        <div style={{
          background: d.risco.fundo, border: `1px solid ${d.risco.borda}`,
          borderRadius: 12, padding: '16px 20px', marginBottom: 24,
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>
            {d.risco.nivel === 'verde' ? '✅' : d.risco.nivel === 'amarelo' ? '⚠️' : '🚨'}
          </span>
          <p style={{ fontSize: 14, color: '#525252', lineHeight: 1.6 }}>{d.insight}</p>
        </div>

        {/* CTA — diferenciado por perfil */}
        <BlocoCTA d={d} onIrParaMetodo={irParaMetodo} />

        {/* Refazer */}
        <button
          onClick={onReiniciar}
          style={{
            width: '100%', padding: '13px', background: 'transparent', color: '#a3a3a3',
            fontSize: 13, borderRadius: 10, border: '1px solid #e5e5e5', transition: 'color 0.15s',
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
