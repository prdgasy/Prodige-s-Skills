import { _, say, Score, tellraw } from "sandstone";
import { SkillList } from "../../skills";
import { goBack, PageNames, ProgressPageIndex, SkillLevelScore, totalSlots } from "../const";
import { GUI } from "@prodigelib/gui";
import { ItemType, Skill } from "../../types";

export function initProgressPages(Menu: GUI.Init, skill: Skill) {
  const playerLevel = SkillLevelScore[skill.name];

  /**
   * Factory for level state buttons
   */
  const levelButton = (
    color: string,
    message: string,
    slot: Score,
    level: Score
  ): GUI.Button => ({
    id: `${color}_stained_glass_pane` as ItemType,
    slot: '$(slot)',
    name: { text: `Level $(level)`, color },
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
    slot: 26,
    name: { text: 'ability' },
    onClick: () => { Menu.toPage(PageNames.ability) }
  }

  const page: GUI.Page = {
    name: PageNames.progress(skill.name),
    Buttons: [
      goBack(Menu, PageNames.main),
      { id: 'paper', slot: 25, onClick: () => ProgressPageIndex['--'] },
      { id: 'paper', slot: 26, onClick: () => ProgressPageIndex['++'] },
      onEventButton,
      abilityBtn
    ]
  };

  Menu.pushInstruction(page, { fill, click });
  Menu.pushPage(page);
}