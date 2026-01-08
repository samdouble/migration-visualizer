import { IVisualizer } from "./IVisualizer";
import { JsonVisualizer } from "./JsonVisualizer";
import { MermaidVisualizer } from "./MermaidVisualizer";

export const VisualizerFactory = {
  create: (type: string): IVisualizer => {
    switch (type) {
      case 'json':
        return new JsonVisualizer();
      case 'mermaid':
        return new MermaidVisualizer();
      default:
        throw new Error(`Unsupported visualizer type: ${type}`);
    }
  },
};
