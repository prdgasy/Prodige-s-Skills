import { Gui, PageClass } from '@prodigelib/gui';
import { Uninstaller } from '@prodigelib/uninstaller';
import { Objective } from 'sandstone';
import { Main } from '@src/menu/main';
import { Shop } from '@src/menu/shop';
import { Skill } from '@src/skill';
import { Progress } from '@src/menu/skill/progress';

const Menu = new Gui('prodige_skills', 'menu');


type NormalPage = {
  getName: () => string;
  init: (g: Gui, page: PageClass) => PageClass;
};

type SubSkillPage = {
  getName: (skill: Skill) => string;
  init: (g: Gui, page: PageClass, skill: Skill) => PageClass;
};

export const pages: (NormalPage | SubSkillPage)[] = [Main, Shop, Progress];


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

Uninstaller.generate(Gui);
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