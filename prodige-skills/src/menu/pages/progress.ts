import { _, say, Score, tellraw } from "sandstone";
import { SkillList } from "../../skills";
import { goBack, PageNames, ProgressPageIndex, totalSlots } from "../const";
import { Errors } from "../../errors"
import { SkillScore } from '../../player/scores';
import { GUI } from "@prodigelib/gui";
import { ItemType, Skill } from "../../types";

export function initProgressPages(Menu: GUI.Init, skill: Skill) {
  const playerLevel = SkillScore[skill.name].level;
  const name = skill.name;
  /**
   * Factory for level state Buttons
   */
  const levelButton = (
    color: string,
    message: string,
    slot: Score,
    level: Score
  ): GUI.Button => ({
    id: `${color}_stained_glass_pane` as ItemType,
    slot: '$(slot)',
    name: { text: `${name} Level $(level)`, color },
    onClick: () => say(message),
    macroArgs: [
      { 'level': level },
      { 'slot': slot }
    ]
  });

  const onEventButton: GUI.Button = {
    id: 'book',
    slot: 20,
    name: { text: 'onEvent page', color: 'green' },
    onClick: () => Menu.toPage(PageNames.onEvent(skill.name, 0))
  };

  const fill = () => {


    _.for([0, totalSlots], 'iterate', i => {
      const slot = i;
      const processedLevel = i['+'](ProgressPageIndex['*'](totalSlots));
      // Fix: Same page having 2 same level number
      processedLevel['+='](ProgressPageIndex);

      _.if(playerLevel['<'](processedLevel), () => {
        Menu.placeItem(levelButton('red', 'Not reacheddd', slot, processedLevel));
      })
        .elseIf(playerLevel['=='](processedLevel), () => {
          tellraw('@p', ["slot in progress:", processedLevel, " playerlevel: ", playerLevel]);
          Menu.placeItem(levelButton('yellow', 'In progress', slot, processedLevel));
        })
        .else(() => {
          Menu.placeItem(levelButton('green', 'Reached', slot, processedLevel));
        });
    })
  };

  const click = () => {
    _.for([0, totalSlots], 'iterate', i => {
      const slot = i;
      const processedLevel = i['+'](ProgressPageIndex['*'](totalSlots));
      _.if(playerLevel['<'](processedLevel), () => {
        Menu.detectClick(levelButton('red', 'Not reacheddd', slot, processedLevel));
      })
        .elseIf(playerLevel['=='](processedLevel), () => {
          Menu.detectClick(levelButton('yellow', 'In progress', slot, processedLevel));
        })
        .else(() => {
          Menu.detectClick(levelButton('green', 'Reached', slot, processedLevel));
        });
    })
  };

  const abilityBtn: GUI.Button = {
    id: 'gold_nugget',
    slot: 22,
    name: { text: 'ability' },
    onClick: () => { Menu.toPage(PageNames.ability) }
  }

  const prestigeBtn: GUI.Button = {
    id: "netherite_scrap",
    slot: 18,
    name: { text: `${skill.name} Prestige`, color: "purple", bold: true },
    lore: [
      { text: "Current Prestige level: ", color: "gray" },
      // On utilise ta lib pour les infos spéciales/dynamiques ici
      Errors.textNotImplemented(),
      { text: "Click to reset your skill level", color: "dark_purple" },
      { text: "and unlock special abilities!", color: "dark_purple" },
      { text: "Available Perks:", color: "blue" },
      { text: "• Double resource drops", color: "aqua" },
      { text: "• +15% Special Ability Damage", color: "aqua" }
    ],
    onClick: () => {
      Errors.functionNotImplemented();
    },
    // On n'y met que des erreurs
    macroArgs: [
      Errors.macroArgumentNotImplemented('prestigeObjective')
    ]
  };

  const page: GUI.Page = {
    name: PageNames.progress(skill.name),
    Buttons: [
      goBack(Menu, PageNames.main),
      { id: 'paper', slot: 25, onClick: () => _.if(ProgressPageIndex['>'](0), () => ProgressPageIndex['--']) },
      { id: 'paper', slot: 26, onClick: () => _.if(ProgressPageIndex['<'](5), () => ProgressPageIndex['++']) },
      onEventButton,
      abilityBtn,
      prestigeBtn
    ]
  };

  Menu.pushInstruction(page, { fill, click });
  Menu.pushPage(page);
}