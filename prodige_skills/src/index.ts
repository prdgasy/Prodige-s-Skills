import { Uninstaller } from '@prodigelib/uninstaller';
import { Loader } from '@src/data/loader';
import { Global } from '@src/global';
import { Menu } from '@src/menu';
import { Player } from '@src/player';

Loader.init();
Player.init();
Menu.init();

Global.generateCleanFn();

Uninstaller.generate(Global);