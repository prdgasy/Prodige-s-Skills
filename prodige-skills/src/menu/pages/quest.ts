import { Button, GUI, Page } from "@prodigelib/gui";
import { goBack, PageNames } from "../../consts/menu";
import { Skill } from "../../types";

export function initQuestPages(Menu: GUI, skill: Skill) {
  const dailyQuestBtn = Button({
    id: 'map',
    slot: 11,
    name: { text: 'Daily Quest', color: 'green' },
    lore: [{ text: 'Complete to earn bonus XP', color: 'gray' }]
  });

  const achievementsBtn = Button({
    id: 'book',
    slot: 15,
    name: { text: 'Achievements', color: 'gold' },
    lore: [{ text: 'Long-term goals', color: 'gray' }]
  });

  const page = Page(
    Menu,
    PageNames.quest(skill.name),
    [
      goBack(Menu, PageNames.progress(skill.name)),
      dailyQuestBtn,
      achievementsBtn
    ]
  );

  page.build();
}