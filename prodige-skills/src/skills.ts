import { Skill } from "./types"

const Mining: Skill = {
  name: 'Mining',
  item: 'diamond_pickaxe',
  startingXp: 15,
  Events: [
    { name: 'Stone', item: 'stone', criteria: 'minecraft.mined:minecraft.stone', xp: 1, point: 5 },
    { name: 'Coal Ore', item: 'coal_ore', criteria: 'minecraft.mined:minecraft.coal_ore', xp: 3, point: 5 },
    { name: 'Iron Ore', item: 'iron_ore', criteria: 'minecraft.mined:minecraft.iron_ore', xp: 5, point: 5 }
  ],
  customItems: [{ name: 'Drill Prototype', item: 'golden_pickaxe' }],
  titles: [{ name: 'Deep Delver' }, { name: 'Mountain King' }],
  Prestige: {
    name: 'Miner', powerPerLvl: 3, func: null
  }

}

const Foraging: Skill = {
  name: 'Foraging',
  item: 'diamond_axe',
  startingXp: 15,
  Events: [
    { name: 'Oak Log', item: 'oak_log', criteria: 'minecraft.mined:minecraft.oak_log', xp: 2, point: 5 }
  ],
  customItems: [{ name: 'Lumberjack Blade', item: 'iron_axe' }],
  titles: [{ name: 'Nature Guardian' }, { name: 'Forest Spirit' }],
  Prestige: {
    name: 'Berseker', powerPerLvl: 6, func: null
  }
}

export const SkillList: Skill[] = [Mining, Foraging];