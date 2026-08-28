import { GUI, Page, Button } from "@prodigelib/gui";
import { goBack, PageNames, Mask } from "../const";

import { Errors } from "../../../lib/errors";
import { SkillClass } from "../../skill";
import { navbar } from "./navbar";
import { MacroArg as $ } from "@prodigelib/gui";

import { _ } from "sandstone";

export function initAbility(Menu: GUI, skill: SkillClass) {

  const info = Button({
    id: 'experience_bottle',
    slot: 13,
    name: { text: 'How it works ?', color: 'yellow' },
    lore: [
      ""
    ],
  });

  const page = Page(
    Menu,
    PageNames.ability(skill.name),
    [
      ...Mask.gray(),
      ...Mask.navbar(),
      info
    ]
  );

  page.pushObject(...navbar(Menu, skill, PageNames.ability(skill.name), page));

  page.pushObject(() => {
    const nextTier = skill.ability.tier['+'](1);

    const unlocked = Button({
      id: 'nether_star',
      slot: 11,
      name: { text: $`${skill.ability.name} ${skill.ability.tier} §a§l[ENABLED]`, color: 'yellow' },
      lore: [
        ...skill.ability.description,
        { text: $`Progress to ${skill.ability.name} ${nextTier}: 12%` },
        { text: "progress_bar" },
      ],
      onClick: () => Errors.functionNotImplemented() // todo: page switcher
    });

    const locked = Button({
      id: 'charcoal',
      slot: 11,
      name: { text: `Unlocking...`, color: 'gray', italic: true },
      lore: [
        ...skill.ability.description,
        { text: $`Progress to ${skill.ability.name} 1}: 12%` },
        { text: "progress_bar" },
      ],
    });

    _.if(skill.ability.tier['=='](0), () => {
      page.rawEmit(locked);
    })
      .else(() => {
        page.rawEmit(unlocked);
      });
  });

  page.build();
}