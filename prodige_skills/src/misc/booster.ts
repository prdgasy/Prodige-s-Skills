import { Objective, Score } from "sandstone";

export class Booster {
	xp: Score;
	point: Score;

	constructor() {
		this.xp = Objective.create('booster.Xp')('@p');
		this.point = Objective.create('booster.point')('@p');
	}
}