import { BetterArray } from "@prodigelib/betterarray";
import { FloatVar } from "@prodigelib/floatVar";
import { CrateName } from "@src/data/definitions";
import { Global } from "@src/global";
import { Player } from "@src/player";
import { Macro as $, _, MCFunction, tellraw, Variable } from "sandstone";
import { Reward } from "./reward";

export type CrateOption = {
	name: string, color: string, description: string, item: string, roll: number, rewards: Map<Reward, number>
}
export class Crate {
	public name: string;
	public color: string;
	public description: string;
	public item: string;
	public roll: number;
	public rewards: Map<Reward, number>;
	public rewardShow: string[];
	public static crates: Record<CrateName, Crate>;
	public static storage = Global.storage.select("crate");

	public constructor(opt: CrateOption) {
		this.name = opt.name;
		this.color = opt.color;
		this.roll = opt.roll;
		this.rewards = opt.rewards;

		this.description = opt.description;
		this.rewardShow = this.setDescription();
		this.item = opt.item;
	}

	private setDescription(): string[] {
		const s: string[] = [];
		let t = 0;
		this.rewards.forEach(w => t += w);
		this.rewards.forEach((weight, obj) => {
			s.push(` §7> ${obj.name} §7• §e${(weight / t) * 100}%`);
		})
		return s;
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

	public static get(c: CrateName): Crate {
		return Crate.crates[c];
	}
}