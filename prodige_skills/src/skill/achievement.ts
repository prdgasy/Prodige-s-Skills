import { Reward } from "@src/misc/reward";
import { Skill } from "@src/skill";
import { Item } from "@src/types";
import { Objective, Score } from "sandstone";

export class Achievement {
	parent: Skill;
	name: string;
	id: string;
	description: string;
	item: Item;
	target: number;
	progress: Score;
	reward: Reward[];

	constructor(parent: Skill, name: string, item: Item, target: number, description: string, reward?: Reward[]) {
		this.parent = parent;
		this.name = name;
		this.id = name.toLowerCase().replace(/\s+/g, "_");
		this.item = item;
		this.target = target;
		this.description = description;
		this.progress = Objective.create(`${this.parent.name}.achievement.${this.id}`)('@p');
		this.reward = reward ?? Reward.common;
	}
}