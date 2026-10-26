import { Button, Gui, PageClass, GuiMacro as $ } from "@prodigelib/gui";
import { Skill } from "@src/skill";
import { Action } from "@src/skill/action";
import { _, Objective } from "sandstone";
import { Navigation } from "./navigation";

export class Actions {
	public static index = Objective.create('menu.actions.index')('@s');

	public static getName(skill: Skill) {
		return this.name + skill.name;
	}

	public static init(g: Gui, p: PageClass, skill: Skill) {
		p.add(() => {
			let page = 0;
			let slot = 0;
			let i = 0;
			while (i < skill.onEvents.length) {
				_.if(Actions.index['=='](page), () => {
					while (slot < 17 && i < skill.onEvents.length) {
						const event = skill.onEvents[i++];
						const xpGained = event.totalExecuted["*"](event.xp); // may be wrong because of boosters
						const ptsGained = event.totalExecuted["*"](event.pts);
						const contribution = xpGained["*"](100)["/"](6); // set total xp;
						p.emit(new Button(
							event.item, slot++, `${event.name}`,
							[
								"",
								"§f§lStatistics",
								$` §8• §7Skill Action: §b${event.name}`,
								$` §8• §7Times Executed: §a${event.totalExecuted} §7times`,
								$` §8• §7Total Xp Generated: §3${xpGained} Xp`,
								$` §8• §7Total Points Earned: §e${ptsGained} Pts`,
								$` §8• §7Skill Impact: §d${contribution}% §7of all Xp`
							],
						))
					}
					slot = 0;
				});
				page++;
			}
		});

		p.add(() => Navigation.render(g, p, skill))
		p.add(() => Navigation.generateSliders(p, Actions.index, Math.floor(skill.onEvents.length / 18)));

		return p;
	}
}

// /**
//  * Creates paginated onEvent pages for a skill
//  */
// export function initOnEvent(Menu: GUI, skill: Skill) {
// 	const paginatedOnEvent = PaginatedPage({
// 		parent: Menu,
// 		name: PageNames.onEvent(skill.name),
// 		staticObjectList: [...Mask.gray()]
// 	});

// 	for (const event of skill.onEvents) {
// 		// Calculs statistiques identiques à la Favorite Action
// 		const totalXpGained = event.totalExecuted["*"](event.xp);
// 		const totalPtsGained = event.totalExecuted["*"](event.pts);
// 		const contributionPercentage = totalXpGained["*"](100)["/"](skill.totalXp);

// 		paginatedOnEvent.objects.push(PaginatedButton({
// 			id: event.itemId,
// 			name: $`§e${event.name} §8• §3${event.xp} Xp §7| §e${event.pts} Pts`,
// 			lore: [
// 				"",
// 				"§f§lStatistics",
// 				$` §8• §7Skill Action: §b${event.name}`,
// 				$` §8• §7Times Executed: §a${event.totalExecuted} §7times`,
// 				$` §8• §7Total Xp Generated: §3${totalXpGained} Xp`,
// 				$` §8• §7Total Points Earned: §e${totalPtsGained} Pts`,
// 				$` §8• §7Skill Impact: §d${contributionPercentage}% §7of all Xp`
// 			],
// 			components: ['!attribute_modifiers']
// 		}));
// 	}

// 	navbar(Menu, skill, PageNames.onEvent(skill.name), paginatedOnEvent);

// 	paginatedOnEvent.build();
// }