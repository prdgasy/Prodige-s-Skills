import { Text } from "@prodigelib/gui";
import { ItemType } from "../types";

export type ToolOptions = {
  name: string;
  item: ItemType;
  price: number;
  description: Text[];
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
  description: Text[];
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