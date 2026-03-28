import { Skill } from "./types"

const Mining: Skill = {
  name: 'Mining',
  item: 'diamond_pickaxe',
  startingXp: 15,
  onEvents: [
    { name: 'Stone', item: 'stone', criteria: 'minecraft.mined:minecraft.stone', gain: 1 },
    { name: 'Coal Ore', item: 'coal_ore', criteria: 'minecraft.mined:minecraft.coal_ore', gain: 3 },
    { name: 'Iron Ore', item: 'iron_ore', criteria: 'minecraft.mined:minecraft.iron_ore', gain: 5 },
    { name: 'Gold Ore', item: 'gold_ore', criteria: 'minecraft.mined:minecraft.gold_ore', gain: 8 },
    { name: 'Diamond Ore', item: 'diamond_ore', criteria: 'minecraft.mined:minecraft.diamond_ore', gain: 15 }
  ],
  customItems: [{ name: 'Drill Prototype', item: 'golden_pickaxe' }],
  titles: [{ name: 'Deep Delver' }, { name: 'Mountain King' }]
}

const Foraging: Skill = {
  name: 'Foraging',
  item: 'diamond_axe',
  startingXp: 15,
  onEvents: [
    { name: 'Oak Log', item: 'oak_log', criteria: 'minecraft.mined:minecraft.oak_log', gain: 2 },
    { name: 'Birch Log', item: 'birch_log', criteria: 'minecraft.mined:minecraft.birch_log', gain: 2 },
    { name: 'Spruce Log', item: 'spruce_log', criteria: 'minecraft.mined:minecraft.spruce_log', gain: 3 },
    { name: 'Jungle Log', item: 'jungle_log', criteria: 'minecraft.mined:minecraft.jungle_log', gain: 4 },
    { name: 'Dark Oak Log', item: 'dark_oak_log', criteria: 'minecraft.mined:minecraft.dark_oak_log', gain: 4 }
  ],
  customItems: [{ name: 'Lumberjack Blade', item: 'iron_axe' }],
  titles: [{ name: 'Nature Guardian' }, { name: 'Forest Spirit' }]
}

const Combat: Skill = {
  name: 'Combat',
  item: 'diamond_sword',
  startingXp: 20,
  onEvents: [
    { name: 'Zombie Kill', item: 'zombie_head', criteria: 'minecraft.killed:minecraft.zombie', gain: 10 },
    { name: 'Skeleton Kill', item: 'skeleton_skull', criteria: 'minecraft.killed:minecraft.skeleton', gain: 12 },
    { name: 'Spider Kill', item: 'spider_eye', criteria: 'minecraft.killed:minecraft.spider', gain: 10 },
    { name: 'Creeper Kill', item: 'creeper_head', criteria: 'minecraft.killed:minecraft.creeper', gain: 15 },
    { name: 'Enderman Kill', item: 'ender_pearl', criteria: 'minecraft.killed:minecraft.enderman', gain: 25 }
  ],
  customItems: [{ name: 'Slayer Blade', item: 'netherite_sword' }],
  titles: [{ name: 'Warrior' }, { name: 'Vanquisher' }]
}

const Farming: Skill = {
  name: 'Farming',
  item: 'diamond_hoe',
  startingXp: 10,
  onEvents: [
    { name: 'Wheat Harvest', item: 'wheat', criteria: 'dummy', gain: 2 },
    { name: 'Carrot Harvest', item: 'carrot', criteria: 'dummy', gain: 2 },
    { name: 'Potato Harvest', item: 'potato', criteria: 'dummy', gain: 2 },
    { name: 'Melon Slice', item: 'melon_slice', criteria: 'minecraft.mined:minecraft.melon', gain: 4 },
    { name: 'Nether Wart', item: 'nether_wart', criteria: 'dummy', gain: 6 }
  ],
  customItems: [{ name: 'Harvester Hoe', item: 'golden_hoe' }],
  titles: [{ name: 'Farmer' }, { name: 'Cultivator' }]
}

const Fishing: Skill = {
  name: 'Fishing',
  item: 'fishing_rod',
  startingXp: 25,
  onEvents: [
    { name: 'Catch Fish', item: 'cod', criteria: 'minecraft.custom:minecraft.fish_caught', gain: 20 },
    { name: 'Catch Salmon', item: 'salmon', criteria: 'dummy', gain: 25 },
    { name: 'Catch Treasure', item: 'nautilus_shell', criteria: 'dummy', gain: 100 },
    { name: 'Catch Junk', item: 'leather_boots', criteria: 'dummy', gain: 5 },
    { name: 'Pufferfish', item: 'pufferfish', criteria: 'dummy', gain: 40 }
  ],
  customItems: [{ name: 'Master Rod', item: 'fishing_rod' }],
  titles: [{ name: 'Angler' }, { name: 'Ocean Master' }]
}

const Alchemy: Skill = {
  name: 'Alchemy',
  item: 'brewing_stand',
  startingXp: 50,
  onEvents: [
    { name: 'Brew Weak Potion', item: 'glass_bottle', criteria: 'dummy', gain: 15 },
    { name: 'Brew Strength', item: 'blaze_powder', criteria: 'dummy', gain: 40 },
    { name: 'Brew Speed', item: 'sugar', criteria: 'dummy', gain: 40 },
    { name: 'Brew Healing', item: 'glistering_melon_slice', criteria: 'dummy', gain: 50 },
    { name: 'Master Brew', item: 'dragon_breath', criteria: 'dummy', gain: 150 }
  ],
  customItems: [{ name: 'Alchemist Flask', item: 'potion' }],
  titles: [{ name: 'Apprentice' }, { name: 'Grand Alchemist' }]
}

const Agility: Skill = {
  name: 'Agility',
  item: 'leather_boots',
  startingXp: 30,
  onEvents: [
    { name: 'Sprinting', item: 'feather', criteria: 'minecraft.custom:minecraft.sprint_one_cm', gain: 1 },
    { name: 'Jumping', item: 'rabbit_foot', criteria: 'minecraft.custom:minecraft.jump', gain: 5 },
    { name: 'Ender Pearl Teleport', item: 'ender_pearl', criteria: 'dummy', gain: 15 },
    { name: 'Elytra Flight', item: 'elytra', criteria: 'minecraft.custom:minecraft.aviate_one_cm', gain: 2 },
    { name: 'Parkour Checkpoint', item: 'heavy_weighted_pressure_plate', criteria: 'dummy', gain: 100 }
  ],
  customItems: [{ name: 'Hermes Boots', item: 'chainmail_boots' }],
  titles: [{ name: 'Runner' }, { name: 'Wind Walker' }]
}

const SkillList: Skill[] = [Mining, Foraging, Combat, Farming, Fishing, Alchemy, Agility]

export { SkillList }