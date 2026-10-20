import { textWrapper } from "@lib/textWrapper";
import { Button, Gui, PageClass } from "@prodigelib/gui";
import { Crate } from "@src/misc/crate";

export class Crates {
	public static getName() {
		return this.name;
	}

	public static init(g: Gui, p: PageClass) {
		const crates: Button[] = [];
		let slot = 11;
		for (const crate of Object.values(Crate.crates)) {
			crates.push(
				new Button('chest', slot++, crate.color + crate.name, textWrapper(crate.description), () => crate.tryOpen())
				// add keys
			);
		}

		p.add(...crates);
		return p;
	}
}