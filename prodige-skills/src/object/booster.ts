import { Objective, Score } from "sandstone";

export class BoosterClass {
  xp: Score;
  point: Score;

  constructor() {
    this.xp = Objective.create('booster.xp')('@p');
    this.point = Objective.create('booster.point')('@p');
  }
}