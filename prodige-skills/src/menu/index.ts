import { GUI } from '@prodigelib/gui';
import { MCFunction, tellraw } from 'sandstone';

import { SkillList } from '../skills';
import { initMainPage } from './pages/main';
import { initProgressPages } from './pages/progress';

/**
 * Main entry point for the GUI system.
 * Initializes scores, menu, and all pages.
 */
MCFunction('menu', () => {
  tellraw('@p', { text: "[Skills-Menu] Loaded", color: 'yellow' });

  const Menu = new GUI('hayichan', 'cmd', 930005);

  initMainPage(Menu);
  // initShopPage(Menu);
  // initBoosterPage(Menu);
  // initItemPage(Menu);
  // initTitlePage(Menu);
  // initProfilePage(Menu);
  // initSettingsPage(Menu);
  // initMilestonesPage(Menu);
  // initDailyTasksPage(Menu);

  SkillList.forEach(skill => {
    // initPrestigePage(Menu, skill);
    initProgressPages(Menu, skill);
    // initOnEventPages(Menu, skill);
    // initQuestPages(Menu, skill);
    // initAbilityPages(Menu, skill);
  })


}, { runOnLoad: true });


