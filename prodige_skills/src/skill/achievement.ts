import { Text } from "@lib/text";
import { smartTellraw } from "@prodigelib/easymacro";
import { Global } from "@src/global";
import { Reward } from "@src/misc/reward";
import { Player } from "@src/player";
import { Skill } from "@src/skill";
import { Item } from "@src/types";
import { Label, NonEmptyString, Objective, Score } from "sandstone";
import { EntityLabel } from "sandstone/variables";

export class Achievement {
	public parent: Skill;
	public name: string;
	public id: string;
	public description: string;
	public item: Item;
	public goal: number;
	public progress: Score;
	public rewards: Reward[];
	public claimed: EntityLabel;

	constructor(parent: Skill, name: string, item: Item, goal: number, description: string, rewards?: Reward[]) {
		this.parent = parent;
		this.name = name;
		this.id = name.toLowerCase().replace(/\s+/g, "_");
		this.item = item;
		this.goal = goal;
		this.description = description;
		this.progress = Objective.create(`${this.parent.name}.achievement.${this.id}`)('@p');
		this.rewards = rewards ?? Reward.common;

		this.claimed = Label(`achievement.${this.name}.claimed` as NonEmptyString)('@p');
	}


	public claim() {
		return Reward.canGiveReward(() => {
			Player.playSound('levelup', 2);
			Reward.giveAll(this.rewards);
			this.claimed.add();
			const next = this.parent.achievements[this.parent.achievements.indexOf(this) + 1];

			smartTellraw([
				`${Global.encapsuler}\n\n`,
				' §d§lACHIEVEMENT COMPLETE!\n\n',
				` §7You reached a new milestone in §b§l${this.parent.name}§7!\n\n`,
				` §f§l${this.name}\n`,
				...Text.wrap(this.description),
				'\n\n',
				` §7Goal reached: §e${this.goal}\n\n`,
				' §6§lREWARDS\n',
				...this.rewards.map(reward => ` §8• §a${reward.name}\n`),
				...(next ? [
					'\n §b§lUP NEXT\n',
					` §f§l${next.name}\n`,
					...Text.wrap(next.description),
					`\n §7Next goal: §e${next.goal}\n\n`,
					' §eKeep going — your next milestone awaits!\n\n',
				] : [
					'\n §6§lALL MILESTONES COMPLETE!\n',
					' §eYou have mastered every achievement for this skill!\n\n',
				]),
				`${Global.encapsuler}`,
			], '@p');
		})
	}
}