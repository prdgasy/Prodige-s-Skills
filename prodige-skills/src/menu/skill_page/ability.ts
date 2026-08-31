import { Button, GUI, Page, MacroArg as $ } from "@prodigelib/gui";
import { _, DataVariable, Variable } from "sandstone";

import { PageNames, Mask, Bars } from "../const";
import { SkillClass } from "../../skill";
import { navbar } from "./navbar";
import { ProgressBar } from "../../../lib/progressBar";
import { textWrapper } from "../../../lib/textWrapper";

function getMax(skill: SkillClass) {
  const max = Variable(0);
  const maxData = {
    id: DataVariable(skill.onEvents[0].itemId),
    name: DataVariable(skill.onEvents[0].name),
    total: Variable(skill.onEvents[0].total),
    Xp: Variable(skill.onEvents[0].Xp),
    pts: Variable(skill.onEvents[0].pts),
  }
  for (const event of skill.onEvents) {
    _.if(event.total['>'](max), () => {
      max['='](event.total);
      maxData.id.set(event.itemId);
      maxData.name.set(event.name);
      maxData.total.set(event.total);
      maxData.Xp.set(event.Xp);
      maxData.pts.set(event.pts);
    });
  }
  return maxData;
}

export function initAbility(menu: GUI, skill: SkillClass) {
  const pageName = PageNames.ability(skill.name);
  const page = Page(menu, pageName, [...Mask.gray()]);
  page.pushObject(...navbar(menu, skill, pageName, page));
  // favourite action
  page.pushObject(() => {
    const favData = getMax(skill);

    // Exemples de données supplémentaires calculées à partir de favData :
    const totalXpGained = favData.total["*"](favData.Xp);
    const totalPtsGained = favData.total["*"](favData.pts);
    const contributionPercentage = totalXpGained["*"](100)["/"](skill.totalXp);

    const favourite = Button({
      id: $(favData.id),
      slot: 12,
      name: $`§eFavorite Action: §b${favData.name}`,
      lore: [
        ...textWrapper("Your most repeated activity and primary source of progression for this skill."),
        "",
        "§6Statistics:",
        $` §7• Times Executed: §a${favData.total} §7times`,
        $` §7• Total Xp Generated: §3+${totalXpGained} Xp`,
        $` §7• Total Points Earned: §e+${totalPtsGained} pts`,
        $` §7• Skill Impact: §d${contributionPercentage}% §7of all Xp`,
        "",
        "§6Per Action Value:",
        $` §7• §3+${favData.Xp} Xp §7| §e+${favData.pts} pts`,
        "",
        "§8Keep going to unlock higher milestones!"
      ]
    });

    page.rawEmit(favourite);
  });

  // total points
  page.pushObject(() => {
    // Calculs ou variables supplémentaires utiles pour meubler
    const averageXpPerPoint = skill.totalPts[">"](0)
      ? skill.totalXp["/"](skill.totalPts)
      : 0;

    const totalGain = Button({
      id: "gold_ingot",
      slot: 11,
      name: "§6§lTotal Lifetime Earnings",
      lore: [
        ...textWrapper(`Cumulative experience and points earned since you started training ${skill.name}.`),
        "",
        "§6Progression Summary:",
        $` §7• Total Xp: §3+${skill.totalXp} Xp`,
        $` §7• Total Points: §e+${skill.totalPts} pts`,
        "",
        "§6Efficiency Ratio:",
        $` §7• Avg Xp per Point: §3~${averageXpPerPoint} Xp/pt`,
        "",
        "§8All resources earned across all activities."
      ]
    });

    page.rawEmit(totalGain);
  });

  page.pushObject(() => {
    // --- Dynamic Tier Calculations ---
    const currentTierProgress = skill.level["%"](10);
    const progressPercentage = currentTierProgress["*"](10);
    const nextTier = skill.ability.tier["+"](1);
    const levelsLeft = Variable(10)["-"](currentTierProgress);

    // --- Slot 16: Refined Info / Guide Button ---
    const infoBtn = Button({
      slot: 15,
      id: "knowledge_book",
      name: "§e§l📖 Ability Guide",
      lore: [
        ...textWrapper("Abilities are powerful passive traits that enhance your skill performance continuously."),
        "",
        "§6Activation:",
        ...textWrapper(" §7• Triggers seamlessly whenever you use or hold the tool."),
        "",
        "§6Progression Rules:",
        " §7• Unlocks at §eSkill Level 10§7.",
        " §7• Upgrades every §b10 levels §7(§dTier I §7➡ §dTier X§7).",
        "",
        "§8No mana, cooldown, or activation key required."
      ]
    });

    const unlockedCard = Button({
      slot: 14,
      id: "nether_star",
      name: $`§b§l✦ ${skill.ability.name} §d[Tier ${skill.ability.tier}]`,
      lore: [
        ...skill.ability.description,
        "",
        "§6Tier progression",
        $` §7• Next Tier: §dTier ${nextTier}`,
        $` §7• Progress: §e${progressPercentage}% §8(§a${levelsLeft} levels left§8)`,
        $` ${() => ProgressBar(progressPercentage)}`,
        "",
        Bars.separator,
        "§a✔ Ability Currently Active"
      ],
      components: ["enchantment_glint_override=1", "!attribute_modifiers"]
    });

    const lockedCard = Button({
      slot: 14,
      id: "charcoal",
      name: "§8§l✦ §kUnknown§r §8[Locked]",
      lore: [
        "§8[§c§lDiscoverable Ability§8]",
        "",
        ...skill.ability.description,
        "",
        "§6§lUnlock progression",
        $` §7• Requirement: §eSkill Level 10`,
        $` §7• Remaining: §c${Variable(10)["-"](skill.level)} levels to go`,
        $` ${() => ProgressBar(skill.level["*"](10))}`,
        "",
        Bars.separator,
        "§c✘ Currently Inactive"
      ]
    });

    // --- Render logic ---
    page.rawEmit(infoBtn);

    _.if(skill.ability.tier["=="](0), () => {
      page.rawEmit(lockedCard);
    }).else(() => {
      page.rawEmit(unlockedCard);
    });
  });



  page.build();
}