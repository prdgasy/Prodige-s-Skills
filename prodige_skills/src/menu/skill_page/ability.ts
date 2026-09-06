import { Button, GUI, Page, MacroArg as $ } from "@prodigelib/gui";
import { _, DataVariable, Variable } from "sandstone";

import { PageNames, Mask } from "../const";
import { SkillClass } from "../../skill";
import { navbar } from "./navbar";
import { ProgressBar } from "../../../lib/progressBar";
import { textWrapper } from "../../../lib/textWrapper";
import { convertToRoman } from "../../../lib/romanNumbers";
function getMax(skill: SkillClass) {
  const max = Variable(0);
  const maxData = {
    id: DataVariable(skill.onEvents[0].itemId),
    name: DataVariable(skill.onEvents[0].name),
    total: Variable(skill.onEvents[0].totalExecuted),
    Xp: Variable(skill.onEvents[0].xp),
    pts: Variable(skill.onEvents[0].pts),
  }
  for (const event of skill.onEvents) {
    _.if(event.totalExecuted['>'](max), () => {
      max['='](event.totalExecuted);
      maxData.id.set(event.itemId);
      maxData.name.set(event.name);
      maxData.total.set(event.totalExecuted);
      maxData.Xp.set(event.xp);
      maxData.pts.set(event.pts);
    });
  }
  return maxData;
}

export function initAbility(menu: GUI, skill: SkillClass) {
  const pageName = PageNames.ability(skill.name);
  const page = Page(menu, pageName, [...Mask.gray(), ...Mask.upperBlack()]);
  navbar(menu, skill, pageName, page);

  // favourite action
  page.pushObject(() => {
    const favData = getMax(skill);

    // Exemples de données supplémentaires calculées à partir de favData :
    const totalXpGained = favData.total["*"](favData.Xp);
    const totalPtsGained = favData.total["*"](favData.pts);
    const contributionPercentage = totalXpGained["*"](100)["/"](skill.totalXp);

    const favourite = Button({
      id: $(favData.id),
      slot: 11,
      name: $`§e§lFavorite Action §8• §b${favData.name}`,
      lore: [
        ...textWrapper("Your most repeated activity and primary source of progression for this skill."),
        "",
        "§f§lStatistics",
        $` §8• §7Skill Action: §b${favData.name}`,
        $` §8• §7Times Executed: §a${favData.total} §7times`,
        $` §8• §7Total Xp Generated: §3${totalXpGained} Xp`,
        $` §8• §7Total Points Earned: §e${totalPtsGained} Pts`,
        $` §8• §7Skill Impact: §d${contributionPercentage}% §7of all Xp`,
        "",
        "§f§lPer Action Value",
        $` §8• §3+${favData.Xp} Xp §7| §e+${favData.pts} Pts`,
        "",
        "§8Keep going to unlock higher milestones!"
      ]
    });

    page.rawEmit(favourite);
  });

  // total
  page.pushObject(() => {
    // Calculs ou variables supplémentaires utiles pour meubler
    const averageXpPerPoint = skill.totalPts[">"](0)
      ? skill.totalXp["/"](skill.totalPts)
      : 0;

    const totalGain = Button({
      id: "gold_ingot",
      slot: 10,
      name: "§6§lTotal Earnings",
      lore: [
        ...textWrapper(`Cumulative experience and points earned since you started training ${skill.name}.`),
        "",
        "§f§lProgression Summary",
        $` §8• §7Total Xp: §3${skill.totalXp} Xp`,
        $` §8• §7Total Points: §e${skill.totalPts} pts`,
        "",
        "§f§lEfficiency Ratio",
        $` §8• §7Avg Xp per Point: §3~${averageXpPerPoint} Xp/pt`,
        "",
        "§8All resources earned across all activities."
      ]
    });

    page.rawEmit(totalGain);
  });

  // info
  page.pushObject(Button({
    slot: 15,
    id: "knowledge_book",
    name: "§a§lAbility Guide",
    lore: [
      ...textWrapper("Abilities are powerful passive traits that enhance your skill performance continuously."),
      "",
      "§f§lProgression Rules",
      " §8• §7Unlocks at §eSkill Level 10§7.",
      " §8• §7Upgrades every §b10 levels §7(§dTier I §7➡ §dTier X§7).",
      "",
      "§8No cooldown, or activation key required."
    ]
  }));

  // ability tier
  page.pushObject(() => {
    // --- Dynamic Tier Calculations ---
    const currentTierProgress = skill.level["%"](10);
    const progressPercentage = currentTierProgress["*"](10);
    const nextTier = skill.ability.tier["+"](1);

    const tierRoman = DataVariable();
    convertToRoman(skill.ability.tier, tierRoman);

    const nextTierRoman = DataVariable();
    convertToRoman(nextTier, nextTierRoman);

    const levelsLeft = Variable(10)["-"](currentTierProgress);
    const slot = 13;
    const unlocked = (color: string, message: string) => Button({
      slot: slot,
      id: "nether_star",
      name: $`${color}§l♦ ${skill.ability.name} ${tierRoman} ♦`, // 
      lore: [
        message,
        "",
        ...skill.ability.description,
        "",
        "§f§lTier progression",
        $` §8• §7Next Tier: §d${skill.ability.name} ${nextTierRoman}`, // 
        $` §8• §7Progress: §e${progressPercentage}% §8(§a${levelsLeft} levels left§8)`,
        $` §8> ${() => ProgressBar(progressPercentage, 10)}`,
        "",
        "§eClick to toggle!"
      ],
      components: ["enchantment_glint_override=1", "!attribute_modifiers"],
      onClick: () => _.if(skill.ability.toggle, () => skill.ability.toggle["="](0)).else(() => skill.ability.toggle["="](1))
    });

    const lockedCard = Button({
      slot: slot,
      id: "charcoal",
      name: "§8§l♦ §kUnknown §8§l♦",
      lore: [
        "§c✘ Currently Inactive",
        "",
        ...skill.ability.description,
        "",
        "§f§lUnlock progression",
        $` §8• §7Requirement: §dSkill Level 10`,
        $` §8• §7Remaining: §c${Variable(10)["-"](skill.level)} levels`,
        $` §8> ${() => ProgressBar(skill.level["*"](10), 10)}`,
        "",
        "§7You cannot toggle this yet!"
      ]
    });

    // --- Render logic ---

    _.if(skill.ability.tier["=="](0), () => page.rawEmit(lockedCard))
      .elseIf(skill.ability.toggle, () => page.rawEmit(unlocked("§d", "§a✔ Ability Currently Active")))
      .else(() => page.rawEmit(unlocked("§c", "§c✘ Currently Inactive")));
  });



  page.build();
}