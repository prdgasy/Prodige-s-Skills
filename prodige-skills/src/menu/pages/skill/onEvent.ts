import { GUI, PaginatedPage, PaginatedButton } from "@prodigelib/gui";
import { goBack, PageNames } from "../../../consts/menu";
import { Skill } from "../../../types";
import { Errors } from "../../../errors";
import { navbar } from "./navbar";

/**
 * Creates paginated onEvent pages for a skill
 */
export function initOnEventPages(Menu: GUI, skill: Skill) {
  const paginatedOnEvent = PaginatedPage({
    parent: Menu,
    name: PageNames.onEvent(skill.name),
  });

  for (const event of skill.SkillEvents) {
    paginatedOnEvent.objects.push(PaginatedButton({
      id: event.item,
      name: { text: `${event.name} (${event.xp} xp)`, color: 'yellow' },
      onClick: () => Errors.functionNotImplemented()
    }));
  }

  paginatedOnEvent.staticObjects.push(
    goBack(Menu, PageNames.progress(skill.name)),
    ...navbar(Menu, skill, PageNames.onEvent(skill.name))
  )


  paginatedOnEvent.build();
}