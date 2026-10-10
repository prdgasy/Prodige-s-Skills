import { GUI, PaginatedPage, PaginatedButton, MacroArg as $ } from "@prodigelib/gui";
import { goBack, Mask, PageNames } from "../const";
import { navbar } from "./navbar";
import { Skill } from "../../skill";

/**
 * Creates paginated onEvent pages for a skill
 */
export function initOnEvent(Menu: GUI, skill: Skill) {
  const paginatedOnEvent = PaginatedPage({
    parent: Menu,
    name: PageNames.onEvent(skill.name),
    staticObjectList: [...Mask.gray()]
  });

  for (const event of skill.onEvents) {
    // Calculs statistiques identiques à la Favorite Action
    const totalXpGained = event.totalExecuted["*"](event.xp);
    const totalPtsGained = event.totalExecuted["*"](event.pts);
    const contributionPercentage = totalXpGained["*"](100)["/"](skill.totalXp);

    paginatedOnEvent.objects.push(PaginatedButton({
      id: event.itemId,
      name: $`§e${event.name} §8• §3${event.xp} Xp §7| §e${event.pts} Pts`,
      lore: [
        "",
        "§f§lStatistics",
        $` §8• §7Skill Action: §b${event.name}`,
        $` §8• §7Times Executed: §a${event.totalExecuted} §7times`,
        $` §8• §7Total Xp Generated: §3${totalXpGained} Xp`,
        $` §8• §7Total Points Earned: §e${totalPtsGained} Pts`,
        $` §8• §7Skill Impact: §d${contributionPercentage}% §7of all Xp`
      ],
      components: ['!attribute_modifiers']
    }));
  }

  navbar(Menu, skill, PageNames.onEvent(skill.name), paginatedOnEvent);

  paginatedOnEvent.build();
}