# focal

Dashboard de tarefas do dia, semana, mês e ano — com segmentos, prioridades,
notificações e instalação como app no celular e no computador (PWA).

## O que já está pronto

- Login sem senha (link mágico por e-mail) via Supabase Auth
- Tarefas com título, segmento, prioridade (Alta/Média/Baixa), período
  (dia/semana/mês/ano), data limite e notas
- Segmentos coloridos personalizáveis (Trabalho, Pessoal, Saúde, Finanças,
  Projetos + os que você criar)
- Marcar como feita/não feita, excluir, buscar e filtrar
- Painel com estatísticas (total, feitas, pendentes, urgentes)
- Sincronização em tempo real entre celular e computador (Supabase Realtime)
- Instalável como app (PWA) no Android, iPhone, Windows e Mac
- Notificações locais para tarefas de alta prioridade que vencem hoje

---

## Passo 1 — Criar o projeto no Supabase (gratuito)

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita.
2. Crie um novo projeto (escolha uma senha de banco e guarde-a).
3. No menu lateral, vá em **SQL Editor** → **New query**.
4. Copie todo o conteúdo do arquivo `supabase/schema.sql` deste projeto, cole
   e clique em **Run**. Isso cria as tabelas `tasks` e `segments` com as
   permissões de segurança corretas (cada pessoa só vê suas próprias tarefas).
5. Vá em **Project settings → API**. Copie:
   - **Project URL**
   - **anon public key**

## Passo 2 — Configurar as variáveis de ambiente

1. Renomeie `.env.local.example` para `.env.local`.
2. Cole os valores copiados no passo anterior:

```
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

## Passo 3 — Rodar localmente (opcional, para testar antes do deploy)

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`. Use seu e-mail para entrar — você receberá um
link de acesso por e-mail (verifique a caixa de spam na primeira vez).

> **Dica:** em Supabase → Authentication → URL Configuration, adicione
> `http://localhost:3000/**` e, depois do deploy, também a URL do Vercel em
> **Redirect URLs**, para o link mágico funcionar nos dois ambientes.

## Passo 4 — Subir para o GitHub

```bash
git init
git add .
git commit -m "focal: primeira versão"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/focal.git
git push -u origin main
```

## Passo 5 — Deploy no Vercel (gratuito)

1. Acesse [vercel.com](https://vercel.com) e entre com sua conta do GitHub.
2. Clique em **Add New → Project** e selecione o repositório `focal`.
3. Em **Environment Variables**, adicione as mesmas duas variáveis do
   `.env.local`.
4. Clique em **Deploy**. Em ~1 minuto seu app estará no ar em
   `https://focal-seu-usuario.vercel.app`.
5. Volte ao Supabase → Authentication → URL Configuration e adicione essa URL
   em **Site URL** e **Redirect URLs** (`https://seu-app.vercel.app/**`).

## Passo 6 — Instalar como app no celular e no computador

**Android (Chrome):** abra o link → menu (⋮) → "Adicionar à tela inicial" /
"Instalar app".

**iPhone (Safari):** abra o link → botão de compartilhar → "Adicionar à Tela
de Início".

**Desktop (Chrome/Edge):** abra o link → ícone de instalação na barra de
endereço → "Instalar".

Depois de instalado, o focal abre como um app nativo, em tela cheia, com
ícone próprio.

## Passo 7 — Ativar notificações

Dentro do app, clique em **"Ativar"** na faixa de notificações e aceite a
permissão do navegador. Enquanto o app estiver aberto (ou minimizado em
segundo plano), tarefas de **alta prioridade** com vencimento em **hoje**
disparam um aviso automático.

---

## Domínio próprio (opcional, ~R$ 40/ano)

No Vercel, vá em **Project → Settings → Domains** e adicione seu domínio
(ex: `focal.app` ou `meusfoco.com.br`, comprado em registro.br ou Namecheap).
Siga as instruções de DNS exibidas na tela.

---

## Roadmap — próximos passos sugeridos

| Prioridade | Item | O que envolve |
|---|---|---|
| Alta | Notificações push reais (mesmo com o app fechado) | Configurar Web Push com chaves VAPID, ou conectar OneSignal (gratuito até 10k usuários) |
| Alta | Editar tarefas existentes | Adicionar modal de edição reaproveitando `TaskModal` |
| Média | Resumo diário por e-mail | Supabase Edge Function + cron diário + Resend (e-mail) |
| Média | Modo escuro com botão (hoje segue o sistema) | Toggle salvo em `localStorage`/cookie |
| Média | Tarefas recorrentes (ex: todo dia, toda semana) | Campo `recurrence` + lógica de regeneração |
| Baixa | Login com Google (além do link mágico) | Habilitar provider OAuth no Supabase |
| Baixa | Monetização (planos Pro/Times) | Integração com Stripe + tabela `subscriptions` |

---

## Estrutura do projeto

```
app/
  layout.tsx          → fontes, metadados e configuração PWA
  page.tsx             → dashboard principal (lógica e estado)
  login/page.tsx       → tela de login com link mágico
  auth/callback/        → recebe o retorno do link mágico
components/
  TopBar, Sidebar, StatsBar, FilterBar, TaskList, TaskItem,
  TaskModal, NotificationBanner
lib/
  supabase/            → clientes Supabase (browser e servidor)
  types.ts             → tipos e constantes (segmentos, prioridades, períodos)
  notifications.ts      → permissão e disparo de notificações
public/
  manifest.json, sw.js, icons/  → configuração do PWA
supabase/
  schema.sql           → script para criar as tabelas no Supabase
```
