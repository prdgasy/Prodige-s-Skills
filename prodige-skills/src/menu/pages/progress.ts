import { MacroArg as $, Button, ButtonClass, GUI, Page, Text } from "@prodigelib/gui";
import { _, raw, Score, tellraw, Variable } from "sandstone";
import { PrestigeScore, SkillScore } from '../../player/scores';
import { goBack, PageNames, ProgressPageIndex, totalSlots } from "../const";

import { JSONTextComponent } from "sandstone/arguments";
import { Indexer } from "../../indexer";
import { Palette } from "../../palette";
import { ItemType, Skill } from "../../types";


/**
  * Factory for level state Buttons
  */
function levelButton(name: string, item: ItemType, color: string, onClickText: JSONTextComponent, slot: Score, level: Score, lore: Text[]): ButtonClass {
  return Button({
    id: item,
    slot: $(slot),
    name: { text: $`${name} ${level}`, color: color },
    lore: [{ text: $`${name} ${level}`, color: "blue" }, ...lore],
    onClick: () => raw($`$say level: ${level}`)
  })
}

function renderProgressBar(progressRatio: Score, length: number = 10, motif: string = "-") {
  // Calcul du nombre de segments remplis (0 à length)
  const filledLength = progressRatio["*"](length)["/"](100);

  const bar = Indexer();
  for (let i = 0; i <= length; i++) {
    bar.set(i.toString(), `§a${motif.repeat(i)}§7${motif.repeat(length - i)}§r`);
  }
  return bar.get(filledLength);
}

export function initProgressPages(Menu: GUI, skill: Skill) {
  const playerLevel = SkillScore[skill.name].level;
  const playerXp = SkillScore[skill.name].xp;
  const playerXpTarget = SkillScore[skill.name].xpTarget;
  const rewardLevel = SkillScore[skill.name].rewardLevel;
  const name = skill.name;

  const onEventButton = Button({
    id: 'book',
    slot: 20,
    name: { text: 'onEvent page', color: 'green' },
    onClick: () => Menu.toPage(PageNames.onEvent(name, 0))
  })

  const notReachedButton = (slot: Score, processedLevel: Score) => {
    return levelButton(name, "charcoal", "red", [`${Palette.codes.danger}You are not here yet!`], slot, processedLevel, [{ text: "Lore test" }]);
  }

  const inProgressButton = (slot: Score, processedLevel: Score) => {
    const progressRatio = SkillScore[skill.name].xp["*"](SkillScore[skill.name].xpTarget)["/"](100);
    const nextLevel = Variable(processedLevel)["++"];
    return levelButton(name, "quartz", "yellow", ["In progress"], slot, processedLevel, [
      { text: "" },
      { text: $`§eProgress to level ${nextLevel}: ${progressRatio}%` },
      { text: $`${() => renderProgressBar(progressRatio)} ${playerXp}/${playerXpTarget}` }
    ]);
  }

  const notClaimedButton = (slot: Score, processedLevel: Score) => {
    return levelButton(name, "amethyst_cluster", "green", [`Claiming this`], slot, processedLevel, []);
  }

  const claimedButton = (slot: Score, processedLevel: Score) => {
    return levelButton(name, "medium_amethyst_bud", "green", [`Already claimed`], slot, processedLevel, []);
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
          tellraw('@p', [processedLevel]);
          page.emitButton(inProgressButton(slot, processedLevel));
        })
        .elseIf(rewardLevel["<"](processedLevel), () => {
          page.emitButton(notClaimedButton(slot, processedLevel));
        })
        .else(() => {
          page.emitButton(claimedButton(slot, processedLevel));
        })
    })
  }


  const abilityBtn = Button({
    id: 'stone',
    slot: 23,
    name: { text: 'Ability' },
    onClick: () => { Menu.toPage(PageNames.ability(skill.name)); },
  })

  const prestigeLvl = PrestigeScore[skill.name];
  const prestigeBtn = Button({
    id: "netherite_scrap",
    slot: 19,
    name: { text: $`${skill.name}: §l${skill.Prestige.name} ${prestigeLvl}`, color: "light_purple" },
    lore: [
      { text: "Reset your skill level", color: "dark_purple" },
      { text: "and unlock special abilities!", color: "dark_purple" },
      { text: "Available Perk:", color: "blue" },
      { text: ` §7• §r + ${skill.Prestige.powerPerLvl} % Special Ability Power`, color: "aqua" },
      { text: "" },
      { text: "Click to view!", color: "yellow" }
    ],
    onClick: () => {
      Menu.toPage(PageNames.prestige);
    }
  });

  const prev = Button({ id: 'paper', name: { text: "Previous", color: "red" }, slot: 25, onClick: () => _.if(ProgressPageIndex['>'](0), () => ProgressPageIndex['--']) });
  const next = Button({ id: 'paper', name: { text: "Next", color: "green" }, slot: 26, onClick: () => _.if(ProgressPageIndex['<'](5), () => ProgressPageIndex['++']) });

  const page = Page(
    Menu,
    PageNames.progress(skill.name),
    [
      goBack(Menu, PageNames.main),
      prev,
      next,
      onEventButton,
      abilityBtn,
      prestigeBtn
    ]
  );

  page.pushObject(levels);
  page.build()
}

