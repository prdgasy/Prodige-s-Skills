import { Text } from "@prodigelib/gui";
import { give, Objective, tellraw } from "sandstone";

/**
 * item that can be given to a player.
 * This is derived from the parameters of the 'give' function from sandstone.
 */
export type ItemType = Parameters<typeof give>[1];
export type Criteria = Parameters<typeof Objective.create>[1];


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