import { Button, GUI, Page, MacroArg as $ } from "@prodigelib/gui";
import { _, DataVariable, Variable } from "sandstone";

import { PageNames, Mask, Bars } from "../const";
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
      name: $`§e§lFavorite Action`,
      lore: [
        ...textWrapper("Your most repeated activity and primary source of progression for this skill."),
        "",
        "§6Statistics:",
        $` §7• Skill Action: §b${favData.name}`,
        $` §7• Times Executed: §a${favData.total} §7times`,
        $` §7• Total Xp Generated: §3${totalXpGained} Xp`,
        $` §7• Total Points Earned: §e${totalPtsGained} Pts`,
        $` §7• Skill Impact: §d${contributionPercentage}% §7of all Xp`,
        "",
        "§6Per Action Value:",
        $` §7• §3+${favData.Xp} Xp §7| §e+${favData.pts} Pts`,
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
      slot: 10,
      name: "§6§lTotal Earnings",
      lore: [
        ...textWrapper(`Cumulative experience and points earned since you started training ${skill.name}.`),
        "",
        "§6Progression Summary:",
        $` §7• Total Xp: §3${skill.totalXp} Xp`,
        $` §7• Total Points: §e${skill.totalPts} pts`,
        "",
        "§6Efficiency Ratio:",
        $` §7• Avg Xp per Point: §3~${averageXpPerPoint} Xp/pt`,
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
    name: "§a§l📖 Ability Guide",
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
      "§8No cooldown, or activation key required."
    ]
  }));

  // ability tier
  page.pushObject(() => {
    // --- Dynamic Tier Calculations ---
    const currentTierProgress = skill.level["%"](10);
    const progressPercentage = currentTierProgress["*"](10);
    const nextTier = Variable(skill.ability.tier);
    nextTier["+="](1);
    const levelsLeft = Variable(10)["-"](currentTierProgress);
    const slot = 13;
    const unlockedCard = Button({
      slot: slot,
      id: "nether_star",
      name: $`§b§l✦ ${skill.ability.name} ${convertToRoman(skill.ability.tier)}`, // 
      lore: [
        "§a✔ Ability Currently Active",
        "",
        ...skill.ability.description,
        "",
        "§6Tier progression:",
        $` §7• Next Tier: §b§l${skill.ability.name} ${convertToRoman(nextTier)}`, // 
        $` §7• Progress: §e${progressPercentage}% §8(§a${levelsLeft} levels left§8)`,
        $` ${() => ProgressBar(progressPercentage)}`,
        "",
        Bars.separator,
        "§eClick to toggle!"
      ],
      components: ["enchantment_glint_override=1", "!attribute_modifiers"]
    });

    const lockedCard = Button({
      slot: slot,
      id: "charcoal",
      name: "§8§l✦ §kUnknown§r §8[Locked]",
      lore: [
        "§c✘ Currently Inactive",
        "",
        ...skill.ability.description,
        "",
        "§6Unlock progression:",
        $` §7• Requirement: §dSkill Level 10`,
        $` §7• Remaining: §c${Variable(10)["-"](skill.level)} levels`,
        $` ${() => ProgressBar(skill.level["*"](10))}`,
        "",
        Bars.separator,
        "§7You cannot toggle this yet!"
      ]
    });

    // --- Render logic ---

    _.if(skill.ability.tier["=="](0), () => {
      page.rawEmit(lockedCard);
    }).else(() => {
      page.rawEmit(unlockedCard);
    });
  });



  page.build();
}