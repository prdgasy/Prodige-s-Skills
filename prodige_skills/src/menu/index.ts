import { Button, Gui, PageClass } from '@prodigelib/gui';
import { Main } from '@src/menu/main';
import { Shop } from '@src/menu/shop';
import { Boosters } from '@src/menu/shop/booster';
import { Crates } from '@src/menu/shop/crates';
import { Items } from '@src/menu/shop/items';
import { Titles } from '@src/menu/shop/titles';
import { Progress } from '@src/menu/skill/progress';
import { Skill } from '@src/skill';
import { Item, SkillPage, SubSkillPage } from '@src/types';
import { Actions } from '@src/menu/skill/actions';
import { Achievements } from '@src/menu/skill/achievements';
import { Abilities } from '@src/menu/skill/abilities';
import { Preferences } from './pages/preferences';
import { Tasks } from './pages/tasks';
import { targetParser } from 'sandstone/variables';

export class Menu {
	public static init() {
		const Menu = new Gui('§d§lProdige Skills', 'menu', true);

		const pages: (SkillPage | SubSkillPage)[] = [
			Main, Progress, Actions, Achievements, Abilities, Shop, Crates, Items, Boosters, Titles, Preferences, Tasks
		];


		for (const p of pages) {
			if (p.getName.length > 0) {
				for (const skill of Object.values(Skill.skills)) {
					const name = p.getName(skill);
					const toRegister = p.init(Menu, Menu.createPage(name), skill);

					Menu.registerPage(toRegister);
				}
			} else {
				const normalP = p as SkillPage;
				const name = normalP.getName();
				const toRegister = normalP.init(Menu, Menu.createPage(name));

				Menu.registerPage(toRegister);
			}
		}
	}

	public static mask(p: PageClass, layer1: Item, layer2: Item): Button[];
	public static mask(p: PageClass, item: Item): Button[];
	public static mask(p: PageClass, itemOrLayer1: Item, layer2?: Item): Button[] {
		const btns: Button[] = [];
		if (layer2) {
			for (let i = 0; i < 9; i++) {
				btns.push(new Button(itemOrLayer1, i, ''));
			}
			for (let i = 9; i < 18; i++) {
				btns.push(new Button(layer2, i, ''));
			}
			for (let i = 18; i < 27; i++) {
				btns.push(new Button(itemOrLayer1, i, ''));
			}
		} else {
			for (let i = 0; i < 27; i++) {
				btns.push(new Button(itemOrLayer1, i, ''));
			}
		}
		p.add(...btns);
		return btns;
	}

	public static back(g: Gui, target: { getName: () => string }) {
		return new Button(
			'arrow', 18, '§cBack', [],
			() => g.switch(target.getName())
		);
	}


}