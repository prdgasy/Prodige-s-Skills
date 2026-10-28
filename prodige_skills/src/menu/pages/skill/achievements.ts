import { Bar } from "@lib/bar";
import { Float } from "@prodigelib/floatVar";
import { Button, Gui, PageClass, GuiMacro as $ } from "@prodigelib/gui";
import { Reward } from "@src/misc/reward";
import { Skill } from "@src/skill";
import { _, say } from "sandstone";
import { Navigation } from "./navigation";
import { Text } from "@lib/text";
import { Player } from "@src/player";
import { Achievement } from "@src/skill/achievement";

export class Achievements {
	public static getName(skill: Skill) {
		return this.name + skill.name;
	}

	public static init(g: Gui, p: PageClass, skill: Skill) {
		p.add(() => {
			skill.achievements.forEach((a, i) => {
				const progress = Float.variable(a.progress)['*='](100)['/='](a.goal);
				const bar = new Bar(progress.toScore()).toData();
				const current = new Button(
					a.item, i, '§e' + a.name,
					[
						...Text.wrap(a.description),
						``,
						$`§f§lProgress: §e${progress.show()}%`,
						$`§8 > ${bar} §e${a.progress}§6/§e${a.goal}`,
						``,
						`§f§lRewards:`,
						...Reward.join(a.rewards),
						``,
						`§e• IN PROGRESS`
					], () => { Player.playSound('tick'); Player.send('This achievement is still in progress.'); }, 1, ['!attribute_modifiers', 'enchantment_glint_override=1']
				);

				const done = new Button(
					a.item, i, `§d${a.name}`,
					[
						...Text.wrap(a.description),
						``,
						$`§f§lRequirement:`,
						$` §8• §7Target: §a${a.goal} §8(Done)`,
						``,
						`§f§lRewards:`,
						...Reward.join(a.rewards),
						``,
						`§a✔ COMPLETED`
					], () => {
						Player.throw("This achievement's rewards has already been claimed!");
					}, 1, ['!attribute_modifiers']
				);

				const toClaim = new Button(
					a.item, i, `§a${a.name} §8• §a§lCLAIM`,
					[
						...Text.wrap(a.description),
						``,
						$`§f§lRequirement:`,
						$` §8• §7Target: §a${a.goal} §8(Done)`,
						``,
						`§f§lRewards:`,
						...Reward.join(a.rewards),
						``,
						`§eClick to claim!`
					], () => {
						a.claim();
					}, 1, ['!attribute_modifiers']
				)

				const locked = new Button(
					'crying_obsidian', i, `§8Locked Step #${i + 1}`,
					[
						``,
						`§7You haven't reached this`,
						`§7achievement step yet!`,
						``,
						`§c🔒 LOCKED`
					], () => { }
				);

				_.if(skill.achievement[">"](i), () => {
					_.if(a.claimed, () => p.emit(done))
						.else(() => p.emit(toClaim));
				})
					.elseIf(skill.achievement["=="](i), () => p.emit(current))
					.else(() => p.emit(locked));
			});
		});

		p.add(() => Navigation.render(g, p, skill));
		return p;

	}
}