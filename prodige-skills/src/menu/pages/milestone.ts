import { GUI } from "@prodigelib/gui";
import { goBack, PageNames } from "../const";
import { Errors } from "../../errors";

export function initMilestonesPage(Menu: GUI.Init) {
  // --- Constant Buttons ---
  const powerLevelInfo: GUI.Button = {
    id: 'experience_bottle',
    slot: 4,
    name: { text: 'Your Total Power', color: 'aqua', bold: true },
    lore: [{ text: 'Sum of all your skill levels.', color: 'gray' }]
  };

  const rewardTier1: GUI.Button = {
    id: 'iron_ingot',
    slot: 10,
    name: { text: 'Milestone: Level 50', color: 'white' },
    lore: [
      { text: 'Reward: ', color: 'gray' }, { text: '+5% Global XP', color: 'green' },
      { text: 'Status: ', color: 'gray' }, { text: 'LOCKED', color: 'red' }
    ],
    onClick: () => Errors.functionNotImplemented()
  };

  const rewardTier2: GUI.Button = {
    id: 'gold_ingot',
    slot: 12,
    name: { text: 'Milestone: Level 100', color: 'gold' },
    lore: [
      { text: 'Reward: ', color: 'gray' }, { text: 'Double Loot Chance (2%)', color: 'green' },
      { text: 'Status: ', color: 'gray' }, { text: 'LOCKED', color: 'red' }
    ],
    onClick: () => Errors.functionNotImplemented()
  };

  const page: GUI.Page = {
    name: PageNames.milestone,
    Buttons: [
      goBack(Menu, PageNames.main),
      powerLevelInfo,
      rewardTier1,
      rewardTier2
    ]
  };

  Menu.pushPage(page);
}