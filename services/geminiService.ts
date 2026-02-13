import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Recipe, NutritionAnalysis, WellnessPlan } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const modelId = "gemini-3-flash-preview";

export const generateRecipe = async (
  ingredients: string,
  dietaryRestrictions: string,
  mealType: string
): Promise<Recipe> => {
  const prompt = `Create a healthy and delicious recipe using these ingredients: ${ingredients}. 
  Dietary restrictions: ${dietaryRestrictions}. 
  Meal type: ${mealType}. 
  Focus on nutritional balance and flavor.`;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          instructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          cookingTime: { type: Type.STRING },
          difficulty: { type: Type.STRING },
          macros: {
            type: Type.OBJECT,
            properties: {
              calories: { type: Type.NUMBER },
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fats: { type: Type.NUMBER }
            }
          }
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as Recipe;
};

export const analyzeNutrition = async (foodDescription: string): Promise<NutritionAnalysis> => {
  const prompt = `Analyze the nutritional value of the following food/meal description: "${foodDescription}". 
  Provide a health rating from 1-10 (10 being healthiest), macro breakdown, and suggestions to make it healthier.`;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          foodItem: { type: Type.STRING },
          summary: { type: Type.STRING },
          healthRating: { type: Type.NUMBER },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          macros: {
            type: Type.OBJECT,
            properties: {
              calories: { type: Type.NUMBER },
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fats: { type: Type.NUMBER }
            }
          }
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as NutritionAnalysis;
};

export const createHealthChatSession = (): Chat => {
  return ai.chats.create({
    model: modelId,
    config: {
      systemInstruction: `You are a knowledgeable and empathetic AI health assistant named 'Dr. AI'. 
      Your goal is to provide general health information, wellness tips, and explain medical concepts in simple terms. 
      
      IMPORTANT GUIDELINES:
      1. ALWAYS include a brief disclaimer that you are an AI and not a replacement for professional medical advice.
      2. If a user describes severe symptoms (chest pain, difficulty breathing, severe bleeding, sudden confusion, etc.), explicitly and urgently tell them to seek emergency care immediately.
      3. Be concise but helpful. Use bullet points for lists.
      4. Maintain a professional, caring, and reassuring tone.`,
    },
  });
};

export const generateWellnessPlan = async (
  age: string,
  gender: string,
  weight: string,
  height: string,
  goal: string,
  activityLevel: string
): Promise<WellnessPlan> => {
  const prompt = `Create a comprehensive weekly wellness plan for a ${age} year old ${gender}, ${weight}kg, ${height}cm.
  Goal: ${goal}.
  Activity Level: ${activityLevel}.
  
  Provide:
  1. A 7-day workout schedule (Monday-Sunday).
  2. A sample daily meal guide (generic healthy options for Breakfast, Lunch, Dinner, Snack).
  3. Daily target macros.
  4. Hydration and sleep goals.
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "A brief motivational summary of the plan" },
          targetMacros: {
            type: Type.OBJECT,
            properties: {
              calories: { type: Type.NUMBER },
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fats: { type: Type.NUMBER }
            }
          },
          weeklySchedule: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                focus: { type: Type.STRING },
                exercises: { type: Type.ARRAY, items: { type: Type.STRING } },
                duration: { type: Type.STRING }
              }
            }
          },
          mealGuide: {
            type: Type.OBJECT,
            properties: {
              breakfast: { type: Type.STRING },
              lunch: { type: Type.STRING },
              dinner: { type: Type.STRING },
              snack: { type: Type.STRING }
            }
          },
          hydrationGoal: { type: Type.STRING },
          sleepGoal: { type: Type.STRING }
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as WellnessPlan;
};