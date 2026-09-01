import { Button, GUI, Page, MacroArg as $ } from "@prodigelib/gui";
import { _, Variable } from "sandstone";

import { goBack, PageNames, Mask } from "../const";

import { SkillClass } from "../../skill";
import { navbar } from "./navbar";
import { ProgressBar } from "../../../lib/progressBar";

export function initAchievement(menu: GUI, skill: SkillClass) {
  const page = Page(
    menu,
    PageNames.achievement(skill.name)
  );

  navbar(menu, skill, PageNames.achievement(skill.name), page);
  
  page.pushObject(() => {
    for (let slot = 0; slot < skill.achievements.length; slot++) {
      const achievement = skill.achievements[slot];
      const ratio = achievement.progress["*"](100)["/"](achievement.target);
      const current = Button({
        id: achievement.itemId,
        slot,
        name: { text: $`§b${achievement.name} §e${achievement.progress}§6/§e${achievement.target} §7(${ratio}%)` },
        lore: [
          { text: $`${() => ProgressBar(ratio)}` }
        ]
      });

      const locked = Button({
        id: "crying_obsidian",
        slot,
        name: { text: "You are not there yet!", color: "dark_gray" }
      });

      _.if(skill.currentAchievement["=="](slot), () => page.rawEmit(current))
        .else(() => page.rawEmit(locked));
    }
  });

  page.build();
}