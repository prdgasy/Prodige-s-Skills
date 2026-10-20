import { Buyable } from "@src/misc/buyable";
import { Skill } from "@src/skill";
import { give, MCFunction } from "sandstone";
import { Item } from "../types";
import { Reward } from "./reward";

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

	constructor(opt: ToolOptions) {
		super(opt.name, opt.description, opt.item, opt.price, Tool.getFromOpt(opt));
		this.name = opt.name;
		this.item = opt.item;
		this.price = opt.price;
		this.description = opt.description;
		this.characteristics = opt.characteristics;
		this.rarity = opt.rarity;
		this.durability = opt.durability;
		this.type = opt.type;
		this.onUse = opt.onUse;
		this.onBreak = opt.onBreak;
		this.onHold = opt.onHold;
	}

	public static getFromOpt(opt: ToolOptions) {
		const fn = MCFunction(Reward.giveMcFn(opt.name), () => {
			give('@p', opt.item, { custom_name: opt.name, lore: [{ text: opt.description }] });
		}, { onConflict: 'ignore' });

		return () => fn();
	}
}