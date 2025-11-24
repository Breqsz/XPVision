// Serviço de detecção de apostas e cálculo de gatilhos de realidade

const BET_KEYWORDS = [
  'bet', 'bet365', 'blaze', 'cassino', 'casino', 
  'aposta', 'pixbet', 'sportingbet', '1xbet', 'betano'
];

export interface RealityTrigger {
  mealsEquivalent: number;
  dreamDaysLost: number;
  message: string;
}

export const betDetectionService = {
  /**
   * Detecta se uma transação é uma aposta baseado na descrição
   */
  detectBet(description: string, category?: string): boolean {
    const lowerDescription = description.toLowerCase();
    const lowerCategory = category?.toLowerCase() || '';
    
    return BET_KEYWORDS.some(keyword => 
      lowerDescription.includes(keyword) || lowerCategory.includes(keyword)
    );
  },

  /**
   * Calcula gatilhos de realidade baseado no valor gasto
   */
  calculateRealityTrigger(
    amount: number,
    dreamTargetValue: number,
    dreamCurrentSaved: number
  ): RealityTrigger {
    const MEAL_COST = 16; // Custo médio de uma refeição
    
    const mealsEquivalent = Math.round(Math.abs(amount) / MEAL_COST);
    
    // Calcula quantos dias atrasa a meta
    // Assumindo que o usuário economiza uma quantia média por dia
    const dailySavings = dreamTargetValue / 365; // Meta anual dividida por dias
    const dreamDaysLost = Math.round(Math.abs(amount) / dailySavings);
    
    const message = `Com esse valor você poderia adiantar ${dreamDaysLost} dias na sua meta.`;
    
    return {
      mealsEquivalent,
      dreamDaysLost,
      message,
    };
  },

  /**
   * Calcula impacto em dias de uma transação na meta
   */
  calculateImpactDays(
    amount: number,
    dreamTargetValue: number,
    dreamCurrentSaved: number
  ): number {
    const dailySavings = dreamTargetValue / 365;
    if (amount < 0) {
      return -Math.round(Math.abs(amount) / dailySavings);
    }
    return Math.round(amount / dailySavings);
  },
};

