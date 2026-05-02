# Diagnóstico Financeiro — Método 6 Caixas

App de diagnóstico financeiro que descobre em quantos dias o caixa do usuário vai acabar e o direciona para a planilha do Método 6 Caixas.

---

## Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em desenvolvimento
npm run dev

# 3. Abrir no navegador
# http://localhost:5173
```

---

## Configuração essencial

Abra o arquivo `src/logica.js` e troque o link do CTA:

```js
export const CONFIG = {
  CTA_URL: 'https://SEU-LINK-DE-VENDA-AQUI.com',
  CTA_LABEL: 'Quero o Método 6 Caixas',
}
```

---

## Deploy no Netlify (gratuito)

### Opção 1 — Via interface (mais fácil)

1. Acesse https://netlify.com e crie uma conta gratuita
2. Clique em "Add new site" → "Deploy manually"
3. Rode `npm run build` localmente
4. Arraste a pasta `dist/` para o Netlify
5. Pronto — você recebe uma URL pública

### Opção 2 — Via GitHub (recomendado para updates futuros)

1. Suba o projeto no GitHub
2. No Netlify: "Add new site" → "Import an existing project"
3. Conecte o repositório
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy automático a cada `git push`

---

## Captura de e-mails com Supabase (opcional)

Para salvar os leads gerados pelo diagnóstico:

### 1. Criar projeto no Supabase (supabase.com — gratuito)

### 2. Criar tabela `leads`:
```sql
create table leads (
  id uuid default gen_random_uuid() primary key,
  email text,
  dias_sobrevivencia int,
  nivel_risco text,
  receita numeric,
  gastos numeric,
  problema text,
  created_at timestamptz default now()
);
```

### 3. Instalar SDK:
```bash
npm install @supabase/supabase-js
```

### 4. Criar arquivo `src/supabase.js`:
```js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'SUA_SUPABASE_URL',
  'SUA_SUPABASE_ANON_KEY'
)
```

### 5. No arquivo `src/pages/TelaDiagnostico.jsx`, substituir o `console.log` por:
```js
import { supabase } from '../supabase.js'

// Dentro do handleEmail:
await supabase.from('leads').insert({
  email,
  dias_sobrevivencia: d.dias,
  nivel_risco: d.risco.nivel,
  receita: d.receita,
  gastos: d.gastos,
  problema: respostas.problema,
})
```

---

## Estrutura do projeto

```
src/
  App.jsx              # Navegação entre telas
  logica.js            # Cálculos e diagnóstico
  index.css            # Design system global
  pages/
    TelaInicio.jsx     # Tela de entrada
    TelaOnboarding.jsx # 4 perguntas sequenciais
    TelaDiagnostico.jsx # Resultado + CTA
```

---

## Fluxo do usuário

```
Tela inicial → 4 perguntas → Diagnóstico (dias de caixa + nível de risco) → CTA Método 6 Caixas
```

Semáforo de risco:
- 🟢 Verde: mais de 30 dias
- 🟡 Amarelo: entre 15 e 30 dias  
- 🔴 Vermelho: menos de 15 dias
