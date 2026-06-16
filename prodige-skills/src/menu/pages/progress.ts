import { _, raw, say, Score, tellraw } from "sandstone";
import { SkillList } from "../../skills";
import { goBack, PageNames, ProgressPageIndex, totalSlots } from "../const";
import { Errors } from "../../errors";
import { PrestigeScore, SkillScore } from '../../player/scores';
import { GUI, Button, MacroArgument, Page, ButtonClass } from "@prodigelib/gui";

import { ItemType, Skill } from "../../types";
import { Palette } from "../../palette";
import { JSONTextComponent } from "sandstone/arguments";

export function initProgressPages(Menu: GUI, skill: Skill) {
  const playerLevel = SkillScore[skill.name].level;
  const rewardLevel = SkillScore[skill.name].rewardLevel;
  const name = skill.name;

  /**
   * Factory for level state Buttons
   */
  function levelButton(item: ItemType, color: string, text: JSONTextComponent, slot: Score, level: Score): ButtonClass {
    const levelArg = MacroArgument(level);
    const slotArg = MacroArgument(slot);
    return Button({
      id: item,
      slot: slotArg.call(),
      name: { text: `${name} ${levelArg.call()}`, color },
      onClick: () => raw(`$say level: ${levelArg.call()}, text: '${text}'`),
      macroArgs: [
        levelArg,
        slotArg
      ]
    })
  }


  const onEventButton = Button({
    id: 'book',
    slot: 20,
    name: { text: 'onEvent page', color: 'green' },
    onClick: () => Menu.toPage(PageNames.onEvent(skill.name, 0))
  })

  const notReachedButton = (slot: Score, processedLevel: Score) => {
    return levelButton("charcoal", "red", [`${Palette.codes.danger}You are not here yet!`], slot, processedLevel);
  }

  const inProgressButton = (slot: Score, processedLevel: Score) => {
    return levelButton("quartz", "yellow", Errors.textNotImplemented(), slot, processedLevel);
  }

  const claimedButton = (slot: Score, processedLevel: Score) => {
    return levelButton("amethyst_cluster", "green", [`Already claimed this`], slot, processedLevel);
  }

  const notClaimedButton = (slot: Score, processedLevel: Score) => {
    return levelButton("medium_amethyst_bud", "green", [`Claiming this right now`], slot, processedLevel);
  }

  const levels = () => {
    _.for([0, totalSlots], 'iterate', i => {
      const slot = i;
      const processedLevel = i['+'](ProgressPageIndex['*'](totalSlots));
      // Fix: Same page having 2 same level number
      processedLevel['+='](ProgressPageIndex);

      _.if(playerLevel['<'](processedLevel), () => {
        page.emitButton(notReachedButton(slot, processedLevel));
      })
        .elseIf(playerLevel['=='](processedLevel), () => {
          page.emitButton(inProgressButton(slot, processedLevel));
        })
        .elseIf(rewardLevel[">"](processedLevel), () => {
          page.emitButton(notClaimedButton(slot, processedLevel));
        })
        .else(() => {
          page.emitButton(claimedButton(slot, processedLevel));
        })
    })
  }


  const test = MacroArgument("3");
  const abilityBtn = Button({
    id: 'gold_nugget',
    slot: 22,
    name: { text: 'ability' },
    onClick: () => { Menu.toPage(PageNames.ability(skill.name)); raw(`$say ${test.call()}`); },
    macroArgs: [test]
  })

  const prestigeLvl = MacroArgument(PrestigeScore[skill.name]);
  const prestigeBtn = Button({
    id: "netherite_scrap",
    slot: 19,
    name: { text: `${skill.name}: §l${skill.Prestige.name} ${prestigeLvl.call()}`, color: "light_purple" },
    lore: [
      { text: "Reset your skill level", color: "dark_purple" },
      { text: "and unlock special abilities!", color: "dark_purple" },
      { text: "Available Perk:", color: "blue" },
      { text: ` §7• §r+${skill.Prestige.powerPerLvl}% Special Ability Power`, color: "aqua" },
      { text: "" },
      { text: "Click to view!", color: "yellow" }
    ],
    onClick: () => {
      Menu.toPage(PageNames.prestige);
    },
    macroArgs: [
      prestigeLvl
    ]
  });

  const page = Page(
    Menu,
    PageNames.progress(skill.name),
    [
      goBack(Menu, PageNames.main),
      Button({ id: 'paper', slot: 25, onClick: () => _.if(ProgressPageIndex['>'](0), () => ProgressPageIndex['--']) }),
      Button({ id: 'paper', slot: 26, onClick: () => _.if(ProgressPageIndex['<'](5), () => ProgressPageIndex['++']) }),
      onEventButton,
      abilityBtn,
      prestigeBtn
    ]
  );

  page.pushObject(levels);
  page.build()
}