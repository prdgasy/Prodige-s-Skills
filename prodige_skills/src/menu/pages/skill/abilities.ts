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
					"§8┃ §7Abilities are §dpassive bonuses §7that enhance",
					"§8┃ §7your performance as you master each skill.",
					"",
					"§e§l┃ PROGRESSION",
					"§e┃ §7Unlocked at §eLevel 10",
					"§e┃ §7Upgraded every §b10 levels",
					"§e┃ §7Maximum rank: §cTier X §8(§eLevel 100§8)",
					"",
					"§b§l┃ ABILITY EFFECTS",
					"§b┃ §7Each skill has a §bunique passive ability",
					"§b┃ §7Higher tiers grant §bstronger effects",
					"§b┃ §7Bonuses apply §aautomatically",
					"",
					"§d§l┃ ACTIVATION",
					"§d┃ §7No activation key required",
					"§d┃ §7No cooldown — effects are always active",
					"",
					"§8┃ §7Master your skills to unlock",
					"§8┃ §7their full potential!"
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
		const status = DataVariable("§a§l[ENABLED]");
		_.if(_.not(a.state), () => {
			status.set("§c§l[DISABLED]");
		});

		p.emit(
			new Button(
				'gold_ingot', 4, $`${status}`,
				[
					'§7Toggle ability perks and buffs.',
					'',
					'§eClick to toggle!'
				], () => {
					Player.playSound('tick');
					a.toggle();
				}
			))
	}

	private static unlocked(p: PageClass, s: Skill, a: Ability) {
		const isActive = DataVariable("§a§l• §aEnabled");
		_.if(_.not(a.state), () => {
			isActive.set("§c§l• §cDisabled");
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
		const isLevel = s.level['>='](10)
		_.if(isPoint, () => point.set('§8[§a✔§8]'));
		_.if(isLevel, () => level.set('§8[§a✔§8]'));
		_.if(_.and(isPoint, isLevel), () => unlock.set('§8• §a§lUNLOCK'));

		p.emit(
			new Button(
				'nether_star', 12, $`§c§l${a.name} §8[§c§l${roman}§8] ${unlock}`,
				[
					...description,
					'',
					$`§d§l┃ STATUS ${isActive}`,
					'',
					'§e§l┃ TIER PROGRESSION',
					$`§e┃ §7Next Tier: §c${a.name} §8[§7${roman}§c§l${romanNext}]`,
					$`§e┃ > §7${a.buff}%»§c§l${a.buff['+'](5)}%`,
					'§e┃',
					`§e┃ §7Requires:`,
					$`§e┃ ${level} §8• §d${s.name} §l${romanLevelRequired} §7(${levelRequired})`,
					$`§e┃ ${point} §8• §e${a.price} Pts`,
					...Text.wrap('Improve your skill to unlock stronger ability effects.', '§e┃ §7'),
					'',
					'§b§l┃ ACTIVATION',
					'§b┃ §7Abilities works automatically.',
					'§b┃ §7Toggle it on or off at any time.',
					'',
					'§8┃ §eClick to upgrade!'
				],
				() => a.tryUpgrade(), 1, ["enchantment_glint_override=1"]
			)
		);
	}

	private static maxTier(p: PageClass, a: Ability, isActive: DataPointClass) {
		p.emit(
			new Button(
				'nether_star', 12, `${a.name} §8[§c§lX§8]`,
				[
					...Text.wrap(a.description),
					'',
					$`§d§l┃ STATUS ${isActive}`,
					'',
					'§c§l┃ MAX TIER',
					'§c┃ §7You have reached the max tier!',
					$`§c┃ §7Perks: ${a.name} §c§l${a.buff}%`,
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
				'charcoal', 12, $`§c🔒 Locked ${unlock}`,
				[
					'§8┃ §7This ability is not yet unlocked.',
					'',
					'§6§l┃ UNLOCK REQUIREMENT',
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
			'anvil', 12, '§c§oComing Soon!',
			[
				'§8┃ §7This skill does not have an',
				'§8┃ §7ability available yet.',
				'',
				'§6§l┃ WHAT TO EXPECT',
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
