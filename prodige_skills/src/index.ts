import { Uninstaller } from '@prodigelib/uninstaller';
import { Loader } from '@src/data/loader';
import { Global } from '@src/global';
import { Menu } from '@src/menu';
import { Player } from '@src/player';
import { Task } from './misc/task';
import { Booster } from './misc/booster';
import { Action } from './skill/action';
import { Crate } from './misc/crate';

Loader.init();
Player.init();
Action.init();
Task.init();
Menu.init();
Booster.init();
Crate.init();

Global.generateCleanFn();

Uninstaller.generate(Global);