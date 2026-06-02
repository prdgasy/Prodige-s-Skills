import { GUI } from "@prodigelib/gui";
import { Score, tellraw } from "sandstone";
import { ItemType } from "../../types";
import { Errors } from "../../errors";
import { PageNames, ProgressPageIndex } from '../const';
import { SkillScore } from "../../player/scores";
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
    macroArgs: [{ level: 3 }]
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
    slot: 21,
    name: { text: 'Shop', color: 'green' },
    onClick: () => { Menu.toPage(PageNames.shop); }
  }

  Menu.pushInstruction(page, {
    fill: () => {
      SkillList.forEach((skill, i) => {
        Menu.placeItem(skillButton(skill.item, 10 + i, skill.name, SkillScore[skill.name].level));

      });
    },
    click: () => {
      SkillList.forEach((skill, i) => {
        Menu.detectClick(skillButton(skill.item, 10 + i, skill.name, SkillScore[skill.name].level));

      });
    }
  });

  const profileButton: GUI.Button = {
    id: 'player_head',
    slot: 4,
    name: { text: 'Profile', color: 'aqua' },
    onClick: () => { Menu.toPage(PageNames.profile); }
  };
  const dailyTaskBtn: GUI.Button = {
    id: 'wheat',
    slot: 23,
    name: { text: 'Daily Tasks', color: 'green' },
    onClick: () => { Menu.toPage(PageNames.dailyTask); }
  };

  const leaderboardBtn: GUI.Button = {
    id: 'book',
    slot: 25,
    name: { text: 'Leaderboard', color: 'green' },
    onClick: () => { Menu.toPage(PageNames.leaderboard); }
  };

  page.Buttons?.push(prestigeButton, shopButton, profileButton, dailyTaskBtn, leaderboardBtn);

  Menu.pushPage(page);
}