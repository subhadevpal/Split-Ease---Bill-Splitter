
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

export const getAmountFromImage = async (base64Image: string, mimeType: string): Promise<number> => {
  try {
    const imagePart = fileToGenerativePart(base64Image, mimeType);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          imagePart,
          { text: "Analyze this image of a receipt. Extract the final total amount. The total amount is usually labeled 'Total', 'Grand Total', or is the largest number at the bottom." }
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalAmount: {
              type: Type.NUMBER,
              description: 'The final total amount from the receipt as a number, without currency symbols. If no amount is found, return 0.',
            },
          },
          required: ["totalAmount"],
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    return result.totalAmount || 0;

  } catch (error) {
    console.error("Error extracting amount from image:", error);
    // Return 0 or throw a more specific error to be handled by the UI
    return 0;
  }
};
