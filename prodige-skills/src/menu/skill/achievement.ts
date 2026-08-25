import { Button, GUI, Page, MacroArg as $ } from "@prodigelib/gui";
import { _, Variable } from "sandstone";

import { goBack, PageNames } from "../../consts/menu";

import { SkillClass } from "../../skill/skillClass";
import { navbar } from "./navbar";
import { ProgressBar } from "../../../lib/progressBar";

export function initAchievement(menu: GUI, skill: SkillClass) {
  const page = Page(
    menu,
    PageNames.achievement(skill.name),
    [
      goBack(menu, PageNames.main),
      ...navbar(menu, skill, PageNames.achievement(skill.name))
    ]
  );

  for (let slot = 0; slot < skill.achievements.length; slot++) {
    const achievement = skill.achievements[slot];
    const ratio = achievement.progress["*"](100)["/"](achievement.target);
    const current = Button({
      id: achievement.id,
      slot,
      name: { text: $`${achievement.name} ${achievement.progress}/${achievement.target} (${ratio}%)`, color: 'gold' },
      lore: [
        { text: `Progress: ${() => ProgressBar(ratio)}`, color: 'yellow' },
      ]
    });

    const locked = Button({
      id: "charcoal",
      slot,
      name: { text: "this is locked", color: "dark_gray" }
    });

    page.pushObject(() => {
      _.if(skill.currentAchievement["=="](slot), () => page.rawEmit(current))
        .else(() => page.rawEmit(locked));
    });
  }

  page.build();
}