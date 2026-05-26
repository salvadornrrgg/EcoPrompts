export const MODEL_DATA: Record<string, {
  costPer1kTokens: number;      // USD
  co2PerToken: number;          // gramas de CO2
  waterPer1kTokens: number;     // ml de água
  energyPer1kTokens: number;    // Wh
  label: string;
}> = {
  'GPT-4': {
    costPer1kTokens: 0.03,
    co2PerToken: 0.0023,
    waterPer1kTokens: 25,
    energyPer1kTokens: 0.001,
    label: 'GPT-4'
  },
  'Claude': {
    costPer1kTokens: 0.015,
    co2PerToken: 0.0018,
    waterPer1kTokens: 20,
    energyPer1kTokens: 0.0008,
    label: 'Claude'
  },
  'Claude 3': {
    costPer1kTokens: 0.015,
    co2PerToken: 0.0018,
    waterPer1kTokens: 20,
    energyPer1kTokens: 0.0008,
    label: 'Claude 3'
  },
  'Gemini': {
    costPer1kTokens: 0.0005,
    co2PerToken: 0.0010,
    waterPer1kTokens: 15,
    energyPer1kTokens: 0.0005,
    label: 'Gemini'
  },
  'default': {
    costPer1kTokens: 0.01,
    co2PerToken: 0.0015,
    waterPer1kTokens: 18,
    energyPer1kTokens: 0.0007,
    label: 'Modelo genérico'
  }
};

// Fatores de conversão para contextualização
export const EQUIVALENCES = {
  co2PerKmCar: 120,        // g CO2 por km de carro médio
  co2PerHourStreaming: 36, // g CO2 por hora de streaming (Netflix)
  co2PerEmail: 4,          // g CO2 por email enviado
  waterPerShower: 60000,   // ml por duche de 5 minutos
  waterPerGlass: 250,      // ml por copo de água
};