import { Bar } from "@lib/bar";
import { macro as $, smartTellraw } from "@prodigelib/easymacro";
import { SkillName } from "@src/data/definitions";
import { Reward } from "@src/misc/reward";
import { Tool } from "@src/misc/tool";
import { Player } from "@src/player";
import { Achievement } from "@src/skill/achievement";
import { OnEvent } from '@src/skill/onEvent';
import { Title } from "@src/skill/title";
import { Item } from "@src/types";
import { _, Label, MCFunction, Objective, playsound, Score, tellraw, title } from "sandstone";
import { Ability } from "./ability";

export type SkillOptions = {
	name: string,
	description?: string,
	item?: Item,
	starting?: number,
	achievements?: Achievement[],
	titles?: Title[],
	rewards?: Map<number, Reward[]>,
	ability?: Ability,
	customItems?: Tool[],
	onEvents?: OnEvent[],
}

export class Skill {
	static skills: Record<SkillName, Skill>;
	static levelUpNotifState = Label('level_up_notif')('@p');

	public name: string;
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
	public onEvents: OnEvent[];
	public ability?: Ability;


	constructor(options: SkillOptions) {
		this.name = options.name;
		this.description = options.description ?? "§7No description for this skill yet.";
		this.item = options.item ?? "anvil";
		this.level = Objective.create(`${this.name}.level`)('@p');
		this.xp = Objective.create(`${this.name}.xp`)('@p');
		this.goal = Objective.create(`${this.name}.goal`)('@p');
		this.starting = options.starting ?? 40;
		this.achievements = options.achievements ?? [];
		this.achievement = Objective.create(`${this.name}.achievement`)(`@p`);
		this.titles = options.titles ?? [];
		this.rewards = options.rewards ?? new Map<number, Reward[]>();
		this.ability = options.ability ?? new Ability(this.name, 'notimple', '§7No ability for this skill yet.');
		this.customItems = options.customItems ?? [];
		this.onEvents = options.onEvents ?? [];
	}

	public onEventTriggered(addedXp: Score, addedPoint: Score) {
		const fn = MCFunction('skill/on_event_triggered', () => {
			const canLevelUp = _.and(this.xp['>='](this.goal), this.level['<'](100));
			_.if(_.not(canLevelUp), () => {
				this.xp['+='](addedXp);
				this.levelUp()
			});

			Player.pts['+='](addedPoint);
			this.onEventDisplay(addedXp, addedPoint);
		}, { onConflict: 'ignore' })

		fn();
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

	private onEventDisplay(XpAdded: Score, pointAdded: Score) {
		return _.if(Player.onEventNotif, () => title('@p').actionbar([
			{ text: this.name }, this.level, '+', XpAdded, 'Xp + ', pointAdded, 'Point'
		]));
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

				const encapsuler = '§7§m------------------------------------------';
				const percentage = this.xp['*'](100)['/'](this.goal);
				const bar = new Bar(percentage);

				smartTellraw([
					encapsuler + '\n',
					$` §e§l${this.name.toUpperCase()} LEVEL UP! §8${this.level['-'](1)} ➜ §e§l${this.level}\n\n`,
					$` §f§lNext Level Goal:\n`,
					$`  §8• §7Target: §d${this.name} ${this.level['+'](1)}\n`,
					$`  §8• §7Progress: §e${percentage}%\n`,
					$`  §8> ${bar.toData()} §e${this.xp}§6/§e${this.goal} XP\n\n`,
					` §f§lRewards:\n`,
					...rewards.map(r => ` ${r}\n`)
				], '@p');

				abilityMsg ? abilityMsg() : null;

				tellraw('@p', [encapsuler]);
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