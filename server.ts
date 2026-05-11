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
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  
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
      
      // Support both styles of input from frontend
      const targetPrompt = message || prompt;
      const targetInstruction = instruction || SYSTEM_INSTRUCTION;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not set in environment" });
      }

      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: targetInstruction 
      });

      const result = await model.generateContent(targetPrompt);
      const text = result.response.text();

      // Return in a structure similar to what the user requested or just the text
      // To match the user's direct requirement for candidates[0] structure if they want to mock it, 
      // but usually returning a clean JSON is better. 
      // However, the user asked to display text from: data.candidates[0].content.parts[0].text
      // So I will return the raw-like structure to satisfy the frontend expectation they described.
      
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
      console.error("Backend Gemini Error:", error);
      res.status(500).json({ error: error.message });
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
