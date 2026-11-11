import { Button, Gui, Page, GuiMacro as $ } from "@prodigelib/gui";
import { Skill } from "@src/skill";
import { _, Objective } from "sandstone";
import { Navigation } from "./navigation";
import { Menu } from "@src/menu";

export class Actions {
	public static index = Objective.create('menu.actions.index')('@s');

	public static getName(skill: Skill) {
		return this.name + skill.name;
	}

	public static init(g: Gui, p: Page, skill: Skill) {
		Navigation.addBottomMask(p);
		p.add(() => this.renderActions(p, skill));
		p.add(() => Navigation.render(g, p, skill));
		p.add(() => Menu.sliders(p, Actions.index, Math.max(0, Math.ceil(skill.onEvents.length / 18) - 1)));

		return p;
	}

	private static renderActions(p: Page, skill: Skill) {
		let page = 0;
		let slot = 0;
		let i = 0;
		while (i < skill.onEvents.length) {
			_.if(Actions.index['=='](page), () => {
				while (slot < 18 && i < skill.onEvents.length) {
					const event = skill.onEvents[i++];
					const xpGained = event.totalXp;
					const ptsGained = event.totalPts;
					const contribution = xpGained["*"](100)["/"](skill.totalXp);
					p.emit(new Button(
						event.item, slot++, `§6${event.name} §8| §b${event.xp} Xp §8• §e${event.pts} Pts`,
						[
							"",
							"§f§lStatistics:",
							` §8• §7Skill Action: §b${event.name}`,
							$` §8• §7Times Executed: §a${event.totalExecuted} §7times`,
							$` §8• §7Total Xp Generated: §3${xpGained.show()} Xp`,
							$` §8• §7Total Points Earned: §e${ptsGained} Pts`,
							$` §8• §7Skill Impact: §d${contribution.show()}% §7of all Xp`
						],
					))
				}
				slot = 0;
			});
			page++;
		}
	}
}