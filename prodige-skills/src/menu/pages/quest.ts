import { GUI } from "@prodigelib/gui";
import { goBack, PageNames } from "../const";
import { Skill } from "../../types";
export function initQuestPages(Menu: GUI.Init, skill: Skill) {
  const dailyQuestBtn: GUI.Button = {
    id: 'map',
    slot: 11,
    name: { text: 'Daily Quest', color: 'green' },
    lore: [{ text: 'Complete to earn bonus XP', color: 'gray' }]
  };

  const achievementsBtn: GUI.Button = {
    id: 'book',
    slot: 15,
    name: { text: 'Achievements', color: 'gold' },
    lore: [{ text: 'Long-term goals', color: 'gray' }]
  };

  const page: GUI.Page = {
    name: PageNames.quest(skill.name),
    Buttons: [
      goBack(Menu, PageNames.progress(skill.name)),
      dailyQuestBtn,
      achievementsBtn
    ]
  };

  Menu.pushPage(page);
}