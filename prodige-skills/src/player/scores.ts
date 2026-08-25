import { Objective, Score } from "sandstone";
import { SkillList } from "../consts/skills";

export const Point = Objective.create('point')('@p');
export const BoosterScore: Record<string, Score> = {
  xp: Objective.create('booster.xp')('@p'),
  point: Objective.create('booster.point')('@p')
};