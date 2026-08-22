import { _, Score, tellraw, Variable } from "sandstone";
import { Player, Options } from "../consts/consts";
import { SkillScore } from "./scores";
import { Displays } from "./displays";


export function levelUp(skillName: string, level: Score, xp: Score, xpTarget: Score) {
  const previousLevel = Variable(level);
  const currentLevel = level["+="](1);
  const nextLevel = currentLevel["+"](1);
  const progress = Variable((xp["/"](xpTarget))["*"](100));
  SkillScore[skillName].xp["-="](xpTarget);

  // xpTarget *= 1.3
  xpTarget["*="](13);
  xpTarget["/="](10);

  // set max
  _.if(xpTarget[">"](5000), () => {
    xpTarget.set(5000);
  })

  _.if(currentLevel["=="](100), () => {
    Displays.maxLvl(skillName);
  }).else(() => {
    Displays.lvl(skillName, currentLevel, previousLevel, nextLevel, xp, xpTarget, progress);
  })


}