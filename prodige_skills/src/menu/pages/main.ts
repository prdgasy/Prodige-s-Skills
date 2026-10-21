import { Bar } from "@lib/bar";
import { Roman } from "@lib/roman";
import { textWrapper } from "@lib/textWrapper";
import { Button, Gui, GuiMacro as $, PageClass } from "@prodigelib/gui";
import { Shop } from "@src/menu/shop";
import { Reward } from "@src/misc/reward";
import { Skill } from "@src/skill";
import { _, comment, DataPointClass, DataVariable, tellraw, Macro as S, say } from "sandstone";
import { Progress } from "./skill/progress";
import { BetterArray } from "@prodigelib/betterarray";
import { Global } from "@src/global";


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

			for (const skill of Object.values(Skill.skills)) {
				comment(`skill_button::${skill.name}`);

				const s = slot++;
				const r = skill.xp["*"](100)["/"](skill.goal);
				const nLvl = skill.level["+"](1);
				const lvlRoman = Roman.get(skill.level);
				const nextRoman = Roman.get(nLvl);
				const bar = new Bar(r).toData();

				Reward.cases(skill, nLvl, (rewards) => {
					p.emit(new Button(
						skill.item, s, $`§d${skill.name} ${lvlRoman}`, [
						$`§9${skill.name} ${skill.level}`,
						"",
						...textWrapper(skill.description),
						"",
						"§f§lNext Level Goal:",
						$` §8• §7Target: §d${skill.name} ${nextRoman}`,
						$` §8• §7Progress: §e${r}%`,
						$` §8> ${bar} §e${skill.xp}§6/§e${skill.goal}`,
						"",
						$`§f§l${skill.name} ${nextRoman} Rewards:`,
						...rewards.map(r => ` §8+§e ${r.name}`),   // one lore line per reward
						"",
						"§eClick to view!",
					], () => {
						Progress.pageIndex.set(skill.level["/"](18));
						g.switch(Progress.getName(skill));
					},
						1,
						["!attribute_modifiers"],
					));
				});
			}
		};
	}
}