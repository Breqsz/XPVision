// Service to call Google's Gemini API
// Replace YOUR_API_KEY with your actual Google Gemini API key

interface GeminiContext {
  dreamTitle?: string;
  dreamProgress?: number;
  recentBets?: number;
  challenges?: string[];
}

export async function sendMessageToGemini(
  prompt: string,
  context?: GeminiContext
): Promise<string> {
  const apiKey = 'AIzaSyBdSpAvqHuE9f6rdldibUg5fT8s204Xd4U';
  
  // Construir contexto do sistema
  let systemContext = 'Você é o FinXP, um coach financeiro jovem e motivador. ';
  systemContext += 'Seu objetivo é ajudar jovens a alcançar seus sonhos financeiros. ';
  systemContext += 'Seja empático, use emojis ocasionalmente e dê conselhos práticos.\n\n';
  
  if (context) {
    if (context.dreamTitle) {
      systemContext += `O usuário tem um sonho: ${context.dreamTitle}. `;
    }
    if (context.dreamProgress !== undefined) {
      systemContext += `Progresso atual: ${(context.dreamProgress * 100).toFixed(0)}%. `;
    }
    if (context.recentBets && context.recentBets > 0) {
      systemContext += `⚠️ ATENÇÃO: O usuário fez ${context.recentBets} aposta(s) recentemente. `;
      systemContext += 'Seja empático mas firme sobre o impacto das apostas no sonho. ';
      systemContext += 'Sugira desafios anti-apostas e alternativas.\n\n';
    }
    if (context.challenges && context.challenges.length > 0) {
      systemContext += `Desafios ativos: ${context.challenges.join(', ')}.\n\n`;
    }
  }
  
  const fullPrompt = systemContext + 'Usuário: ' + prompt;
  
  // Usar Gemini 1.5 Flash (modelo estável e confiável)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const body = {
    contents: [
      {
        parts: [
          {
            text: fullPrompt,
          },
        ],
      },
    ],
  };
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error('API request failed');
    }
    const data = await res.json();
    const candidates = data.candidates;
    if (candidates && candidates.length > 0) {
      return candidates[0].content.parts[0].text || '';
    }
    return '...';
  } catch (e) {
    console.error('Gemini API error', e);
    return 'Erro ao chamar serviço de IA. Verifique sua chave da API do Gemini.';
  }
}

/**
 * Envia mensagem automática quando uma aposta é detectada
 */
export async function sendBetDetectedMessage(
  betAmount: number,
  daysLost: number,
  context?: GeminiContext
): Promise<string> {
  const prompt = `Identifiquei uma aposta de R$ ${betAmount.toFixed(2)}. Ela atrasou seu sonho em ${daysLost} dias. Quer recuperar isso com um desafio simples?`;
  return sendMessageToGemini(prompt, context);
}