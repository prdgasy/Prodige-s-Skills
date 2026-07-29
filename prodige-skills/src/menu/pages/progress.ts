import { _, DataIndexMap, raw, say, Score, tellraw, Variable, Macro as $, DataPointClass } from "sandstone";
import { SkillList } from "../../skills";
import { goBack, PageNames, ProgressPageIndex, totalSlots } from "../const";
import { Errors } from "../../errors";
import { PrestigeScore, SkillScore } from '../../player/scores';
import { GUI, Button, MacroArgument, Page, ButtonClass, Text } from "@prodigelib/gui";

import { ItemType, Skill } from "../../types";
import { Palette } from "../../palette";
import { JSONTextComponent } from "sandstone/arguments";

/**
 * Génère une barre de progression sous forme de texte coloré (style Hypixel SkyBlock)
 */
function renderProgressBar(progressRatio: Score, length: number = 20, motif: string = "-"): Text[] {
  // Calcul du nombre de segments remplis (0 à length)
  const filledLength = progressRatio["*"](length)["/"](100);

  // 1. On crée les DataIndexMaps pour stocker les chaînes pré-générées
  const filledMap = DataIndexMap({});
  const emptyMap = DataIndexMap({});

  // 2. Génération au BUILD TIME (JS/TS) des combinaisons de chaînes possibles
  for (let i = 0; i <= length; i++) {
    filledMap[i] = motif.repeat(i);
    emptyMap[i] = motif.repeat(length - i);
  }

  // 3. Récupération dynamique au RUNTIME via la Macro NBT
  const greenText = filledMap[$`${filledLength}`];
  const grayText = emptyMap[$`${filledLength}`];

  // 4. On retourne le composant Text[] prêt à être injecté dans le Lore
  return [
    { text: greenText, color: "green" },
    { text: grayText, color: "dark_gray" },
    { text: ` ${Macro`${progressRatio}`}%`, color: "yellow" }
  ];
}

/**
   * Factory for level state Buttons
   */
function levelButton(name: string, item: ItemType, color: string, onClickText: JSONTextComponent, slot: Score, level: Score, lore: Text): ButtonClass {
  const levelArg = MacroArgument(level);
  const slotArg = MacroArgument(slot);
  return Button({
    id: item,
    slot: slotArg.call(),
    name: { text: `${name} ${levelArg.call()}`, color: color },
    lore: lore,
    onClick: () => raw(`$say level: ${levelArg.call()}, text: '${onClickText}'`),
    macroArgs: [
      levelArg,
      slotArg
    ]
  })
}

export function initProgressPages(Menu: GUI, skill: Skill) {
  const playerLevel = SkillScore[skill.name].level;
  const rewardLevel = SkillScore[skill.name].rewardLevel;
  const name = skill.name;

  const onEventButton = Button({
    id: 'book',
    slot: 20,
    name: { text: 'onEvent page', color: 'green' },
    onClick: () => Menu.toPage(PageNames.onEvent(name, 0))
  })

  const blueLevel = (level: Score): Text => {
    return { text: `${name} ${MacroArgument(level).call()}`, color: "blue" }
  }

  const notReachedButton = (slot: Score, processedLevel: Score) => {
    return levelButton(name, "charcoal", "red", [`${Palette.codes.danger}You are not here yet!`], slot, processedLevel, [{ text: "Lore test" }]);
  }

  const inProgressButton = (slot: Score, processedLevel: Score) => {
    const progressRatio = Variable(SkillScore[skill.name].xp)["*"](100)["/"](SkillScore[skill.name].xpTarget);

    return levelButton(name, "quartz", "yellow", ["In progress"], slot, processedLevel, [
      blueLevel(processedLevel),
      { text: "" },
      [
        { text: `Progress to level ${MacroArgument(processedLevel["++"]).call()}:` },
        { text: `${MacroArgument(progressRatio).call()}%` }
      ],
      renderProgressBar(progressRatio)
    ]);
  }

  const notClaimedButton = (slot: Score, processedLevel: Score) => {
    return levelButton(name, "amethyst_cluster", "green", [`Claiming this`], slot, processedLevel, [{ text: "Lore test" }]);
  }

  const claimedButton = (slot: Score, processedLevel: Score) => {
    return levelButton(name, "medium_amethyst_bud", "green", [`Already claimed`], slot, processedLevel, [{ text: "Lore test" }]);
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

