import { Buyable } from "@src/misc/buyable";
import { Skill } from "@src/skill";
import { give, MCFunction, tellraw } from "sandstone";
import { Item } from "../types";

export type ToolOptions = {
	name: string;
	item: Item;
	price: number;
	description: string;
	characteristics: string[];
	rarity: ToolRarity;
	durability: number;
	type?: Skill;
	onUse?: () => void;
	onBreak?: () => void;
	onHold?: () => void;
};

type ToolRarity = "§f§lCOMMON" | "§9§lRARE" | "§d§lEPIC" | "§6§lLEGENDARY";

export class Tool extends Buyable {
	public static list: Tool[] = [];
	public name: string;
	public item: Item;
	public price: number;
	public description: string;
	public characteristics: string[];
	public rarity: ToolRarity;
	public durability: number;

	public type?: Skill;
	public onUse?: () => void;
	public onBreak?: () => void;
	public onHold?: () => void;

	constructor(options: ToolOptions) {
		super();
		this.name = options.name;
		this.item = options.item;
		this.price = options.price;
		this.description = options.description;
		this.characteristics = options.characteristics;
		this.rarity = options.rarity;
		this.durability = options.durability;
		this.type = options.type;
		this.onUse = options.onUse;
		this.onBreak = options.onBreak;
		this.onHold = options.onHold;
	}

	override give() {
		const fn = MCFunction(Buyable.giveFnName(this.name), () => {
			tellraw('@p', `§aBought x1 [${this.name}§a]!`);
			give('@p', this.item);
		}, { onConflict: 'ignore' })
		return fn();
	}
}