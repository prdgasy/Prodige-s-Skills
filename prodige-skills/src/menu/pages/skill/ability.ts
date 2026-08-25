import { GUI, Page, Button } from "@prodigelib/gui";
import { goBack, PageNames } from "../../../consts/menu";

import { Errors } from "../../../errors";
import { SkillClass } from "../../../skill/skillClass";


export function initAbility(Menu: GUI, skill: SkillClass) {
  // --- Ability Definitions ---
  const passivePerk = Button({
    id: 'enchanted_book',
    slot: 11,
    name: { text: `${skill.name} Mastery`, color: 'yellow' },
    lore: [{ text: `Increase ${skill.name} XP by 10%`, color: 'gray' }],
    onClick: () => Errors.functionNotImplemented()
  });

  const activeAbility = Button({
    id: 'nether_star', // Or nether_star
    slot: 15,
    name: { text: 'Ultimate Move', color: 'light_purple', bold: true },
    lore: [
      { text: 'Right-click tool to activate!', color: 'gray' },
      { text: 'Cooldown: ', color: 'gray' }, { text: '60s', color: 'aqua' }
    ],
    onClick: () => Errors.functionNotImplemented()
  });

  const page = Page(
    Menu,
    PageNames.ability(skill.name),
    [
      goBack(Menu, PageNames.progress(skill.name)),
      passivePerk,
      activeAbility
    ]
  );

  page.build();
}