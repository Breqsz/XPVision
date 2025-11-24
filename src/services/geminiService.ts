// src/services/geminiService.ts

export interface GeminiContext {
  dreamTitle?: string;
  dreamProgress?: number;
  recentBets?: number;
  challenges?: string[];
}

/**
 * Serviço principal para enviar mensagens ao Gemini
 */
export async function sendMessageToGemini(
  prompt: string,
  context?: GeminiContext
): Promise<string> {


  const apiKey = "AIzaSyBdSpAvqHuE9f6rdldibUg5fT8s204Xd4U"; 

  let systemContext = `
Você é o FinXP, um coach financeiro jovem e motivador.
Ajude o usuário com educação financeira, metas e controle emocional.
Use emojis com moderação e dê conselhos práticos e imediatos.
`;

  if (context) {
    if (context.dreamTitle)
      systemContext += `Meta do usuário: ${context.dreamTitle}. `;
    if (context.dreamProgress !== undefined)
      systemContext += `Progresso da meta: ${(context.dreamProgress * 100).toFixed(0)}%. `;
    if (context.recentBets && context.recentBets > 0)
      systemContext += `Atenção: o usuário fez ${context.recentBets} aposta(s) recentemente. Seja firme e empático.\n`;
    if (context.challenges && context.challenges.length > 0)
      systemContext += `Desafios ativos: ${context.challenges.join(", ")}.\n`;
  }

  const finalPrompt = systemContext + "\nUsuário: " + prompt;

  // Modelo estável disponível no seu projeto
  const model = "models/gemini-2.5-flash";

  const url = `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: finalPrompt }]
      }
    ]
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    // ⚠️ Primeiro pegamos como texto para evitar JSON parse error
    const raw = await res.text();

    if (!res.ok) {
      console.error("Gemini error response:", raw);
      return "Erro ao processar sua mensagem. Tente novamente em instantes.";
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch (jsonError) {
      console.error("Erro ao converter JSON:", jsonError, raw);
      return "A IA respondeu de forma inesperada. Tente novamente.";
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text || text.trim() === "") {
      return "Não consegui gerar uma resposta agora. Pode reformular a pergunta?";
    }

    return text;

  } catch (err) {
    console.error("Gemini API fatal error:", err);
    return "Erro ao comunicar com a IA. Verifique sua conexão e tente novamente.";
  }
}

/**
 * Mensagem automática quando uma aposta é detectada
 */
export async function sendBetDetectedMessage(
  betAmount: number,
  daysLost: number,
  context?: GeminiContext
): Promise<string> {
  const prompt = `Detectei uma aposta de R$ ${betAmount.toFixed(
    2
  )}. Isso atrasou sua meta em ${daysLost} dias. Você quer recuperar esse tempo com um desafio rápido?`;
  
  return sendMessageToGemini(prompt, context);
}
