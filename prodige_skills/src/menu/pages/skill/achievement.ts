import { Button, GUI, Page, MacroArg as $ } from "@prodigelib/gui";
import { _, Variable, DataPointClass } from "sandstone";

import { goBack, PageNames, Mask } from "../const";

import { Skill } from "../../skill";
import { navbar } from "./navigation";
import { ProgressBar } from "../../../lib/progressBar";
import { RewardClass } from "../../object/reward";

export function initAchievement(menu: GUI, skill: Skill) {
	const page = Page(
		menu,
		PageNames.achievement(skill.name)
	);

	navbar(menu, skill, PageNames.achievement(skill.name), page);

	page.pushObject(() => {
		for (let slot = 0; slot < skill.achievements.length; slot++) {

			const achievement = skill.achievements[slot];
			const ratio = achievement.progress["*"](100)["/"](achievement.target);

			const current = Button({
				id: achievement.itemId,
				slot,
				name: $`§e${achievement.name}`,
				lore: [
					...achievement.description.map(line => `§7${line}`),
					`§7`,
					$`§f§lProgress §e${ratio}%`,
					$`§8 > ${ProgressBar(ratio)} §e${achievement.progress}§6/§e${achievement.target}`,
					`§7`,
					`§f§lRewards`,
					...RewardClass.join(achievement.reward),
					`§7`,
					`§e• IN PROGRESS`
				],
				components: ['!attribute_modifiers', 'enchantment_glint_override=1']
			});

			// 🟢 Bouton : Succès déjà accompli (COMPLETED)
			const done = Button({
				id: achievement.itemId,
				slot,
				name: $`§a${achievement.name}`,
				lore: [
					...achievement.description.map(line => `§7${line}`),
					`§7`,
					$`§f§lRequirement:`,
					$` §8• §7Target: §a${achievement.target} §8(Done)`,
					`§7`,
					`§f§lRewards:`,
					...RewardClass.join(achievement.reward),
					`§7`,
					`§a✔ COMPLETED`
				],
				components: ['!attribute_modifiers']
			});

			// 🔴 Bouton : Succès verrouillé (LOCKED)
			const locked = Button({
				id: "crying_obsidian",
				slot,
				name: $`§8Locked Step #${slot + 1}`,
				lore: [
					`§7`,
					`§7You haven't reached this`,
					`§7achievement step yet!`,
					`§7`,
					`§c🔒 LOCKED`
				],
				components: ['!attribute_modifiers']
			});

			_.if(skill.currentAchievement[">"](slot), () => page.rawEmit(done))
				.elseIf(skill.currentAchievement["=="](slot), () => page.rawEmit(current))
				.else(() => page.rawEmit(locked));
		}
	});

	page.build();
}