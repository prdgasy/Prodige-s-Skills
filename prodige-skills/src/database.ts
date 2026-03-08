type Event = {
  name: string,
  criteria: string,
  gain: number
}
type Skill = {
  name: string,
  startingXp: number
  onEvents: Event[]
}

const Mining: Skill = {
  name: 'Mining',
  startingXp: 15,
  onEvents: [
    { name: 'diamond_ore', criteria: 'mined:diamond_ore', gain: 7 },
    { name: 'stone', criteria: 'mined:stone', gain: 1 }
  ]
}

const Foraging: Skill = {
  name: 'Foraging',
  startingXp: 10,
  onEvents: [
    { name: 'oak_wood', criteria: 'mined:oak_wood', gain: 5 },
    { name: 'birch_wood', criteria: 'mined:birch_wood', gain: 5 }
  ]
}

const Skills = {
  Mining, Foraging
}

export { Skills }