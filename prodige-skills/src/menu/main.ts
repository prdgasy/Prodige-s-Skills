import { MacroArg as $, Button, ButtonClass, GUI, Page } from "@prodigelib/gui";
import { Score } from "sandstone";
import { Errors } from "../../lib/errors";
import { SkillList } from "../skill/const";
import { ItemType } from "../types";
import { Mask, PageNames, ProgressPageIndex } from './const';
import { SkillClass } from "../skill/skillClass";
import { ProgressBar } from "../../lib/progressBar";

export function initMain(Menu: GUI) {
  const page = Page(Menu, PageNames.main, Mask.gray());

  const shop = Button({
    id: 'emerald',
    slot: 21,
    name: { text: 'Shop', color: 'green' },
    onClick: () => Menu.toPage(PageNames.shop)
  })

  page.pushObject(() => {
    SkillList.forEach((skill, i) => {
      const percentage = skill.xp['/'](skill.xpTarget)['*'](100);
      const nextLevel = skill.level['+'](1);
      const bar = () => ProgressBar(percentage);
      page.rawEmit(Button({
        id: skill.itemId,
        slot: i + 10,
        name: { text: skill.name, color: 'green' },
        lore: [
          ...skill.description,
          { text: '' },
          { text: $`Progress to Level ${nextLevel}: §e${percentage}%` },
          { text: $`${bar} §e${skill.xp}§6/§e${skill.xpTarget}` },
          { text: '' },
          { text: $`Level ${nextLevel} Rewards:` },
          { text: '' },
          { text: "§eClick to view!" }
        ],
        onClick: () => {
          ProgressPageIndex.set(skill.level['/'](18));
          Menu.toPage(PageNames.progress(skill.name));
        },
        components: ['!attribute_modifiers']
      }));
    });
  });

  const profile = Button({
    id: 'player_head',
    slot: 4,
    name: { text: 'Profile', color: 'aqua' },
    onClick: () => Menu.toPage(PageNames.profile)
  });

  const dailyTask = Button({
    id: 'wheat',
    slot: 23,
    name: { text: 'Daily Tasks', color: 'green' },
    onClick: () => Menu.toPage(PageNames.dailyTask)
  });

  const leaderboard = Button({
    id: 'book',
    slot: 25,
    name: { text: 'Leaderboard', color: 'green' },
    onClick: () => Menu.toPage(PageNames.leaderboard)
  });

  page.pushObject(shop, profile, dailyTask, leaderboard);

  page.build();
}