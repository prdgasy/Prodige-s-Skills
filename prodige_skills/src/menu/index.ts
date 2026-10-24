import { Gui, PageClass } from '@prodigelib/gui';
import { Main } from '@src/menu/main';
import { Shop } from '@src/menu/shop';
import { Boosters } from '@src/menu/shop/booster';
import { Crates } from '@src/menu/shop/crates';
import { Items } from '@src/menu/shop/items';
import { Titles } from '@src/menu/shop/titles';
import { Progress } from '@src/menu/skill/progress';
import { Skill } from '@src/skill';
import { SkillPage, SubSkillPage } from '@src/types';
import { Actions } from '@src/menu/skill/actions';
import { Achievements } from '@src/menu/skill/achievements';
import { StatsAbility } from '@src/menu/skill/statsability';
export class Menu {
	public static init() {
		const Menu = new Gui('§d§lProdige Skills', 'menu', true);

		const pages: (SkillPage | SubSkillPage)[] = [
			Main, Progress, Actions, Achievements, StatsAbility, Shop, Crates, Items, Boosters, Titles
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
}