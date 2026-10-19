import '@src/data/load';
import { initMenu } from '@src/menu';
import '@src/player';
import '@src/skill';

import { Uninstaller } from '@prodigelib/uninstaller';
import { Global } from '@src/global';

initMenu();
Uninstaller.generate(Global);