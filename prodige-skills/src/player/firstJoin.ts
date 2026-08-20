import { execute, Label, MCFunction, Selector } from "sandstone";
import { Options } from "./consts";
import { BoosterScore, SkillScore } from "./scores";
import { SkillList } from "../skills";

MCFunction('player/first_join', () => {
  const firstJoin = Label('firstJoin');
  execute.as('@a').run(() => {
    execute.as(Selector('@s', { tag: [`!${firstJoin.fullName}`] })).run(() => {
      for (const label of Object.values(Options)) {
        label('@s').add();
      }

      SkillList.forEach(skill => {
        SkillScore[skill.name].xpTarget.set(skill.startingXp);
        SkillScore[skill.name].level.set(0);
      })

      BoosterScore.point.set(1);
      BoosterScore.xp.set(1);
    })
    firstJoin('@s').add();
  })

}, { runOnLoad: true })

