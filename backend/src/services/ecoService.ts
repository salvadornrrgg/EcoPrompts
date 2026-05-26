import { prisma } from '../lib/prisma';
import { MODEL_DATA, EQUIVALENCES } from '../data/ecoData';

// Estimativa simples de tokens: ~4 caracteres por token (heurística amplamente usada)
const estimateTokens = (text: string): number => {
  return Math.ceil(text.length / 4);
};

const getModelData = (aiModel: string) => {
  return MODEL_DATA[aiModel] ?? MODEL_DATA['default'];
};

export const getEcoStats = async (promptId: number) => {
  const prompt = await prisma.prompt.findUnique({
    where: { id: promptId },
    include: {
      user: { select: { id: true, username: true } },
      category: true,
      versions: true,
    }
  });

  if (!prompt) throw new Error('Prompt não encontrado');

  const model = getModelData(prompt.AImodel);

  // Cálculo de tokens
  const promptTokens = estimateTokens(prompt.prompt);
  const resultTokens = estimateTokens(prompt.result);
  const totalTokens = promptTokens + resultTokens;

  // Custo
  const estimatedCost = (totalTokens / 1000) * model.costPer1kTokens;

  // Impacto ambiental
  const co2Grams = totalTokens * model.co2PerToken;
  const waterMl = (totalTokens / 1000) * model.waterPer1kTokens;
  const energyWh = (totalTokens / 1000) * model.energyPer1kTokens;

  // Equivalências contextuais
  const equivalences = {
    kmDeCarro: parseFloat((co2Grams / EQUIVALENCES.co2PerKmCar).toFixed(4)),
    minutosDeStreaming: parseFloat((co2Grams / EQUIVALENCES.co2PerHourStreaming * 60).toFixed(2)),
    emailsEquivalentes: parseFloat((co2Grams / EQUIVALENCES.co2PerEmail).toFixed(2)),
    percentagemDuche: parseFloat((waterMl / EQUIVALENCES.waterPerShower * 100).toFixed(4)),
    coposDeAgua: parseFloat((waterMl / EQUIVALENCES.waterPerGlass).toFixed(4)),
  };

  // Métricas do prompt
  const promptLength = prompt.prompt.length;
  const wordsCount = prompt.prompt.trim().split(/\s+/).length;
  const densityScore = parseFloat((wordsCount / promptLength * 100).toFixed(2));

  // Eficiência — ratio entre resultado e prompt (quanto output por unidade de input)
  const efficiencyRatio = parseFloat((resultTokens / promptTokens).toFixed(2));

  // Impacto acumulado das versões
  const versionsCount = prompt.versions.length;
  const totalVersionTokens = prompt.versions.reduce((acc, v) => acc + estimateTokens(v.promptText), 0);
  const totalCo2WithVersions = co2Grams + totalVersionTokens * model.co2PerToken;

  return {
    prompt: {
      id: prompt.id,
      title: prompt.title,
      AImodel: prompt.AImodel,
      modelLabel: model.label,
    },
    tokens: {
      promptTokens,
      resultTokens,
      totalTokens,
      estimationMethod: 'heurística ~4 chars/token',
    },
    cost: {
      estimatedUSD: parseFloat(estimatedCost.toFixed(6)),
      costPer1kTokens: model.costPer1kTokens,
      currency: 'USD',
    },
    environmental: {
      co2: {
        grams: parseFloat(co2Grams.toFixed(4)),
        label: 'CO₂ equivalente emitido',
        source: 'Estimativa baseada em Luccioni et al. (2023)',
      },
      water: {
        milliliters: parseFloat(waterMl.toFixed(4)),
        label: 'Água consumida nos data centers',
        source: 'Estimativa baseada em relatórios Microsoft/Google 2023',
      },
      energy: {
        wattHours: parseFloat(energyWh.toFixed(6)),
        label: 'Energia consumida',
        source: 'Estimativa baseada em consumo médio de GPU inference',
      },
    },
    equivalences: {
      co2: {
        kmDeCarro: equivalences.kmDeCarro,
        minutosDeStreaming: equivalences.minutosDeStreaming,
        emailsEquivalentes: equivalences.emailsEquivalentes,
      },
      water: {
        percentagemDuche: equivalences.percentagemDuche,
        coposDeAgua: equivalences.coposDeAgua,
      },
    },
    promptMetrics: {
      characters: promptLength,
      words: wordsCount,
      densityScore,
      efficiencyRatio,
      note: efficiencyRatio > 2
        ? 'Prompt eficiente — gera muito output por unidade de input'
        : efficiencyRatio > 1
        ? 'Prompt moderadamente eficiente'
        : 'Prompt pouco eficiente — considera simplificar',
    },
    versions: {
      count: versionsCount,
      totalTokensAcrossVersions: totalVersionTokens,
      totalCo2WithVersionsGrams: parseFloat(totalCo2WithVersions.toFixed(4)),
    },
    disclaimer: 'Valores estimados com base em literatura científica e dados públicos dos fornecedores. Não representam medições reais.',
  };
};