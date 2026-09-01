import { MacroArg as $, Button, ButtonClass, GUI, Page, Text } from "@prodigelib/gui";
import { _, DataPointClass, Score, tellraw, Variable } from "sandstone";

import { ItemType } from "../../types";
import { goBack, Mask, PageNames, ProgressPageIndex } from "../const";
import { Errors } from "../../../lib/errors";
import { navbar } from "./navbar";
import { SkillClass } from "../../skill";
import { ProgressBar } from "../../../lib/progressBar";
import { RewardClass } from "../../object/reward";

const totalSlots = 17;

export function initProgress(Menu: GUI, skill: SkillClass) {

  const page = Page(Menu, PageNames.progress(skill.name));
  // --- Loop & State Generator ---
  const levels = () => {
    const percentage = skill.Xp["*"](100)["/"](skill.XpTarget);
    const nextLevel = skill.level["+"](1);
    const bar = (): DataPointClass => ProgressBar(percentage);



    _.for([0, totalSlots], 'iterate', i => {
      const processedLevel = i['+'](ProgressPageIndex['*'](totalSlots))["++"];
      processedLevel['+='](ProgressPageIndex);
      const emitBtn = (rewards: Text[]) => {
        const notReached = Button({
          id: "red_stained_glass_pane",
          slot: $(i),
          name: $`§c${skill.name} ${processedLevel}`,
          lore: [
            "§7Rewards:",
            ...rewards,
          ]
        });
        const inProgress = Button({
          id: "yellow_stained_glass_pane",
          name: $`§e${skill.name} ${processedLevel}`,
          slot: $(i),
          lore: [
            $`§7Progress: §e${percentage}%`,
            $`${bar} §e${skill.Xp}§6/§e${skill.XpTarget}`,
            "",
            "§7Rewards: ",
            ...rewards,
          ],
        });
        const reached = Button({
          id: "green_stained_glass_pane",
          name: $`§a${skill.name} ${processedLevel}`,
          lore: [
            '§7Rewards:',
            ...rewards
          ],
          slot: $(i)
        });

        _.if(nextLevel['<'](processedLevel), () => {
          page.rawEmit(notReached);
        })
          .elseIf(nextLevel['>'](processedLevel), () => {
            page.rawEmit(reached);
          })
          .elseIf(nextLevel["=="](processedLevel), () => {
            page.rawEmit(inProgress);
          });
      };
      RewardClass.resolve(skill, processedLevel, emitBtn);
    });
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
  navbar(Menu, skill, PageNames.progress(skill.name), page)
  page.pushObject(

    prev,
    next,
    levels,
  );

  page.build();

}