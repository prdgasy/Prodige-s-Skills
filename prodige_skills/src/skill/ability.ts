import { Roman } from "@lib/roman";
import { Text } from "@lib/text";
import { macro as $, smartTellraw } from "@prodigelib/easymacro";
import { FloatVar } from "@prodigelib/floatVar";
import { Player } from "@src/player";
import { _, Label, NonEmptyString, Objective, playsound, Score } from "sandstone";
import { EntityLabel } from "sandstone/variables";
import { Skill } from ".";


export class Ability {
	public skill: Skill;
	public name: string;
	public description: string;
	public tier: Score;
	public buff: Score;
	public state: EntityLabel;

	constructor(skill: Skill, name: string, description: string) {
		this.skill = skill;
		this.name = name;
		this.description = description;
		this.tier = Objective.create(`${this.skill.name}.ability.tier`)('@p');
		this.buff = Objective.create(`${this.skill.name}.ability.buff`)('@p');
		this.state = Label(`${this.skill.name}.ability.toggle` as NonEmptyString)('@p');
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
		const abilityUnlocked = this.tier['=='](0);
		const abilityUpgraded = _.and(this.tier['>'](0), (this.tier['%'](10)['=='](0)));
		_.if(_.or(abilityUnlocked, abilityUpgraded), () => this.tier["++"]);
	}

	public tierUpNotif() {
		const abilityUnlocked = this.tier['=='](0);
		const abilityUpgraded = _.and(this.tier['>'](0), (this.tier['%'](10)['=='](0)));
		_.if(_.or(abilityUnlocked, abilityUpgraded), () => {
			_.if(Player.sound, () => playsound('entity.ender_dragon.growl', 'master', '@p', '~ ~ ~', 1, 1));
		})
		const sendAbilityMessage = (unlocked: boolean) => {
			const romanTier = Roman.get(this.tier);
			const romanPreviousTier = Roman.get(this.tier['-'](1));

			const title = unlocked ? '§a§lABILITY UNLOCKED!' : '§b§lABILITY UPGRADE!';
			const tier = unlocked
				? `§c§l${romanTier}`
				: `${romanPreviousTier}➜§c§l${romanTier}`;

			smartTellraw([
				' \n',
				` ${title}\n`,
				$`  §8• §7Ability: §c§l${this.name} §8[${tier}§8]\n`,
				...Text.wrap(this.description).map(r => $`   §7${r}\n`),
				' §8• §7Bonus:\n'
			], '@p');
		};

		return () => {
			_.if(abilityUnlocked, () => sendAbilityMessage(true));
			_.if(abilityUpgraded, () => sendAbilityMessage(false));
		}
	}

	public firstJoin() {
		this.tier.set(0);
		this.enable();
	}

	public upgradeBuff() {

	}



	public onEvent() {

	}

	public trigger() {

	}
}