import { BetterArray } from "@prodigelib/betterarray";
import { FloatVar } from "@prodigelib/floatVar";
import { Global } from "@src/global";
import { Player } from "@src/player";
import { Macro as $, _, MCFunction, tellraw, Variable } from "sandstone";
import { Buyable } from "./buyable";
import { Reward } from "./reward";

export class Crate {
	public name: string;
	public color: string;
	public description: string;
	public item: string;
	public roll: number;
	public rewards: Map<Buyable, number>;
	public rewardShow: string[];
	public static list: Crate[] = [];
	public static storage = Global.storage.select("crate");


	public constructor(name: string, color: string, description: string, item: string, roll: number, rewards: Map<Buyable, number>) {
		this.name = name;
		this.color = color;
		this.roll = roll;
		this.rewards = rewards;

		this.description = description;
		this.rewardShow = this.setDescription();
		this.item = item;
	}

	private setDescription(): string[] {
		if (this.rewards.size === 0) return ["§7No rewards."];
		const toPrint: string[] = [];
		this.rewards.forEach((weight, obj) => {
			toPrint.push(` §7> ${obj.name} §7• §e${weight * 100}%`); // % => weight/total * 100
		})
		return toPrint;
	}

	private pick(n: number) {
		const fn = MCFunction(`misc/crate/roll/${Global.toMcFunction(this.name)}`, () => {
			let t = 0;
			this.rewards.forEach(weight => t += weight);
			const buyables = new BetterArray<string>(this.rewards.keys().map(b => Global.toMcFunction(b.name)).toArray());
			const weights = new BetterArray<number>(this.rewards.values().toArray());

			const i = Variable(0);
			const picked = Variable(0);

			_.while(picked['<'](n), () => {
				const b = buyables.get(i);
				const w = new FloatVar(weights.get(i));

				const P_b = w['/'](t);
				const roll = FloatVar.random()['*'](t);

				_.if(roll['-'](P_b)['<'](0), () => {
					_.with([b], () => $.functionCmd($`${Global.ns}:${Reward.giveMcFn(b)}`));
					picked.add(1);
				})

				i['++']['%='](this.rewards.size);
			})
		}, { onConflict: 'ignore' });

		return fn();
	}

	private open() {
		const fn = MCFunction(`misc/crate/open/${Global.toMcFunction(this.name)}`, () => {
			tellraw('@p', `§eOpened x1 [${this.color}${this.name}§e]!`);
			Player.playSound('info');
			return this.pick(this.roll);
		}, { onConflict: 'ignore' });

		return fn();
	}

	public tryOpen() {
		_.if(Variable(0)['=='](0), () => this.open()); // crate key
	}
}