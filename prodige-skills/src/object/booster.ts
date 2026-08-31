import { Objective, Score } from "sandstone";

export class BoosterClass {
  Xp: Score;
  point: Score;

  constructor() {
    this.Xp = Objective.create('booster.Xp')('@p');
    this.point = Objective.create('booster.point')('@p');
  }
}