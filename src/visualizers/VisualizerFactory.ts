import { MermaidVisualizer } from "./MermaidVisualizer";

export const VisualizerFactory = {
  create: (type: string) => {
    switch (type) {
      case 'mermaid':
        return new MermaidVisualizer();
      default:
        throw new Error(`Unsupported visualizer type: ${type}`);
    }
  },
};
