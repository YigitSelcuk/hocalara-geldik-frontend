
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
  // Use process.env.API_KEY directly as per guidelines
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Generates a news draft using Gemini 3 Flash.
 * Configures responseSchema for structured JSON output.
 */
export const generateNewsDraft = async (topic: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Bir eğitim kurumu için şu konu hakkında profesyonel, ilgi çekici ve bilgilendirici bir haber taslağı oluştur: ${topic}.`,
    config: {
      responseMimeType: "application/json",
      // Recommended way to request JSON output with specific structure
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: 'Haberin başlığı',
          },
          content: {
            type: Type.STRING,
            description: 'Haberin detaylı içeriği',
          },
        },
        required: ["title", "content"],
      },
    },
  });
  
  // Directly access .text property from response
  const jsonStr = response.text || '{}';
  return JSON.parse(jsonStr.trim());
};

/**
 * Summarizes the provided text into a short social media update.
 */
export const summarizeContent = async (text: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Aşağıdaki metni eğitim kurumu sosyal medya hesabında paylaşılacak şekilde kısa bir özet haline getir: ${text}`,
  });
  
  // Directly access .text property from response
  return response.text || '';
};
