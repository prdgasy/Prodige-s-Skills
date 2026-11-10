import { Button, Gui, PageClass } from "@prodigelib/gui";
import { Shop } from ".";
import { Menu } from "@src/menu";
import { Tool } from "@src/misc/tool";
import { Text } from "@lib/text";
import { _, Objective } from "sandstone";

export class Items {
	public static index = Objective.create('menu.shop.items.index')('@s');

	public static getName() {
		return this.name;
	}

	public static init(g: Gui, p: PageClass) {
		const tools = Object.values(Tool.tools);

		p.add(() => {
			let slot = 0;
			let page = 0;
			let t = 0;
			while (t < tools.length) {
				_.if(Items.index['=='](page), () => {
					while (slot < 18 && t < tools.length) {
						const tool = tools[t];
						p.emit(this.displayItem(tool, slot++));
						t++;
					}
					slot = 0;
				})
				page++;
			}
		});

		p.add(() => Menu.sliders(p, Items.index, Math.floor(tools.length / 18)));



		p.add(Shop.balance(), Menu.back(g, Shop));
		return p;
	}

	private static displayItem(tool: Tool, slot: number) {
		return new Button(
			tool.icon,
			slot,
			`§a§l${tool.name} §8• §6${tool.price} Pts`,
			[
				"",
				...Text.wrap(tool.description, `§7`),
				"",
				...(tool.characteristics?.length ? [
					`§d§l┃ Special Characteristics`,
					...tool.characteristics.flatMap(c => Text.wrap(c, '§d┃ §7')),
					"",
				] : []),
				`§b§l┃ Price §8• §6${tool.price} Pts`,
				"§7↪ §8Click to purchase!",
				"",
				tool.rarity
			],
			() => tool.buy()
		);
	}
}