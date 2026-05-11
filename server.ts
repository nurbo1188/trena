import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini Setup
  const SYSTEM_INSTRUCTION = `
Сен 6-сынып оқушысына арналған интеллектуалды тренажёрдың көмекшісісің. 
Оқушылар жасы 11-12. Жауаптар тек қазақ тілінде, қысқа, нақты, күнделікті өмірден мысалдармен болсын. 
Күрделі терминдерді қарапайым тілмен түсіндір. 
Тапсырмалар алгоритмдер мен Python бастауыш деңгейіне (6-сынып оқулығына) арналған.
Информтика пәні бойынша білімің терең, бірақ түсіндіруің балаларға түсінікті.
`;

  // API Route
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, prompt, instruction } = req.body;
      const targetPrompt = message || prompt;
      const targetInstruction = instruction || SYSTEM_INSTRUCTION;

      const rawKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
      const apiKey = rawKey.trim().replace(/^["']|["']$/g, "");

      if (!apiKey) {
        console.error("DEBUG: GEMINI_API_KEY and GOOGLE_API_KEY are BOTH missing.");
        return res.status(500).json({ error: "Серверде API кілті орнатылмаған. Баптауларды тексеріңіз (Secrets panel)." });
      }

      console.log(`DEBUG: API Key found. Length: ${apiKey.length}. Starts with: ${apiKey.substring(0, 4)}...`);

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

      // Returning structure for candidates[0].content.parts[0].text to be backward compatible with what the user asked
      res.json({
        candidates: [
          {
            content: {
              parts: [{ text }]
            }
          }
        ]
      });
    } catch (error: any) {
      console.error("Backend Proxy Error:", error.message);
      res.status(500).json({ 
        error: "AI жауап беру кезінде қате кетті. API кілті дұрыс екеніне көз жеткізіңіз.",
        message: error.message
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
