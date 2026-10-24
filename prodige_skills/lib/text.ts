export class Text {
	public static wrap(input: string, wordsPerLine = 5, color = '§7') {
		const words = input.split(' ');
		const result: string[] = [];
		let currentLine: string[] = [];

		words.forEach(word => {
			currentLine.push(word);
			if (currentLine.length == wordsPerLine) {
				result.push(color + currentLine.join(' '));
				currentLine = [];
			}
		});

		if (currentLine.length > 0) {
			result.push(color + currentLine.join(' '));
		}

		return result;
	}
}
