import { Variable } from "sandstone";
import { textWrapper } from "../../lib/textWrapper"
import { Achievement } from "./achievement";
import { OnEvent } from "./onEvent";
import { SkillClass, Skill } from "./skill";


const Mining = Skill({
  name: 'Mining',
  description: textWrapper({ text: 'Mine, mine, mien, very long too. Lets see how it goes' }),
  itemId: 'diamond_pickaxe',
  startingXp: 15,
});

Mining.onEvents.push(
  OnEvent({ parent: Mining, name: 'Stone', itemId: 'stone', criteria: 'minecraft.mined:minecraft.stone', xp: 1, pts: 5 }),
  OnEvent({ parent: Mining, name: 'Coal Ore', itemId: 'coal_ore', criteria: 'minecraft.mined:minecraft.coal_ore', xp: 3, pts: 5 }),
  OnEvent({ parent: Mining, itemId: 'iron_ore' })
);

Mining.achievements.push(
  Achievement({
    parent: Mining,
    itemId: 'charcoal',
    id: 'mine_coal_ach',
    name: 'Mine 1000 stone',
    target: 1000,
  }),
  Achievement({
    parent: Mining,
    itemId: 'stone',
    id: 'mine_stone_ach',
    name: 'Mine 1000 stone',
    target: 1000,
  }),
  Achievement({
    parent: Mining,
    itemId: 'diamond_ore',
    id: 'mine_diamond_ach',
    name: 'Mine 1000 stone',
    target: 1000,
  })
);
export const SkillList: SkillClass[] = [Mining];