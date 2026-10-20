import { Global } from "@src/global";
import { Player } from "@src/player";
import { Skill } from "@src/skill";
import { Macro as $, _, DataPointClass, Score, Variable } from "sandstone";
import { MacroLiteral } from "sandstone/core";

export class Reward {
	show: string;
	give: () => void;
	public static common: Reward[] = [];
	public static rare: Reward[] = [];

	constructor(show: string, give: () => void) {
		this.show = show;
		this.give = give;
	}

	/** Assemble multiple rewards into a string[] */
	public static join(rewards: Reward[]): string[] {
		return rewards.map(r => ` §8+ §r${r.show}`);
	}

	/** Give every rewards inside @param rewards */
	public static giveAll(rewards: Reward[]) {
		return rewards.map(r => r.give);
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

	public static resolve(skill: Skill, lvl: Score, f: (strings: string[], rewards: Reward[]) => void) {
		const found = Variable(0);
		skill.rewards.forEach((r, i) => {
			_.if(lvl["=="](i), () => {
				f(Reward.join(r), r);
				found.set(1);
			});
		});

		_.if(_.not(found), () => f(Reward.join(Reward.common), Reward.common));
	}

	public static giveMcFn(name: string): string;
	public static giveMcFn(name: DataPointClass): MacroLiteral;
	public static giveMcFn(name: string | DataPointClass) {
		if (typeof name === 'string') return `misc/give/${Global.toMcFunction(name)}`;

		return $`misc/give/${name}`;
	}
}

