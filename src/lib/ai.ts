import { GoogleGenAI } from "@google/genai";

class AI {
  private client: GoogleGenAI;
  private model: string;

  constructor() {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_AI_API_KEY is not set");
    }

    this.model = process.env.GOOGLE_AI_MODEL ?? "gemini-2.5-flash-lite";

    this.client = new GoogleGenAI({ apiKey });
  }

  async prompt(input: string): Promise<string> {
    const response = await this.client.models.generateContent({
      model: this.model,
      contents: input,
    });

    return response.text ?? "";
  }
}

const ai = new AI();
export default ai;
