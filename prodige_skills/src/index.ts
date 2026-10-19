import { initMenu } from '@src/menu';
import '@src/player';
import '@src/skill';
import '@src/skill/importCsv';

import { Uninstaller } from '@prodigelib/uninstaller';
import { Global } from '@src/global';

initMenu();
Uninstaller.generate(Global);