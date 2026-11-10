import { Uninstaller } from '@prodigelib/uninstaller';
import { Loader } from '@src/data/loader';
import { Global } from '@src/global';
import { Menu } from '@src/menu';
import { Player } from '@src/player';
import { Skill } from '@src/skill';
import { Task } from './misc/task';
import { Booster } from './misc/booster';
import { Action } from './skill/action';
import { Crate } from './misc/crate';
import { Achievement } from './skill/achievement';
import { Title } from './skill/title';

Loader.init();
Player.init(() => {
	for (const skill of Object.values(Skill.skills)) skill.firstJoin();
	Task.firstJoin();
	Skill.levelUpNotifState.add();
	for (const type of ['Xp', 'Pts'] as const) {
		Booster.getMult(type).set(1);
		Booster.getTimer(type).set(0);
	}
});
Action.init();
Task.init();
Menu.init();
Booster.init();
Crate.init();
Achievement.init();
Title.init();

Global.generateCleanFn();

Uninstaller.generate(Global);