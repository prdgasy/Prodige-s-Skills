import { MacroArg as $, Button, ButtonClass, GUI, Page, Text } from "@prodigelib/gui";
import { _, raw, Score, Variable } from "sandstone";
import { JSONTextComponent } from "sandstone/arguments";

import { Indexer } from "../../../indexer";
import { Palette } from "../../../palette";
import { SkillScore } from '../../../player/scores';
import { ItemType, Skill } from "../../../types";
import { goBack, PageNames, ProgressPageIndex } from "../../../consts/menu";
import { Errors } from "../../../errors";
import { navbar } from "./navbar";


const totalSlots = 17;

/**
* Creates and configures a standardized button representing a skill level state.
*
* @param name - The skill name.
* @param item - The Minecraft item ID to display.
* @param color - The primary color name for the button title.
* @param onClickText - Unused/Legacy text component passed to click events.
* @param slot - Score containing the inventory slot index.
* @param level - Score containing the target skill level.
* @param lore - Additional lore lines to append beneath the header.
* @returns A new ButtonClass instance configured with macro arguments.
*/
function levelButton(
  name: string,
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
    name: { text: $`${name} ${level}`, color: color },
    lore: [
      { text: $`${name} ${$(level)}`, color: "blue" },
      { text: "" },
      ...lore
    ],
    onClick: onClick
  });
}

/**
* Renders a dynamic text-based progress bar given a ratio score.
*
* @param progressRatio - Current progress score scaled from 0 to 100.
* @param length - Total number of segment characters in the bar (default: 10).
* @param motif - Character used for each segment of the bar (default: "-").
* @returns The formatted string corresponding to the current progress length.
*/
function renderProgressBar(
  progressRatio: Score,
  length: number = 10,
  motif: string = "-"
) {
  const filledLength = progressRatio["*"](length)["/"](100);
  const bar = Indexer();

  for (let i = 0; i <= length; i++) {
    bar.set(i.toString(), `§a${motif.repeat(i)}§7${motif.repeat(length - i)}§r`);
  }

  return bar.get(filledLength);
}



export function initProgressPages(Menu: GUI, skill: Skill) {
  const page = Page(Menu, PageNames.progress(skill.name));
  const name = skill.name;

  // Score references
  const playerLevel = SkillScore[name].level;
  const playerXp = SkillScore[name].xp;
  const playerXpTarget = SkillScore[name].xpTarget;

  // --- Dynamic Level Button Factories ---

  /**
  * Generates a button for a skill level that has not yet been reached.
  */
  const notReached = (slot: Score, processedLevel: Score) => {
    return levelButton(
      name,
      "red_stained_glass_pane",
      "red",
      () => {
        Menu.toPage(PageNames.ability(name));
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

  /**
  * Generates a button for the level currently in progress by the player.
  */
  const inProgress = (slot: Score | number, processedLevel: Score | number, item: ItemType = "yellow_stained_glass_pane", skillDescription: Text[] = []) => {
    const progressRatio = playerXp["*"](playerXpTarget)["/"](100);
    const nextLevel = Variable(processedLevel)["++"];

    const progressInfo: Text[] = [
      { text: $`§eProgress to level ${nextLevel}: ${progressRatio}%` },
      { text: $`${() => renderProgressBar(progressRatio)} ${playerXp}/${playerXpTarget}` }
    ];
    return levelButton(
      name,
      item,
      "yellow",
      () => { Errors.functionNotImplemented(); },
      slot,
      processedLevel,
      [...skillDescription, ...progressInfo]
    );
  };

  /**
  * Generates a button for an unlocked level whose reward has not been claimed yet.
  */
  const reached = (slot: Score, processedLevel: Score) => {
    return levelButton(
      name,
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
        _.if(playerLevel.equals(processedLevel), () => page.rawEmit(inProgress(0, 0, skill.item)))
          .else(() => inProgress(0, 0, skill.item, skill.description));
      })
        .elseIf(playerLevel['<'](processedLevel), () => {
          page.rawEmit(notReached(slot, processedLevel));
        })
        .elseIf(playerLevel['>'](processedLevel), () => {
          page.rawEmit(reached(slot, processedLevel));
        })
        .elseIf(playerLevel['=='](processedLevel), () => {
          page.rawEmit(inProgress(slot, processedLevel));
        });


      _.if(playerLevel['>'](processedLevel), () => reached(slot, processedLevel));
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
    ...navbar(Menu, skill, PageNames.progress(name)),
    levels
  );

  page.build();

}