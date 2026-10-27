import { Roman } from "@lib/roman";
import { BetterArray } from "@prodigelib/betterarray";
import { ToolName } from "@src/data/definitions";
import { Global } from "@src/global";
import { Player } from "@src/player";
import { Skill } from "@src/skill";
import { Ability } from "@src/skill/ability";
import { Macro as $, _, comment, DataPointClass, DataVariable, Score, Variable } from "sandstone";
import { MacroLiteral } from "sandstone/core";

export type AllRewards = ToolName | 'Common Crate Key'

export class Reward {
	name: string;
	give: () => void;
	public static common: Reward[];
	public static rare: Reward[];
	public static registry = new Map<string, Reward>();

	constructor(name: string, give: () => void) {
		this.name = name;
		this.give = give;

		Reward.registry.set(this.name, this);
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

	public static ability(ability: Ability, tier: number): Reward {
		return new Reward(
			`§7Unlock access to §c${ability.name} §8[§c${Roman.get(tier)}§8] • ${tier * 2.5}%»§c${(tier + 1) * 2.5}%`
			, () => { });
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
		const reward = Reward.registry.get(r);

		if (!reward) {
			throw Error(`"${r}" is not registered into "Reward.registry".`);
		}

		return reward;
	}
}

