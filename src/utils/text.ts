export const dedent = (text: string): string => {
  const splittedText = text.split('\n');
  const indentations = splittedText
    .map(line => line.match(/^[\s]+/gm)?.[0]?.length)
    .filter(length => length !== undefined);
  const minIndentation = indentations.length > 0 ? Math.min(...indentations) : 0;
  return splittedText.map(line => line.slice(minIndentation)).join('\n');
};

export const indent = (text: string, nbSpaces: number): string => {
  const padding = ' '.repeat(nbSpaces);
  return text.split('\n').map(line => padding + line).join('\n');
};
