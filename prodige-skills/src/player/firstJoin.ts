import { execute, Label, MCFunction, Selector } from "sandstone";
import { Options } from "../consts/player";
import { BoosterScore } from "./scores";
import { SkillList } from "../consts/skills";

MCFunction('player/first_join', () => {
  const firstJoin = Label('firstJoin');
  execute.as('@a').as(Selector('@s', { tag: [`!${firstJoin.fullName}`] })).run(() => {
    for (const label of Object.values(Options)) {
      label('@s').add();
    }

    for (const skill of SkillList) {
      skill.level.set(0);
      skill.xp.set(0);
      skill.xpTarget.set(skill.startingXp);
      skill.ability.tier.set(0);
      skill.currentAchievement.set(0);
      for (const achievement of skill.achievements) {
        achievement.progress.set(0);
      }
    }

    BoosterScore.point.set(1);
    BoosterScore.xp.set(1);

    firstJoin('@s').add();
  })

}, { runOnLoad: true })

