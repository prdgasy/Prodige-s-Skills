import { Button, Gui, PageClass, GuiMacro as G } from '@prodigelib/gui';
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
import { RewardVault } from './pages/rewards';
import { ConditionClass, targetParser } from 'sandstone/variables';
import { Score, DataVariable, _ } from 'sandstone';

export class Menu {
	public static init() {
		const Menu = new Gui('§d§lProdige Skills', 'menu', true);

		const pages: (SkillPage | SubSkillPage)[] = [
			Main, Progress, Actions, Achievements, Abilities, Shop, Crates, Items, Boosters, Titles, Preferences, Tasks, RewardVault
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



	public static back(g: Gui, target: { getName: () => string }, callback?: () => void) {
		return new Button(
			'arrow', 18, '§cBack', [],
			() => {
				g.switch(target.getName());
				callback?.();
			}
		);
	}

	public static sliders(p: PageClass, slider: Score, max: number | Score) {
		const bottom = slider['=='](0);
		const top = slider['=='](max);

		const createButton = (
			condition: ConditionClass,
			slot: number,
			name: string,
			action: () => void
		) => {
			const icon = DataVariable('arrow');
			const label = DataVariable('§e' + name);

			_.if(condition, () => {
				icon.set('tipped_arrow');
				label.set('§7' + name);
			});

			p.emit(new Button(
				G(icon), slot, G(label), [],
				() => _.if(_.not(condition), action)
			));
		};

		createButton(bottom, 25, 'Previous', () => slider['--']);
		createButton(top, 26, 'Next', () => slider['++']);
	}
}