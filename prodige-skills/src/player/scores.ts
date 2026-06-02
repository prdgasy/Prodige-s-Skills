import { Objective, Score } from "sandstone";
import { SkillList } from "../skills";


/** Stores player level scores per skill */
export const SkillScore: Record<string, { level: Score, xp: Score, xpTarget: Score }> = {};
export const Event: Record<string, Record<string, Score>> = {};
export const PrestigeScore: Record<string, Score> = {};
export const Point = Objective.create('point')('@p');
export const BoosterScore: Record<string, Score> = {
  xp: Objective.create('booster.xp')('@p'),
  point: Objective.create('booster.point')('@p')
};

SkillList.forEach(skill => {
  SkillScore[skill.name] = {
    level: Objective.create(`${skill.name}.level`)('@p'),
    xp: Objective.create(`${skill.name}.xp`)('@p'),
    xpTarget: Objective.create(`${skill.name}.xpTarget`)('@p'),
  }

  Event[skill.name] = {};
  skill.Events.forEach(event => {
    Event[skill.name][event.name] = Objective.create(`${skill.name}.event.${event.name.replace(' ', '')}`, event.criteria)('@p');
  });



  PrestigeScore[skill.name] = Objective.create(`${skill.name}.prestige`)('@p');
});

