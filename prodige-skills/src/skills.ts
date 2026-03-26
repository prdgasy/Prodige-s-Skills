import { Skill } from "./types"

const Mining: Skill = {
  name: 'Mining',
  item: 'stone_pickaxe',
  startingXp: 15,
  onEvents: [
    { name: 'diamond_ore', item: 'diamond', criteria: 'mined:diamond_ore', gain: 7 },
    { name: 'stone', item: 'stone', criteria: 'mined:stone', gain: 1 }
  ],
  customItems: [{ name: 'specialMiningItem', item: 'golden_axe' }],
  titles: [{name: 'MINER III'}]
}

const Foraging: Skill = {
  name: 'Foraging',
  startingXp: 10,
  item: 'golden_axe',
  onEvents: [
    { name: 'oak_wood', item: 'oak_wood', criteria: 'mined:oak_wood', gain: 5 },
    { name: 'birch_wood', item: 'birch_wood', criteria: 'mined:birch_wood', gain: 5 }
  ],
  customItems: [{ name: 'specialMiningItem', item: 'diamond_pickaxe' }],
  titles: [{name: 'ForestGumber III'}]
}

const SkillList: Skill[] = [Mining, Foraging]

export { SkillList }