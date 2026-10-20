import { Button, Gui, PageClass } from "@prodigelib/gui";
import { Skill } from "@src/skill";



export class Titles {
	public static getName() {
		return this.name
	}

	public static init(g: Gui, p: PageClass) {
		let s = 0;
		for (const skill of Object.values(Skill.skills)) for (const title of skill.titles) {
			const t = new Button('name_tag', s++, title.name, [title.description]);
			p.add(t);
		}
		return p;
	}
}