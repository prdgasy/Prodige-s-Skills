import { ItemType } from "./types.ts"

type Event = {
  name: string,
  item: ItemType,
  criteria: string,
  gain: number
}

type Skill = {
  name: string,
  item: ItemType,
  startingXp: number,
  onEvents: Event[]
}

const Mining: Skill = {
  name: 'Mining',
  item: 'stone_pickaxe',
  startingXp: 15,
  onEvents: [
    { name: 'diamond_ore', item: 'diamond', criteria: 'mined:diamond_ore', gain: 7 },
    { name: 'stone', item: 'stone', criteria: 'mined:stone', gain: 1 }
  ]
}

const Foraging: Skill = {
  name: 'Foraging',
  startingXp: 10,
  item: 'golden_axe',
  onEvents: [
    { name: 'oak_wood', item: 'oak_wood', criteria: 'mined:oak_wood', gain: 5 },
    { name: 'birch_wood', item: 'birch_wood', criteria: 'mined:birch_wood', gain: 5 }
  ]
}

const SkillList: Skill[] = [Mining, Foraging]

export { SkillList, Skill }