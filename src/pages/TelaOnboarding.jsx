import React, { useState, useEffect } from 'react'
import { formatarMoeda, calcularTotais } from '../logica.js'

// ── componentes base ──────────────────────────────────────────────────────────

function Header({ etapa, total, onVoltar }) {
  return (
    <header style={{ background:'#fff', padding:'16px 24px', borderBottom:'1px solid #e5e5e5' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {etapa > 0 && (
            <button onClick={onVoltar} style={{
              background:'none', border:'none', color:'#737373',
              fontSize:13, fontWeight:600, cursor:'pointer', padding:'4px 8px',
              borderRadius:6, display:'flex', alignItems:'center', gap:4,
            }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path d="M16 10H4M10 4l-6 6 6 6" stroke="#737373" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Voltar
            </button>
          )}
        </div>
        <span style={{ fontSize:13, color:'#737373', fontWeight:500 }}>
          {etapa + 1} de {total}
        </span>
      </div>
      <div style={{ height:4, background:'#f5f5f5', borderRadius:2 }}>
        <div style={{
          height:'100%', borderRadius:2, background:'#f97316',
          width:`${((etapa + 1) / total) * 100}%`,
          transition:'width 0.4s ease',
        }}/>
      </div>
    </header>
  )
}

function BotaoAvancar({ onClick, disabled, label }) {
  return (
    <footer style={{
      padding:'16px 24px', borderTop:'1px solid #e5e5e5',
      background:'#fff', position:'sticky', bottom:0,
    }}>
      <button onClick={onClick} disabled={disabled} style={{
        width:'100%', padding:'16px',
        background: disabled ? '#e5e5e5' : '#f97316',
        color: disabled ? '#a3a3a3' : '#fff',
        borderRadius:12, fontSize:16, fontWeight:700,
        border:'none', cursor: disabled ? 'not-allowed' : 'pointer',
        display:'flex', alignItems:'center', justifyContent:'center', gap:8,
        boxShadow: disabled ? 'none' : '0 4px 14px rgba(249,115,22,0.3)',
        transition:'all 0.2s',
      }}>
        {label}
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M4 10h12M10 4l6 6-6 6"
            stroke={disabled ? '#a3a3a3' : '#fff'}
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </footer>
  )
}

function InputMoeda({ label, icone, valor, onChange, placeholder = '0' }) {
  const [display, setDisplay] = useState(valor ? Number(valor).toLocaleString('pt-BR') : '')

  function handle(e) {
    const digits = e.target.value.replace(/\D/g, '')
    setDisplay(digits ? Number(digits).toLocaleString('pt-BR') : '')
    onChange(Number(digits) || 0)
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <label style={{ fontSize:13, fontWeight:600, color:'#525252', display:'flex', alignItems:'center', gap:6 }}>
        <span>{icone}</span> {label}
      </label>
      <div style={{ position:'relative' }}>
        <span style={{
          position:'absolute', left:14, top:'50%', transform:'translateY(-50%)',
          fontSize:15, fontWeight:700, color:'#a3a3a3', pointerEvents:'none',
        }}>R$</span>
        <input
          type="tel" inputMode="numeric"
          value={display}
          onChange={handle}
          placeholder={placeholder}
          style={{
            width:'100%', padding:'13px 14px 13px 44px',
            background:'#fff', border:'1.5px solid #e5e5e5',
            borderRadius:10, fontSize:18, fontWeight:700,
            color:'#0f0f0f', outline:'none',
            transition:'border-color 0.2s, box-shadow 0.2s',
          }}
          onFocus={e => { e.target.style.borderColor='#f97316'; e.target.style.boxShadow='0 0 0 3px rgba(249,115,22,0.1)' }}
          onBlur={e  => { e.target.style.borderColor='#e5e5e5'; e.target.style.boxShadow='none' }}
        />
      </div>
    </div>
  )
}

function OpcaoCard({ valor, label, desc, icone, selecionado, onSelect }) {
  return (
    <button onClick={() => onSelect(valor)} style={{
      width:'100%', textAlign:'left', padding:'16px 20px',
      borderRadius:12, cursor:'pointer',
      background: selecionado ? '#fff4ed' : '#fff',
      border: `2px solid ${selecionado ? '#f97316' : '#e5e5e5'}`,
      transition:'all 0.15s',
      display:'flex', alignItems:'center', gap:14,
    }}>
      <span style={{ fontSize:24, flexShrink:0 }}>{icone}</span>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:15, fontWeight:700, color: selecionado ? '#f97316' : '#0f0f0f' }}>{label}</div>
        {desc && <div style={{ fontSize:13, color:'#737373', marginTop:2 }}>{desc}</div>}
      </div>
      {selecionado && (
        <div style={{
          width:22, height:22, borderRadius:'50%', background:'#f97316',
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </button>
  )
}

// ── tela de loading ───────────────────────────────────────────────────────────

function TelaLoading({ onConcluir }) {
  const frases = [
    'Calculando comprometimento de renda...',
    'Analisando despesas fixas e variáveis...',
    'Identificando nível de risco do caixa...',
    'Gerando seu diagnóstico personalizado...',
  ]
  const [fase, setFase] = useState(0)
  const [progresso, setProgresso] = useState(0)

  useEffect(() => {
    const intervalo = setInterval(() => {
      setFase(f => {
        const proximo = f + 1
        if (proximo >= frases.length) { clearInterval(intervalo); setTimeout(onConcluir, 600); }
        return proximo < frases.length ? proximo : f
      })
      setProgresso(p => Math.min(p + 26, 100))
    }, 900)
    return () => clearInterval(intervalo)
  }, [])

  return (
    <div style={{
      minHeight:'100vh', background:'#0f0f0f',
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      padding:'40px 24px', gap:32,
      animation:'fadeUp 0.4s ease forwards',
    }}>
      {/* Ícone animado */}
      <div style={{
        width:80, height:80, borderRadius:'50%',
        background:'rgba(249,115,22,0.1)',
        border:'2px solid rgba(249,115,22,0.3)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
            stroke="#f97316" strokeWidth="2" strokeLinecap="round"
            style={{ animation:'spin 1.5s linear infinite' }}
          />
        </svg>
      </div>

      <div style={{ textAlign:'center', maxWidth:320 }}>
        <h2 style={{
          fontSize:22, fontWeight:800, color:'#fff',
          marginBottom:8, letterSpacing:'-0.01em',
        }}>Analisando seu perfil...</h2>
        <p style={{
          fontSize:15, color:'#f97316', fontWeight:500,
          minHeight:24, transition:'all 0.3s',
        }}>{frases[fase]}</p>
      </div>

      {/* Barra de progresso */}
      <div style={{ width:'100%', maxWidth:320 }}>
        <div style={{ height:6, background:'#1a1a1a', borderRadius:3, overflow:'hidden' }}>
          <div style={{
            height:'100%', background:'#f97316', borderRadius:3,
            width:`${progresso}%`, transition:'width 0.8s ease',
          }}/>
        </div>
        <div style={{ textAlign:'right', marginTop:8, fontSize:13, color:'#525252' }}>
          {progresso}%
        </div>
      </div>

      <p style={{ fontSize:13, color:'#525252', textAlign:'center', maxWidth:280 }}>
        Comparando com o padrão ideal do Método 6 Caixas
      </p>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ── onboarding principal ──────────────────────────────────────────────────────

const ETAPAS = ['problema', 'receita', 'fixos', 'cartao', 'variaveis', 'loading']

export default function TelaOnboarding({ onConcluir }) {
  const [etapa, setEtapa] = useState(0)
  const [dados, setDados] = useState({
    problema: '', receita: 0, tipoRenda: '',
    fixos: { aluguel:0, contasBasicas:0, internetCelular:0, planoSaude:0, escolaFaculdade:0 },
    cartao: 0,
    variaveis: { alimentacao:0, transporte:0, lazer:0, assinaturas:0, roupasCompras:0, outros:0 },
  })

  function set(campo, valor) {
    setDados(d => ({ ...d, [campo]: valor }))
  }
  function setFixo(campo, valor) {
    setDados(d => ({ ...d, fixos: { ...d.fixos, [campo]: valor } }))
  }
  function setVariavel(campo, valor) {
    setDados(d => ({ ...d, variaveis: { ...d.variaveis, [campo]: valor } }))
  }

  const etapaAtual = ETAPAS[etapa]

  function podeAvancar() {
    if (etapaAtual === 'problema') return !!dados.problema
    if (etapaAtual === 'receita')  return dados.receita > 0 && !!dados.tipoRenda
    return true // fixos, cartao, variaveis são opcionais (0 é válido)
  }

  function avancar() {
    if (!podeAvancar()) return
    if (etapa < ETAPAS.length - 1) setEtapa(e => e + 1)
  }

  if (etapaAtual === 'loading') {
    return <TelaLoading onConcluir={() => onConcluir(dados)} />
  }

  const totalFixos = Object.values(dados.fixos).reduce((a, b) => a + b, 0)
  const totalVariaveis = Object.values(dados.variaveis).reduce((a, b) => a + b, 0)
  const totalCartao = dados.cartao
  const totalGastos = totalFixos + totalCartao + totalVariaveis
  const percentual = dados.receita > 0 ? Math.round((totalGastos / dados.receita) * 100) : 0

  return (
    <div style={{ minHeight:'100vh', background:'#fff', display:'flex', flexDirection:'column' }}>
      <Header etapa={etapa} total={ETAPAS.length - 1} onVoltar={() => setEtapa(e => e - 1)} />

      <main style={{
        flex:1, maxWidth:560, margin:'0 auto',
        padding:'36px 24px 100px', width:'100%',
        animation:'slideIn 0.3s ease forwards',
      }} key={etapa}>

        {/* ── ETAPA 1: Problema ── */}
        {etapaAtual === 'problema' && (
          <div>
            <div style={{ fontSize:12, fontWeight:800, color:'#f97316', letterSpacing:'0.1em', marginBottom:12 }}>
              IDENTIFICAÇÃO
            </div>
            <h2 style={{ fontSize:'clamp(22px,6vw,30px)', fontWeight:800, color:'#0f0f0f', marginBottom:8, lineHeight:1.2, letterSpacing:'-0.01em' }}>
              Qual dessas frases descreve você hoje?
            </h2>
            <p style={{ fontSize:15, color:'#737373', marginBottom:32 }}>
              Seja honesto — esse é o ponto de partida do seu diagnóstico.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[
                { valor:'a', icone:'📅', label:'Meu dinheiro acaba antes do mês terminar',       desc:'Sempre aperto no final do mês' },
                { valor:'b', icone:'❓', label:'Sei que gasto, mas não sei para onde vai',        desc:'O dinheiro some sem deixar rastro' },
                { valor:'c', icone:'💸', label:'Ganho bem mas não sobra nada no fim do mês',      desc:'Boa renda, sem resultado' },
                { valor:'d', icone:'📉', label:'Minha renda é instável e isso me deixa no limite',desc:'Cada mês é uma surpresa' },
              ].map(o => (
                <OpcaoCard key={o.valor} {...o} selecionado={dados.problema === o.valor} onSelect={v => set('problema', v)} />
              ))}
            </div>
          </div>
        )}

        {/* ── ETAPA 2: Receita ── */}
        {etapaAtual === 'receita' && (
          <div>
            <div style={{ fontSize:12, fontWeight:800, color:'#f97316', letterSpacing:'0.1em', marginBottom:12 }}>
              SUA RENDA
            </div>
            <h2 style={{ fontSize:'clamp(22px,6vw,30px)', fontWeight:800, color:'#0f0f0f', marginBottom:8, lineHeight:1.2 }}>
              Quanto entra na sua conta por mês?
            </h2>
            <p style={{ fontSize:15, color:'#737373', marginBottom:32 }}>
              Some todas as fontes: salário, freelas, aluguéis, bicos. Use o valor líquido.
            </p>
            <div style={{ marginBottom:24 }}>
              <div style={{ position:'relative' }}>
                <span style={{
                  position:'absolute', left:18, top:'50%', transform:'translateY(-50%)',
                  fontSize:22, fontWeight:700, color:'#a3a3a3', pointerEvents:'none',
                }}>R$</span>
                <input
                  type="tel" inputMode="numeric" autoFocus
                  value={dados.receita ? Number(dados.receita).toLocaleString('pt-BR') : ''}
                  onChange={e => {
                    const d = e.target.value.replace(/\D/g,'')
                    set('receita', Number(d) || 0)
                  }}
                  placeholder="0"
                  style={{
                    width:'100%', padding:'20px 20px 20px 68px',
                    background:'#fff', border:'2px solid #e5e5e5',
                    borderRadius:14, fontSize:36, fontWeight:900,
                    color:'#0f0f0f', outline:'none', letterSpacing:'-0.02em',
                    transition:'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={e => { e.target.style.borderColor='#f97316'; e.target.style.boxShadow='0 0 0 3px rgba(249,115,22,0.1)' }}
                  onBlur={e  => { e.target.style.borderColor='#e5e5e5'; e.target.style.boxShadow='none' }}
                />
              </div>
              <p style={{ fontSize:13, color:'#a3a3a3', marginTop:10 }}>
                💡 Use o valor que realmente cai na sua conta
              </p>
            </div>

            <p style={{ fontSize:15, fontWeight:700, color:'#0f0f0f', marginBottom:12 }}>
              Sua renda é:
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[
                { valor:'fixa',    icone:'💼', label:'Fixa',    desc:'Salário CLT ou valor fixo todo mês' },
                { valor:'variavel',icone:'📊', label:'Variável',desc:'Freela, autônomo, comissão, MEI' },
                { valor:'mista',   icone:'⚖️', label:'Mista',   desc:'Parte fixa + parte variável' },
              ].map(o => (
                <OpcaoCard key={o.valor} {...o} selecionado={dados.tipoRenda === o.valor} onSelect={v => set('tipoRenda', v)} />
              ))}
            </div>
          </div>
        )}

        {/* ── ETAPA 3: Fixos ── */}
        {etapaAtual === 'fixos' && (
          <div>
            <div style={{ fontSize:12, fontWeight:800, color:'#f97316', letterSpacing:'0.1em', marginBottom:12 }}>
              DESPESAS FIXAS
            </div>
            <h2 style={{ fontSize:'clamp(20px,5vw,26px)', fontWeight:800, color:'#0f0f0f', marginBottom:8, lineHeight:1.2 }}>
              Seus compromissos todo mês
            </h2>
            <p style={{ fontSize:15, color:'#737373', marginBottom:24 }}>
              São os gastos que você paga independente do que aconteça. Deixe em zero o que não se aplica.
            </p>

            {/* Resumo parcial */}
            {totalFixos > 0 && dados.receita > 0 && (
              <div style={{
                background:'#fff4ed', border:'1px solid #fed7aa',
                borderRadius:10, padding:'12px 16px', marginBottom:20,
                display:'flex', justifyContent:'space-between', alignItems:'center',
              }}>
                <span style={{ fontSize:13, color:'#92400e', fontWeight:600 }}>
                  Fixos até agora:
                </span>
                <div style={{ textAlign:'right' }}>
                  <span style={{ fontSize:16, fontWeight:800, color:'#f97316' }}>
                    {formatarMoeda(totalFixos)}
                  </span>
                  <span style={{ fontSize:12, color:'#92400e', marginLeft:8 }}>
                    ({Math.round((totalFixos/dados.receita)*100)}% da renda)
                  </span>
                </div>
              </div>
            )}

            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <InputMoeda icone="🏠" label="Aluguel / Financiamento" valor={dados.fixos.aluguel} onChange={v => setFixo('aluguel', v)} />
              <InputMoeda icone="💡" label="Luz / Água / Gás" valor={dados.fixos.contasBasicas} onChange={v => setFixo('contasBasicas', v)} />
              <InputMoeda icone="📱" label="Internet / Celular" valor={dados.fixos.internetCelular} onChange={v => setFixo('internetCelular', v)} />
              <InputMoeda icone="🏥" label="Plano de saúde" valor={dados.fixos.planoSaude} onChange={v => setFixo('planoSaude', v)} />
              <InputMoeda icone="💳" label="Parcelas / Crédito" valor={dados.fixos.parcelasCredito} onChange={v => setFixo('parcelasCredito', v)} />
              <InputMoeda icone="🎓" label="Escola / Faculdade" valor={dados.fixos.escolaFaculdade} onChange={v => setFixo('escolaFaculdade', v)} />
            </div>
          </div>
        )}

        {/* ── ETAPA 4: Cartão ── */}
        {etapaAtual === 'cartao' && (
          <div>
            <div style={{ fontSize:12, fontWeight:800, color:'#dc2626', letterSpacing:'0.1em', marginBottom:12 }}>
              ATENÇÃO: CARTÃO DE CRÉDITO
            </div>
            <h2 style={{ fontSize:'clamp(20px,5vw,26px)', fontWeight:800, color:'#0f0f0f', marginBottom:8, lineHeight:1.2 }}>
              Quanto vai na fatura do cartão por mês?
            </h2>
            <p style={{ fontSize:15, color:'#737373', marginBottom:12 }}>
              Esse é o maior vilão invisível das finanças. Inclua tudo que você coloca no crédito — compras, assinaturas, qualquer coisa.
            </p>

            {/* Alerta cartão */}
            <div style={{
              background:'#fef2f2', border:'1px solid #fecaca',
              borderRadius:10, padding:'14px 16px', marginBottom:24,
              display:'flex', gap:10, alignItems:'flex-start',
            }}>
              <span style={{ fontSize:18, flexShrink:0 }}>⚠️</span>
              <p style={{ fontSize:13, color:'#991b1b', lineHeight:1.5 }}>
                <strong>Por que separar?</strong> O cartão cria uma ilusão de que você tem dinheiro quando não tem. Muitas pessoas só percebem o rombo quando a fatura chega.
              </p>
            </div>

            <div style={{ position:'relative', marginBottom:16 }}>
              <span style={{
                position:'absolute', left:18, top:'50%', transform:'translateY(-50%)',
                fontSize:22, fontWeight:700, color:'#a3a3a3', pointerEvents:'none',
              }}>R$</span>
              <input
                type="tel" inputMode="numeric" autoFocus
                value={dados.cartao ? Number(dados.cartao).toLocaleString('pt-BR') : ''}
                onChange={e => {
                  const d = e.target.value.replace(/\D/g,'')
                  set('cartao', Number(d) || 0)
                }}
                placeholder="0"
                style={{
                  width:'100%', padding:'20px 20px 20px 68px',
                  background:'#fff', border:'2px solid #e5e5e5',
                  borderRadius:14, fontSize:36, fontWeight:900,
                  color:'#0f0f0f', outline:'none', letterSpacing:'-0.02em',
                  transition:'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={e => { e.target.style.borderColor='#dc2626'; e.target.style.boxShadow='0 0 0 3px rgba(220,38,38,0.1)' }}
                onBlur={e  => { e.target.style.borderColor='#e5e5e5'; e.target.style.boxShadow='none' }}
              />
            </div>

            {dados.cartao > 0 && dados.receita > 0 && (
              <div style={{
                background: Math.round((dados.cartao/dados.receita)*100) > 30 ? '#fef2f2' : '#fff4ed',
                border: `1px solid ${Math.round((dados.cartao/dados.receita)*100) > 30 ? '#fecaca' : '#fed7aa'}`,
                borderRadius:10, padding:'12px 16px',
                display:'flex', justifyContent:'space-between', alignItems:'center',
              }}>
                <span style={{ fontSize:13, fontWeight:600, color:'#525252' }}>
                  Peso do cartão na sua renda:
                </span>
                <span style={{
                  fontSize:20, fontWeight:900,
                  color: Math.round((dados.cartao/dados.receita)*100) > 30 ? '#dc2626' : '#f97316',
                }}>
                  {Math.round((dados.cartao/dados.receita)*100)}%
                </span>
              </div>
            )}

            <p style={{ fontSize:13, color:'#a3a3a3', marginTop:12 }}>
              Não usa cartão? Deixe em zero e avance.
            </p>
          </div>
        )}

        {/* ── ETAPA 5: Variáveis ── */}
        {etapaAtual === 'variaveis' && (
          <div>
            <div style={{ fontSize:12, fontWeight:800, color:'#f97316', letterSpacing:'0.1em', marginBottom:12 }}>
              DESPESAS VARIÁVEIS
            </div>
            <h2 style={{ fontSize:'clamp(20px,5vw,26px)', fontWeight:800, color:'#0f0f0f', marginBottom:8, lineHeight:1.2 }}>
              Onde seu dinheiro escorrega sem você perceber
            </h2>
            <p style={{ fontSize:15, color:'#737373', marginBottom:24 }}>
              Estime uma média mensal. Não precisa ser exato — seja honesto.
            </p>

            {/* Resumo geral */}
            {dados.receita > 0 && (
              <div style={{
                background:'#f9f8f6', border:'1px solid #e5e5e5',
                borderRadius:12, padding:'14px 16px', marginBottom:20,
              }}>
                <div style={{ fontSize:12, color:'#737373', marginBottom:8, fontWeight:600 }}>
                  TOTAL DE GASTOS ATÉ AGORA
                </div>
                <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
                  <div>
                    <div style={{ fontSize:11, color:'#a3a3a3' }}>Fixos</div>
                    <div style={{ fontSize:15, fontWeight:700, color:'#0f0f0f' }}>{formatarMoeda(totalFixos)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:11, color:'#a3a3a3' }}>Cartão</div>
                    <div style={{ fontSize:15, fontWeight:700, color:'#dc2626' }}>{formatarMoeda(totalCartao)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:11, color:'#a3a3a3' }}>Variáveis</div>
                    <div style={{ fontSize:15, fontWeight:700, color:'#f97316' }}>{formatarMoeda(totalVariaveis)}</div>
                  </div>
                  <div style={{ marginLeft:'auto' }}>
                    <div style={{ fontSize:11, color:'#a3a3a3' }}>Total / Renda</div>
                    <div style={{ fontSize:15, fontWeight:800, color: percentual > 90 ? '#dc2626' : percentual > 80 ? '#d97706' : '#16a34a' }}>
                      {percentual}%
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <InputMoeda icone="🛒" label="Alimentação / Mercado / Delivery" valor={dados.variaveis.alimentacao} onChange={v => setVariavel('alimentacao', v)} />
              <InputMoeda icone="🚗" label="Transporte / Combustível / Uber" valor={dados.variaveis.transporte} onChange={v => setVariavel('transporte', v)} />
              <InputMoeda icone="🎭" label="Lazer / Restaurantes / Passeios" valor={dados.variaveis.lazer} onChange={v => setVariavel('lazer', v)} />
              <InputMoeda icone="📺" label="Assinaturas (streaming, apps)" valor={dados.variaveis.assinaturas} onChange={v => setVariavel('assinaturas', v)} />
              <InputMoeda icone="👕" label="Roupas / Compras diversas" valor={dados.variaveis.roupasCompras} onChange={v => setVariavel('roupasCompras', v)} />
              <InputMoeda icone="📦" label="Outros / Imprevistos" valor={dados.variaveis.outros} onChange={v => setVariavel('outros', v)} />
            </div>
          </div>
        )}

      </main>

      <BotaoAvancar
        onClick={avancar}
        disabled={!podeAvancar()}
        label={etapa === ETAPAS.length - 2 ? 'Gerar meu diagnóstico' : 'Continuar'}
      />
    </div>
  )
}
