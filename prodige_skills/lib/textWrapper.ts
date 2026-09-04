export function textWrapper(rawInput: string, wordsPerLine = 5, colorCode = "§7"): string[] {
  const words = rawInput.split(' ');
  const result: string[] = [];
  let currentLine: string[] = [];

  words.forEach(word => {
    currentLine.push(word);
    if (currentLine.length == wordsPerLine) {
      result.push(colorCode + currentLine.join(' '));
      currentLine = [];
    }
  });

  if (currentLine.length > 0) {
    result.push(colorCode + currentLine.join(' '));
  }

  return result;
}
