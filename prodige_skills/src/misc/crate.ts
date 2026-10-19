import { BetterArray } from "@prodigelib/betterarray";
import { smartTellraw, macro as T } from "@prodigelib/easymacro";
import { FloatVar } from "@prodigelib/floatVar";
import { Global } from "@src/global";
import { Player } from "@src/player";
import { Macro as $, _, MCFunction, tellraw, Variable } from "sandstone";
import { Buyable } from "./buyable";

export class Crate {
	public name: string;
	public price: number;
	public description: string;
	public item: string;
	public rewards: Map<Buyable, number>;
	public rewardShow: string[];
	public static list: Crate[] = [];
	public static storage = Global.storage.select("crate");


	public constructor(name: string, price: number, description: string, item: string, rewards?: Map<Buyable, number>) {
		this.name = name;
		this.price = price;
		this.rewards = rewards ?? new Map<Buyable, number>();

		this.description = description;
		this.rewardShow = this.setDescription();
		this.item = item;

		Crate.list.push(this);
		// Buyable.list.push(this);
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
		const fn = MCFunction(`misc/crate/roll/${this.name}`, () => {
			let t = 0;
			this.rewards.forEach(weight => t += weight);
			const buyables = new BetterArray<string>(this.rewards.keys().map(b => Global.toMcFunction(b.name)).toArray());
			const weights = new BetterArray<number>(this.rewards.values().toArray());

			const i = Variable(0);
			const picked = Variable(0);
			const stay = _.and(i['<'](this.rewards.size), picked['<'](n));

			_.while(stay, () => {
				const b = buyables.get(i);
				const w = new FloatVar(weights.get(i));
				smartTellraw([
					T`Weight: ${w}`
				]);
				const P_b = w['/'](t);

				const roll = FloatVar.random()['*'](t);
				_.if(roll['-'](P_b)['<'](0), () => {
					_.with([b], () => $.functionCmd(Buyable.giveFnName(b)));
					picked.add(1);
				})

				i['++'];
			})
		}, { onConflict: 'ignore' });

		return fn();
	}

	private open() {
		const fn = MCFunction(Buyable.giveFnName(this.name), () => {
			this.pick(1);
			Player.playSound('info');
			return tellraw('@p', `Opened x1 [${this.name}§a]!`);
		}, { onConflict: 'ignore' });

		return fn();
	}

	public tryOpen() {
		_.if(Variable(0)['=='](0), () => this.open()); // TODO > Verify if player has the corresponding crate key
	}
}