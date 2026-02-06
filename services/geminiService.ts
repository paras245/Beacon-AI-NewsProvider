
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { NewsItem, LocationState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchGoodNews = async (location: string, year: number): Promise<NewsItem[]> => {
  const prompt = `Give me 1-3 highly positive, hopeful, or significant "good news" events from ${location} in the year ${year}. 
  Focus on achievements in community, technology, health, environment, or culture. 
  For each news item, provide a headline, a 2-3 sentence summary, a category, and real article sources (publisher name and URL).
  Ensure the news is factually accurate for that specific year and location.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              category: { 
                type: Type.STRING,
                description: "One of: Community, Technology, Health, Environment, Culture"
              },
              sources: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    publisher: { type: Type.STRING },
                    url: { type: Type.STRING }
                  },
                  required: ["publisher", "url"]
                }
              }
            },
            required: ["title", "summary", "category", "sources"]
          }
        },
        tools: [{ googleSearch: {} }]
      },
    });

    const jsonStr = response.text?.trim();
    if (!jsonStr) return [];

    const data = JSON.parse(jsonStr);
    
    return data.map((item: any, index: number) => ({
      ...item,
      id: `${location}-${year}-${index}`,
      location,
      year
    }));
  } catch (error) {
    console.error("Error fetching news from Gemini:", error);
    throw error;
  }
};

export const resolveLocation = async (query: string): Promise<LocationState> => {
    const prompt = `Resolve the location query "${query}" into structured data. 
    Find the approximate Latitude and Longitude and the clean "City, Country" or "Region, Country" name.
    Respond with JSON: {"lat": number, "lng": number, "name": "string"}.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        lat: { type: Type.NUMBER },
                        lng: { type: Type.NUMBER },
                        name: { type: Type.STRING }
                    },
                    required: ["lat", "lng", "name"]
                }
            }
        });
        const result = JSON.parse(response.text?.trim() || "{}");
        return result;
    } catch (error) {
        console.error("Location resolution failed:", error);
        throw new Error("Could not find that location.");
    }
};

export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    const prompt = `What is the City and Country name for the coordinates Latitude: ${lat}, Longitude: ${lng}? Respond with just "City, Country" or "Region, Country". If it's the middle of the ocean, say "The High Seas".`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt
        });
        return response.text?.trim() || "Unknown Location";
    } catch (error) {
        console.error("Geocoding failed:", error);
        return "Selected Point";
    }
};
