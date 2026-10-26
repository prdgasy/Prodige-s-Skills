import { Bar } from "@lib/bar";
import { macro as $, smartTellraw } from "@prodigelib/easymacro";
import { SkillName } from "@src/data/definitions";
import { Reward } from "@src/misc/reward";
import { Tool } from "@src/misc/tool";
import { Player } from "@src/player";
import { Achievement } from "@src/skill/achievement";
import { Action } from '@src/skill/action';
import { Title } from "@src/skill/title";
import { Item } from "@src/types";
import { _, bossbar, Label, MCFunction, Objective, playsound, say, Score, tellraw, title, Macro as S, Variable } from "sandstone";
import { Ability } from "./ability";
import { Global } from "@src/global";
import { Roman } from "@lib/roman";

export type SkillOptions = {
	name: string,
	description?: string,
	item?: Item,
	starting?: number,
	achievements?: Achievement[],
	titles?: Title[],
	rewards?: Map<number, Reward[]>,
	ability?: { name: string, description: string },
	customItems?: Tool[],
	onEvents?: Action[],
}

export class Skill {
	static skills: Record<SkillName, Skill>;
	static levelUpNotifState = Label('level_up_notif')('@p');

	public name: string;
	public resource: string;
	public description: string;
	public item: Item;
	public level: Score;
	public xp: Score;
	public goal: Score;
	public starting: number;
	public achievements: Achievement[];
	public achievement: Score;
	public titles: Title[];
	public rewards: Map<number, Reward[]>;
	public customItems: Tool[];
	public onEvents: Action[];
	public ability?: Ability;

	public totalXp: Score;
	public totalPts: Score;

	private bossbarCount = Variable(0);

	constructor(opt: SkillOptions) {
		this.name = opt.name;
		this.resource = Global.toResource(this.name);
		this.description = opt.description ?? "§7No description for this skill yet.";
		this.item = opt.item ?? "anvil";
		this.level = Objective.create(`${this.name}.level`)('@p');
		this.xp = Objective.create(`${this.name}.xp`)('@p');
		this.goal = Objective.create(`${this.name}.goal`)('@p');
		this.starting = opt.starting ?? 40;
		this.achievements = opt.achievements ?? [];
		this.achievement = Objective.create(`${this.name}.achievement`)(`@p`);
		this.titles = opt.titles ?? [];
		this.rewards = opt.rewards ?? new Map<number, Reward[]>();
		this.ability = opt.ability ? new Ability(this, opt.ability.name, opt.ability.description) : undefined;
		this.customItems = opt.customItems ?? [];
		this.onEvents = opt.onEvents ?? [];

		this.totalXp = Objective.create(`${this.name}.totalXp`)('@p');
		this.totalPts = Objective.create(`${this.name}.totalPts`)('@p');
	}

	public onEventTriggered(addedXp: Score, addedPoint: Score) {
		const fn = MCFunction(`skill/${Global.toResource(this.name)}/on_event_triggered`, () => {
			this.xp.add(addedXp);
			Player.pts.add(addedPoint);
			this.totalPts.add(addedPoint);
			this.totalXp.add(addedXp);
			this.ability?.roll();

			_.if(_.and(this.xp['>='](this.goal), this.level['<'](100)), () => {
				this.levelUp();
			});

			this.onEventDisplay(addedXp, addedPoint);

		}, { onConflict: 'ignore' });

		return fn();
	}

	private levelUp() {
		this.xp["-="](this.goal);

		this.goal["*="](13)["/="](10);
		_.if(this.goal['>'](5000), () => {
			this.goal.set(5000);
		});

		this.level["++"];

		Reward.cases(this, this.level, (r: Reward[]) => Reward.giveAll(r)); // store it in a storage associated by name; claim later in the menu;

		this.ability?.tierUp();
		const abilityMsg = this.ability?.tierUpNotif();
		this.levelUpNotif(abilityMsg);
	}

	private onEventDisplay(xpAdded: Score, pointAdded: Score) {
		const show = MCFunction(`skill/${this.resource}/show`, () => {
			this.bossbarCount['++'];
			const key = Variable(this.bossbarCount);
			const roman = Roman.get(this.level);
			_.with([key, roman, this.xp, this.goal, xpAdded, pointAdded], () => {
				tellraw('@p', ['started showing: ', this.name, ', key: ', key])
				const id = S`prodige_skills.${this.resource}.${key}`
				S.bossbar.add(id, S`"§d§l${this.name} ${roman} §8• §e${this.xp}§6/§e${this.goal} XP §8| §b+${xpAdded} Xp §8• §e+${pointAdded} Pts"`);
				S.bossbar.set(id).max(this.goal);
				S.bossbar.set(id).value(this.xp);
				S.bossbar.set(id).color('light_purple');
				S.bossbar.set(id).style('progress');
				S.bossbar.set(id).players('@s');
			});

			_.await.sleep("5s");

			// clean
			_.with([key], () => {
				S.bossbar.remove(S`prodige_skills.${this.resource}.${key}`);
			});
			this.bossbarCount['--'];
		}, { asyncContext: true });

		return show();
	}

	private levelUpNotif(abilityMsg?: () => void) {
		Reward.cases(this, this.level, (rewards: Reward[]) => {
			_.if(Skill.levelUpNotifState, () => {
				title('@p').title([{ text: '§d§lSKILL LEVEL UP!', bold: true }]);
				title('@p').subtitle([
					{ text: `§d${this.name} §8` },
					this.level['-'](1),
					{ text: '§8➜§d' },
					this.level
				]);


				_.if(Player.sound, () => playsound('entity.player.levelup', 'master', '@p', '~ ~ ~', 1, 0));

				const percentage = this.xp['*'](100)['/'](this.goal);
				const bar = new Bar(percentage);

				smartTellraw([
					Global.encapsuler + '\n',
					$` §e§l${this.name.toUpperCase()} LEVEL UP! §8${this.level['-'](1)} ➜ §e§l${this.level}\n\n`,
					$` §f§lNext Level Goal:\n`,
					$`  §8• §7Target: §d${this.name} ${this.level['+'](1)}\n`,
					$`  §8• §7Progress: §e${percentage}%\n`,
					$`  §8> ${bar.toData()} §e${this.xp}§6/§e${this.goal} XP\n\n`,
					` §f§lRewards:\n`,
					...rewards.map(r => ` ${r}\n`)
				], '@p');
				abilityMsg ? abilityMsg() : null;
				tellraw('@p', [Global.encapsuler]);
			});
		});
	}

	public firstJoin() {
		this.level.set(0);
		this.xp.set(0);
		this.goal.set(this.starting);

		this.ability?.firstJoin();

		this.achievement.set(0);
		for (const achievement of this.achievements) {
			achievement.progress.set(0);
		}
	}

	public static get(skill: SkillName): Skill {
		return Skill.skills[skill];
	}
}