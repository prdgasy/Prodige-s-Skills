import { Tool, ToolClass } from "./tool";
import { textWrapper } from "../../lib/textWrapper";

export const NovicePickaxe = Tool({
  name: "Novice Miner's Pickaxe",
  item: "iron_pickaxe",
  price: 50,
  description: textWrapper({
    text: "A reliable pickaxe for aspiring miners, ideal for extracting basic ores.",
    color: "gray"
  }),
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
  description: textWrapper({
    text: "Forged in deep caverns, this sturdy pickaxe effortlessly breaks through the toughest stone.",
    color: "gray"
  }),
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
