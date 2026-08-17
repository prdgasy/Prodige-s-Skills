import { _, tellraw } from "sandstone";
import { PrestigeScore, SkillScore } from "./scores";
import { Skill } from "../types";

export function prestigeUp(skill: Skill) {
  const prestigeLvl = PrestigeScore[skill.name];
  _.if(prestigeLvl["=="](5), () => {
    tellraw('@p', { text: "You have already reached the maximum prestige!", color: "red" });

  })
    .elseIf(SkillScore[skill.name].level["<"](100), () => {
      tellraw('@p', { text: "You need to be level 100 for that!", color: "red" });

    })
    .else(() => {
      prestigeLvl["++"];
      // tellraw('@p', { text: "Prestiged up, now at ", prestigeLvl });
    })
}