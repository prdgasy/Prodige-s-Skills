import { Bar } from "@lib/bar";
import { Roman } from "@lib/roman";
import { Text } from "@lib/text";
import { Button, Gui, GuiMacro as $, PageClass } from "@prodigelib/gui";
import { Shop } from "@src/menu/shop";
import { Reward } from "@src/misc/reward";
import { Skill } from "@src/skill";
import { comment, tellraw } from "sandstone";
import { Progress } from "@src/menu/skill/progress";
import { Preferences } from "@src/menu/preferences";
import { Tasks } from "./tasks";
import { Player } from "@src/player";


export class Main {
	static getName() {
		return this.name;
	}

	static init(g: Gui, p: PageClass) {
		const shop = new Button("emerald", 21, "§aShop", [], () => g.switch(Shop.getName()));
		const preferences = new Button("comparator", 4, "§bPreferences", [], () => g.switch(Preferences.getName()));
		const tasks = new Button("wheat", 23, "§6Tasks", [], () => {
			g.switch(Tasks.getName());
			Player.playSound('block.chest.open', 0);
		});
		const activeBoosters = new Button("experience_bottle", 26, "§bActive Boosters");

		p.add(shop, preferences, tasks, this.skillBts(g, p));

		return p;
	}

	private static skillBts(g: Gui, p: PageClass) {
		return () => {
			let slot = 10;

			for (const skill of Object.values(Skill.skills)) {
				comment(`skill_button::${skill.name}`);

				const s = slot++;
				const progress = skill.xp["*"](100)["/"](skill.goal);
				const nLvl = skill.level["+"](1);
				const lvlRoman = Roman.get(skill.level);
				const nextRoman = Roman.get(nLvl);
				const bar = new Bar(progress.toScore()).toData();

				Reward.cases(skill, nLvl, rewards => {
					p.emit(new Button(
						skill.item, s, $`§d${skill.name} ${lvlRoman}`, [
						$`§9${skill.name} ${skill.level}`,
						"",
						...Text.wrap(skill.description),
						"",
						"§f§lNext Level Goal:",
						$` §8• §7Target: §d${skill.name} ${nextRoman}`,
						$` §8• §7Progress: §e${progress.show()}%`,
						$` §8> ${bar} §e${skill.xp.show()}§6/§e${skill.goal}`,
						"",
						$`§f§l${skill.name} ${nextRoman} Rewards:`,
						...rewards.map(r => ` §8+§e ${r.name}`),
						"",
						"§eClick to view!",
					], () => {
						Progress.index.set(skill.level["/"](18));
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