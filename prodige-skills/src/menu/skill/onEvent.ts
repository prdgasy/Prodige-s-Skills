import { GUI, PaginatedPage, PaginatedButton } from "@prodigelib/gui";
import { goBack, PageNames } from "../../consts/menu";
import { Errors } from "../../errors";
import { navbar } from "./navbar";
import { SkillClass } from "../../skill/skillClass";

/**
 * Creates paginated onEvent pages for a skill
 */
export function initOnEvent(Menu: GUI, skill: SkillClass) {
  const paginatedOnEvent = PaginatedPage({
    parent: Menu,
    name: PageNames.onEvent(skill.name),
  });

  for (const event of skill.onEvents) {
    paginatedOnEvent.objects.push(PaginatedButton({
      id: event.id,
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