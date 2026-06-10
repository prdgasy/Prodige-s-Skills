import { Score, tellraw, Variable } from "sandstone";
import { Player, Options } from "./consts";
import { SkillScore } from "./scores";
import { Displays } from "./displays";


export function levelUp(skillName: string, level: Score, xp: Score, xpTarget: Score) {
  const previousLevel = Variable(level);
  const currentLevel = level["+="](1);
  const nextLevel = currentLevel["+"](1);

  SkillScore[skillName].xp.set(0);
  Displays.lvl(skillName, currentLevel, previousLevel, nextLevel, xp, xpTarget);
}