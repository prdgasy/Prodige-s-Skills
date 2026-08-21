type Text = {
  text: string;
  color?: string;
  italic?: boolean;
  bold?: boolean;
} | Text[]

export function textWrapper({
  text,
  color = 'gray',
  italic = false,
  bold = false,
  wordsPerLine = 5,

}: {
  text: string,
  color?: string,
  italic?: boolean,
  bold?: boolean,
  wordsPerLine?: number,
}): Text[] {
  const words = text.split(' ');
  const result: Text[] = [];
  let currentLine: string[] = [];
  let spaceAfterFirst = ''
  words.forEach(word => {
    currentLine.push(word);
    if (currentLine.length == wordsPerLine) {
      result.push({ text: spaceAfterFirst + currentLine.join(' '), color: color, italic: italic, bold: bold });
      spaceAfterFirst = ' '
      currentLine = [];
    }
  });

  if (currentLine.length > 0) result.push({ text: spaceAfterFirst + currentLine.join(' '), color: color, italic: italic, bold: bold });

  return result;
}