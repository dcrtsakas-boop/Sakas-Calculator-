
import { GoogleGenAI, Type } from "@google/genai";
import { NutritionInfo } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeFoodImage(base64Image: string): Promise<NutritionInfo> {
  const model = 'gemini-3-flash-preview';
  
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        {
          text: "Analyse cette image de nourriture. Fournis des informations nutritionnelles estimées. Sois aussi précis que possible pour la taille de la portion affichée. IMPORTANT : Les champs 'foodName' et 'description' DOIVENT être rédigés en français.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          foodName: { type: Type.STRING, description: "Nom commun de l'aliment en français" },
          calories: { type: Type.NUMBER, description: "Calories totales en kcal" },
          proteins: { type: Type.NUMBER, description: "Protéines totales en grammes" },
          carbs: { type: Type.NUMBER, description: "Glucides totaux en grammes" },
          fats: { type: Type.NUMBER, description: "Lipides totaux en grammes" },
          confidence: { type: Type.NUMBER, description: "Score de confiance de 0 à 1" },
          description: { type: Type.STRING, description: "Brève description des composants identifiés en français" }
        },
        required: ["foodName", "calories", "proteins", "carbs", "fats", "confidence", "description"]
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Pas de réponse de l'IA");
  
  return JSON.parse(text) as NutritionInfo;
}
