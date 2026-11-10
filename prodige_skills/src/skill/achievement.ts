import { Text } from "@lib/text";
import { smartTellraw, macro as E } from "@prodigelib/easymacro";
import { Global } from "@src/global";
import { Reward } from "@src/misc/reward";
import { Player } from "@src/player";
import { Skill } from "@src/skill";
import { Criteria, Item } from "@src/types";
import { _, execute, Label, MCFunction, NonEmptyString, Objective, Score, Macro as S, say, Variable, DataPointClass } from "sandstone";
import { EntityLabel } from "sandstone/variables";
import { BetterArray } from "@prodigelib/betterarray";

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
	public claimed: EntityLabel;

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

		this.claimed = Label(`achievement.${this.resourceId}.claimed` as NonEmptyString)('@p');
	}

	public static init() {
		MCFunction('achievement/init', () => {
			for (const skill of Object.values(Skill.skills)) {
				skill.achievementArray = new BetterArray(skill.achievements.map(a => ({
					score: a.progress.objective.name,
					goal: a.goal,
					name: a.name,
				})));
			}
		}, { runOnLoad: true });

		this.actionListener();
	}

	private static actionListener() {
		return MCFunction('achievement/listener', () => {
			execute.as('@a').run(() => {
				for (const skill of Object.values(Skill.skills)) {
					const ach = skill.achievementArray.get(skill.achievementId);

					const goal = Variable();
					const progress = Variable();

					execute.store.result(goal).run.data.get(ach.select('goal'));
					const scoreName = ach.select('score');
					_.with([scoreName], () => {
						S.execute.store.result(progress).run.scoreboard.players.get('@s', S`${scoreName}`);
					})

					_.if(progress['>='](goal), () => {
						this.complete(skill, ach.select('name'), goal);
					})
				}
			});
		}, { runEvery: '10s' });
	}

	private static complete(skill: Skill, name: DataPointClass, goal: Score) {
		_.if(Player.achievementNotif, () => {
			Player.smartSend(E`Achievement complete! §e${name} ${goal}§6/§e${goal} §8• §d${skill.name}`, '§a');
			Player.playSound('success', 2);
		})

		skill.achievementId['++'];
		const next = skill.achievementArray.get(skill.achievementId);
		const scoreName = next.select('score');
		_.with([scoreName], () => {
			S.scoreboard.players.reset('@s', S`${scoreName}`);
		});
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