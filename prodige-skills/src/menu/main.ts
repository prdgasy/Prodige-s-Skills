import { MacroArg as $, Button, ButtonClass, GUI, Page } from "@prodigelib/gui";
import { Score } from "sandstone";
import { Errors } from "../errors";
import { SkillList } from "../consts/skills";
import { ItemType } from "../types";
import { Mask, PageNames, ProgressPageIndex } from '../consts/menu';
import { SkillClass } from "../skill/skillClass";

function skillButton(Menu: GUI, skill: SkillClass, slot: number): ButtonClass {
  return Button({
    id: skill.itemId,
    slot: slot,
    name: { text: skill.name, color: 'yellow' },
    lore: [{ text: `${skill.name} ${$(skill.level)}` }],
    onClick: () => {
      ProgressPageIndex.set(skill.level['/'](18));
      Menu.toPage(PageNames.progress(skill.name));
    },
    components: ['!attribute_modifiers']
  });
};

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
      page.rawEmit(skillButton(Menu, skill, 10 + i));
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