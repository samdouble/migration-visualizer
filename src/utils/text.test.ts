import { dedent, indent } from './text';

describe('text', () => {
  describe('dedent', () => {
    it('should dedent a single line of text', () => {
      expect(dedent(`This is a single line of text`)).toBe('This is a single line of text');
      expect(dedent(`    This is a single line of text`)).toBe('This is a single line of text');
    });

    it('should dedent a multiline text', () => {
      const text = dedent(
      `
        if (true) {
          return 'This is true';
        } else {
          return 'This is false';
        }
        
        return 'This is a return value';`,
      );
      const expected = [
        '',
        'if (true) {',
        '  return \'This is true\';',
        '} else {',
        '  return \'This is false\';',
        '}',
        '',
        'return \'This is a return value\';',
      ].join('\n');
      expect(text).toBe(expected);
    });
  });

  describe('indent', () => {
    it('should indent a single line of text', () => {
      const text = indent(`This is a single line of text`, 4);
      expect(text).toBe('    This is a single line of text');
    });

    it('should indent the text', () => {
      const text = indent(
        dedent(
        `
          if (true) {
            return 'This is true';
          } else {
            return 'This is false';
          }
          
          return 'This is a return value';`,
        ),
        4,
      );
      const expected = [
        '    ',
        '    if (true) {',
        '      return \'This is true\';',
        '    } else {',
        '      return \'This is false\';',
        '    }',
        '    ',
        '    return \'This is a return value\';',
      ].join('\n');
      expect(text).toBe(expected);
    });
  });
});
