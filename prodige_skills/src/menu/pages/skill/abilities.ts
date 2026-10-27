import { Gui, PageClass, GuiMacro as $, Button } from "@prodigelib/gui";
import { Skill } from "@src/skill";
import { Navigation } from "./navigation";
import { Roman } from "@lib/roman";
import { _, DataVariable, tellraw } from "sandstone";
import { Player } from "@src/player";
import { Text } from "@lib/text";

export class Abilities {
	public static getName(skill: Skill) {
		return this.name + skill.name;
	}

	public static init(g: Gui, p: PageClass, skill: Skill) {
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

			if (skill.ability) {
				const next = skill.ability.tier['+'](1);
				const roman = Roman.get(skill.ability.tier);
				const isActive = DataVariable("§a§l• §aEnabled");
				const name = DataVariable(`§d§l${skill.ability.name}`);
				const description = Text.wrap(skill.ability.description);

				_.if(_.not(skill.ability.state), () => {
					isActive.set("§c§l• §cDisabled");
					name.set(`§7§o${skill.ability!.name}`);
				});

				const unlocked = new Button(
					'nether_star', 12, $`§c§l${skill.ability.name} §8[§c§l${roman}§8]`,
					[
						...description,
						'',
						$`§d§l┃ ABILITY STATUS ${isActive}`,
						'',
						'§e§l┃ TIER PROGRESSION',
						$`§e┃ §7Next Tier: §c${skill.ability.name} ${Roman.get(next)}`,
						...Text.wrap('Improve your skill to unlock stronger ability effects.', '§e┃ §7'),
						'',
						'§b§l┃ ACTIVATION',
						'§b┃ §7Abilities works automatically.',
						'§b┃ §7Toggle it on or off at any time.',
						'',
						'§8┃ §eClick to toggle!'
					],
					() => {
						skill.ability!.toggle();
						Player.playSound('tick');
						_.if(skill.ability!.state, () => tellraw('@p', Player.send(`Ability §c${skill.ability!.name} §ais now enabled!`, '§a'))).
							else(() => tellraw('@p', Player.send(`Ability §c${skill.ability!.name} §cis now disabled!`, '§c')));
					},
					1,
					["enchantment_glint_override=1"]
				);

				const locked = new Button(
					'charcoal', 12, "§c🔒 Locked",
					[
						'§8┃ §7This ability is not yet unlocked.',
						'',
						'§c§l┃ REQUIREMENTS',
						`§c┃ §7Skill: §f${skill.name}`,
						'§c┃ §7Required Level: §e10',
						'§c┃ §7Current Level: §e' + skill.level,
						'',
						'§6§l┃ UNLOCK REWARDS',
						'§6┃ §7Gain access to this skill\'s',
						'§6┃ §7unique passive ability.',
						'§6┃ §7Continue leveling to strengthen it.',
						'',
						'§8┃ §eReach Level 10 to unlock!'
					],
					() => {
						Player.playSound('error');
						Player.throw(`You need to reach Level 10 in ${skill.name} to unlock this!`);
					}
				);

				_.if(skill.ability.tier['=='](0), () => p.emit(locked))
					.else(() => p.emit(unlocked));
			} else {
				p.emit(new Button(
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
						Player.throw(`Ability for ${skill.name} coming soon!`);
					}
				));
			}
		});


		p.add(() => Navigation.render(g, p, skill));
		return p;
	}
}
