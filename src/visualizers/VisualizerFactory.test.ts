import { MermaidVisualizer } from "./MermaidVisualizer";
import { VisualizerFactory } from "./VisualizerFactory";

describe('VisualizerFactory', () => {
  it('should create a Mermaid visualizer', () => {
    const visualizer = VisualizerFactory.create('mermaid');
    expect(visualizer).toBeInstanceOf(MermaidVisualizer);
  });

  it('should throw an error for an unsupported visualizer type', () => {
    expect(() => VisualizerFactory.create('unsupported')).toThrow(Error);
  });
});
