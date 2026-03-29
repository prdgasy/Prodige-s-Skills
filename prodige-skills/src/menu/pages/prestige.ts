import { GUI } from "@prodigelib/gui";
import { goBack, PageNames } from "../const";
import { PrestigeScore } from "../../player/scores";
import { ItemType } from "../../types";
import { Score } from "sandstone";
import { Errors } from "../../errors";
import { SkillList } from "../../skills";

export function initPrestigePage(Menu: GUI.Init) {
  const page: GUI.Page = {
    name: PageNames.prestige,
    Buttons: [goBack(Menu, PageNames.main)]
  }

  const skillPrestigeButton = (id: ItemType, slot: number, skillName: string, prestigeLevel: Score): GUI.Button => ({
    id,
    slot,
    name: { text: skillName, color: 'yellow' },
    lore: [{ text: `${skillName} $(level)` }],
    onClick: () => {
      Errors.functionNotImplemented();
    },
    macroArgs: [Errors.macroArgumentNotImplemented('level')]
  });

  SkillList.forEach((skill, index) => {
    page.Buttons?.push(skillPrestigeButton(skill.item, index + 10, skill.name, PrestigeScore[skill.name]))
  })

  Menu.pushPage(page);
}