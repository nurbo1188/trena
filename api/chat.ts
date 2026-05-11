// Vercel Serverless Function
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message, prompt, instruction } = req.body;
  const targetPrompt = message || prompt;
  
  const SYSTEM_INSTRUCTION = `
Сен 6-сынып оқушысына арналған интеллектуалды тренажёрдың көмекшісісің. 
Оқушылар жасы 11-12. Жауаптар тек қазақ тілінде, қысқа, нақты, күнделікті өмірден мысалдармен болсын. 
Күрделі терминдерді қарапайым тілмен түсіндір. 
Тапсырмалар алгоритмдер мен Python бастауыш деңгейіне (6-сынып оқулығына) арналған.
Информтика пәні бойынша білімің терең, бірақ түсіндіруің балаларға түсінікті.
`;
  const targetInstruction = instruction || SYSTEM_INSTRUCTION;

  const rawKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
  const apiKey = rawKey.trim().replace(/^["']|["']$/g, "");

  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server (Vercel environment variables).' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: {
        role: "system",
        parts: [{ text: targetInstruction }]
      }
    });
    
    const result = await model.generateContent(targetPrompt);
    const text = result.response.text();

    res.status(200).json({
      candidates: [
        {
          content: {
            parts: [{ text }]
          }
        }
      ]
    });
  } catch (error: any) {
    res.status(500).json({ error: "AI Error", message: error.message });
  }
}
