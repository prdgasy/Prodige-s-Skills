import { _, MCFunction, say, tellraw } from 'sandstone';
import { GUI } from '@prodigelib/gui';

import { initMainPage } from './pages/main';
import { initProgressPage } from './pages/progress';
import { initOnEventPages } from './pages/onEvent';
import { initTitlePage } from './pages/title';
import { initBoosterPage } from './pages/booster';
import { initPrestigePage } from './pages/prestige';
import { initShopPage } from './pages/shop';
import { initItemPage } from './pages/item';
/**
 * Main entry point for the GUI system.
 * Initializes scores, menu, and all pages.
 */
MCFunction('menu', () => {
  tellraw('@p', { text: "[Skills-Menu] Loaded", color: 'yellow' });

  const Menu = new GUI.Init('hayichan', 'cmd');

  initMainPage(Menu);
  initProgressPage(Menu);
  initOnEventPages(Menu);
  initPrestigePage(Menu);
  initShopPage(Menu);
  initBoosterPage(Menu);
  initItemPage(Menu);
  initTitlePage(Menu);

}, { runOnLoad: true });


