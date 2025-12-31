
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getInspirationalQuote = async () => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Provide a short, uplifting Bible verse or spiritual message suitable for a Christian New Year celebration in both English and Nepali. Focus on hope, new beginnings, and grace.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            english: { type: Type.STRING },
            nepali: { type: Type.STRING },
            reference: { type: Type.STRING }
          },
          required: ["english", "nepali", "reference"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to fetch quote:", error);
    return {
      english: "His mercies are new every morning.",
      nepali: "उहाँको कृपा हरेक बिहान नयाँ हुन्छ।",
      reference: "Lamentations 3:22-23"
    };
  }
};
