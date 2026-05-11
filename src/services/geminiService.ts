import { GoogleGenAI } from "@google/genai";

// Initialize the client
// Using the specified key or the default one
const apiKey = process.env.GEMINI_API_KEYY || process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export async function getGeminiResponse(_apiKey: string, prompt: string, systemInstruction: string) {
  try {
    // Note: the first parameter _apiKey is kept for compatibility but we prefer the env var
    const currentApiKey = _apiKey || process.env.GEMINI_API_KEYY || process.env.GEMINI_API_KEY || "";
    
    // If the key changed dynamically or we need to recreate the client
    const client = _apiKey ? new GoogleGenAI({ apiKey: _apiKey }) : ai;

    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to get AI response");
  }
}

export const SYSTEM_INSTRUCTION = `
Сен 6-сынып оқушысына арналған интеллектуалды тренажёрдың көмекшісісің. 
Оқушылар жасы 11-12. Жауаптар тек қазақ тілінде, қысқа, нақты, күнделікті өмірден мысалдармен болсын. 
Күрделі терминдерді қарапайым тілмен түсіндір. 
Тапсырмалар алгоритмдер мен Python бастауыш деңгейіне (6-сынып оқулығына) арналған.
Информтика пәні бойынша білімің терең, бірақ түсіндіруің балаларға түсінікті.
`;
