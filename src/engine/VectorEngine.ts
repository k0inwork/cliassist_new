import { pipeline, Pipeline } from '@xenova/transformers';

export class VectorEngine {
  private embedder: any = null;

  async initialize() {
    if (this.embedder) return;

    // Using MiniLM-L6-v2 for 384-dim embeddings as specified
    this.embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      quantized: false
    });
  }

  async embed(text: string): Promise<number[]> {
    if (!this.embedder) {
      await this.initialize();
    }

    const output = await this.embedder!(text, {
      pooling: 'mean',
      normalize: true
    });

    return Array.from(output.data);
  }

  static cosineSimilarity(v1: number[], v2: number[]): number {
    if (v1.length !== v2.length) return 0;
    let dot = 0;
    for (let i = 0; i < v1.length; i++) {
      dot += v1[i] * v2[i];
    }
    // Since vectors are normalized (unit vectors), dot product is cosine similarity
    return dot;
  }
}
