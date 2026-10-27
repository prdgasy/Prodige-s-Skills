export class Text {
	public static wrap(input: string, debut = '§7', wordsPerLine = 5) {
		const words = input.split(' ');
		const result: string[] = [];
		let currentLine: string[] = [];

		words.forEach(word => {
			currentLine.push(word);
			if (currentLine.length == wordsPerLine) {
				result.push(debut + currentLine.join(' '));
				currentLine = [];
			}
		});

		if (currentLine.length > 0) {
			result.push(debut + currentLine.join(' '));
		}

		return result;
	}
}
