// Serviço para cálculos relacionados ao sonho

export interface DreamProgress {
  percentage: number;
  daysRemaining: number;
  daysAdvanced: number;
}

export const dreamCalculationService = {
  /**
   * Calcula progresso do sonho
   */
  calculateProgress(
    currentSaved: number,
    targetValue: number
  ): DreamProgress {
    const percentage = Math.min(Math.max(currentSaved / targetValue, 0), 1);
    
    // Calcula dias restantes baseado na economia diária média
    const remaining = targetValue - currentSaved;
    const dailySavings = targetValue / 365; // Assumindo meta anual
    const daysRemaining = Math.max(Math.round(remaining / dailySavings), 0);
    
    // Calcula dias adiantados com boost
    const daysAdvanced = 0; // Será calculado quando houver boost
    
    return {
      percentage,
      daysRemaining,
      daysAdvanced,
    };
  },

  /**
   * Calcula quantos dias um boost adianta o sonho
   */
  calculateBoostDays(
    boostAmount: number,
    targetValue: number
  ): number {
    const dailySavings = targetValue / 365;
    return Math.round(boostAmount / dailySavings);
  },
};

