import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string = process.env.GEMINI_API_KEY || "") {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateJson(prompt: string): Promise<any> {
    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    // Simple JSON extraction from markdown if necessary
    const jsonMatch = text.match(/\{.*\}/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No JSON found in response');
  }

  async generateText(prompt: string): Promise<string> {
    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }
}
