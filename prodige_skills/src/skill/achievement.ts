import { Reward } from "@src/misc/reward";
import { Skill } from "@src/skill";
import { Item } from "@src/types";
import { Objective, Score } from "sandstone";

export class Achievement {
	public parent: Skill;
	public name: string;
	public id: string;
	public description: string;
	public item: Item;
	public goal: number;
	public progress: Score;
	public customReward: Reward[];

	constructor(parent: Skill, name: string, item: Item, goal: number, description: string, reward?: Reward[]) {
		this.parent = parent;
		this.name = name;
		this.id = name.toLowerCase().replace(/\s+/g, "_");
		this.item = item;
		this.goal = goal;
		this.description = description;
		this.progress = Objective.create(`${this.parent.name}.achievement.${this.id}`)('@p');
		this.customReward = reward ?? Reward.common;
	}

	public get reward(): Reward[] {
		return this.customReward ?? Reward.common;
	}
}