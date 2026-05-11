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
            { username: 'pedro', email: 'pedro@email.com', password: hashedPassword, userType: 'Mod' }
        ]
    });

    const admin = await prisma.user.findUnique({ where: { email: 'admin@ecoprompts.com' } });
    const joao = await prisma.user.findUnique({ where: { email: 'joao@email.com' } });
    const maria = await prisma.user.findUnique({ where: { email: 'maria@email.com' } });
    const pedro = await prisma.user.findUnique({ where: { email: 'pedro@email.com' } });

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

    const prompt1 = await prisma.prompt.create({
        data: {
            title: 'Gerar função fatorial',
            description: 'Prompt para gerar uma função que calcula o fatorial de um número',
            prompt: 'Gere uma função em TypeScript que calcule o fatorial de um número de forma recursiva',
            AImodel: 'GPT-4',
            result: 'function factorial(n: number): number { if (n <= 1) return 1; return n * factorial(n - 1); }',
            categoryId: programacao!.id,
            userId: joao!.id
        }
    });
    await indexPrompt(`${prompt1.title} ${prompt1.description}`, prompt1.id);
    console.log(`✅ Prompt 1 indexado`);

    const prompt2 = await prisma.prompt.create({
        data: {
            title: 'Escrever artigo sobre IA',
            description: 'Prompt para gerar um artigo sobre inteligência artificial',
            prompt: 'Escreve um artigo sobre o impacto da inteligência artificial na educação',
            AImodel: 'Claude 3',
            result: 'A inteligência artificial está a revolucionar a educação...',
            categoryId: escrita!.id,
            userId: maria!.id
        }
    });
    await indexPrompt(`${prompt2.title} ${prompt2.description}`, prompt2.id);
    console.log(`✅ Prompt 2 indexado`);

    const prompt3 = await prisma.prompt.create({
        data: {
            title: 'Análise de sentimentos',
            description: 'Prompt para analisar sentimentos de um texto',
            prompt: 'Analisa o sentimento do seguinte texto e classifica como positivo, negativo ou neutro',
            AImodel: 'Gemini',
            result: 'Sentimento: Positivo (confiança: 0.92)',
            categoryId: tecnologia!.id,
            userId: admin!.id
        }
    });
    await indexPrompt(`${prompt3.title} ${prompt3.description}`, prompt3.id);
    console.log(`✅ Prompt 3 indexado`);

    const prompt4 = await prisma.prompt.create({
        data: {
            title: 'Plano de marketing digital',
            description: 'Prompt para criar plano de marketing',
            prompt: 'Cria um plano de marketing digital para uma pequena empresa de café artesanal',
            AImodel: 'GPT-4',
            result: '1. Redes sociais: Instagram e TikTok... 2. Email marketing...',
            categoryId: marketing!.id,
            userId: pedro!.id
        }
    });
    await indexPrompt(`${prompt4.title} ${prompt4.description}`, prompt4.id);
    console.log(`✅ Prompt 4 indexado`);

    const prompt5 = await prisma.prompt.create({
        data: {
            title: 'Resumir texto académico',
            description: 'Prompt para resumir artigos científicos',
            prompt: 'Resume o seguinte artigo científico em 3 parágrafos, destacando os pontos principais',
            AImodel: 'Claude 3',
            result: 'Este artigo aborda... Conclusão:...',
            categoryId: estudo!.id,
            userId: joao!.id
        }
    });
    await indexPrompt(`${prompt5.title} ${prompt5.description}`, prompt5.id);
    console.log(`✅ Prompt 5 indexado`);

    const prompt6 = await prisma.prompt.create({
        data: {
            title: 'Organizar tarefas diárias',
            description: 'Prompt para criar lista de tarefas prioritárias',
            prompt: 'Com base na minha lista de tarefas, organiza por prioridade e sugere um horário',
            AImodel: 'Gemini',
            result: '09:00-10:00: Reunião... 10:00-12:00: Desenvolvimento...',
            categoryId: produtividade!.id,
            userId: maria!.id
        }
    });
    await indexPrompt(`${prompt6.title} ${prompt6.description}`, prompt6.id);
    console.log(`✅ Prompt 6 indexado`);

    console.log('🔄 A criar versões...');
    await prisma.version.create({
        data: {
            versionNumber: 1,
            promptText: 'Gere uma função em TypeScript que calcule o fatorial de um número',
            improvements: 'Versão inicial',
            rating: 4,
            promptId: prompt1.id,
            userId: joao!.id
        }
    });

    await prisma.version.create({
        data: {
            versionNumber: 2,
            promptText: 'Gere uma função em TypeScript que calcule o fatorial de um número de forma recursiva com validação de input',
            improvements: 'Adicionada validação para números negativos',
            rating: 5,
            promptId: prompt1.id,
            userId: joao!.id
        }
    });

    console.log('💬 A criar comentários...');
    await prisma.comment.createMany({
        data: [
            { comment: 'Excelente prompt! Muito útil para iniciantes.', userId: maria!.id, promptId: prompt1.id },
            { comment: 'Funcionou perfeitamente. Obrigado!', userId: pedro!.id, promptId: prompt1.id },
            { comment: 'Gostei muito do resultado. Vou adaptar para o meu projeto.', userId: admin!.id, promptId: prompt1.id }
        ]
    });

    console.log('⭐ A criar avaliações...');
    await prisma.eval.createMany({
        data: [
            { score: 5, userId: maria!.id, promptId: prompt1.id },
            { score: 4, userId: pedro!.id, promptId: prompt1.id }
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