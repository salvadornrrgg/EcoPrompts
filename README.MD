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

---

## Instalação

```bash
git clone <url>
cd EcoPrompts
npm install
```

---

## Dependências
Não é necessário correr, uma vez que na instalação as dependências já foram instaladas (definidas no package.json)

```bash
npm install express @prisma/client zod swagger-ui-express swagger-jsdoc dotenv

npm install -D typescript @types/express @types/node tsx prisma @types/swagger-ui-express @types/swagger-jsdoc
```

---

## Configuração

Criar ficheiro .env na raiz do projeto:

```bash
DATABASE_URL="postgresql://usuario:senha@localhost:5432/ecoprompts"
```

--- 

## Base de Dados

```bash
npx prisma migrate dev
npx prisma generate
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

## Endpoints da API

---

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