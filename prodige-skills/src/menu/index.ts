import { GUI } from '@prodigelib/gui';
import { MCFunction, tellraw } from 'sandstone';

import { SkillList } from '../consts/skills';
import { initMain } from './pages/main';
import { initProgress } from './pages/skill/progress';
import { initShop } from './pages/shop';
import { initItem } from './pages/item';
import { initOnEvent } from './pages/skill/onEvent';
import { initAchievement } from './pages/skill/achievement';

/**
 * Main entry point for the GUI system.
 * Initializes scores, menu, and all pages.
 */
MCFunction('menu', () => {
  tellraw('@p', { text: "§e[Skills-Menu] Loaded" });

  const Menu = new GUI('hayichan', 'cmd', 100107);

  initMain(Menu);
  initShop(Menu);
  // initBooster(Menu);
  initItem(Menu);
  // initTitle(Menu);
  // initProfile(Menu);
  // initSettings(Menu);
  // initMilestones(Menu);
  // initDailyTasks(Menu);

  SkillList.forEach(skill => {
    initProgress(Menu, skill);
    initOnEvent(Menu, skill);
    initAchievement(Menu, skill);
    // initAbility(Menu, skill);
  })


}, { runOnLoad: true });


