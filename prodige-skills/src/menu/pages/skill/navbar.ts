import { Button, ButtonClass, GUI } from "@prodigelib/gui";

import { PageNames } from "../../../consts/menu";
import { SkillClass } from "../../../skill/skillClass";

export function navbar(Menu: GUI, skill: SkillClass, currentPage: string): ButtonClass[] {
  const isProgress = currentPage === PageNames.progress(skill.name);
  const isOnEvent = currentPage === PageNames.onEvent(skill.name);
  const isAbility = currentPage === PageNames.ability(skill.name);
  const isAchievement = currentPage === PageNames.achievement(skill.name);

  const progress = Button({
    id: skill.id,
    slot: 20,
    name: { text: "See your progress", color: isProgress ? "gold" : "gray" },
    lore: [
      { text: "This page will show you your progress" }
    ],
    components: isProgress ? [] : undefined,  // todo : enchantement glow if onProgress
    onClick: isProgress ? undefined : () => Menu.toPage(PageNames.progress(skill.name))
  });

  const onEvent = Button({
    id: 'book',
    slot: 21,
    name: { text: 'onEvent page', color: isOnEvent ? "gold" : "gray" },
    onClick: isOnEvent ? undefined : () => Menu.toPage(PageNames.onEvent(skill.name)),
    components: isOnEvent ? [] : undefined
  });

  const ability = Button({
    id: 'stone',
    slot: 22,
    name: { text: 'Ability', color: isAbility ? "gold" : "gray" },
    onClick: isAbility ? undefined : () => Menu.toPage(PageNames.ability(skill.name)),
    components: isAbility ? [] : undefined
  });

  const achievement = Button({
    id: 'book',
    slot: 23,
    name: { text: 'Achievement', color: isAchievement ? "gold" : "gray" },
    onClick: isAchievement ? undefined : () => Menu.toPage(PageNames.achievement(skill.name)),
    components: isAchievement ? [] : undefined
  });

  return [progress, onEvent, ability, achievement];
}