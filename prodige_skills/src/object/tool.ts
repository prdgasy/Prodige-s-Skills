import { ItemType } from "../types";
import { textWrapper } from "../../lib/textWrapper";
import { say } from "sandstone";

export type ToolOptions = {
  name: string;
  item: ItemType;
  price: number;
  description: string[];
  rarity: ToolRarity;
  durability: number;
  onUse?: () => void;
  onBreak?: () => void;
  onHold?: () => void;
};
export type ToolRarity = "§f§lCOMMON" | "§9§lRARE" | "§d§lEPIC" | "§6§lLEGENDARY";
export class ToolClass {
  name: string;
  item: ItemType;
  price: number;
  description: string[];
  rarity: ToolRarity;
  durability: number;

  onUse?: () => void;
  onBreak?: () => void;
  onHold?: () => void;

  constructor(options: ToolOptions) {
    this.name = options.name;
    this.item = options.item;
    this.price = options.price;
    this.description = options.description;
    this.rarity = options.rarity;
    this.durability = options.durability;
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

export function Tool({
  name,
  item,
  price,
  description,
  rarity,
  durability,
  onUse,
  onBreak,
  onHold
}: ToolOptions) {
  return new ToolClass({
    name,
    item,
    price,
    description,
    rarity,
    durability,
    onUse,
    onBreak,
    onHold
  });
}

export const NovicePickaxe = Tool({
  name: "§9Novice Miner's Pickaxe",
  item: "iron_pickaxe",
  price: 50,
  description: textWrapper('§7A reliable pickaxe for aspiring miners, ideal for extracting basic ores.'),
  rarity: "§f§lCOMMON",
  durability: 250,
  onUse: () => { },
  onBreak: () => { },
  onHold: () => { }
});

export const DeepDelverPickaxe = Tool({
  name: "Deep Delver Pickaxe",
  item: "diamond_pickaxe",
  price: 250,
  description: textWrapper('§7Forged in deep caverns, this sturdy pickaxe effortlessly breaks through the toughest stone.'),
  rarity: "§9§lRARE",
  durability: 1000,
  onUse: () => { },
  onBreak: () => { },
  onHold: () => { }
});

export const ToolList: ToolClass[] = [
  NovicePickaxe,
  DeepDelverPickaxe
];