import { Gui, PageClass } from "@prodigelib/gui";

export class Items {
	public static getName() {
		return this.name;
	}

	public static init(g: Gui, p: PageClass) {
		let slot = 0;

		// for (const tool of Tool.tools) {
		//   const t = new Button(
		//     tool.item,
		//     slot++,
		//     `§a§l${tool.name}`,
		//     [
		//       `§7Rarity: ${tool.rarity}`,
		//       "",
		//       "§f§lDescription",
		//       ...textWrapper(`§7${tool.description}`),
		//       "",
		//       "§d§l✦ Special Characteristic",
		//       ...tool.characteristics.flatMap(c => textWrapper(c)),
		//       "",
		//       "§b§lStatistics",
		//       `§7Durability: §f${tool.durability}`,
		//       `§7Price: §6${tool.price} Points`,
		//       "",
		//       "§e§l➜ Click to purchase",
		//     ],
		//     () => tool.buy()
		//   );
		//   p.add(t);
		// }
		return p;
	}
}