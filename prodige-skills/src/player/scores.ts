import { Objective, Score } from "sandstone";
import { SkillList } from "../consts/skills";

/** Stores player level scores per skill */
export const SkillScore: Record<string, { level: Score, rewardLevel: Score, xp: Score, xpTarget: Score }> = {};
export const EventScores: Record<string, Record<string, Score>> = {};
export const PrestigeScore: Record<string, Score> = {};
export const Point = Objective.create('point')('@p');
export const BoosterScore: Record<string, Score> = {
  xp: Objective.create('booster.xp')('@p'),
  point: Objective.create('booster.point')('@p')
};

SkillList.forEach(skill => {
  SkillScore[skill.name] = {
    level: Objective.create(`${skill.name}.level`)('@p'),
    rewardLevel: Objective.create(`${skill.name}.rewardLevel`)('@p'),
    xp: Objective.create(`${skill.name}.xp`)('@p'),
    xpTarget: Objective.create(`${skill.name}.xpTarget`)('@p'),
  }

  EventScores[skill.name] = {};
  skill.SkillEvents.forEach(event => {
    EventScores[skill.name][event.name] = Objective.create(`${skill.name}.event.${event.name.replace(' ', '')}`, event.criteria)('@p');
  });

  PrestigeScore[skill.name] = Objective.create(`${skill.name}.prestige`)('@p');
});

