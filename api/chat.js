// Vercel Serverless Function: /api/chat.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const SYSTEM_INSTRUCTION = `
Сен 6-сынып оқушысына арналған интеллектуалды тренажёрдың көмекшісісің. 
Оқушылар жасы 11-12. Жауаптар тек қазақ тілінде, қысқа, нақты, күнделікті өмірден мысалдармен болсын. 
Күрделі терминдерді қарапайым тілмен түсіндір. 
Тапсырмалар алгоритмдер мен Python бастауыш деңгейіне (6-сынып оқулығына) арналған.
Информтика пәні бойынша білімің терең, бірақ түсіндіруің балаларға түсінікті.
`;

  try {
    const rawKey = process.env.GEMINI_API_KEYY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
    const apiKey = rawKey.trim().replace(/^["']|["']$/g, "");

    if (!apiKey) {
      console.error("Vercel Error: No API key found (tried GEMINI_API_KEYY, GEMINI_API_KEY, GOOGLE_API_KEY)");
      return res.status(500).json({ error: "API Key missing in environment variables." });
    }

    const { message, prompt, instruction } = req.body;
    const targetPrompt = message || prompt;
    const targetInstruction = instruction || SYSTEM_INSTRUCTION;

    if (!targetPrompt) {
      return res.status(400).json({ error: "Content is required" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest",
      systemInstruction: targetInstruction 
    });
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: targetPrompt }] }],
    });
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
  } catch (error) {
    console.error("Vercel API Error:", error);
    res.status(500).json({ error: "Server Error", message: error.message });
  }
}
