import { GUI, Page, Button } from "@prodigelib/gui";
import { goBack, PageNames } from "../const";
import { Errors } from "../../errors";

export function initProfilePage(Menu: GUI) {
  // --- Info Buttons ---
  const statsBtn = Button({
    id: 'gold_block',
    slot: 10,
    name: { text: 'Your Statistics', color: 'gold' },
    lore: [
      { text: 'Total Power: ', color: 'gray' }, { text: '1,240', color: 'yellow' },
      { text: '' },
      { text: 'Global Rank: ', color: 'gray' }, { text: '#142', color: 'aqua' }
    ]
  });

  const activeBoostersBtn = Button({
    id: 'clock',
    slot: 12,
    name: { text: 'Active Boosters', color: 'light_purple' },
    lore: [{ text: 'No active multipliers.', color: 'gray' }]
  });

  const favoriteSkillBtn = Button({
    id: 'nether_star',
    slot: 14,
    name: { text: 'Most Played Skill', color: 'aqua' },
    lore: [{ text: 'Mining (Level 42)', color: 'gray' }]
  });

  // --- Utility Buttons ---
  const settingsBtn = Button({
    id: 'comparator',
    slot: 2,
    name: { text: 'Settings', color: 'red' },
    lore: [{ text: 'Toggle particles and sounds', color: 'gray' }],
    onClick: () => Menu.toPage(PageNames.settings)
  });

  const leaderboardBtn = Button({
    id: 'writable_book',
    slot: 16,
    name: { text: 'Leaderboards', color: 'yellow' },
    onClick: () => Errors.functionNotImplemented()
  });

  const page = Page(
    Menu,
    PageNames.profile,
    [
      goBack(Menu, PageNames.main),
      statsBtn,
      activeBoostersBtn,
      favoriteSkillBtn,
      leaderboardBtn,
      settingsBtn
    ]
  );

  page.build();
}