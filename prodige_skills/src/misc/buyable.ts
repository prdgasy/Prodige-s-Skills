import { Reward } from "@src/misc/reward";
import { Player } from "@src/player";
import { Item } from "@src/types";
import { _, Data, tellraw, Variable } from "sandstone";
import { ConditionClass } from "sandstone/variables";

export class Buyable extends Reward {
	public name: string;
	public description: string;
	public price: number;
	public item: Item;
	public give: () => void;

	constructor(name: string, description: string, item: Item, price: number, give: () => void) {
		super(name, give);
		this.name = name;
		this.description = description;
		this.price = price;
		this.item = item;
		this.give = give;
	}

	public buy() {
		_.if(Player.pts['<'](this.price), () => {
			tellraw("@p", `§cYou don't have enough points to buy [${this.name}§c]!`);
			Player.playSound('error');
		})
			.elseIf(Player.isInvFull(), () => {
				tellraw("@p", "§cYour inventory is full!");
				Player.playSound('error');
			})
			.else(() => {
				Player.pts['-='](this.price);
				this.give();
				Player.playSound('success', 2);
			});
	}
}