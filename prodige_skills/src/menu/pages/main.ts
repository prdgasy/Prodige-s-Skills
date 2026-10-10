import { GuiMacro as $, Button, Gui, PageClass } from "@prodigelib/gui";
import { ProgressBar } from "../../../lib/progressBar";
import { RewardClass } from "../../object/reward";
import { tellraw } from "sandstone";
import { RomanNumbers } from "../../../lib/romanNumbers";
import { Shop } from "./shop";
import { Progress } from "@/pages/skill/progress";
import { Skill } from "@/skill";


export class Main {
  static getName() {
    return this.name;
  }
  static init(g: Gui, p: PageClass) {
    // tellraw("@s", "§eMain page loaded");

    const shop = new Button("emerald", 21, "§aShop", () => g.switch(Shop.name));
    // const profile = new Button("player_head", 4, "§bProfile", () => g.toPage(PageNames.profile));
    // const dailyTask = new Button("wheat", 23, "§cDaily Tasks", () => g.toPage(PageNames.dailyTask));
    // const leaderboard = new Button("book", 25, "§6Leaderboard", () => g.toPage(PageNames.leaderboard));

    p.add(shop);
    // p.pushObject(shop, profile, dailyTask, leaderboard);

    p.add(() => {
      let slot = 10;

      for (const skill of Skill.list) {
        // const percentage = skill.xp["*"](100)["/"](skill.xpTarget);
        // const nextLevel = skill.level["+"](1);

        const emitBtn = (rewards: string[]) => p.add(new Button(
          'diamond_sword', // skill.itemId,
          slot,
          $`§d${skill.name} ${RomanNumbers.convert(4)}`, // $`§d${skill.name} ${RomanNumbers.convert(skill.level)}`,
          () => {
            Progress.pageIndex.set(0); // skill.level["/"](18));
            g.switch(Progress.getName(skill));
          },
          [
            // $`§9${skill.name} ${skill.level}`,
            "",
            // ...skill.description,
            "",
            "§f§lNext Level Goal",
            // $` §8• §7Target: §d${skill.name} ${RomanNumbers.convert(nextLevel)}`,
            // $` §8• §7Progress: §e${percentage}%`,
            // $` §8> ${ProgressBar(percentage)} §e${skill.xp}§6/§e${skill.xpTarget}`,
            // "",
            // $`§f§l${skill.name} ${RomanNumbers.convert(nextLevel)} Rewards`,
            // ...rewards,
            // "",
            "§eClick to view!",
          ],
          1,
          ["!attribute_modifiers"],
        ));
        emitBtn(["a", "b"]);
        // RewardClass.resolve(skill, skill.level, emitBtn);
        slot++;
      }
    });

    return p;
  }
}