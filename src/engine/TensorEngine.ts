import { VectorEngine } from './VectorEngine';
import { CommandEvent, World, TensorPosition, EngineState } from '../common/types';

export class TensorEngine {
  private vectorEngine: VectorEngine;
  private SIMILARITY_THRESHOLD = 0.4;
  private ALPHA = 3.0; // Softmax temperature
  private PROPAGATION_DECAY = 0.7;

  constructor() {
    this.vectorEngine = new VectorEngine();
  }

  async updatePosition(commandEvent: CommandEvent, world: World, currentState: EngineState): Promise<EngineState> {
    // 1. Embed command
    const v_cmd = await this.vectorEngine.embed(commandEvent.commandLine);

    // 2. Load world tensors
    const allTensors = Object.values(world.tensors);

    // 3. Compute cosine similarities
    const candidates: { tensor: TensorPosition, similarity: number, rawScore: number }[] = [];
    for (const tensor of allTensors) {
      const similarity = VectorEngine.cosineSimilarity(v_cmd, tensor.vector);
      if (similarity > this.SIMILARITY_THRESHOLD) {
        candidates.push({
          tensor: { ...tensor }, // Clone to avoid mutation of world def
          similarity,
          rawScore: Math.exp(this.ALPHA * similarity)
        });
      }
    }

    // 4. Normalize to probabilities
    const totalScore = candidates.reduce((sum, c) => sum + c.rawScore, 0);
    if (totalScore > 0) {
      for (const candidate of candidates) {
        candidate.tensor.probability = candidate.rawScore / totalScore;
      }
    }

    // 5. Hierarchical propagation
    this.propagateHierarchy(candidates, world);

    // 6. World prior boost
    this.applyWorldPriors(world, candidates);

    // 7. Global normalization
    // Update state
    const newPositions: Record<string, TensorPosition> = {};
    for (const candidate of candidates) {
      newPositions[candidate.tensor.id] = candidate.tensor;
    }

    // Merge with current state (simplified for now)
    return {
      ...currentState,
      tensorPositions: newPositions,
      lastUpdate: Date.now(),
      sessionHistory: [...currentState.sessionHistory, commandEvent]
    };
  }

  private propagateHierarchy(candidates: { tensor: TensorPosition }[], world: World) {
    for (const candidate of candidates) {
      const tensor = candidate.tensor;

      // Propagate UP intention hierarchy
      for (const parentIntentId of tensor.connects_to) {
        const parentTensor = world.tensors[parentIntentId];
        if (parentTensor) {
          // If parent is already a candidate, add to its probability
          const parentCandidate = candidates.find(c => c.tensor.id === parentIntentId);
          if (parentCandidate) {
            parentCandidate.tensor.probability += tensor.probability * this.PROPAGATION_DECAY;
          } else {
             // In a real impl, we'd add it to candidates or handle it elsewhere
             // For now let's keep it simple as per spec snippet
          }
        }
      }
    }
  }

  private applyWorldPriors(world: World, candidates: { tensor: TensorPosition }[]) {
    for (const candidate of candidates) {
      const prior = world.commonTensors[candidate.tensor.id] || 1.0;
      candidate.tensor.probability *= prior;
    }
  }
}
