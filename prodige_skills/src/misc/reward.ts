import { Roman } from "@lib/roman";
import type { ToolName } from "@src/data/definitions";
import { Global } from "@src/global";
import { Player } from "@src/player";
import type { Skill } from "@src/skill";
import type { Ability } from "@src/skill/ability";
import type { Item } from "@src/types";
import { Macro as $, _, comment, DataPointClass, Objective, Score, Variable } from "sandstone";
import { MacroLiteral } from "sandstone/core";

export type AllRewards = ToolName | 'Common Crate Key'

export class Reward {
	public static registry = new Map<string, Reward>();
	public name: string;
	public resourceId: string;
	public give: () => void;
	public icon: Item;
	public takesPlace: boolean;
	public pending: Score;
	public static common: Reward[];
	public static rare: Reward[];

	constructor(
		name: string,
		give: () => void,
		opt: { icon?: Item; takesPlace?: boolean } = {}
	) {
		this.name = name;
		this.resourceId = Global.toResource(this.name);
		this.give = give;
		this.icon = opt.icon ?? 'chest';
		this.takesPlace = opt.takesPlace ?? false;

		const objectiveName = 'reward.pending.' + this.resourceId;
		this.pending = Objective.create(objectiveName)('@p');

		Reward.registry.set(this.resourceId, this);
	}

	/** Assemble multiple rewards into a string[] */
	public static join(rewards: Reward[]): string[] {
		return rewards.map(r => ` §8• ${r.name}`);
	}

	/** Give every rewards inside rewards */
	public static giveAll(rewards: Reward[]) {
		comment(`Reward.giveAll::${rewards.map(r => r.name).join(', ')}`);
		rewards.forEach(r => r.give());
	}

	public static enqueue(reward: Reward) {
		if (reward.takesPlace)
			return reward.pending.add(1);

		reward.give();
	}

	public static enqueueAll(rewards: Reward[]) {
		rewards.forEach(reward => Reward.enqueue(reward));
	}

	public static vaultAll(rewards: Reward[]) {
		rewards.forEach(reward => reward.pending.add(1));
	}

	public claim() {
		_.if(this.pending['>'](0), () => {
			const claim = () => {
				this.pending['--'];
				this.give();
				Player.playSound('success', 2);
			};

			if (this.takesPlace) Reward.canGiveReward(claim);
			else claim();
		});
	}

	public static canGiveReward(callback: () => void) {
		return _.if(Player.isInvFull(), () => {
			Player.throw("You don't have enough space in your inventory!");
		}).else(() => callback());
	}

	public static ability(ability: Ability, tier: number): Reward {
		return new Reward(
			`§dUpgrade avaible: §c§l${ability.name} §8[§c§l${Roman.get(tier)}§8] • ${(tier - 1) * 2.5}%»§c${tier * 2.5}%`
			, () => { }, { icon: 'experience_bottle', takesPlace: false });
	}

	public static point(p: number): Reward {
		return new Reward(`§e${p} Pts`, () => Player.pts.add(p));
	}

	public static xp(x: number, skill: Skill): Reward {
		return new Reward(`§3${x} ${skill.name} Xp`, () => skill.xp.add(x));
	}

	public static level(skill: Skill, level: number): Reward[] {
		return skill.rewards.get(level) ?? Reward.common;
	}

	/** Runs `f` once per reward case: one branch per custom level, plus the default one. */
	public static cases(skill: Skill, lvl: Score, f: (rewards: Reward[]) => void) {
		const found = Variable(0);
		skill.rewards.forEach((rewards, level) => {
			_.if(lvl["=="](level), () => {
				f(rewards);
				found.set(1);
			});
		});

		_.if(_.not(found), () => f(Reward.common));
	}

	public static giveFn(name: AllRewards): string;
	public static giveFn(name: DataPointClass): MacroLiteral;
	public static giveFn(name: AllRewards | DataPointClass) {
		if (typeof name === 'string') return `misc/give/${Global.toResource(name)}`;

		return $`misc/give/${name}`;
	}

	public static get(r: AllRewards): Reward {
		const reward = Reward.registry.get(Global.toResource(r));

		if (!reward) {
			throw Error(`"${r}" is not registered into "Reward.registry".`);
		}

		return reward;
	}
}