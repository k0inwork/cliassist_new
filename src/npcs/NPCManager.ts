import { GeminiService } from '../engine/GeminiService';
import { EngineState, NPCMessage } from '../common/types';

export class NPCManager {
  private gemini: GeminiService;
  private personas: any[] = [];

  constructor(gemini: GeminiService) {
    this.gemini = gemini;
  }

  async initializePersonas(theme: string) {
    const prompt = `
      You are generating 5 NPC personas for a CLI RPG system with the theme: "${theme}".
      The roles are:
      1. Prophet (Future predictor / Dominant tensor identifier)
      2. Critic (Uncertainty exposer / Alternative identifier)
      3. Sceptic (Prerequisite checker / Low skill warner)
      4. Guide (Action suggester / Next step provider)
      5. Chronicler (Progress tracker / Skill unlocker)

      For each role, provide:
      - id (prophet, critic, sceptic, guide, chronicler)
      - name (fitting the theme)
      - style (how they talk)

      Respond in JSON format:
      { "personas": [ { "id": "...", "name": "...", "style": "..." }, ... ] }
    `;

    const result = await this.gemini.generateJson(prompt);
    this.personas = result.personas;
  }

  async getCouncilMessages(state: EngineState): Promise<NPCMessage[]> {
    // In a real impl, this would use the persona styles and triggers
    // For now, returning dummy messages based on personas
    return this.personas.map(p => ({
        npc: p.name,
        text: `${p.style}: I see you are working on something interesting...`,
        priority: 1
    }));
  }
}
