import { Gui, PageClass, GuiMacro as $, Button } from "@prodigelib/gui";
import { Skill } from "@src/skill";
import { Navigation } from "./navigation";
import { Roman } from "@lib/roman";
import { _, DataVariable, Variable } from "sandstone";
import { Player } from "@src/player";
import { Text } from "@lib/text";

export class StatsAbility {
	public static getName(skill: Skill) {
		return this.name + skill.name;
	}

	public static init(g: Gui, p: PageClass, skill: Skill) {
		p.add(() => {
			const totalGain = new Button(
				'gold_ingot', 10, '§6§lTotal Earnings',
				[
					`Cumulative experience and points earned since you started training ${skill.name}.`,
					'',
					"§f§lProgression Summary",
					$` §8• §7Total Xp: §3${skill.totalXp} Xp`,
					$` §8• §7Total Points: §e${skill.totalPts} pts`,
					"",
					"§8All resources earned across all activities."
				]
			)

			const info = new Button(
				"knowledge_book", 15, "§a§lAbility Guide",
				[
					"Abilities are powerful passive traits that enhance your skill performance continuously.",
					"",
					"§f§lProgression Rules",
					" §8• §7Unlocks at §eSkill Level 10§7.",
					" §8• §7Upgrades every §b10 levels §7(§cTier I §7➡ §cTier X§7).",
					"",
					"§8No cooldown, or activation key required."
				]
			);

			p.emit(totalGain);
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
					'nether_star', 13, `§d§l${skill.ability.name} ${roman}`,
					[
						...description,
						'',
						"§f§lTier progression",
						$` §8• §7Next Tier: §4§l${skill.ability.name} ${Roman.get(next)}`,
						'§7Add more info later..',
						'',
						"§eClick to toggle!"
					], () => { skill.ability!.toggle(); }, 1, ["enchantment_glint_override=1"]
				);

				const locked = new Button(
					'charcoal', 13, "§7§oLocked",
					[
						"",
						...description,
						"",
						"§8You cannot toggle this yet!"
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
					'anvil', 13, '§c§oComming soon!', [], () => {
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
