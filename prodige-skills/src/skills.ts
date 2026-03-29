import { Skill } from "./types"

const Mining: Skill = {
  name: 'Mining',
  item: 'diamond_pickaxe',
  startingXp: 15,
  Events: [
    { name: 'Stone', item: 'stone', criteria: 'minecraft.mined:minecraft.stone', xp: 1, point: 5 },
    { name: 'Coal Ore', item: 'coal_ore', criteria: 'minecraft.mined:minecraft.coal_ore', xp: 3, point: 5 },
    { name: 'Iron Ore', item: 'iron_ore', criteria: 'minecraft.mined:minecraft.iron_ore', xp: 5, point: 5 },
    { name: 'Gold Ore', item: 'gold_ore', criteria: 'minecraft.mined:minecraft.gold_ore', xp: 8, point: 5 },
    { name: 'Diamond Ore', item: 'diamond_ore', criteria: 'minecraft.mined:minecraft.diamond_ore', xp: 15, point: 5 }
  ],
  customItems: [{ name: 'Drill Prototype', item: 'golden_pickaxe' }],
  titles: [{ name: 'Deep Delver' }, { name: 'Mountain King' }]
}

const Foraging: Skill = {
  name: 'Foraging',
  item: 'diamond_axe',
  startingXp: 15,
  Events: [
    { name: 'Oak Log', item: 'oak_log', criteria: 'minecraft.mined:minecraft.oak_log', xp: 2, point: 5 },
    { name: 'Birch Log', item: 'birch_log', criteria: 'minecraft.mined:minecraft.birch_log', xp: 2, point: 5 },
    { name: 'Spruce Log', item: 'spruce_log', criteria: 'minecraft.mined:minecraft.spruce_log', xp: 3, point: 5 },
    { name: 'Jungle Log', item: 'jungle_log', criteria: 'minecraft.mined:minecraft.jungle_log', xp: 4, point: 5 },
    { name: 'Dark Oak Log', item: 'dark_oak_log', criteria: 'minecraft.mined:minecraft.dark_oak_log', xp: 4, point: 5 }
  ],
  customItems: [{ name: 'Lumberjack Blade', item: 'iron_axe' }],
  titles: [{ name: 'Nature Guardian' }, { name: 'Forest Spirit' }]
}

export const SkillList: Skill[] = [Mining, Foraging];