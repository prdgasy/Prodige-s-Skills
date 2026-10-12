import { Item } from "../types";
import { textWrapper } from "../../lib/textWrapper";
import { say } from "sandstone";
import { Skill } from "@src/skill";

export type ToolOptions = {
  name: string;
  item: Item;
  price: number;
  description: string;
  rarity: ToolRarity;
  durability: number;
  type?: Skill;
  onUse?: () => void;
  onBreak?: () => void;
  onHold?: () => void;
};

type ToolRarity = "§f§lCOMMON" | "§9§lRARE" | "§d§lEPIC" | "§6§lLEGENDARY";

export class Tool {
  public static list: Tool[] = [];
  public name: string;
  public item: Item;
  public price: number;
  public description: string;
  public rarity: ToolRarity;
  public durability: number;

  public type?: Skill;
  public onUse?: () => void;
  public onBreak?: () => void;
  public onHold?: () => void;

  constructor(options: ToolOptions) {
    this.name = options.name;
    this.item = options.item;
    this.price = options.price;
    this.description = options.description;
    this.rarity = options.rarity;
    this.durability = options.durability;
    this.type = options.type;
    this.onUse = options.onUse;
    this.onBreak = options.onBreak;
    this.onHold = options.onHold;
  }

  give() {
    say(`Given x1 ${this.name} to @p`);
  }

  toString() {
    return this.name;
  }
}

const NovicePickaxe = new Tool({
  name: "§9Novice Miner's Pickaxe",
  item: "iron_pickaxe",
  price: 50,
  description: '§7A reliable pickaxe for aspiring miners, ideal for extracting basic ores.',
  rarity: "§f§lCOMMON",
  durability: 250,
  onUse: () => { },
  onBreak: () => { },
  onHold: () => { }
});

const DeepDelverPickaxe = new Tool({
  name: "Deep Delver Pickaxe",
  item: "diamond_pickaxe",
  price: 250,
  description: '§7Forged in deep caverns, this sturdy pickaxe effortlessly breaks through the toughest stone.',
  rarity: "§9§lRARE",
  durability: 1000,
  onUse: () => { },
  onBreak: () => { },
  onHold: () => { }
});

Tool.list.push(NovicePickaxe, DeepDelverPickaxe);