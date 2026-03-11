import { TensorEngine } from './TensorEngine';

jest.mock('@xenova/transformers', () => ({
  pipeline: jest.fn().mockResolvedValue(null)
}));

describe('TensorEngine', () => {
  it('should be able to initialize', () => {
    const engine = new TensorEngine();
    expect(engine).toBeDefined();
  });
});
