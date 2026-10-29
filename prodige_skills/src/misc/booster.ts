import { Player } from "@src/player";
import { _, clear, execute, give, MCFunction, Objective, Score } from "sandstone";
import { ItemPredicate } from "sandstone";
import { Item } from "@src/types";

export type BoosterType = 'Xp' | 'Pts';
export const BOOSTER_TYPE: BoosterType[] = ['Xp', 'Pts'];

export class Booster {
	public static boosters: Booster[] = [];
	private static usedXp = Objective.create('boost.xp.used', 'minecraft.used:minecraft.carrot_on_a_stick')('@p');
	private static usedPts = Objective.create('boost.pts.used', 'minecraft.used:minecraft.warped_fungus_on_a_stick')('@p');

	public name: string;
	public description: string;
	public item: Item;
	public price: number;
	public mult: number;
	public type: BoosterType;
	public duration: number;
	private predicate: ReturnType<typeof ItemPredicate>;

	constructor(mult: number, type: BoosterType, price: number, duration = 30) {
		const name = `§${type === 'Xp' ? 'b' : 'e'}x${mult} ${type} Booster`;
		const item = type === 'Xp' ? 'carrot_on_a_stick' : 'warped_fungus_on_a_stick';
		const customData = { prodige_skills: { booster: `${type.toLowerCase()}_${mult}` } };
		const predicate = ItemPredicate(`minecraft:${item}`).match('minecraft:custom_data', customData);
		this.name = name;
		this.description = `${mult}x ${type} Booster · ${duration} minutes`;
		this.item = item;
		this.price = price;
		this.mult = mult;
		this.type = type;
		this.duration = duration;
		this.predicate = predicate;
		Booster.boosters.push(this);
	}

	public giveItem() {
		const customData = { prodige_skills: { booster: `${this.type.toLowerCase()}_${this.mult}` } };
		return give('@p', this.item, {
			'minecraft:custom_name': this.name,
			'minecraft:lore': [
				`§7${this.mult}x ${this.type} multiplier`,
				`§7Duration: ${this.duration} minutes`,
				'§eRight-click to activate'
			],
			'minecraft:item_model': this.type === 'Xp'
				? 'minecraft:experience_bottle'
				: 'minecraft:gold_ingot',
			'minecraft:custom_data': customData,
			'minecraft:unbreakable': {}
		});
	}

	public static init() {
		MCFunction('misc/booster/count_timer', () => {
			execute.as('@a').at('@s').run(() => {
				for (const type of BOOSTER_TYPE) {
					const t = Booster.getTimer(type);
					_.if(t['>'](0), () => t['--']);
				}
			});
		}, { runEvery: '60s' });

		return MCFunction('misc/booster/use', () => {
			execute.as('@a').at('@s').run(() => {
				for (const booster of Booster.boosters) {
					const used = booster.type === 'Xp' ? Booster.usedXp : Booster.usedPts;
					_.if(used['>'](0), () => {
						execute.if.items.entity('@s', 'weapon.mainhand', booster.predicate).run(() => {
							_.if(Booster.getTimer(booster.type)['>'](0), () => {
								Player.throw(`You already have an active ${booster.type} Booster!`);
							}).else(() => {
								clear('@s', booster.predicate, 1);
								booster.activate();
							});
						});
					});
				}
				Booster.usedXp.reset();
				Booster.usedPts.reset();
			});
		}, { runEvery: '1t' });
	}

	public static getTimer(type: BoosterType): Score {
		return Objective.create(`misc.booster.${type}.timer`)('@p');
	}

	public static getMult(type: BoosterType): Score {
		return Objective.create(`misc.booster.${type}.mult`)('@p');
	}

	public static getColor(type: BoosterType): string {
		return type == 'Xp' ? '§b' : '§e';
	}

	public activate() {
		_.if(Booster.getTimer(this.type)['>'](0), () => {
			Player.throw(`You already have an active ${this.type} Booster!`);
		})
			.else(() => {
				Player.send(`${Booster.getColor(this.type)}x${this.mult} ${this.type} Booster enabled for §d${this.duration} minutes!`, '§a');
				Booster.getMult(this.type).set(this.mult);
				Booster.getTimer(this.type).set(this.duration);
			})
	}
}