import { GUI } from "@prodigelib/gui";
import { Score } from "sandstone";
import { ItemType } from "../../types";
import { Errors } from "../../errors";
import { PageNames, ProgressPageIndex, SkillLevelScore } from '../const';
import { SkillList } from "../../skills";

export function initMainPage(Menu: GUI.Init) {
  const page: GUI.Page = {
    name: PageNames.main,
    Buttons: []
  };

  /**
   * Creates a skill button displayed in main menu
   */
  const skillButton = (id: ItemType, slot: number, name: string, playerLevel: Score): GUI.Button => ({
    id: id,
    slot: slot,
    name: { text: name, color: 'yellow' },
    lore: [{ text: `${name} $(level)` }],
    onClick: () => {
      ProgressPageIndex.set(playerLevel['/'](18));
      Menu.toPage(PageNames.progress(name));
    },
    macroArgs: [Errors.macroArgumentNotImplemented('level')]
  });


  const prestigeButton: GUI.Button = {
    id: 'netherite_scrap',
    slot: 20,
    name: { text: 'Prestige' },
    lore: [Errors.textNotImplemented()],
    onClick: () => { Menu.toPage(PageNames.prestige) }
  }
  const shopButton: GUI.Button = {
    id: 'emerald',
    slot: 22,
    name: { text: 'Shop', color: 'green' },
    onClick: () => { Menu.toPage(PageNames.shop); }
  }

  Menu.pushInstruction(page, {
    fill: () => {
      SkillList.forEach((skill, i) => {
        Menu.placeItem(skillButton(skill.item, 10 + i, skill.name, SkillLevelScore[skill.name]));
      });
    },
    click: () => {
      SkillList.forEach((skill, i) => {
        Menu.detectClick(skillButton(skill.item, 10 + i, skill.name, SkillLevelScore[skill.name]));
      });
    }
  });

  const profileButton: GUI.Button = {
    id: 'player_head',
    slot: 19,
    name: { text: 'Profile', color: 'aqua' },
    onClick: () => { Menu.toPage(PageNames.profile); }
  };
  page.Buttons?.push(prestigeButton, shopButton, profileButton);

  Menu.pushPage(page);
}