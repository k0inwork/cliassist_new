import { TensorEngine } from './TensorEngine';
import { CommandEvent, World, EngineState } from '../common/types';

describe('TensorEngine', () => {
  it('should be able to initialize', () => {
    const engine = new TensorEngine();
    expect(engine).toBeDefined();
  });
});
