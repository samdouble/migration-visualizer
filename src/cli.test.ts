import program from "./cli";

describe('CLI', () => {
  it('should have the correct name', () => {
    expect(program.name()).toBe('migration-visualizer');
  });

  describe('visualize', () => {
    const visualizeCmd = program.commands.find(cmd => cmd.name() === 'visualize');

    it('should have the command', () => {
      expect(visualizeCmd).toBeDefined();
    });

    it('should have --changed option', () => {
      const changedOption = visualizeCmd?.options.find(opt => opt.long === '--changed');
      expect(changedOption).toBeDefined();
    });

    it('should have --output option', () => {
      const outputOption = visualizeCmd?.options.find(opt => opt.long === '--output');
      expect(outputOption).toBeDefined();
    });
  });
});
