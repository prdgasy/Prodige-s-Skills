import { ToolName } from "@src/data/definitions";
import { Global } from "@src/global";
import { Player } from "@src/player";
import { Skill } from "@src/skill";
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
		return rewards.map(r => ` §8+ §r${r.name}`);
	}

	/** Give every rewards inside rewards */
	public static giveAll(rewards: Reward[]) {
		comment(`Reward.giveAll::${rewards.map(r => r.name).join(', ')}`);
		rewards.forEach(r => r.give());
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

	public static resolve(skill: Skill, lvl: Score, mode: 'give' | 'string'): DataPointClass[] {
		const found = Variable(0);
		const strings: DataPointClass[] = [];
		skill.rewards.forEach((rewards, level) => {
			_.if(lvl["=="](level), () => {
				if (mode === 'string') strings.push(...rewards.map(r => DataVariable(r.name)));
				else Reward.giveAll(rewards);
				found.set(1);
			});
		});

		_.if(_.not(found), () => {
			if (mode === 'string') strings.push(...Reward.common.map(r => DataVariable(r.name)));
			else Reward.giveAll(Reward.common);
		});

		return strings;
	}

	public static giveMcFn(name: string): string;
	public static giveMcFn(name: DataPointClass): MacroLiteral;
	public static giveMcFn(name: string | DataPointClass) {
		if (typeof name === 'string') return `misc/give/${Global.toMcFunction(name)}`;

		return $`misc/give/${name}`;
	}

	public static get(r: AllRewards): Reward {
		try {
			return Reward.registry.get(r) as Reward;
		} catch (e) {
			throw Error(`${e}: "${r}" is not registered into "Reward.registry".`);
		}
	}
}

