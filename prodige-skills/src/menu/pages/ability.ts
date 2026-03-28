import { GUI } from "@prodigelib/gui";
import { goBack, PageNames } from "../const";
import { Skill } from "../../types";
import { Errors } from "../../errors";

export function initAbilityPages(Menu: GUI.Init, skill: Skill) {
  // --- Ability Definitions ---
  const passivePerk: GUI.Button = {
    id: 'enchanted_book',
    slot: 11,
    name: { text: `${skill.name} Mastery`, color: 'yellow' },
    lore: [{ text: `Increase ${skill.name} XP by 10%`, color: 'gray' }],
    onClick: () => Errors.functionNotImplemented()
  };

  const activeAbility: GUI.Button = {
    id: 'nether_star', // Or nether_star
    slot: 15,
    name: { text: 'Ultimate Move', color: 'light_purple', bold: true },
    lore: [
      { text: 'Right-click tool to activate!', color: 'gray' },
      { text: 'Cooldown: ', color: 'gray' }, { text: '60s', color: 'aqua' }
    ],
    onClick: () => Errors.functionNotImplemented()
  };

  const page: GUI.Page = {
    name: PageNames.ability(skill.name),
    Buttons: [
      goBack(Menu, PageNames.progress(skill.name)),
      passivePerk,
      activeAbility
    ]
  };

  Menu.pushPage(page);
}