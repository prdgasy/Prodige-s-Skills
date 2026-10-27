import { Roman } from "@lib/roman";
import { Text } from "@lib/text";
import { macro as $, smartTellraw } from "@prodigelib/easymacro";
import { Float } from "@prodigelib/floatVar";
import { Player } from "@src/player";
import { _, DataVariable, Label, MCFunction, NonEmptyString, Objective, playsound, say, Score, tellraw } from "sandstone";
import { EntityLabel } from "sandstone/variables";
import { Skill } from ".";
import { Global } from "@src/global";


export class Ability {
	public skill: Skill;
	public name: string;
	public description: string;
	public price: Score;
	public basePrice: number;
	public tier: Score;
	public buff: Score;
	public trigger: () => void;
	public state: EntityLabel;

	constructor(skill: Skill, name: string, description: string, basePrice: number, trigger: () => void) {
		this.skill = skill;
		this.name = name;
		this.basePrice = basePrice;
		this.description = description;
		this.tier = Objective.create(`${this.skill.name}.ability.tier`)('@p');
		this.buff = Objective.create(`${this.skill.name}.ability.buff`)('@p');
		this.state = Label(`${this.skill.name}.ability.toggle` as NonEmptyString)('@p');
		this.trigger = trigger;
		this.price = Objective.create(`${this.skill.name}.ability.price`)('@p');
	}

	public disable() {
		this.state.remove();
	}

	public enable() {
		this.state.add();
	}

	public toggle() {
		this.state.toggle();
	}

	public tierUp() {
		this.tier["++"];
		this.buff.add(5);
		this.tierUpShow();
	}

	private tierUpShow() {
		_.if(Player.sound, () => playsound('entity.ender_dragon.growl', 'master', '@p', '~ ~ ~', 1, 1));

		const romanTier = Roman.get(this.tier);
		const romanPreviousTier = Roman.get(this.tier['-'](1));

		smartTellraw([
			`${Global.encapsuler}\n`,
			$` §d§l${this.skill.name.toUpperCase()} ABILITY UPGRADED!\n`,
			$`§c§l${this.name} §8[§7${romanPreviousTier}➜§c§l${romanTier}§8]\n`,
			'',
			...Text.wrap(this.description, ` §7§o`),
			$` §dBonus: §7${this.buff['-'](5)}%»§c${this.buff}%`,

			$`§b§lNext Upgrade: §c${this.name} §8[§7${romanTier}➜§c§l${Roman.get(this.tier['+'](1))}§8]\n`,
			$` • §7Price: §e${this.price} Pts\n`,
			$` • §7Bonus: §7${this.buff}%»§c${this.buff['+'](5)}%`,
			Global.encapsuler
		], '@p');
	}

	public firstJoin() {
		this.tier.set(0);
		this.buff.set(0);
		this.price.set(this.basePrice);
		this.enable();
	}

	public roll() {
		const fn = MCFunction(`ability/roll/${Global.toResource(this.name)}`, () => {
			_.if(_.and(this.state, Float.random(0, 0, 100)['<='](this.buff)), () => {
				this.trigger();
			})
		}, { onConflict: 'ignore' })

		return fn();
	}
}