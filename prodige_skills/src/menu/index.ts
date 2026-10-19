import { Gui, PageClass } from '@prodigelib/gui';
import { Main } from '@src/menu/main';
import { Shop } from '@src/menu/shop';
import { Boosters } from '@src/menu/shop/booster';
import { Crates } from '@src/menu/shop/crates';
import { Items } from '@src/menu/shop/items';
import { Titles } from '@src/menu/shop/titles';
import { Progress } from '@src/menu/skill/progress';
import { Skill } from '@src/skill';


export function initMenu() {
	const Menu = new Gui('prodige_skills', 'menu', '§e§l', true);

	type NormalPage = {
		getName: () => string;
		init: (g: Gui, page: PageClass) => PageClass;
	};

	type SubSkillPage = {
		getName: (skill: Skill) => string;
		init: (g: Gui, page: PageClass, skill: Skill) => PageClass;
	};

	const pages: (NormalPage | SubSkillPage)[] = [
		Main, Progress, Shop, Crates, Items, Boosters, Titles
	];


	for (const p of pages) {
		if (p.getName.length > 0) {
			for (const skill of Skill.list) {
				const name = p.getName(skill);
				const toRegister = p.init(Menu, Menu.createPage(name), skill);

				Menu.registerPage(toRegister);
			}
		} else {
			const normalP = p as NormalPage;
			const name = normalP.getName();
			const toRegister = normalP.init(Menu, Menu.createPage(name));

			Menu.registerPage(toRegister);
		}
	}
}



// reg(Shop);
// MCFunction('menu', () => {

//   initMain(Menu);
//   initShop(Menu);
//   // initBooster(Menu);
//   initItem(Menu);
//   // initTitle(Menu);
//   // initProfile(Menu);
//   // initSettings(Menu);
//   // initMilestones(Menu);
//   // initDailyTasks(Menu);

//   SkillList.forEach(skill => {
//     initProgress(Menu, skill);
//     initOnEvent(Menu, skill);
//     initAchievement(Menu, skill);
//     initAbility(Menu, skill);
//   });
// }, { runOnLoad: true });