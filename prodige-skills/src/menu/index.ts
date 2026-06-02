import { _, MCFunction, say, tellraw } from 'sandstone';
import { GUI } from '@prodigelib/gui';

import { initMainPage } from './pages/main';
import { initProgressPages } from './pages/progress';
import { initOnEventPages } from './pages/onEvent';
import { initTitlePage } from './pages/shop/title';
import { initBoosterPage } from './pages/shop/booster';
import { initPrestigePage } from './pages/prestige';
import { initShopPage } from './pages/shop';
import { initItemPage } from './pages/item';
import { initQuestPages } from './pages/quest';
import { SkillList } from '../skills';
import { initProfilePage } from './pages/profile';
import { initSettingsPage } from './pages/settings';
import { initMilestonesPage } from './pages/milestone';
import { initAbilityPages } from './pages/ability';
import { initDailyTasksPage } from './pages/dailyTasks';

/**
 * Main entry point for the GUI system.
 * Initializes scores, menu, and all pages.
 */
MCFunction('menu', () => {
  tellraw('@p', { text: "[Skills-Menu] Loaded", color: 'yellow' });

  const Menu = new GUI.Init('hayichan', 'cmd', 930005);

  initMainPage(Menu);
  initShopPage(Menu);
  initBoosterPage(Menu);
  initItemPage(Menu);
  initTitlePage(Menu);
  initProfilePage(Menu);
  initSettingsPage(Menu);
  initMilestonesPage(Menu);
  initDailyTasksPage(Menu);

  SkillList.forEach(skill => {
    initPrestigePage(Menu, skill);
    initProgressPages(Menu, skill);
    initOnEventPages(Menu, skill);
    initQuestPages(Menu, skill);
    initAbilityPages(Menu, skill)
  })


}, { runOnLoad: true });


