# 💧 SweatTrack v2

> Plataforma clínica full-stack de monitoramento de hidratação e performance esportiva, desenvolvida em parceria com o Centro Universitário São Camilo — baseada em diretrizes científicas de nutrição esportiva.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

---

## Sobre o projeto

SweatTrack v2 é uma aplicação web clínica que auxilia profissionais de saúde e atletas no controle preciso da hidratação antes, durante e após atividades físicas. O sistema calcula taxa de sudorese, déficit hídrico e protocolo de reidratação personalizado com base em dados fisiológicos do atleta — substituindo planilhas manuais por um fluxo clínico guiado e em tempo real.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + Vite, TailwindCSS, Framer Motion, Recharts |
| Roteamento | React Router v6 |
| HTTP | Axios (proxy via Vite → backend) |
| Backend | Node.js + Express |
| Banco de dados | MySQL 8 |
| Auth | JWT + bcrypt |

---

## Estrutura de pastas

```
sweattrack-v2/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── ui/          # Button, Card, Input, Modal, Badge, Spinner, Toast
│       │   ├── layout/      # AppLayout, Sidebar, BottomNav, Header, Logo
│       │   ├── charts/      # HydrationGauge, WeeklyChart, UrineScale
│       │   └── session/     # SessionCard
│       ├── pages/           # Landing, Login, Register, Dashboard, PreSession,
│       │                    # ActiveMonitoring, PostSession, Analytics,
│       │                    # MealPlan, History, Profile, Settings
│       ├── contexts/        # AuthContext
│       ├── services/        # api.js (Axios + all API helpers)
│       └── utils/           # calculations.js
├── backend/
│   └── src/
│       ├── routes/          # auth, sessions, users, analytics, meals
│       ├── controllers/     # authController, sessionController, etc.
│       ├── middleware/      # auth.js (JWT guard)
│       └── config/          # database.js (MySQL pool)
└── database/
    └── schema.sql
```

---

## Pré-requisitos

- Node.js 18+
- MySQL 8+

---

## Setup

### 1. Banco de dados

```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edite .env com suas credenciais MySQL
npm install
npm run dev        # porta 3001
```

Variáveis de ambiente (`.env`):

```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=sweattrack
JWT_SECRET=troque_em_producao
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev        # porta 5173
```

Acesse: **http://localhost:5173**

---

## Conta demo

Após rodar o `schema.sql`, use para teste rápido:

| Campo | Valor |
|-------|-------|
| Email | `demo@sweattrack.com` |
| Senha | `demo1234` |

> Ou clique em **"Preencher com conta demo"** na tela de login.

---

## Funcionalidades

### Fluxo de sessão
1. **Dashboard** → Nova Sessão (modal de tipo + intensidade)
2. **Pré-Sessão** → Peso corporal, coloração da urina (escala WUTS), percepção de sede, condições ambientais
3. **Monitoramento Ativo** → Timer em tempo real, taxa de sudorese estimada, temperatura interna, registro de ingestão hídrica (log incremental), alertas de temperatura
4. **Resumo Pós-Sessão** → Taxa final, perda total, protocolo de recuperação personalizado (volume de reidratação, eletrólitos, monitoramento de urina), estimativa biopsicossocial

### Outras telas
- **Analytics** — índice de hidratação, VO₂ máx, gráfico de tendência de sudorese (7 dias), carga metabólica semanal, observações clínicas
- **Plano Alimentar** — refeições com macros (C/P/G), barra visual de macronutrientes, modal para adicionar alimentos
- **Histórico** — listagem com filtros por intensidade, busca, estatísticas agregadas
- **Perfil** — dados pessoais, físicos, cálculo automático de IMC e peso ideal
- **Configurações** — notificações, tema, unidades, troca de senha, logout

### Design
- Dark mode nativo (tema único)
- Mobile-first com bottom navigation
- Desktop com sidebar animada
- Animações Framer Motion em todas as transições
- Toast notifications globais
- Modais bottom-sheet no mobile

---

## API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/sessions
POST   /api/sessions
GET    /api/sessions/:id
PATCH  /api/sessions/:id/pre
POST   /api/sessions/:id/start
POST   /api/sessions/:id/fluid
PATCH  /api/sessions/:id/temp
POST   /api/sessions/:id/finish
DELETE /api/sessions/:id

GET    /api/analytics/dashboard
GET    /api/analytics/weekly
GET    /api/analytics/hydration-trend

GET    /api/meals
POST   /api/meals
GET    /api/meals/:id
DELETE /api/meals/:id

PUT    /api/users/profile
PUT    /api/users/password
GET    /api/users/notifications
PATCH  /api/users/notifications/:id/read
```

---

## Cálculos implementados

```
Taxa de sudorese (L/h) = (ΔPeso_kg + Ingestão_L) / Duração_h
Déficit hídrico (ml)  = ΔPeso_kg × 1000
Volume de reidratação  = |Déficit| × 1.5   (150% da perda)
Perda de sódio (mg)   = Suor_total_ml × 0.50  (~50 mg/100ml)
Índice de hidratação  = f(cor_urina)  [0–100%]
```

Baseado nas diretrizes:  
*Quaresma et al., 2025 — Nutrição Esportiva Guidelines (MAUA/São Camilo)*

---

## Autor

**Mateo Vuolo Cortez** — [github.com/omateocortez](https://github.com/omateocortez) · [linkedin.com/in/omateocortez](https://linkedin.com/in/omateocortez)

Desenvolvido como projeto de extensão em parceria com o Centro Universitário São Camilo.
