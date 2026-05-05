import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const aiService = {
  analyzeRecord: async (record: any) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this business record and provide a concise summary, risks, and recommendations in Markdown format: ${JSON.stringify(record)}`,
        config: {
          temperature: 0.7,
        }
      });
      return response.text;
    } catch (error) {
      console.error('AI Analysis failed:', error);
      throw error;
    }
  },

  askAI: async (query: string, context?: any) => {
    try {
      const systemPrompt = `You are the Analytics Pro Technical Assistant. 
Analyze the following context and answer the user's query with high precision.
Context: ${JSON.stringify(context || 'System Dashboard Overview')}
User Query: ${query}

Provide a structured Markdown response with clear headers and bullet points if necessary. Focus on operational metrics and system health if applicable.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: systemPrompt,
        config: {
          temperature: 0.2, // Lower temperature for more analytical responses
        }
      });
      return response.text;
    } catch (error) {
      console.error('AI Query failed:', error);
      throw error;
    }
  }
};
