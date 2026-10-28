import { Gui, PageClass, GuiMacro as $, Button } from "@prodigelib/gui";
import { Skill } from "@src/skill";
import { Navigation } from "./navigation";
import { Roman } from "@lib/roman";
import { _, DataPointClass, DataVariable, tellraw } from "sandstone";
import { Player } from "@src/player";
import { Text } from "@lib/text";
import { Ability } from "@src/skill/ability";

export class Abilities {
	public static getName(skill: Skill) {
		return this.name + skill.name;
	}

	public static init(g: Gui, p: PageClass, s: Skill) {
		p.add(() => {
			const info = new Button(
				"knowledge_book", 14, "§a§lAbility Guide",
				[
					...Text.wrap("§7Abilities are §dpassive bonuses §7that enhance your performance as you master each skill."),
					"",
					"§e§l┃ Progression",
					"§e┃ §7Unlocked at §eLevel 10",
					"§e┃ §7Upgraded every §b10 levels",
					"§e┃ §7Maximum rank: §cTier X §8(§eLevel 100§8)",
					"",
					"§6§l┃ Ability Perks",
					...Text.wrap("Each skill has a §bunique passive ability. Higher tiers grant §bstronger effects§7!", "§6┃ §7"),
					"",
					"§d§l┃ Activation",
					...Text.wrap("No activation key required. Effects are always active!", "§d┃ §7"),
					"",
					...Text.wrap("Master your skills to unlock their full potential!", "§8")
				]
			);
			p.emit(info);

			const a = s.ability;
			if (a) {
				_.if(a.tier['=='](0), () => this.locked(p, s, a))
					.else(() => this.unlocked(p, s, a));
				this.toggler(p, a);
			}
			else this.comingSoon(p, s);
		});

		p.add(() => Navigation.render(g, p, s));
		return p;
	}

	public static toggler(p: PageClass, a: Ability) {
		const status = DataVariable("§a§lOn");
		_.if(_.not(a.state), () => {
			status.set("§c§lOff");
		});

		p.emit(
			new Button(
				'lever', 12, '§d§lAbility Perks',
				[
					'§7Toggle your ability perks and buffs.',
					'',
					$`§7Status §8• [${status}§8]`,
					'',
					'§eClick to toggle!'
				], () => {
					Player.playSound('tick', 2);
					a.toggle();
				}
			))
	}

	private static unlocked(p: PageClass, s: Skill, a: Ability) {
		const isActive = DataVariable("§8• §aActive");
		_.if(_.not(a.state), () => {
			isActive.set("§8• §7Inactive");
		});

		_.if(a.tier['=='](10), () => this.maxTier(p, a, isActive)).
			else(() => this.upgradeBtn(p, s, a, isActive));
	}

	private static upgradeBtn(p: PageClass, s: Skill, a: Ability, isActive: DataPointClass) {
		const next = a.tier['+'](1);
		const roman = Roman.get(a.tier);
		const romanNext = Roman.get(next);
		const description = Text.wrap(a.description);
		const levelRequired = next['*'](10);
		const romanLevelRequired = Roman.get(levelRequired);

		const unlock = DataVariable('');
		const point = DataVariable('§8[§c✘§8]');
		const level = DataVariable('§8[§c✘§8]');

		const isPoint = Player.pts['>='](a.basePrice);
		const isLevel = s.level['>='](levelRequired); // SHOW UPGRADE BUG
		_.if(isPoint, () => point.set('§8[§a✔§8]'));
		_.if(isLevel, () => level.set('§8[§a✔§8]'));
		_.if(_.and(isPoint, isLevel), () => unlock.set('§8• §a§lUNLOCK'));

		p.emit(
			new Button(
				'nether_star', 4, $`§c§l${a.name} §8[§c§l${roman}§8] ${unlock}`,
				[
					$`${isActive}`,
					'',
					...description,
					'',
					'§e§l┃ Next Tier',
					$`§e┃ §c${a.name} §8[${roman}➜§c§l${romanNext}§8] §8• ${a.buff.show()}%»§c§l${a.buff['+'](2.5).show()}%`,
					'§e┃',
					$`§e┃ ${level} §8• §d${s.name} §l${romanLevelRequired} §7(${levelRequired})`,
					$`§e┃ ${point} §8• §e${a.price} Pts`,
					'',
					...Text.wrap('Improve your skill to unlock stronger ability effects.', '§e┃ §7'),
					'',
					'§eClick to upgrade!'
				],
				() => a.tryUpgrade(), 1, ["enchantment_glint_override=1"]
			)
		);
	}

	private static maxTier(p: PageClass, a: Ability, isActive: DataPointClass) {
		p.emit(
			new Button(
				'nether_star', 4, `${a.name} §8[§c§lX§8]`,
				[
					...Text.wrap(a.description),
					'',
					$`§d§l┃ STATUS ${isActive}`,
					'',
					'§c§l┃ MAX TIER',
					'§c┃ §7You have reached the max tier!',
					$`§c┃ §7Perks: ${a.name} §c§l${a.buff.show()}%`,
					'',
					'§b§l┃ ACTIVATION',
					'§b┃ §7Abilities works automatically.',
					'§b┃ §7Toggle it on or off at any time.',
					'',
					'§8You cannot upgrade this more!'
				], () => Player.throw('You have already reached the max tier for this Ability!')
			)
		);
	}

	private static locked(p: PageClass, s: Skill, a: Ability) {
		const next = a.tier['+'](1);
		const levelRequired = next['*'](10);
		const romanLevelRequired = Roman.get(levelRequired);
		const unlock = DataVariable('');
		const point = DataVariable('§8[§c✘§8]');
		const level = DataVariable('§8[§c✘§8]');

		const isPoint = Player.pts['>='](a.basePrice);
		const isLevel = s.level['>='](10);
		_.if(isPoint, () => point.set('§8[§a✔§8]'));
		_.if(isLevel, () => level.set('§8[§a✔§8]'));
		_.if(_.and(isPoint, isLevel), () => unlock.set('§8• §a§lUNLOCK'));

		return p.emit(
			new Button(
				'charcoal', 4, $`§c🔒 Locked ${unlock}`,
				[
					'§8┃ §7This ability is not yet unlocked.',
					'',
					'§6§l┃ Unlocking Requirements',
					$`§6┃ ${level} §8• §d${s.name} §l${romanLevelRequired} §7(${levelRequired})`,
					$`§6┃ ${point} §8• §e${a.basePrice} Pts`,
					'',
					'§5§l┃ PERKS',
					'§5┃ §7Gain access to this skill\'s',
					'§5┃ §7unique passive ability.',
					'§5┃ §7Continue leveling to strengthen it.',
					'',
					'§eClick to unlock!'
				],
				() => {
					a.tryUpgrade();
				}
			)
		);
	}

	private static comingSoon(p: PageClass, s: Skill) {

		return p.emit(new Button(
			'anvil', 4, '§c§lComing Soon!',
			[
				'§8┃ §7This skill does not have an',
				'§8┃ §7ability available yet.',
				'',
				'§6§l┃ What to expect',
				'§6┃ §7A unique passive effect',
				'§6┃ §7Progression through skill tiers',
				'§6┃ §7Bonuses that improve your gameplay',
				'',
				'§8┃ §7Stay tuned for future updates!'
			],
			() => {
				Player.playSound('error');
				Player.throw(`Ability for ${s.name} coming soon!`);
			}
		));
	}
}
