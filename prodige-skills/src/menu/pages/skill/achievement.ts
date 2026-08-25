import { Button, GUI, Page } from "@prodigelib/gui";
import { goBack, PageNames } from "../../../consts/menu";

import { navbar } from "./navbar";
import { SkillClass } from "../../../skill/skillClass";
import { Score, _, Variable } from 'sandstone';


export function initAchievement(Menu: GUI, skill: SkillClass) {
  const page = Page(
    Menu,
    PageNames.achievement(skill.name),
    [
      goBack(Menu, PageNames.progress(skill.name)),
      ...navbar(Menu, skill, PageNames.achievement(skill.name)),
    ]
  );

  let slot = 0;
  page.pushObject(() => {
    for (const achievement of skill.achievements) {
      const buttonSlot = (slot++) % 18;
      const locked = Button({

        slot: buttonSlot,
        id: 'dark_oak_sign',
        name: { text: 'Locked' },

      });
      const unlocked = Button({
        slot: buttonSlot,
        id: achievement.id,
        name: { text: achievement.name },
        onClick: () => { }
      });
      _.if(Variable(slot)['>'](10), () => page.rawEmit(locked))
        .else(() => page.rawEmit(unlocked));
    }
  });
  page.build();
}