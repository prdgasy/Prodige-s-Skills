import { GUI, PaginatedPage, PaginatedButton } from "@prodigelib/gui";
import { goBack, Mask, PageNames } from "../const";
import { Errors } from "../../../lib/errors";
import { navbar } from "./navbar";
import { SkillClass } from "../../skill";

/**
 * Creates paginated onEvent pages for a skill
 */
export function initOnEvent(Menu: GUI, skill: SkillClass) {
  const paginatedOnEvent = PaginatedPage({
    parent: Menu,
    name: PageNames.onEvent(skill.name),
    staticObjectList: [...Mask.gray(), ...Mask.navbar()]
  });

  for (const event of skill.onEvents) {
    paginatedOnEvent.objects.push(PaginatedButton({
      id: event.itemId,
      name: { text: `${event.name}`, color: 'green' },
      lore: [
        { text: `• ${event.xp} xp`, color: "aqua" },
        { text: `• ${event.pts} pts`, color: "gold" }
      ]
    }));
  }

  paginatedOnEvent.staticObjects.push(
    ...navbar(Menu, skill, PageNames.onEvent(skill.name), paginatedOnEvent)
  );

  paginatedOnEvent.build();
}