import { Variable } from "sandstone";
import { textWrapper } from "../../lib/textWrapper"
import { Achievement } from "../skill/achievementClass";
import { OnEvent } from "../skill/onEventClass";
import { SkillClass, Skill } from "../skill/skillClass";


const Mining = Skill({
  name: 'Mining',
  description: textWrapper({ text: 'Mine, mine, mien, very long too. Let s see how it goes' }),
  id: 'diamond_pickaxe',
  startingXp: 15,
});

Mining.onEvents.push(
  OnEvent({ parent: Mining, name: 'Stone', id: 'stone', criteria: 'minecraft.mined:minecraft.stone', xp: 1, point: 5 }),
  OnEvent({ parent: Mining, name: 'Coal Ore', id: 'coal_ore', criteria: 'minecraft.mined:minecraft.coal_ore', xp: 3, point: 5 }),
  OnEvent({ parent: Mining, id: 'iron_ore' })
);

Mining.achievements.push(
  Achievement({
    id: 'stone',
    name: 'Mine 1000 stone',
    target: 1000,
    current: Variable()
  }),
  Achievement({
    id: 'stone',
    name: 'Mine 1000 stone',
    target: 1000,
    current: Variable()
  }),
  Achievement({
    id: 'stone',
    name: 'Mine 1000 stone',
    target: 1000,
    current: Variable()
  })
);
export const SkillList: SkillClass[] = [Mining];