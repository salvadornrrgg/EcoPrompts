import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { indexPrompt } from '../src/services/embeddingService';

dotenv.config();

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 A iniciar seed da base de dados...');

    console.log('🗑️ A limpar dados existentes...');
    await prisma.eval.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.version.deleteMany();
    await prisma.prompt.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash('123456', 10);

    console.log('👤 A criar utilizadores...');
    await prisma.user.createMany({
        data: [
            { username: 'admin', email: 'admin@ecoprompts.com', password: hashedPassword, userType: 'Admin' },
            { username: 'joao', email: 'joao@email.com', password: hashedPassword, userType: 'User' },
            { username: 'maria', email: 'maria@email.com', password: hashedPassword, userType: 'User' },
            { username: 'pedro', email: 'pedro@email.com', password: hashedPassword, userType: 'Mod' },
            { username: 'ana', email: 'ana@email.com', password: hashedPassword, userType: 'User' }
        ]
    });

    const admin = await prisma.user.findUnique({ where: { email: 'admin@ecoprompts.com' } });
    const joao = await prisma.user.findUnique({ where: { email: 'joao@email.com' } });
    const maria = await prisma.user.findUnique({ where: { email: 'maria@email.com' } });
    const pedro = await prisma.user.findUnique({ where: { email: 'pedro@email.com' } });
    const ana = await prisma.user.findUnique({ where: { email: 'ana@email.com' } });

    console.log('📂 A criar categorias...');
    await prisma.category.createMany({
        data: [
            { name: 'Tecnologia' },
            { name: 'Programação' },
            { name: 'Escrita Criativa' },
            { name: 'Marketing' },
            { name: 'Estudo' },
            { name: 'Produtividade' },
            { name: 'Tradução' },
            { name: 'Análise de Dados' }
        ]
    });

    const programacao = await prisma.category.findUnique({ where: { name: 'Programação' } });
    const escrita = await prisma.category.findUnique({ where: { name: 'Escrita Criativa' } });
    const tecnologia = await prisma.category.findUnique({ where: { name: 'Tecnologia' } });
    const marketing = await prisma.category.findUnique({ where: { name: 'Marketing' } });
    const estudo = await prisma.category.findUnique({ where: { name: 'Estudo' } });
    const produtividade = await prisma.category.findUnique({ where: { name: 'Produtividade' } });

    console.log('📝 A criar prompts...');

    // Prompt 1 - API REST com validação e boas práticas
    const prompt1 = await prisma.prompt.create({
        data: {
            title: 'API RESTful com Express, TypeScript e validação Zod',
            description: 'Gera uma API completa com CRUD, validação de dados, erros tratados e documentação Swagger',
            prompt: `Cria uma API RESTful para gestão de tarefas (to-do list) com os seguintes requisitos:

- Express com TypeScript
- Validação de inputs usando Zod (título obrigatório, descrição opcional, status enum)
- CRUD completo (criar, listar, buscar por id, atualizar, eliminar)
- Middleware de erro global
- Documentação Swagger/OpenAPI
- Persistência em memória (array) para simplicidade

Inclui exemplos de requests/responses e explica o código.`,
            AImodel: 'GPT-4',
            result: `## API de Tarefas com Express + TypeScript + Zod

### Estrutura
\`\`\`
src/
├── index.ts
├── routes/tasks.ts
├── controllers/taskController.ts
├── services/taskService.ts
├── schemas/taskSchema.ts
├── middleware/errorHandler.ts
└── swagger.ts
\`\`\`

### Schemas (Zod)
\`\`\`typescript
export const TaskStatus = z.enum(['pending', 'in_progress', 'completed']);
export const CreateTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  status: TaskStatus.default('pending')
});
\`\`\`

### Controller
\`\`\`typescript
export class TaskController {
  async create(req: Request, res: Response, next: NextFunction) {
    const validated = CreateTaskSchema.parse(req.body);
    const task = await taskService.create(validated);
    res.status(201).json(task);
  }
}
\`\`\`

### Endpoints
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /tasks | Lista todas as tarefas |
| GET | /tasks/:id | Busca uma tarefa |
| POST | /tasks | Cria nova tarefa |
| PUT | /tasks/:id | Atualiza tarefa |
| DELETE | /tasks/:id | Elimina tarefa |

A documentação Swagger estará disponível em \`/api-docs\`.`,
            categoryId: programacao!.id,
            userId: joao!.id
        }
    });
    await indexPrompt(`${prompt1.title} ${prompt1.description}`, prompt1.id);
    console.log(`✅ Prompt 1 indexado - API REST`);

    // Prompt 2 - Artigo detalhado sobre IA
    const prompt2 = await prisma.prompt.create({
        data: {
            title: 'Guia prático de IA para pequenas empresas',
            description: 'Prompt para gerar artigo completo sobre adoção de IA em PMEs',
            prompt: `Escreve um artigo para blog com cerca de 1500 palavras sobre como pequenas empresas podem adotar inteligência artificial.

O artigo deve incluir:
- Introdução (contexto atual da IA)
- 5 casos de uso práticos para PMEs (com exemplos reais)
- Ferramentas acessíveis (ChatGPT, Canva AI, etc.)
- Passo a passo para começar (orçamentos baixos)
- Cuidados e limitações
- Conclusão com previsões para os próximos 2-3 anos

Tom: profissional mas acessível, otimizado para SEO.`,
            AImodel: 'Claude 3',
            result: `# IA para Pequenas Empresas: Guia Prático de Adoção (2026)

## Introdução
A inteligência artificial deixou de ser um luxo de grandes corporações...

## 5 Casos de Uso Práticos
1. **Atendimento ao Cliente 24/7** - Chatbots com IA reduziram custos em 30% na empresa XPTO
2. **Criação de Conteúdo** - Geração de posts para redes sociais em minutos
3. **Análise de Feedback** - Processamento automático de avaliações
4. **Previsão de Vendas** - Modelos simples com Excel + IA
5. **Automação de Email Marketing** - Segmentação inteligente

## Ferramentas Acessíveis (€0-50/mês)
- ChatGPT Plus (€20/mês)
- Canva Magic Studio (€10/mês)
- HubSpot Free Tier (com IA básica)

## Passo a Passo para Começar
1. Identificar tarefas repetitivas
2. Testar ferramentas gratuitas (2 semanas)
3. Treinar equipa (workshops de 2h)
4. Medir ROI após 30 dias

## Cuidados
- Privacidade de dados do cliente
- Revisão humana de outputs críticos

## Conclusão
Até 2028, estima-se que 70% das PMEs usarão IA no dia-a-dia...`,
            categoryId: escrita!.id,
            userId: maria!.id
        }
    });
    await indexPrompt(`${prompt2.title} ${prompt2.description}`, prompt2.id);
    console.log(`✅ Prompt 2 indexado - Guia de IA`);

    // Prompt 3 - Análise de dados financeiros
    const prompt3 = await prisma.prompt.create({
        data: {
            title: 'Dashboard financeiro com análise preditiva',
            description: 'Prompt para gerar análise de dados financeiros e previsões',
            prompt: `Tenho um ficheiro CSV com vendas mensais dos últimos 3 anos (colunas: data, produto, quantidade, valor_venda, regiao).

Preciso de:
1. Limpeza dos dados (valores nulos, outliers, formato de datas)
2. Análise exploratória:
   - Top 5 produtos por receita
   - Sazonalidade por mês
   - Região com maior crescimento
3. Previsão de vendas para os próximos 6 meses (usando média móvel ou ARIMA simples)
4. Geração de alertas: detetar meses com queda >15% vs média

Gera código Python (pandas, matplotlib, statsmodels) com comentários e explicações.`,
            AImodel: 'Gemini',
            result: `\`\`\`python
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.holtwinters import ExponentialSmoothing

# 1. Limpeza
df = pd.read_csv('vendas.csv', parse_dates=['data'])
df = df.dropna(subset=['valor_venda'])
df = df[df['valor_venda'] < df['valor_venda'].quantile(0.99)]  # remove outliers

# 2. Análise exploratória
produtos_top = df.groupby('produto')['valor_venda'].sum().sort_values(ascending=False).head()
vendas_por_mes = df.groupby(df['data'].dt.month)['valor_venda'].sum()
crescimento_regiao = df.groupby('regiao')['valor_venda'].pct_change().mean()

# 3. Previsão (Holt-Winters)
df_mensal = df.groupby(df['data'].dt.to_period('M'))['valor_venda'].sum()
model = ExponentialSmoothing(df_mensal, seasonal_periods=12, trend='add', seasonal='add')
fit = model.fit()
previsao = fit.forecast(6)

# 4. Alertas
media_geral = df['valor_venda'].mean()
alertas = df[df['valor_venda'] < media_geral * 0.85]
\`\`\``,
            categoryId: tecnologia!.id,
            userId: admin!.id
        }
    });
    await indexPrompt(`${prompt3.title} ${prompt3.description}`, prompt3.id);
    console.log(`✅ Prompt 3 indexado - Dashboard financeiro`);

    // Prompt 4 - Estratégia de marketing completa
    const prompt4 = await prisma.prompt.create({
        data: {
            title: 'Estratégia de marketing digital 360°',
            description: 'Prompt para criar plano de marketing completo',
            prompt: `Sou dono de uma cafeteria artesanal em Lisboa, com 2 anos de existência. Quero um plano de marketing digital para os próximos 6 meses.

Contexto:
- Público: 25-45 anos, renda média-alta, mora em Lisboa
- Concorrência: 3 cafeterias num raio de 500m
- Diferenciais: café de origem única, bolos caseiros sem glúten, espaço pet-friendly
- Orçamento: €500/mês

Plano deve incluir:
1. Análise SWOT
2. Estratégia de redes sociais (Instagram + TikTok)
3. Campanha de Google Ads (palavras-chave e orçamento sugerido)
4. Programa de fidelização (sugestão criativa)
5. Calendário de conteúdos para 30 dias
6. KPIs para medir sucesso

Sê específico e prático. Dá exemplos concretos.`,
            AImodel: 'GPT-4',
            result: `## Plano de Marketing Digital - Cafetaria Artesanal

### Análise SWOT
| | Positivo | Negativo |
|---|----------|----------|
| Interno | Produto diferenciado (sem glúten) | Equipa sem experiência digital |
| Externo | Zona com tráfego pedonal intenso | Concorrência agressiva com preços |

### Estratégia Instagram + TikTok
- **Segunda**: Reel "O nosso café da semana" (produtor parceiro)
- **Quarta**: Dicas de pairing (café + bolo)
- **Sexta**: Clientes com pets (UGC - conteúdo gerado por utilizadores)
- **Domingo**: Bastidores da preparação

Hashtags: #cafelisboa #petfriendlylisboa #cafesemgluten

### Google Ads (€300/mês)
Palavras-chave:
- "melhor café Lisboa" (€1.20/clique)
- "café pet friendly Lisboa" (€0.90/clique)
- "bolos sem glúten Lisboa" (€1.50/clique)

### Programa de Fidelização - "Passaporte do Café"
Carimbo por cada café comprado. Ao 10º café, oferta de um bolo. Ao 30º, um saco de café de origem.

### KPIs
- Taxa de engajamento (target >5%)
- Custo por aquisição (target <€5)
- Visitantes únicos/mês (crescer 20%)
- Taxa de retenção (clientes recorrentes >40%)`,
            categoryId: marketing!.id,
            userId: pedro!.id
        }
    });
    await indexPrompt(`${prompt4.title} ${prompt4.description}`, prompt4.id);
    console.log(`✅ Prompt 4 indexado - Marketing`);

    // Prompt 5 - Resumo académico detalhado
    const prompt5 = await prisma.prompt.create({
        data: {
            title: 'Resumo e análise crítica de artigo científico',
            description: 'Prompt para resumir e analisar papers académicos',
            prompt: `Preciso de ajuda para analisar um artigo académico sobre "Machine Learning for Predictive Maintenance in Manufacturing" (autor: Zhang et al., 2024).

Tarefas:
1. Resumo estruturado (objetivo, metodologia, resultados, conclusão)
2. Pontos fortes e fracos da metodologia
3. Comparação com 2-3 abordagens alternativas mencionadas no artigo
4. Explicação leiga dos conceitos principais (para stakeholders não técnicos)
5. Sugestões para trabalho futuro baseado nas limitações apontadas

O artigo tem 25 páginas, foco em redes neuronais LSTM para prever falhas em equipamento industrial.`,
            AImodel: 'Claude 3',
            result: `## Análise do Artigo: Zhang et al. (2024)

### Resumo Estruturado
**Objetivo**: Desenvolver modelo LSTM para previsão de falhas em máquinas industriais usando sensores IoT.
**Metodologia**: 18 meses de dados de 50 máquinas + LSTM bidirecional + validação cruzada temporal.
**Resultados**: Acurácia de 94%, redução de 67% em paragens não planeadas.
**Conclusão**: LSTM supera modelos tradicionais (Random Forest +23%, SVM +31%).

### Pontos Fortes
- Dados reais, não sintéticos
- Comparação com 5 benchmarks diferentes
- Explicabilidade via SHAP

### Pontos Fracos
- Apenas um tipo de indústria (automóvel)
- Não testado em tempo real (apenas histórico)

### Comparação com Alternativas
| Método | Acurácia | Latência | Interpretabilidade |
|--------|----------|----------|-------------------|
| LSTM (Zhang) | 94% | 50ms | Baixa |
| Isolation Forest | 71% | 20ms | Alta |
| XGBoost | 82% | 35ms | Média |

### Explicação Leiga
Imagine que o modelo aprende padrões como "quando a temperatura sobe 10° em 5 segundos, a máquina vai falhar nas próximas 2 horas".

### Sugestões de Trabalho Futuro
- Testar em tempo real (edge computing)
- Expandir para 5 indústrias diferentes
- Adicionar explicabilidade melhor (exemplo: LIME)`,
            categoryId: estudo!.id,
            userId: joao!.id
        }
    });
    await indexPrompt(`${prompt5.title} ${prompt5.description}`, prompt5.id);
    console.log(`✅ Prompt 5 indexado - Resumo académico`);

    // Prompt 6 - Sistema de produtividade com pomodoro
    const prompt6 = await prisma.prompt.create({
        data: {
            title: 'Sistema de produtividade estilo Pomodoro + Eisenhower',
            description: 'Prompt para gerar organizador de tarefas com duas metodologias',
            prompt: `Cria um assistente de produtividade pessoal que combina duas metodologias:

1. **Matriz de Eisenhower** (urgente vs importante) - para priorizar tarefas
2. **Técnica Pomodoro** (25 min foco, 5 min pausa) - para execução

Funcionalidades:
- Receber lista de 10-15 tarefas diárias
- Classificar cada tarefa na matriz
- Gerar sequência de pomodoros para o dia (máximo 8 pomodoros)
- Sugerir pausas longas (15 min a cada 4 pomodoros)
- Incluir slots para imprevistos (20% do tempo livre)

Entrada exemplo:
"Reunião com cliente, rever pull requests, estudar React, responder emails, escrever relatório, fazer exercício físico, ligar para fornecedor, planeamento da semana"

Gera a saída organizada em tabelas e dá recomendações de melhoria.`,
            AImodel: 'Gemini',
            result: `## Assistente de Produtividade - Plano Diário

### Classificação (Matriz de Eisenhower)

| Tarefa | Urgência | Importância | Quadrante |
|--------|----------|-------------|-----------|
| Reunião com cliente | Alta | Alta | 1 (Fazer primeiro) |
| Rever pull requests | Alta | Alta | 1 |
| Escrever relatório | Alta | Média | 2 (Agendar) |
| Responder emails | Média | Baixa | 3 (Delegar) |
| Estudar React | Baixa | Alta | 2 |
| Planeamento da semana | Baixa | Média | 2 |
| Ligar para fornecedor | Média | Baixa | 3 |
| Exercício físico | Baixa | Alta | 2 |

### Sequência de Pomodoros (25/5)

| Bloco | Horário | Tarefa | Pomodoro |
|-------|---------|--------|----------|
| 1 | 09:00-09:25 | Reunião cliente | 1 |
| 2 | 09:30-09:55 | Rever PRs | 2 |
| Pausa | 09:55-10:00 | Café | - |
| 3 | 10:00-10:25 | Escrever relatório | 3 |
| 4 | 10:30-10:55 | Estudar React | 4 |
| **Pausa Longa** | **11:00-11:15** | **Descanso** | **-** |
| 5 | 11:15-11:40 | Planeamento semana | 5 |
| 6 | 11:45-12:10 | Responder emails (30 min) | 6 |
| 7 | 14:00-14:25 | Exercício físico | 7 |
| 8 | 14:30-14:55 | Ligar fornecedor | 8 |

### Recomendações
- Bloco de imprevistos: 15h-16h (20% tempo livre)
- Considerar automatizar resposta de emails (regras Outlook)
- Exercício físico ao almoço é mais consistente (estudo mostra +40% adesão)`,
            categoryId: produtividade!.id,
            userId: maria!.id
        }
    });
    await indexPrompt(`${prompt6.title} ${prompt6.description}`, prompt6.id);
    console.log(`✅ Prompt 6 indexado - Produtividade`);

    console.log('🔄 A criar versões...');
    await prisma.version.create({
        data: {
            versionNumber: 1,
            promptText: 'Cria uma API RESTful para gestão de tarefas com Express, TypeScript e validação Zod',
            improvements: 'Versão inicial completa',
            rating: 4,
            promptId: prompt1.id,
            userId: joao!.id
        }
    });

    await prisma.version.create({
        data: {
            versionNumber: 2,
            promptText: 'Cria uma API RESTful para gestão de tarefas com Express, TypeScript, validação Zod, autenticação JWT e testes unitários',
            improvements: 'Adicionada autenticação e testes. Melhor documentação Swagger.',
            rating: 5,
            promptId: prompt1.id,
            userId: joao!.id
        }
    });

    await prisma.version.create({
        data: {
            versionNumber: 1,
            promptText: 'Escreve um artigo sobre IA para pequenas empresas (versão curta)',
            improvements: 'Versão inicial',
            rating: 3,
            promptId: prompt2.id,
            userId: maria!.id
        }
    });

    await prisma.version.create({
        data: {
            versionNumber: 2,
            promptText: 'Escreve um artigo completo sobre IA para pequenas empresas com casos de uso reais e ferramentas práticas',
            improvements: 'Versão expandida com exemplos e orçamentos',
            rating: 5,
            promptId: prompt2.id,
            userId: maria!.id
        }
    });

    console.log('💬 A criar comentários...');
    await prisma.comment.createMany({
        data: [
            { comment: 'Muito completo! Usei como base para o meu projeto.', userId: maria!.id, promptId: prompt1.id },
            { comment: 'Excelente explicação das decisões de arquitetura.', userId: pedro!.id, promptId: prompt1.id },
            { comment: 'Obrigado por partilhar, muito útil para iniciantes.', userId: admin!.id, promptId: prompt1.id },
            { comment: 'Conteúdo muito prático! Já implementei na minha cafeteria.', userId: admin!.id, promptId: prompt4.id },
            { comment: 'Alguma sugestão para orçamentos mais baixos?', userId: joao!.id, promptId: prompt4.id },
            { comment: 'A matriz de Eisenhower mudou a minha forma de trabalhar!', userId: pedro!.id, promptId: prompt6.id },
            { comment: 'Consegues adicionar integração com Google Calendar?', userId: ana?.id || joao!.id, promptId: prompt6.id }
        ]
    });

    console.log('⭐ A criar avaliações...');
    await prisma.eval.createMany({
        data: [
            { score: 5, userId: maria!.id, promptId: prompt1.id },
            { score: 4, userId: pedro!.id, promptId: prompt1.id },
            { score: 5, userId: admin!.id, promptId: prompt2.id },
            { score: 4, userId: joao!.id, promptId: prompt2.id },
            { score: 5, userId: maria!.id, promptId: prompt4.id },
            { score: 5, userId: pedro!.id, promptId: prompt6.id }
        ]
    });

    console.log('🎉 Seed concluída com sucesso!');
}

main()
    .catch((e) => {
        console.error('❌ Erro durante o seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });