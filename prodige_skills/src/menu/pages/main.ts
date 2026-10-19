import { Bar } from "@lib/bar";
import { RomanNumbers } from "@lib/romanNumbers";
import { textWrapper } from "@lib/textWrapper";
import { GuiMacro as $, Button, Gui, PageClass } from "@prodigelib/gui";
import { Shop } from "@src/menu/shop";
import { Progress } from "@src/menu/skill/progress";
import { Reward } from "@src/misc/reward";
import { Skill } from "@src/skill";
import { comment, tellraw } from "sandstone";


export class Main {
	static getName() {
		return this.name;
	}

	static init(g: Gui, p: PageClass) {
		const shop = new Button("emerald", 21, "§aShop", [], () => g.switch(Shop.getName()));
		const profile = new Button("player_head", 4, "§bProfile", [], () => { tellraw('@p', '§cNot implemented yet.') });
		const dailyTask = new Button("wheat", 23, "§cDaily Tasks", [], () => { tellraw('@p', '§cNot implemented yet.') });

		p.add(shop, profile, dailyTask, this.skillBts(g, p));

		return p;
	}

	private static skillBts(g: Gui, p: PageClass) {
		return () => {
			let slot = 10;

			for (const skill of Skill.list) {
				comment(`skill_button::${skill.name}`)

				const r = skill.xp["*"](100)["/"](skill.goal);
				const nLvl = skill.level["+"](1);

				const emitBtn = (rewards: string[]) => p.add(new Button(
					skill.item, slot++, $`§d${skill.name} ${RomanNumbers.convert(skill.level)}`, [
					$`§9${skill.name} ${skill.level}`,
					"",
					...textWrapper(skill.description),
					"",
					"§f§lNext Level Goal:",
					$` §8• §7Target: §d${skill.name} ${RomanNumbers.convert(nLvl)}`,
					$` §8• §7Progress: §e${r}%`,
					$` §8> ${new Bar(r).get()} §e${skill.xp}§6/§e${skill.goal}`,
					"",
					$`§f§l${skill.name} ${RomanNumbers.convert(nLvl)} Rewards:`,
					...rewards,
					"",
					"§eClick to view!",
				], () => {
					Progress.pageIndex.set(skill.level["/"](18));
					g.switch(Progress.getName(skill));
				},
					1,
					["!attribute_modifiers"],
				));

				Reward.resolve(skill, skill.level, emitBtn);
			}
		}
	}
}