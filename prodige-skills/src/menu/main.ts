import { MacroArg as $, Button, GUI, Page, Text } from "@prodigelib/gui";
import { SkillList } from "../skill";
import { Mask, PageNames, ProgressPageIndex } from './const';
import { ProgressBar } from "../../lib/progressBar";
import { RewardClass } from "../object/reward";
import { _, tellraw } from "sandstone";

export function initMain(Menu: GUI) {
  tellraw("@p", "§eLoaded");
  const page = Page(Menu, PageNames.main, Mask.gray());

  const shop = Button({
    id: 'emerald',
    slot: 21,
    name: { text: 'Shop', color: 'green' },
    onClick: () => Menu.toPage(PageNames.shop)
  })

  page.pushObject(() => {
    let slot = 10;
    for (const skill of SkillList) {
      const percentage = skill.Xp['*'](100)['/'](skill.XpTarget);
      const nextLevel = skill.level['+'](1);
      const bar = () => ProgressBar(percentage);

      const emitBtn = (rewards: Text[]) => {
        page.rawEmit(Button({
          id: skill.itemId,
          slot: slot,
          name: $`§d${skill.name} ${skill.level}`,
          lore: [
            ...skill.description,
            "",
            $`§7Progress to Level ${nextLevel}: §e${percentage}%`,
            $`${bar} §e${skill.Xp}§6/§e${skill.XpTarget}`,
            "",
            $`§7Level ${nextLevel} Rewards:`,
            ...rewards,
            "",
            "§eClick to view!"
          ],
          onClick: () => {
            ProgressPageIndex.set(skill.level['/'](18));
            Menu.toPage(PageNames.progress(skill.name));
          },
          components: ['!attribute_modifiers']
        }));
      };

      RewardClass.resolve(skill, skill.level, emitBtn)

      slot++;
    }
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