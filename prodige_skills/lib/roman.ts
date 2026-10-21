import { Data, DataPointClass, MCFunction, Score, Macro as $, defaultNamespace } from "sandstone";

export class Roman {
	private static ns = defaultNamespace.toString();
	private static storage = Data('storage', `${this.ns}:prodigelib`, 'RomanNumbers');
	private static nextId = 0;
	private static numbers = this.storage.select('numbers');

	static {
		this.setData();
	}

	private static setData() {
		return MCFunction('__lib/roman/set_data', () => {
			const s: string[] = ["0"];
			for (let i = 1; i < 101; i++) {
				s.push(this.numberToRoman(i));
			}
			this.numbers.set(s);
			return this.numbers;
		}, { runOnLoad: true });
	}

	public static get(s: Score): DataPointClass;
	public static get(n: number): string;
	public static get(v: Score | number) {
		if (typeof v === 'number') return this.numberToRoman(v);

		const temp = this.storage.select('temp');
		const out = this.storage.select(`out_${this.nextId++}`);
		const fn = MCFunction(`__lib/roman/score/get`, (_loop: any, s: Score) => {
			$.data.modify(temp).set.from(this.numbers.select($`[${s}]`));
		});
		fn(v);

		out.set(temp);
		return out;
	}

	private static numberToRoman(num: number): string {
		if (num <= 0) return "";
		const lookup: [number, string][] = [
			[100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
			[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
		];
		let roman = "";
		for (const [val, str] of lookup) {
			while (num >= val) {
				roman += str;
				num -= val;
			}
		}
		return roman;
	}
}