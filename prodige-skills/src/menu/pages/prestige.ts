import { GUI } from "@prodigelib/gui";
import { goBack, PageNames } from "../const";
import { PrestigeScore } from "../../player/scores";
import { ItemType, Skill } from "../../types";
import { Score } from "sandstone";
import { Errors } from "../../errors";
import { SkillList } from "../../skills";

export function initPrestigePage(Menu: GUI.Init, skill: Skill) {
  const name = skill.name
  const page: GUI.Page = {
    name: PageNames.prestige,
    Buttons: [goBack(Menu, PageNames.progress(name))]
  }

  const skillBtn: GUI.Button = {
    id: skill.item,
    name: { text: `${name} Prestige` },
    lore: [{ text: "Current lvl: " }, { text: "perks: ..." }],
    slot: 10
  }

  const romanLetters = ["I", "II", "III", "IV", "V"];
  const items: ItemType[] = ["copper_ingot", "iron_ingot", "gold_ingot", "diamond", "netherite_scrap"];

  for (let i = 0; i < 5; i++) {
    const prestigeActioner: GUI.Button = {
      id: items[i],
      slot: i + 11,
      name: { text: `${skill.Prestige.name} ${romanLetters[i]}` },
      onClick: () => Errors.functionNotImplemented(),
      lore: [{ text: "Perks: description..." }, { text: "Click to prestige!", color: "yellow" }]
    }

    page.Buttons?.push(prestigeActioner);
  }

  Menu.pushPage(page);
}