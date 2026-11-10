import { Text } from "@lib/text";
import { Button, Gui, GuiMacro as $, PageClass } from "@prodigelib/gui";
import { Menu } from "@src/menu";
import { Skill } from "@src/skill";
import { Title } from "@src/skill/title";
import { _, DataVariable, Label, Objective, Score, Variable } from "sandstone";
import { EntityLabel } from "sandstone/variables";
import { Shop } from ".";
import { Item } from "@src/types";
import { Player } from "@src/player";

const FILTER_ICONS: Item[] = ['chest', 'ender_chest', 'barrel'];
const FILTER_NAMES = ['All Titles', 'Owned Titles', 'Locked Titles'];

export class Titles {
	public static index = Objective.create('menu.shop.titles.index')('@s');
	private static filter = Objective.create('title.filter')('@p');

	public static getName() {
		return this.name;
	}

	public static init(g: Gui, p: PageClass) {
		const titles = Object.values(Skill.skills).flatMap(skill => skill.titles);

		p.add(() => {
			_.switch(this.filter, _
				.case(0, this.setFilter(p, FILTER_ICONS[0]))
				.case(1, this.setFilter(p, FILTER_ICONS[1]))
				.case(2, this.setFilter(p, FILTER_ICONS[2]))
			);

			const toRender = Variable(0);
			const slot = Variable(0);

			for (const [i, title] of titles.entries()) {
				const render = () => {
					_.if(this.index['=='](Math.floor(i / 18)), () => {
						this.renderTitle(p, title, slot);
						slot['++']['%='](18);
					});
					toRender['++'];
				}

				_.switch(this.filter, _
					.case(0, render)
					.case(1, () => _.if(title.owned, render))
					.case(2, () => _.if(_.not(title.owned), render))
				)
			}

			_.if(toRender['=='](0), () => {
				p.emit(new Button('barrier', 13, '§cNo Titles Here', [
					'',
					...Text.wrap('There are no titles matching this filter on this page.', '§7'),
				], () => { }));
			})
				.else(() => Menu.sliders(p, this.index, toRender['/'](18)));
		});

		p.add(new Button(
			"emerald",
			22,
			"§a⚒ Items & Gear",
			[
				'',
				'§e§l┃ Gear for Your Journey',
				...Text.wrap('Browse equipment made to support your skill progression.', '§e┃ §7'),
				'',
				'§a§l┃ What You Can Find',
				'§a┃ §7Tools and weapons',
				'§a┃ §7Special item effects',
				'§a┃ §7Equipment details and prices',
			]
		));

		p.add(Shop.balance(), Menu.back(g, Shop));
		return p;
	}

	private static setFilter(p: PageClass, icon: string) {
		return () => {
			const s: string[] = [];

			for (let i = 0; i < 3; i++) {
				const color = FILTER_ICONS[i] === icon ? '§a' : '§7';
				s.push(color + FILTER_NAMES[i]);
			}

			this.filterBtn(p, s.join(' §8• '), icon);
		}
	}

	private static filterBtn(p: PageClass, name: string, icon: string) {
		return p.emit(
			new Button(icon as Item, 23, name, [],
				() => {
					this.filter['++']['%='](3);
					this.index.set(0);
					Player.playSound('block.lever.click');
				}
			));
	}

	private static renderTitle(p: PageClass, title: Title, slot: Score) {
		const isOwned = DataVariable('§cNOT OWNED');
		const equipped = DataVariable('');
		_.if(title.owned, () => {
			isOwned.set('§a§lOWNED');
			equipped.set(' §8• §a§lEQUIP');
		});
		_.if(title.equipped, () => equipped.set(' §8• §b§lUNEQUIP'));

		const requirement = title.obtain === 'level'
			? `Unlock at §d${title.skill.name} §7level: §d${title.requires}`
			: `Price: §6${title.price} Pts`;
		const action = DataVariable('§eClick to purchase this title!');
		_.if(title.owned, () => action.set('§eClick to equip or unequip this title!'));

		p.emit(new Button(
			title.icon,
			$(slot),
			$`${title.name}${equipped}`,
			[
				$`§8• ${isOwned}`,
				'',
				'§d§l┃ Title',
				...Text.wrap(title.description, '§d┃ §7'),
				$`§d┃ §7${requirement}`,
				'',
				$`${action}`,
			],
			() => title.purchaseOrToggle()
		));
	}
}
