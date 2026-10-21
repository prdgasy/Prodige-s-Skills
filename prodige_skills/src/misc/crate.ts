import { BetterArray } from "@prodigelib/betterarray";
import { FloatVar } from "@prodigelib/floatVar";
import { CrateName } from "@src/data/definitions";
import { Global } from "@src/global";
import { Player } from "@src/player";
import { Macro as $, _, DataPointClass, MCFunction, say, tellraw, Variable } from "sandstone";
import { Reward } from "./reward";
import { SmartTellrawClass, macro as T, smartTellraw } from "@prodigelib/easymacro";

export type CrateOption = {
	name: string, description: string, item: string, roll: number, rewards: Map<Reward, number>
}
export class Crate {
	public name: string;
	public description: string;
	public item: string;
	public roll: number;
	public rewards: Map<Reward, number>;
	public static crates: Record<CrateName, Crate>;
	public static storage = Global.storage.select("crate");

	public constructor(opt: CrateOption) {
		this.name = opt.name;
		this.roll = opt.roll;
		this.rewards = opt.rewards;

		this.description = opt.description;
		this.item = opt.item;
	}

	public getItemDescription(): string[] {
		const s: string[] = [];
		let t = 0;
		this.rewards.forEach(w => t += w);
		this.rewards.forEach((weight, obj) => {
			s.push(` §7> ${obj.name} §7• §e${(weight / t) * 100}%`);
		})
		return s;
	}

	private pick(n: number) {
		const fn = MCFunction(`misc/crate/roll/${Global.toResource(this.name)}`, () => {


			const encapsuler = '§7*--*--*--*--*--* §6§lSkill Crates §7*--*--*--*--*--*';
			smartTellraw([
				encapsuler + '\n\n',
				` §7You opened a ${this.name} Crate §7and received:`
			]);

			let total = 0;
			this.rewards.forEach(w => total += w);
			// n is known at compile time: unroll the rolls instead of looping at runtime
			_.for([0, n], 'iterate', () => {
				const roll = FloatVar.random()['*'](total);   // one draw in [0, total)
				const done = Variable(0);

				let acc = 0;
				for (const [reward, weight] of this.rewards) {
					acc += weight;
					// first cumulative threshold above the draw wins, exactly one per roll
					_.if(_.and(_.not(done), roll['<'](acc)), () => {
						reward.give();
						smartTellraw([T`  §8• ${reward.name}`]);
						done.set(1);
					});
				}
			});

			smartTellraw([
				'  \n§7§oVisit the Shop to buy more crate keys!\n\n',
				encapsuler
			]);
		}, { onConflict: 'ignore' });

		return fn();
	}

	private open() {
		const fn = MCFunction(`misc/crate/open/${Global.toResource(this.name)}`, () => {
			tellraw('@p', `§eOpened x1 [${this.name}§e]!`);
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