import { Text } from "@lib/text";
import { Button, Gui, GuiMacro as $, PageClass } from "@prodigelib/gui";
import { Player } from "@src/player";
import { Skill } from "@src/skill";
import { Item } from "@src/types";
import { _, DataVariable } from "sandstone";
import { EntityLabel } from "sandstone/variables";
import { Menu } from "..";
import { Main } from "./main";

type Switch = {
	name: string,
	description: string,
	item: Item,
	label: EntityLabel,
}

export class Preferences {
	public static getName() {
		return this.name;
	}

	public static init(g: Gui, p: PageClass) {
		const switches: Switch[] = [
			{
				name: 'Sound Effects',
				description: 'Enable or disable global Sound for Prodige Skill.',
				item: 'note_block',
				label: Player.sound
			},
			{
				name: 'Action Notifications',
				description: 'Show a progression bar when you complete a skill actions.',
				item: 'book',
				label: Player.onEventNotif
			},
			{
				name: 'Achievement Notifications',
				description: 'Show notifications when you unlock achievements.',
				item: 'diamond',
				label: Player.achievementNotif
			},
			{
				name: 'Level-up Notifications',
				description: 'Show a notification when you gain a skill level.',
				item: 'experience_bottle',
				label: Skill.levelUpNotifState
			},
			{
				name: 'Tasks',
				description: 'Track and randomly assign a task.',
				item: 'wheat',
				label: Player.taskProgress
			}
		];

		p.add(() => {
			let slot = 11;
			for (const preference of switches) {
				const status = DataVariable('§a§l[ON]');
				_.if(_.not(preference.label), () => status.set('§c§l[OFF]'));

				p.emit(new Button(
					preference.item,
					slot++,
					`§b${preference.name}`,
					[

						...Text.wrap(`§7${preference.description}`),
						'',
						$`§fStatus §8• ${status}`,
						'',
						'§eClick to toggle!'
					],
					() => {
						preference.label.toggle();
						Player.playSound('tick');
					}
				));
			}
		});
		p.add(Menu.back(g, Main));
		return p;
	}
}