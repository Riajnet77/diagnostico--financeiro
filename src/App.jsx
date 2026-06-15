import React, { useState } from 'react'
import TelaInicio from './pages/TelaInicio.jsx'
import TelaOnboarding from './pages/TelaOnboarding.jsx'
import TelaDiagnostico from './pages/TelaDiagnostico.jsx'

const TELAS = {
  INICIO: 'inicio',
  ONBOARDING: 'onboarding',
  DIAGNOSTICO: 'diagnostico',
}

export default function App() {
  const [tela, setTela] = useState(TELAS.INICIO)
  const [respostas, setRespostas] = useState(null)

  function handleOnboardingConcluido(dados) {
    setRespostas(dados)
    setTela(TELAS.DIAGNOSTICO)
  }

  function reiniciar() {
    setRespostas(null)
    setTela(TELAS.INICIO)
  }

  function editarLancamentos() {
    setTela(TELAS.ONBOARDING)
  }

  return (
    <>
      {tela === TELAS.INICIO && (
        <TelaInicio onAvancar={() => setTela(TELAS.ONBOARDING)} />
      )}
      {tela === TELAS.ONBOARDING && (
        <TelaOnboarding
          dadosIniciais={respostas}
          onConcluir={handleOnboardingConcluido}
        />
      )}
      {tela === TELAS.DIAGNOSTICO && respostas && (
        <TelaDiagnostico
          respostas={respostas}
          onReiniciar={reiniciar}
          onEditar={editarLancamentos}
        />
      )}
    </>
  )
}
"// force rebuild $(date)" 
