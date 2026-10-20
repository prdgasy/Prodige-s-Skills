import { Global } from "@src/global";
import { Macro as $, _, DataPointClass, Score, Variable } from "sandstone";
import { MacroLiteral } from "sandstone/core";
import { Player } from "../player";
import { Skill } from "../skill";
import { Tool } from "./tool";

export class Reward {
	show: string;
	give: () => void;

	constructor(show: string, give: () => void) {
		this.show = show;
		this.give = give;
	}

	/** Assemble multiple rewards into a string[] */
	public static join(rewards: Reward[]): string[] {
		return rewards.map(r => ` §8+ §r${r.show}`);
	}

	/** Give every rewards inside @param rewards */
	public static get(rewards: Reward[]) {
		rewards.map(r => r.give);
	}

	public static point(p: number): Reward {
		return new Reward(`§e${p} Pts`, () => Player.pts.add(p));
	}

	public static xp(x: number, skill: Skill): Reward {
		return new Reward(`§3${x} ${skill.name} Xp`, () => skill.xp.add(x));
	}

	public static common(skill: Skill): Reward[] {
		return [
			Reward.point(20),
			Tool.list[0]
		]
	}

	public static level(skill: Skill, level: number): Reward[] {
		return skill.rewards.get(level) ?? Reward.common(skill);
	}

	public static giveRewards(skill: Skill) {
		const found = Variable(0);
		skill.rewards.forEach((rewards, level) => {
			_.if(skill.level["=="](level), () => {
				Reward.get(rewards);
				found.set(1);
			});
		});

		_.if(_.not(found), () => {
			Reward.get(Reward.common(skill));
		});
	}

	public static resolve(skill: Skill, lvl: Score, f: (rewards: string[]) => void) {
		const found = Variable(0);
		skill.rewards.forEach((r, i) => {
			_.if(lvl["=="](i), () => {
				f(Reward.join(r));
				found.set(1);
			});
		});

		_.if(_.not(found), () => {
			f(Reward.join(Reward.common(skill)))
		});
	}

	public static giveMcFn(name: string): string;
	public static giveMcFn(name: DataPointClass): MacroLiteral;
	public static giveMcFn(name: string | DataPointClass) {
		if (typeof name === 'string') return `misc/give/${Global.toMcFunction(name)}`;

		return $`misc/give/${name}`;
	}
}

