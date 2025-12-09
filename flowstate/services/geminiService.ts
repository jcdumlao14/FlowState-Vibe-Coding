import { GoogleGenAI, Type } from "@google/genai";
import { ProjectData, Task } from "../types";

const SYSTEM_PROMPT = `
You are an expert Agile Project Manager and Business Strategist. 
Your goal is to digitize physical meeting notes, whiteboards, or strategy sketches into structured project data.

Analyze the provided image.
1. Identify the main high-level 'Objective' (Strategic Goal).
2. Identify 3 specific, measurable 'Key Results' (OKRs).
3. Extract actionable tasks. If tasks are not explicitly listed, infer necessary steps to achieve the objective.
4. For each task, provide a concise title, a brief description, and an ESTIMATED number of hours required (integer) based on complexity.

Return strictly JSON.
`;

export const analyzeStrategyImage = async (base64Image: string): Promise<ProjectData> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // We remove the header "data:image/jpeg;base64," if present to just get the data
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg", // Assuming JPEG for simplicity or generic handling
              data: cleanBase64
            }
          },
          {
            text: "Analyze this strategy sketch. Convert it into a JSON object with an 'objective', 'keyResults' (array of 3 strings), and 'tasks' (array of objects with title, description, hours). Do not include markdown formatting."
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            objective: { type: Type.STRING },
            keyResults: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  hours: { type: Type.NUMBER, description: "Estimated hours to complete" }
                },
                required: ["title", "description", "hours"]
              }
            }
          },
          required: ["objective", "keyResults", "tasks"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No response from Gemini");
    }

    const rawData = JSON.parse(response.text);

    // Transform raw data to our App types with business logic
    const tasks: Task[] = (rawData.tasks || []).map((t: any, index: number) => {
      // Check for keywords to auto-tag high priority
      const textContent = `${t.title} ${t.description}`.toLowerCase();
      const isHighPriority = textContent.includes('marketing') || textContent.includes('influencer');

      return {
        id: `task-${Date.now()}-${index}`,
        title: t.title,
        description: t.description,
        hoursEstimate: t.hours,
        status: 'todo',
        priority: isHighPriority ? 'high' : 'normal'
      };
    });

    // Sort tasks: High priority first
    tasks.sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (a.priority !== 'high' && b.priority === 'high') return 1;
      return 0;
    });

    return {
      okrs: {
        objective: rawData.objective || "Untitled Objective",
        keyResults: rawData.keyResults || []
      },
      tasks
    };

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};