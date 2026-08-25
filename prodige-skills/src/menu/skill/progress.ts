import { MacroArg as $, Button, ButtonClass, GUI, Page, Text } from "@prodigelib/gui";
import { _, Score, Variable } from "sandstone";

import { ItemType } from "../../types";
import { goBack, PageNames, ProgressPageIndex } from "../../consts/menu";
import { Errors } from "../../errors";
import { navbar } from "./navbar";
import { SkillClass } from "../../skill/skillClass";
import { ProgressBar } from "../../../lib/progressBar";

const totalSlots = 17;

export function initProgress(Menu: GUI, skill: SkillClass) {

  function levelButton(
    item: ItemType,
    color: string,
    onClick: () => void,
    slot: Score | number,
    level: Score | number,
    lore: Text[]
  ): ButtonClass {
    return Button({
      id: item,
      slot: $(slot),
      name: { text: $`${skill.name} ${level}`, color: color },
      lore: [
        { text: $`${skill.name} ${$(level)}`, color: "blue" },
        { text: "" },
        ...lore
      ],
      onClick: onClick
    });
  }
  const page = Page(Menu, PageNames.progress(skill.name));

  // --- Dynamic Level Button Factories ---
  const notReached = (slot: Score, processedLevel: Score) => {
    return levelButton(
      "red_stained_glass_pane",
      "red",
      () => {
        Menu.toPage(PageNames.ability(skill.name));
      },
      slot,
      processedLevel,
      [
        { text: "Rewards:", color: "gray" },
        { text: skill.ability.name, color: "yellow" },
        ...skill.ability.description
      ]
    );
  };


  const inProgress = (slot: Score | number, processedLevel: Score | number, item: ItemType = "yellow_stained_glass_pane", skillDescription: Text[] = []) => {
    const progressRatio = skill.xp["*"](skill.xpTarget)["/"](100);
    const nextLevel = Variable(processedLevel)["++"];

    const progressInfo: Text[] = [
      { text: $`§eProgress to level ${nextLevel}: ${progressRatio}%` },
      { text: $`${() => ProgressBar(progressRatio)} ${skill.xp}/${skill.xpTarget}` }
    ];
    return levelButton(
      item,
      "yellow",
      () => { Errors.functionNotImplemented(); },
      slot,
      processedLevel,
      [...skillDescription, ...progressInfo]
    );
  };


  const reached = (slot: Score, processedLevel: Score) => {
    return levelButton(
      "green_stained_glass_pane",
      "green",
      () => { Errors.functionNotImplemented(); },
      slot,
      processedLevel,
      [
        { text: "Click to claim!", color: "yellow" }
      ]
    );
  };


  // --- Loop & State Generator ---

  /**
  * Iterates through all available inventory slots on the page, calculates the
  * corresponding skill level, and emits the matching state button.
  */
  const levels = () => {
    _.for([0, totalSlots], 'iterate', i => {
      _.if(i['>'](100), () => {
        page.rawEmit(Button({
          slot: $(i),
          name: { text: '---' },
          id: 'gray_stained_glass_pane'
        }));
      });

      const slot = i;
      const processedLevel = i['+'](ProgressPageIndex['*'](totalSlots));
      processedLevel['+='](ProgressPageIndex);

      _.if(processedLevel.equals(0), () => {
        _.if(skill.level.equals(processedLevel), () => page.rawEmit(inProgress(0, 0, skill.id)))
          .else(() => inProgress(0, 0, skill.id, skill.description));
      })
        .elseIf(skill.level['<'](processedLevel), () => {
          page.rawEmit(notReached(slot, processedLevel));
        })
        .elseIf(skill.level['>'](processedLevel), () => {
          page.rawEmit(reached(slot, processedLevel));
        })
        .elseIf(skill.level['=='](processedLevel), () => {
          page.rawEmit(inProgress(slot, processedLevel));
        });

      _.if(skill.level['>'](processedLevel), () => reached(slot, processedLevel));
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

  page.pushObject(
    goBack(Menu, PageNames.main),
    prev,
    next,
    ...navbar(Menu, skill, PageNames.progress(skill.name)),
    levels
  );

  page.build();

}