import React, { useState, useEffect } from 'react'
import { formatarMoeda } from '../logica.js'

function Header({ etapa, total, onVoltar }) {
  return (
    <header style={{ background:'#fff', padding:'16px 24px', borderBottom:'1px solid #e5e5e5', position:'sticky', top:0, zIndex:10 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#f97316' }} />
          <span style={{ fontSize:13, fontWeight:700, color:'#0f0f0f' }}>O Hábito da Economia</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {etapa > 0 && (
            <button onClick={onVoltar} style={{ background:'none', border:'none', color:'#737373', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path d="M16 10H4M10 4l-6 6 6 6" stroke="#737373" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Voltar
            </button>
          )}
          <span style={{ fontSize:12, color:'#a3a3a3' }}>{etapa + 1}/{total}</span>
        </div>
      </div>
      <div style={{ height:4, background:'#f5f5f5', borderRadius:2 }}>
        <div style={{ height:'100%', borderRadius:2, background:'#f97316', width:`${((etapa+1)/total)*100}%`, transition:'width 0.4s ease' }}/>
      </div>
    </header>
  )
}

function BotaoAvancar({ onClick, disabled, label }) {
  return (
    <div style={{ padding:'16px 24px', background:'#fff', borderTop:'1px solid #e5e5e5', position:'sticky', bottom:0 }}>
      <button onClick={onClick} disabled={disabled} style={{
        width:'100%', padding:'16px', background:disabled?'#e5e5e5':'#f97316', color:disabled?'#a3a3a3':'#fff',
        borderRadius:12, fontSize:16, fontWeight:700, border:'none', cursor:disabled?'not-allowed':'pointer',
        display:'flex', alignItems:'center', justifyContent:'center', gap:8,
        boxShadow:disabled?'none':'0 4px 14px rgba(249,115,22,0.3)', transition:'all 0.2s',
      }}>
        {label}
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M4 10h12M10 4l6 6-6 6" stroke={disabled?'#a3a3a3':'#fff'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}

function OpcaoCard({ valor, label, desc, icone, selecionado, onSelect }) {
  return (
    <button onClick={() => onSelect(valor)} style={{
      width:'100%', textAlign:'left', padding:'16px 20px', borderRadius:12, cursor:'pointer',
      background:selecionado?'#fff4ed':'#fff', border:`2px solid ${selecionado?'#f97316':'#e5e5e5'}`,
      transition:'all 0.15s', display:'flex', alignItems:'center', gap:14,
    }}>
      <span style={{ fontSize:22, flexShrink:0 }}>{icone}</span>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:15, fontWeight:700, color:selecionado?'#f97316':'#0f0f0f' }}>{label}</div>
        {desc && <div style={{ fontSize:13, color:'#737373', marginTop:2 }}>{desc}</div>}
      </div>
      {selecionado && (
        <div style={{ width:22, height:22, borderRadius:'50%', background:'#f97316', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </button>
  )
}

// Limite máximo por campo: R$ 99.999
const LIMITE_CAMPO = 99999

function InputMoeda({ valor, onChange, destaque, icone, label, placeholder = '0', autoFocus = false }) {
  const display = valor > 0 ? Number(valor).toLocaleString('pt-BR') : ''
  function handle(e) {
    const d = e.target.value.replace(/\D/g, '')
    const v = Number(d) || 0
    onChange(Math.min(v, LIMITE_CAMPO))
  }
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:12, padding:'12px 16px',
      background:destaque?'#fef2f2':'#fff',
      border:`1.5px solid ${destaque?'#fecaca':'#e5e5e5'}`,
      borderRadius:10,
    }}>
      {icone && <span style={{ fontSize:20, flexShrink:0 }}>{icone}</span>}
      {label && <label style={{ fontSize:14, fontWeight:600, color:'#525252', flex:1 }}>{label}</label>}
      <div style={{ display:'flex', alignItems:'center', gap:4, flexShrink:0 }}>
        <span style={{ fontSize:13, fontWeight:700, color:'#a3a3a3' }}>R$</span>
        <input
          type="tel" inputMode="numeric"
          value={display}
          onChange={handle}
          placeholder={placeholder}
          autoFocus={autoFocus}
          style={{
            width: label ? 100 : '100%', padding:'8px 10px',
            background:'#f9f8f6', border:`1.5px solid ${destaque?'#fecaca':'#e5e5e5'}`,
            borderRadius:8, fontSize:16, fontWeight:700,
            color:'#0f0f0f', outline:'none', textAlign:'right',
          }}
          onFocus={e => { e.target.style.borderColor=destaque?'#dc2626':'#f97316'; e.target.style.boxShadow=`0 0 0 3px ${destaque?'rgba(220,38,38,0.1)':'rgba(249,115,22,0.1)'}` }}
          onBlur={e  => { e.target.style.borderColor=destaque?'#fecaca':'#e5e5e5'; e.target.style.boxShadow='none' }}
        />
      </div>
    </div>
  )
}

function SecaoDespesas({ titulo, icone, cor, campos, valores, onChange }) {
  const total = campos.reduce((a, c) => a + (Number(valores[c.key]) || 0), 0)
  return (
    <div style={{ marginBottom:8 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', marginBottom:8, borderBottom:`2px solid ${cor}20` }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:18 }}>{icone}</span>
          <span style={{ fontSize:14, fontWeight:800, color:'#0f0f0f', textTransform:'uppercase', letterSpacing:'0.05em' }}>{titulo}</span>
        </div>
        {total > 0 && <span style={{ fontSize:14, fontWeight:800, color:cor }}>{formatarMoeda(total)}</span>}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {campos.map(c => (
          <InputMoeda
            key={c.key}
            icone={c.icone}
            label={c.label}
            valor={valores[c.key] || 0}
            onChange={v => onChange(c.key, v)}
          />
        ))}
      </div>
    </div>
  )
}

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
    const t = setInterval(() => {
      setFase(f => {
        const next = f + 1
        if (next >= frases.length) { clearInterval(t); setTimeout(onConcluir, 700) }
        return next < frases.length ? next : f
      })
      setProgresso(p => Math.min(p + 26, 100))
    }, 900)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ minHeight:'100vh', background:'#0f0f0f', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 24px', gap:32 }}>
      <div style={{ width:80, height:80, borderRadius:'50%', background:'rgba(249,115,22,0.1)', border:'2px solid rgba(249,115,22,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" style={{ animation:'spin 1.5s linear infinite' }}>
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div style={{ textAlign:'center', maxWidth:320 }}>
        <h2 style={{ fontSize:22, fontWeight:800, color:'#fff', marginBottom:10 }}>Analisando seu perfil...</h2>
        <p style={{ fontSize:15, color:'#f97316', fontWeight:500, minHeight:24 }}>{frases[fase]}</p>
      </div>
      <div style={{ width:'100%', maxWidth:320 }}>
        <div style={{ height:6, background:'#1a1a1a', borderRadius:3, overflow:'hidden' }}>
          <div style={{ height:'100%', background:'#f97316', borderRadius:3, width:`${progresso}%`, transition:'width 0.8s ease' }}/>
        </div>
        <div style={{ textAlign:'right', marginTop:8, fontSize:13, color:'#525252' }}>{progresso}%</div>
      </div>
      <p style={{ fontSize:13, color:'#525252', textAlign:'center', maxWidth:280 }}>Comparando com o padrão ideal do Método 6 Caixas</p>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

const ETAPAS = ['problema', 'receita', 'despesas', 'loading']
const LIMITE_RECEITA = 999999
const LIMITE_TOTAL_GASTOS = 999999

export default function TelaOnboarding({ onConcluir, dadosIniciais }) {
  const [etapa, setEtapa] = useState(dadosIniciais ? 2 : 0)
  const [dados, setDados] = useState(dadosIniciais || {
    problema:'', receita:0, tipoRenda:'',
    fixos: { aluguel:0, contasBasicas:0, internetCelular:0, planoSaude:0, parcelasCredito:0, escolaFaculdade:0 },
    cartao: 0,
    usoCartao: '',
    variaveis: { alimentacao:0, transporte:0, lazer:0, assinaturas:0, roupasCompras:0, outros:0 },
  })

  const etapaAtual = ETAPAS[etapa]
  const totalFixos     = Object.values(dados.fixos).reduce((a,b) => a+(Number(b)||0), 0)
  const totalVariaveis = Object.values(dados.variaveis).reduce((a,b) => a+(Number(b)||0), 0)
  const totalCartao    = Number(dados.cartao) || 0
  const totalGastos    = totalFixos + totalCartao + totalVariaveis
  const percentual     = dados.receita > 0 ? Math.round((totalGastos/dados.receita)*100) : 0
  const corPercentual  = percentual > 90 ? '#dc2626' : percentual > 80 ? '#d97706' : '#16a34a'
  const gastosAbsurdos = totalGastos > LIMITE_TOTAL_GASTOS

  function podeAvancar() {
    if (etapaAtual === 'problema') return !!dados.problema
    if (etapaAtual === 'receita')  return dados.receita > 0 && dados.receita <= LIMITE_RECEITA && !!dados.tipoRenda
    if (etapaAtual === 'despesas') return !gastosAbsurdos
    return true
  }

  function avancar() {
    if (!podeAvancar()) return
    setEtapa(e => e + 1)
  }

  if (etapaAtual === 'loading') return <TelaLoading onConcluir={() => onConcluir(dados)} />

  return (
    <div style={{ minHeight:'100vh', background:'#fff', display:'flex', flexDirection:'column' }}>
      <Header etapa={etapa} total={ETAPAS.length - 1} onVoltar={() => setEtapa(e => e - 1)} />

      <main style={{ flex:1, maxWidth:560, margin:'0 auto', padding:'32px 24px 24px', width:'100%' }} key={etapa}>

        {etapaAtual === 'problema' && (
          <div style={{ animation:'slideIn 0.3s ease forwards' }}>
            <div style={{ fontSize:12, fontWeight:800, color:'#f97316', letterSpacing:'0.1em', marginBottom:12 }}>IDENTIFICAÇÃO</div>
            <h2 style={{ fontSize:'clamp(22px,6vw,30px)', fontWeight:800, color:'#0f0f0f', marginBottom:8, lineHeight:1.2 }}>
              Qual dessas frases descreve você hoje?
            </h2>
            <p style={{ fontSize:15, color:'#737373', marginBottom:32 }}>Seja honesto — esse é o ponto de partida do seu diagnóstico.</p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[
                { valor:'a', icone:'📅', label:'Meu dinheiro acaba antes do mês terminar',        desc:'Sempre aperto no final do mês' },
                { valor:'b', icone:'❓', label:'Sei que gasto, mas não sei para onde vai',         desc:'O dinheiro some sem deixar rastro' },
                { valor:'c', icone:'💸', label:'Ganho bem mas não sobra nada no fim do mês',       desc:'Boa renda, sem resultado' },
                { valor:'d', icone:'📉', label:'Minha renda é instável e isso me deixa no limite', desc:'Cada mês é uma surpresa' },
              ].map(o => (
                <OpcaoCard key={o.valor} {...o} selecionado={dados.problema===o.valor} onSelect={v=>setDados(d=>({...d,problema:v}))} />
              ))}
            </div>
          </div>
        )}

        {etapaAtual === 'receita' && (
          <div style={{ animation:'slideIn 0.3s ease forwards' }}>
            <div style={{ fontSize:12, fontWeight:800, color:'#f97316', letterSpacing:'0.1em', marginBottom:12 }}>SUA RENDA</div>
            <h2 style={{ fontSize:'clamp(22px,6vw,30px)', fontWeight:800, color:'#0f0f0f', marginBottom:8, lineHeight:1.2 }}>
              Quanto entra na sua conta por mês?
            </h2>
            <p style={{ fontSize:15, color:'#737373', marginBottom:28 }}>Some todas as fontes: salário, freelas, aluguéis. Use o valor líquido.</p>
            <div style={{ position:'relative', marginBottom:10 }}>
              <span style={{ position:'absolute', left:18, top:'50%', transform:'translateY(-50%)', fontSize:24, fontWeight:700, color:'#a3a3a3', pointerEvents:'none' }}>R$</span>
              <input
                type="tel" inputMode="numeric" autoFocus
                value={dados.receita > 0 ? Number(dados.receita).toLocaleString('pt-BR') : ''}
                onChange={e => {
                  const d = e.target.value.replace(/\D/g,'')
                  const v = Number(d) || 0
                  setDados(p=>({...p, receita: Math.min(v, LIMITE_RECEITA)}))
                }}
                placeholder="0"
                style={{ width:'100%', padding:'20px 20px 20px 68px', background:'#fff', border:'2px solid #e5e5e5', borderRadius:14, fontSize:36, fontWeight:900, color:'#0f0f0f', outline:'none', letterSpacing:'-0.02em', transition:'border-color 0.2s, box-shadow 0.2s' }}
                onFocus={e=>{ e.target.style.borderColor='#f97316'; e.target.style.boxShadow='0 0 0 3px rgba(249,115,22,0.1)' }}
                onBlur={e=>{ e.target.style.borderColor='#e5e5e5'; e.target.style.boxShadow='none' }}
              />
            </div>
            <p style={{ fontSize:13, color:'#a3a3a3', marginBottom:28 }}>💡 Use o valor que realmente cai na sua conta</p>
            <p style={{ fontSize:15, fontWeight:700, color:'#0f0f0f', marginBottom:12 }}>Sua renda é:</p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[
                { valor:'fixa',    icone:'💼', label:'Fixa',    desc:'Salário CLT ou valor fixo todo mês' },
                { valor:'variavel',icone:'📊', label:'Variável',desc:'Freela, autônomo, comissão, MEI' },
                { valor:'mista',   icone:'⚖️', label:'Mista',   desc:'Parte fixa + parte variável' },
              ].map(o => (
                <OpcaoCard key={o.valor} {...o} selecionado={dados.tipoRenda===o.valor} onSelect={v=>setDados(d=>({...d,tipoRenda:v}))} />
              ))}
            </div>
          </div>
        )}

        {etapaAtual === 'despesas' && (
          <div style={{ animation:'slideIn 0.3s ease forwards' }}>
            <div style={{ fontSize:12, fontWeight:800, color:'#f97316', letterSpacing:'0.1em', marginBottom:12 }}>SUAS DESPESAS</div>
            <h2 style={{ fontSize:'clamp(20px,5vw,26px)', fontWeight:800, color:'#0f0f0f', marginBottom:8, lineHeight:1.2 }}>
              Para onde vai o seu dinheiro?
            </h2>
            <p style={{ fontSize:15, color:'#737373', marginBottom:20 }}>Preencha o que se aplica. O total aparece ao vivo.</p>

            <div style={{ background:'#f9f8f6', border:'1px solid #e5e5e5', borderRadius:14, padding:'16px', marginBottom:24, position:'sticky', top:72, zIndex:5 }}>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12 }}>
                {[
                  { label:'Fixos',     valor:totalFixos,     cor:'#525252' },
                  { label:'Cartão',    valor:totalCartao,    cor:'#dc2626' },
                  { label:'Variáveis', valor:totalVariaveis, cor:'#f97316' },
                ].map(m => (
                  <div key={m.label} style={{ flex:1, minWidth:80, textAlign:'center' }}>
                    <div style={{ fontSize:11, color:'#a3a3a3', marginBottom:2 }}>{m.label}</div>
                    <div style={{ fontSize:15, fontWeight:800, color:m.valor>0?m.cor:'#d4d4d4' }}>
                      {m.valor > 0 ? formatarMoeda(m.valor) : 'R$ 0'}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop:'1px solid #e5e5e5', paddingTop:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13, fontWeight:700, color:'#0f0f0f' }}>Total: {formatarMoeda(totalGastos)}</span>
                {dados.receita > 0 && (
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:80, height:6, background:'#e5e5e5', borderRadius:3, overflow:'hidden' }}>
                      <div style={{ height:'100%', borderRadius:3, background:corPercentual, width:`${Math.min(percentual,100)}%`, transition:'width 0.4s ease' }}/>
                    </div>
                    <span style={{ fontSize:14, fontWeight:800, color:corPercentual }}>{percentual}%</span>
                  </div>
                )}
              </div>
              {gastosAbsurdos && (
                <div style={{ marginTop:10, background:'#fef2f2', borderRadius:8, padding:'8px 12px', fontSize:13, color:'#991b1b', fontWeight:600 }}>
                  ⚠️ Total de gastos não pode ultrapassar {formatarMoeda(LIMITE_TOTAL_GASTOS)}. Revise os valores.
                </div>
              )}
              {!gastosAbsurdos && percentual > 90 && <div style={{ marginTop:10, background:'#fef2f2', borderRadius:8, padding:'8px 12px', fontSize:13, color:'#991b1b', fontWeight:600 }}>⚠️ Seus gastos comprometem {percentual}% da renda — isso é crítico.</div>}
              {!gastosAbsurdos && percentual > 80 && percentual <= 90 && <div style={{ marginTop:10, background:'#fffbeb', borderRadius:8, padding:'8px 12px', fontSize:13, color:'#92400e', fontWeight:600 }}>⚡ Atenção: {percentual}% da renda comprometida.</div>}
            </div>

            <SecaoDespesas
              titulo="Despesas Fixas" icone="📌" cor="#525252"
              campos={[
                { key:'aluguel',         icone:'🏠', label:'Aluguel / Financiamento' },
                { key:'contasBasicas',   icone:'💡', label:'Luz / Água / Gás' },
                { key:'internetCelular', icone:'📱', label:'Internet / Celular' },
                { key:'planoSaude',      icone:'🏥', label:'Plano de saúde' },
                { key:'parcelasCredito', icone:'💳', label:'Parcelas / Empréstimos' },
                { key:'escolaFaculdade', icone:'🎓', label:'Escola / Faculdade' },
              ]}
              valores={dados.fixos}
              onChange={(k,v) => setDados(d=>({...d, fixos:{...d.fixos,[k]:v}}))}
            />

            <div style={{ height:1, background:'#e5e5e5', margin:'20px 0' }} />

            <div style={{ marginBottom:8 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', marginBottom:8, borderBottom:'2px solid rgba(220,38,38,0.15)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:18 }}>💳</span>
                  <span style={{ fontSize:14, fontWeight:800, color:'#0f0f0f', textTransform:'uppercase', letterSpacing:'0.05em' }}>Cartão de Crédito</span>
                  <span style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:700, color:'#dc2626' }}>⚠️ maior vilão</span>
                </div>
                {totalCartao > 0 && <span style={{ fontSize:14, fontWeight:800, color:'#dc2626' }}>{formatarMoeda(totalCartao)}</span>}
              </div>

              <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:'#fef2f2', border:'1.5px solid #fecaca', borderRadius:10 }}>
                <span style={{ fontSize:20, flexShrink:0 }}>💳</span>
                <label style={{ fontSize:14, fontWeight:600, color:'#525252', flex:1 }}>Total da fatura mensal</label>
                <div style={{ display:'flex', alignItems:'center', gap:4, flexShrink:0 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:'#a3a3a3' }}>R$</span>
                  <input
                    type="tel" inputMode="numeric"
                    value={dados.cartao > 0 ? Number(dados.cartao).toLocaleString('pt-BR') : ''}
                    onChange={e => {
                      const d = e.target.value.replace(/\D/g,'')
                      const v = Number(d) || 0
                      setDados(p => ({...p, cartao: Math.min(v, LIMITE_CAMPO)}))
                    }}
                    placeholder="0"
                    style={{ width:100, padding:'8px 10px', background:'#fff', border:'1.5px solid #fecaca', borderRadius:8, fontSize:16, fontWeight:700, color:'#0f0f0f', outline:'none', textAlign:'right' }}
                    onFocus={e => { e.target.style.borderColor='#dc2626'; e.target.style.boxShadow='0 0 0 3px rgba(220,38,38,0.1)' }}
                    onBlur={e  => { e.target.style.borderColor='#fecaca'; e.target.style.boxShadow='none' }}
                  />
                </div>
              </div>
              <p style={{ fontSize:12, color:'#a3a3a3', marginTop:8, paddingLeft:4 }}>Inclua compras parceladas, assinaturas e qualquer gasto no crédito</p>

              {dados.cartao > 0 && (
                <div style={{ marginTop:14 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:'#0f0f0f', marginBottom:10 }}>Seu cartão é usado principalmente para:</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {[
                      { valor:'essencial', icone:'🏠', label:'Pagar contas do dia a dia', desc:'Mercado, combustível, contas, remédios' },
                      { valor:'lazer',     icone:'🎭', label:'Lazer e compras',            desc:'Restaurantes, roupas, viagens, entretenimento' },
                      { valor:'misto',     icone:'⚖️', label:'Os dois misturados',         desc:'Tanto essencial quanto lazer' },
                    ].map(o => (
                      <button
                        key={o.valor}
                        onClick={() => setDados(d=>({...d, usoCartao:o.valor}))}
                        style={{
                          width:'100%', textAlign:'left', padding:'12px 16px', borderRadius:10, cursor:'pointer',
                          background:dados.usoCartao===o.valor?'#fef2f2':'#fff',
                          border:`1.5px solid ${dados.usoCartao===o.valor?'#dc2626':'#e5e5e5'}`,
                          display:'flex', alignItems:'center', gap:12, transition:'all 0.15s',
                        }}
                      >
                        <span style={{ fontSize:18, flexShrink:0 }}>{o.icone}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:14, fontWeight:700, color:dados.usoCartao===o.valor?'#dc2626':'#0f0f0f' }}>{o.label}</div>
                          <div style={{ fontSize:12, color:'#737373', marginTop:1 }}>{o.desc}</div>
                        </div>
                        {dados.usoCartao===o.valor && (
                          <div style={{ width:20, height:20, borderRadius:'50%', background:'#dc2626', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ height:1, background:'#e5e5e5', margin:'20px 0' }} />

            <SecaoDespesas
              titulo="Despesas Variáveis" icone="📊" cor="#f97316"
              campos={[
                { key:'alimentacao',   icone:'🛒', label:'Alimentação / Mercado / Delivery' },
                { key:'transporte',    icone:'🚗', label:'Transporte / Combustível / Uber' },
                { key:'lazer',         icone:'🎭', label:'Lazer / Restaurantes / Passeios' },
                { key:'assinaturas',   icone:'📺', label:'Assinaturas (streaming, apps)' },
                { key:'roupasCompras', icone:'👕', label:'Roupas / Compras diversas' },
                { key:'outros',        icone:'📦', label:'Outros / Imprevistos' },
              ]}
              valores={dados.variaveis}
              onChange={(k,v) => setDados(d=>({...d, variaveis:{...d.variaveis,[k]:v}}))}
            />

            <div style={{ height:60 }} />
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
