import { MacroArg as $, Button, ButtonClass, GUI, Page, Text } from "@prodigelib/gui";
import { _, Score, Variable } from "sandstone";

import { ItemType } from "../../types";
import { goBack, Mask, PageNames, ProgressPageIndex } from "../../consts/menu";
import { Errors } from "../../errors";
import { navbar } from "./navbar";
import { SkillClass } from "../../skill/skillClass";
import { ProgressBar } from "../../../lib/progressBar";

const totalSlots = 17;

export function initProgress(Menu: GUI, skill: SkillClass) {

  const page = Page(Menu, PageNames.progress(skill.name));
  const percentage = skill.xp["*"](100)["/"](skill.xpTarget);
  const nextLevel = skill.level["+"](1);
  const bar = () => ProgressBar(percentage);
  // --- Dynamic Level Button Factories ---
  const firstSlot = Button({
    id: skill.itemId,
    slot: 0,
    name: { text: $`${skill.name} Skill`, color: "green" },
    lore: [
      ...skill.description,
      { text: $`Progress to Level ${nextLevel}: §e${percentage}%`, color: "gray" },
      { text: $`${bar} §e${skill.xp}§6/§e${skill.xpTarget}` }
    ],
    components: ['!attribute_modifiers', 'enchantment_glint_override=1']
  });

  const notReached = (slot: Score, processedLevel: Score) => {
    return Button({
      id: "red_stained_glass_pane",
      slot: $(slot),
      name: { text: $`§c${skill.name} ${processedLevel}` },
      lore: [
        { text: "Rewards:" }
      ]
    });
  };
  const inProgress = (slot: Score) => {
    return Button({
      id: "yellow_stained_glass_pane",
      name: { text: $`${skill.name} ${skill.level}`, color: 'yellow' },
      slot: $(slot),
      lore: [
        { text: $`Progress: §e${percentage}%`, color: "gray" },
        { text: $`${bar} §e${skill.xp}§6/§e${skill.xpTarget}` }
      ],
    });
  };
  const reached = (slot: Score, processedLevel: Score) => {
    return Button({
      id: "green_stained_glass_pane",
      name: { text: $`${skill.name} ${processedLevel}`, color: 'green' },

      slot: $(slot)
    });
  };


  // --- Loop & State Generator ---
  const levels = () => {
    _.for([0, totalSlots], 'iterate', i => {
      const processedLevel = i['+'](ProgressPageIndex['*'](totalSlots));
      processedLevel['+='](ProgressPageIndex);

      _.if(i["=="](0), () => { page.rawEmit(firstSlot); i["--"]; }) // skip first slot
        .elseIf(skill.level['<'](processedLevel), () => {
          page.rawEmit(notReached(i, processedLevel));
        })
        .elseIf(skill.level['>'](processedLevel), () => {
          page.rawEmit(reached(i, processedLevel));
        })
        .elseIf(skill.level['=='](processedLevel), () => {
          page.rawEmit(inProgress(i));
        });
    })
  };

  // --- Navigation & Action Buttons ---

  const prev = Button({
    id: 'paper',
    slot: 25,
    name: { text: "Previous", color: "red" },
    onClick: () => _.if(ProgressPageIndex['>'](0), () => ProgressPageIndex['--'])
  });

  const next = Button({
    id: 'paper',
    slot: 26,
    name: { text: "Next", color: "green" },
    onClick: () => _.if(ProgressPageIndex['<'](5), () => ProgressPageIndex['++'])
  });

  // --- Page Registration & Build ---

  page.pushObject(
    ...Mask.navbar(),
    goBack(Menu, PageNames.main),
    prev,
    next,
    ...navbar(Menu, skill, PageNames.progress(skill.name)),
    levels
  );

  page.build();

}