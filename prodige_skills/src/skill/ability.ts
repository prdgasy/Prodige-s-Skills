import { Roman } from "@lib/roman";
import { Text } from "@lib/text";
import { macro as $, smartTellraw } from "@prodigelib/easymacro";
import { FloatVar } from "@prodigelib/floatVar";
import { Player } from "@src/player";
import { _, Label, MCFunction, NonEmptyString, Objective, playsound, say, Score, tellraw } from "sandstone";
import { EntityLabel } from "sandstone/variables";
import { Skill } from ".";
import { Global } from "@src/global";


export class Ability {
	public skill: Skill;
	public name: string;
	public description: string;
	public tier: Score;
	public buff: Score;
	public trigger: () => void;
	public state: EntityLabel;

	constructor(skill: Skill, name: string, description: string, trigger?: () => void) {
		this.skill = skill;
		this.name = name;
		this.description = description;
		this.tier = Objective.create(`${this.skill.name}.ability.tier`)('@p');
		this.buff = Objective.create(`${this.skill.name}.ability.buff`)('@p');
		this.state = Label(`${this.skill.name}.ability.toggle` as NonEmptyString)('@p');
		this.trigger = trigger ?? (() => say('triggered'));
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
		const abilityUpgraded = _.and(this.tier['>'](0), (this.tier['%'](10)['=='](0)));

		_.if(abilityUpgraded, () => {
			this.tier["++"];
			this.buff.add(5);
		});
	}

	public tierUpNotif() {
		const abilityUnlocked = this.tier['=='](0);
		const abilityUpgraded = _.and(this.tier['>'](0), (this.tier['%'](10)['=='](0)));

		_.if(abilityUpgraded, () => {
			_.if(Player.sound, () => playsound('entity.ender_dragon.growl', 'master', '@p', '~ ~ ~', 1, 1));
		})

		const sendAbilityMessage = (unlocking: boolean) => {
			const romanTier = Roman.get(this.tier);
			const romanPreviousTier = Roman.get(this.tier['-'](1));

			const title = unlocking ? '§a§lABILITY UNLOCKED!' : '§b§lABILITY UPGRADE!';
			const tier = unlocking
				? `§c§lI`
				: `${romanPreviousTier}➜§c§l${romanTier}`;

			smartTellraw([
				' \n',
				` ${title}\n`,
				$`  §8• §c§l${this.name} §8[${tier}§8]\n`,
				...Text.wrap(this.description).map(r => $`   §7${r}\n`),
				` §8• §f§lBonus: §7${this.buff['-'](5)}>>§c${this.buff}%`,
			], '@p');
		};

		return () => {
			_.if(abilityUnlocked, () => sendAbilityMessage(true));
			_.if(abilityUpgraded, () => sendAbilityMessage(false));
		}
	}

	public firstJoin() {
		this.tier.set(0);
		this.buff.set(0);
		this.enable();
	}

	public roll() {
		const fn = MCFunction(`ability/roll/${Global.toResource(this.name)}`, () => {
			const roll = FloatVar.random(0, 0, 100);

			tellraw('@p', ['§8[§d§lABILITY ROLL§8] §7You rolled §d', roll.toData(), '§7!']);
			_.if(_.and(this.state, roll['<'](50)), () => { // < this.buff
				this.trigger();
			})
		}, { onConflict: 'ignore' })

		return fn();
	}
}