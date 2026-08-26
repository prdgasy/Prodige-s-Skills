import { Button, ButtonClass, GUI } from "@prodigelib/gui";

import { PageNames } from "../const";
import { SkillClass } from "../../skill/skill";
import { getEnvironmentData } from "node:worker_threads";

export function navbar(Menu: GUI, skill: SkillClass, currentPage: string): ButtonClass[] {
  const isProgress = currentPage === PageNames.progress(skill.name);
  const isOnEvent = currentPage === PageNames.onEvent(skill.name);
  const isAbility = currentPage === PageNames.ability(skill.name);
  const isAchievement = currentPage === PageNames.achievement(skill.name);

  const enchantGlint = 'enchantment_glint_override=1';
  const currentColor = "green";

  const progress = Button({
    id: "ender_eye",
    slot: 20,
    name: { text: "See your progress", color: isProgress ? currentColor : "gray" },
    components: isProgress ? [enchantGlint, '!attribute_modifiers'] : undefined,
    onClick: isProgress ? undefined : () => Menu.toPage(PageNames.progress(skill.name))
  });

  const onEvent = Button({
    id: 'book',
    slot: 21,
    name: { text: 'Actions', color: isOnEvent ? currentColor : "gray" },
    onClick: isOnEvent ? undefined : () => Menu.toPage(PageNames.onEvent(skill.name)),
    components: isOnEvent ? [enchantGlint] : undefined
  });

  const ability = Button({
    id: 'nether_star',
    slot: 22,
    name: { text: 'Ability', color: isAbility ? currentColor : "gray" },
    onClick: isAbility ? undefined : () => Menu.toPage(PageNames.ability(skill.name)),
    components: isAbility ? [enchantGlint] : undefined
  });

  const achievement = Button({
    id: 'diamond',
    slot: 23,
    name: { text: 'Achievements', color: isAchievement ? currentColor : "gray" },
    onClick: isAchievement ? undefined : () => Menu.toPage(PageNames.achievement(skill.name)),
    components: isAchievement ? [enchantGlint] : undefined
  });

  return [progress, onEvent, ability, achievement];
}