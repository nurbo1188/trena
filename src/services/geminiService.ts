// Frontend now calls backend API
export async function getGeminiResponse(_apiKey: string, prompt: string, systemInstruction: string) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        instruction: systemInstruction
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Failed to fetch from API");
    }

    const data = await response.json();
    // Supporting the data.candidates[0].content.parts[0].text structure
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
}

export const SYSTEM_INSTRUCTION = `
Сен 6-сынып оқушысына арналған интеллектуалды тренажёрдың көмекшісісің. 
Оқушылар жасы 11-12. Жауаптар тек қазақ тілінде, қысқа, нақты, күнделікті өмірден мысалдармен болсын. 
Күрделі терминдерді қарапайым тілмен түсіндір. 
Тапсырмалар алгоритмдер мен Python бастауыш деңгейіне (6-сынып оқулығына) арналған.
Информтика пәні бойынша білімің терең, бірақ түсіндіруің балаларға түсінікті.
`;
