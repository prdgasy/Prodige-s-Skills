import { MacroArg as $, Button, ButtonClass, GUI, Page } from "@prodigelib/gui";
import { Score } from "sandstone";
import { Errors } from "../../errors";
import { SkillScore } from "../../player/scores";
import { SkillList } from "../../skills";
import { ItemType } from "../../types";
import { PageNames, ProgressPageIndex } from '../const';

export function initMainPage(Menu: GUI) {
  const page = Page(Menu, PageNames.main);

  function skillButton(id: ItemType, slot: number, skill: string, playerLevel: Score): ButtonClass {
    return Button({
      id: id,
      slot: slot,
      name: { text: skill, color: 'yellow' },
      lore: [{ text: `${skill} ${$(playerLevel)}` }],
      onClick: () => {
        ProgressPageIndex.set(playerLevel['/'](18));
        Menu.toPage(PageNames.progress(skill));
      }
    });
  };

  const prestigeButton = Button({
    id: 'netherite_scrap',
    slot: 20,
    name: { text: 'Prestige' },
    lore: [Errors.textNotImplemented()],
    onClick: () => { Menu.toPage(PageNames.prestige) }
  })

  const shopButton = Button({
    id: 'emerald',
    slot: 21,
    name: { text: 'Shop', color: 'green' },
    onClick: () => { Menu.toPage(PageNames.shop); }
  })

  page.pushObject(() => {
    SkillList.forEach((skill, i) => {
      page.emitButton(skillButton(skill.item, 10 + i, skill.name, SkillScore[skill.name].level));
    });
  });

  const profileButton = Button({
    id: 'player_head',
    slot: 4,
    name: { text: 'Profile', color: 'aqua' },
    onClick: () => { Menu.toPage(PageNames.profile); }
  });

  const dailyTaskBtn = Button({
    id: 'wheat',
    slot: 23,
    name: { text: 'Daily Tasks', color: 'green' },
    onClick: () => { Menu.toPage(PageNames.dailyTask); }
  });

  const leaderboardBtn = Button({
    id: 'book',
    slot: 25,
    name: { text: 'Leaderboard', color: 'green' },
    onClick: () => { Menu.toPage(PageNames.leaderboard); }
  });

  page.pushObject(prestigeButton, shopButton, profileButton, dailyTaskBtn, leaderboardBtn);

  page.build();
}