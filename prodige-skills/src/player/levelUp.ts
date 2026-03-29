import { Score, tellraw, Variable } from "sandstone";
import { Player, playerOption } from "./const";
import { SkillScore } from "./scores";


export function levelUp(skillName: string, level: Score, xp: Score, xpTarget: Score) {
  const previousLevel = Variable(level);
  const currentLevel = level["+="](1);
  const nextLevel = currentLevel["+"](1);

  SkillScore[skillName].xp.set(0);
  tellraw(Player(playerOption.levelNotif), [`${skillName} Level up ! `, previousLevel, ' => ', currentLevel, ' Next level: ', nextLevel]);
}