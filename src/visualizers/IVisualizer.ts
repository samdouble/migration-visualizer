import { State } from '../connectors/types';

export interface IVisualizer {
  visualize: (beforeState: State, afterState: State) => Promise<string>;
}
