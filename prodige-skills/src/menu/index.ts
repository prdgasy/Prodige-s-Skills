import { GUI } from '@prodigelib/gui';
import { MCFunction, tellraw } from 'sandstone';

import { SkillList } from '../consts/skills';
import { initMainPage } from './pages/main';
import { initProgressPages } from './pages/progress';
import { shopPage } from './pages/shop';
import { initItemPage } from './pages/item';

/**
 * Main entry point for the GUI system.
 * Initializes scores, menu, and all pages.
 */
MCFunction('menu', () => {
  tellraw('@p', { text: "§e[Skills-Menu] Loaded" });

  const Menu = new GUI('hayichan', 'cmd', 100107);

  initMainPage(Menu);
  shopPage(Menu);
  // initBoosterPage(Menu);
  initItemPage(Menu);
  // initTitlePage(Menu);
  // initProfilePage(Menu);
  // initSettingsPage(Menu);
  // initMilestonesPage(Menu);
  // initDailyTasksPage(Menu);

  SkillList.forEach(skill => {
    initProgressPages(Menu, skill);
    // initOnEventPages(Menu, skill);
    // initQuestPages(Menu, skill);
    // initAbilityPages(Menu, skill);
  })


}, { runOnLoad: true });


