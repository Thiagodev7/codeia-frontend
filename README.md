# CodeIA Frontend 🚀

Painel administrativo moderno e escalável para gerenciamento de atendimentos, agentes de IA e sessões do WhatsApp. Construído com foco em performance e experiência do usuário.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18.x-blue)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue)
![Vite](https://img.shields.io/badge/vite-6.x-purple)

## 🛠️ Stack Tecnológico

- **Core:** React 18, TypeScript, Vite
- **Estilização:** Tailwind CSS v3
- **Estado do Servidor:** TanStack Query v5 (React Query)
- **Roteamento:** React Router DOM v7
- **UI Components:** Lucide React (Ícones), Sonner (Toasts)
- **Testes:** Vitest, React Testing Library, jsdom
- **HTTP Client:** Axios

## 🚀 Como Iniciar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/codeia-frontend.git

# Entre na pasta
cd codeia-frontend

# Instale as dependências
npm install
```

### Rodando Localmente

```bash
npm run dev
```

O app estará disponível em `http://localhost:5173`.

### Rodando Testes

```bash
# Rodar testes unitários e de integração
npm test

# Rodar testes em modo watch
npm test -- --watch
```

### Build de Produção

```bash
npm run build
```

## 📂 Estrutura do Projeto

```
src/
├── components/         # Componentes reutilizáveis
│   ├── layout/         # Layouts (Sidebar, Header)
│   └── ui/             # UI Kit (Button, Card, Modal, etc)
├── features/           # Funcionalidades por domínio
│   ├── agents/         # Gestão de Agentes
│   ├── appointments/   # Agendamentos
│   ├── monitor/        # Monitoramento em Tempo Real
│   └── whatsapp/       # Sessões do WhatsApp
├── hooks/              # Custom Hooks (React Query, Lógica)
├── lib/                # Configurações de bibliotecas (axios, queryClient)
├── types/              # Definições de tipos globais
└── test/               # Configurações de teste
```

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000
```

## 🤝 Contribuição

Confira o arquivo [CONTRIBUTING.md](CONTRIBUTING.md) para diretrizes de como contribuir.

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.
