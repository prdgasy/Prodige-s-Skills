import { Uninstaller } from '@prodigelib/uninstaller';
import { Loader } from '@src/data/loader';
import { Global } from '@src/global';
import { Menu } from '@src/menu';
import { Player } from '@src/player';
import { Task } from './misc/task';

Loader.init();
Player.init();
Menu.init();
Task.init();

Global.generateCleanFn();

Uninstaller.generate(Global);