import { GUI } from '@prodigelib/gui';
import { MCFunction, tellraw } from 'sandstone';

import { SkillList } from '../skill/const';
import { initMain } from './main';
import { initProgress } from './skill_page/progress';
import { initShop } from './shop_page';
import { initItem } from './item';
import { initOnEvent } from './skill_page/onEvent';
import { initAchievement } from './skill_page/achievement';
import { initAbility } from './skill_page/ability';

/**
 * Main entry point for the GUI system.
 * Initializes scores, menu, and all pages.
 */
MCFunction('menu', () => {
  tellraw('@p', { text: "§e[Skills/Menu] Loaded" });

  const Menu = new GUI('prodige_skills', 'menu', 100107);

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
    initAbility(Menu, skill);
  });
}, { runOnLoad: true });