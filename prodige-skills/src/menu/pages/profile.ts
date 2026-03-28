import { GUI } from "@prodigelib/gui";
import { goBack, PageNames } from "../const";
import { Errors } from "../../errors";

export function initProfilePage(Menu: GUI.Init) {
  // --- Buttons Definitions ---
  const activeBoostersBtn: GUI.Button = {
    id: 'clock',
    slot: 10,
    name: { text: 'Active Boosters', color: 'light_purple' },
    lore: [{ text: 'No active boosters', color: 'gray' }]
  };

  const globalStatsBtn: GUI.Button = {
    id: 'gold_block',
    slot: 12,
    name: { text: 'Global Statistics', color: 'gold' },
    lore: [{ text: 'Loading stats...', color: 'gray' }]
  };

  const favoriteSkillBtn: GUI.Button = {
    id: 'nether_star',
    slot: 14,
    name: { text: 'Favorite Skill', color: 'aqua' },
    lore: [{ text: 'Most played: Mining', color: 'gray' }]
  };

  const leaderboardBtn: GUI.Button = {
    id: 'writable_book',
    slot: 16,
    name: { text: 'Leaderboard', color: 'yellow' },
    onClick: () => { Errors.functionNotImplemented() }
  };


  // --- Page Assembly ---
  const page: GUI.Page = {
    name: 'profile',
    Buttons: [
      goBack(Menu, PageNames.main),
      activeBoostersBtn,
      globalStatsBtn,
      favoriteSkillBtn,
      leaderboardBtn
    ]
  };

  Menu.pushPage(page);
}