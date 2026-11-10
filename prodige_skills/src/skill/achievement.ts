import { Text } from "@lib/text";
import { smartTellraw } from "@prodigelib/easymacro";
import { Global } from "@src/global";
import { Reward } from "@src/misc/reward";
import { Player } from "@src/player";
import { Skill } from "@src/skill";
import { Criteria, Item } from "@src/types";
import { _, execute, MCFunction, Objective, Score } from "sandstone";

export class Achievement {
	public parent: Skill;
	public name: string;
	public resourceId: string;
	public description: string;
	public item: Item;
	public goal: number;
	public criteria: Criteria;
	public progress: Score;
	public rewards: Reward[];

	constructor(parent: Skill, name: string, item: Item, goal: number, criteria: Criteria, description: string, rewards?: Reward[]) {
		this.parent = parent;
		this.name = name;
		this.resourceId = Global.toResource(name);
		this.item = item;
		this.goal = goal;
		this.criteria = criteria;
		this.description = description;
		this.progress = Objective.create(`${this.parent.resourceId}.achievement.${this.resourceId}`, criteria)('@p');
		this.rewards = rewards ?? Reward.common;
	}

	public static init() {
		this.actionListener();
	}

	private static actionListener() {
		return MCFunction('achievement/listener', () => {
			execute.as('@a').at('@s').run(() => {
				for (const skill of Object.values(Skill.skills)) {
					skill.achievements.forEach((achievement, index) => {
						_.if(skill.achievementId['=='](index), () => {
							_.if(achievement.progress['>='](achievement.goal), () => {
								this.complete(skill, achievement, index);
							});
						});
					});
				}
			});
		}, { runEvery: '10s' });
	}

	private static complete(skill: Skill, achievement: Achievement, index: number) {
		Reward.vaultAll(achievement.rewards);
		skill.achievementId['++'];

		const next = skill.achievements[index + 1];
		next?.progress.reset();

		_.if(Player.achievementNotif, () => {
			Player.playSound('levelup', 2);
			smartTellraw([
				`${Global.encapsuler}\n\n`,
				` §d§lACHIEVEMENT COMPLETE! §7(${skill.name})\n\n`,
				` §a§l${achievement.name}\n`,
				...Text.wrap(achievement.description + ` §e${achievement.goal}§6/§e${achievement.goal}`, ' §7'),
				'\n\n',
				' §6§lREWARDS\n',
				...achievement.rewards.map(reward => ` §8• §a${reward.name}\n`),
				' §7All rewards are waiting in your Reward Vault.\n',
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
			], '@s');
		});
	}
}