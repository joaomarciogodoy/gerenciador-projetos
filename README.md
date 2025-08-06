# Gerencia Projetos

Sistema de gerenciamento de projetos com autenticação real usando Prisma, PostgreSQL e JWT.

## 🚀 Tecnologias

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Autenticação**: JWT + bcrypt
- **UI**: shadcn/ui

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL (Neon ou local)
- npm ou yarn

## ⚙️ Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@host:port/database"

# JWT Secret (gerar uma chave segura)
JWT_SECRET="your-super-secret-jwt-key-here"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

### 3. Configurar banco de dados

```bash
# Gerar o cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate dev --name init

# (Opcional) Abrir o Prisma Studio
npx prisma studio
```

### 4. Executar o projeto

```bash
npm run dev
```

## 🗄️ Estrutura do Banco

### Tabelas

- **users**: Usuários do sistema
- **projects**: Projetos dos usuários
- **todos**: Tarefas dos projetos

### Relacionamentos

- Um usuário pode ter muitos projetos
- Um projeto pode ter muitas tarefas
- Uma tarefa pertence a um projeto
- Uma tarefa pode ser atribuída a um usuário (opcional)

## 🔐 Autenticação

O sistema usa JWT (JSON Web Tokens) para autenticação:

- **Login**: `/api/auth/login`
- **Registro**: `/api/auth/register`
- **Logout**: `/api/auth/logout`
- **Verificar usuário**: `/api/auth/me`

### Segurança

- Senhas são hasheadas com bcrypt
- Tokens JWT com expiração de 7 dias
- Cookies httpOnly para armazenamento seguro
- Middleware para proteção de rotas

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── api/auth/          # APIs de autenticação
│   ├── login/             # Página de login
│   ├── register/          # Página de registro
│   └── page.js            # Dashboard principal
├── components/
│   ├── ui/                # Componentes shadcn/ui
│   ├── AuthGuard.js       # Proteção de rotas
│   ├── DashboardHeader.js # Header do dashboard
│   ├── DashboardSidebar.js # Sidebar do dashboard
│   ├── ProjectManager.js  # Gerenciador de projetos
│   ├── ProjectCard.js     # Card de projeto
│   ├── ProjectForm.js     # Formulário de projeto
│   └── TodoForm.js        # Formulário de tarefa
├── lib/
│   ├── auth.js            # Funções de autenticação
│   ├── prisma.js          # Cliente Prisma
│   └── getUser.js         # Helper para obter usuário
└── middleware.js          # Middleware de autenticação
```

## 🎨 Interface

- Design moderno com gradientes e efeitos de vidro
- Tema claro/escuro
- Animações suaves
- Responsivo para mobile e desktop
- Sidebar colapsável

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start

# Prisma
npx prisma generate
npx prisma migrate dev
npx prisma studio
npx prisma db push

# Limpar cache
npm run clean
```

## 🚀 Deploy

### Vercel

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outros

- Configure as variáveis de ambiente
- Execute `npm run build`
- Configure o servidor para servir os arquivos estáticos

## 📝 Licença

MIT
