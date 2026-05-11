# EcoPrompts API

## Contextualização

API RESTful para gerenciamento de prompts, categorias, comentários, avaliações e versões para modelos de IA.

---

## Tecnologias

- Node.js + Express + TypeScript
- Prisma + PostgreSQL
- Zod (validação)
- Swagger (documentação)
- dotenv (variáveis de ambiente)
- LangChain + Ollama + pgvector (pesquisa semântica)

---

## Instalação

```bash
git clone <url>
cd EcoPrompts/backend
npm install
```

---

## Dependências
Não é necessário correr, uma vez que na instalação as dependências já foram instaladas (definidas no package.json)

```bash
npm install express @prisma/client zod swagger-ui-express swagger-jsdoc dotenv bcryptjs jsonwebtoken cors helmet express-rate-limit @langchain/ollama @langchain/community @langchain/core pg

npm install -D typescript @types/express @types/node tsx prisma @types/swagger-ui-express @types/swagger-jsdoc @types/bcryptjs @types/jsonwebtoken @types/cors
```

---

## Configuração

Criar ficheiro .env na raiz do projeto:

```bash
DATABASE_URL="postgresql://usuario:senha@localhost:5432/ecoprompts"
JWT_SECRET="o-teu-secret"
OLLAMA_BASE_URL="http://localhost:11434"
```

---

## Pré-requisitos adicionais

**Ollama** — necessário para a pesquisa semântica:
```bash
# Instalar o Ollama e fazer pull do modelo de embeddings
ollama pull mxbai-embed-large
```

**pgvector** — extensão do PostgreSQL necessária para os embeddings:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

---

## Base de Dados

```bash
npx prisma migrate dev
npx prisma generate
```

### Popular a base de dados (seed)

```bash
npx tsx prisma/seed.ts
```

---

## Executar

```bash
npx tsx watch src/server.ts
```

Servidor em http://localhost:3000

---

## Documentação

Swagger: http://localhost:3000/api-docs

---

## Endpoints da API

### Autenticação

- `POST /api/auth/login`
  Login

---

### Utilizadores

- `GET /api/users`
  Listar utilizadores

- `POST /api/users`
  Criar utilizador

- `GET /api/users/:id`
  Obter utilizador por ID

- `PUT /api/users/:id`
  Atualizar utilizador

- `DELETE /api/users/:id`
  Remover utilizador

---

### Categorias

- `GET /api/categories`
  Listar categorias

- `POST /api/categories`
  Criar categoria

- `GET /api/categories/search`
  Pesquisar categorias

- `GET /api/categories/:id`
  Obter categoria por ID

- `GET /api/categories/:id/prompts`
  Listar prompts de uma categoria

---

### Prompts

- `GET /api/prompts`
  Listar prompts

- `POST /api/prompts`
  Criar prompt

- `GET /api/prompts/search?q=`
  Pesquisa semântica de prompts (RAG)

- `GET /api/prompts/:id`
  Obter prompt por ID

- `PUT /api/prompts/:id`
  Atualizar prompt

- `DELETE /api/prompts/:id`
  Remover prompt

---

### Versões

- `GET /api/prompts/:id/versions`
  Listar versões de um prompt

- `POST /api/prompts/:id/versions`
  Criar versão

- `GET /api/versions/:versionId`
  Obter versão

- `DELETE /api/versions/:versionId`
  Remover versão

---

### Comentários

- `GET /api/prompts/:id/comments`
  Listar comentários de um prompt

- `POST /api/prompts/:id/comments`
  Adicionar comentário

- `GET /api/comments/:commentId`
  Obter comentário

- `DELETE /api/comments/:commentId`
  Remover comentário

---

### Avaliações

- `POST /api/prompts/:id/rating`
  Avaliar prompt

- `PUT /api/prompts/:id/rating`
  Atualizar avaliação

- `DELETE /api/prompts/:id/rating`
  Remover avaliação

- `DELETE /api/ratings/:id`
  Remover avaliação (admin)

---

### Tradução

- `POST /api/translate`
  Traduzir texto usando a MyMemory API (serviço externo gratuito)
  Body: `{ text: string, source: string, target: string }`