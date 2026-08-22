import { GUI, Page, Button } from "@prodigelib/gui";
import { goBack, PageNames } from "../../consts/menu";
import { Errors } from "../../errors";
import { Skill } from "../../types";

/**
 * Creates paginated onEvent pages for a skill
 */
export function initOnEventPages(Menu: GUI, skill: Skill) {
  const pageCount = Math.ceil(skill.SkillEvents.length / 18);

  for (let i = 0; i < pageCount; i++) {
    const index = i;
    const page = Page(
      Menu,
      PageNames.onEvent(skill.name, index),
      [goBack(Menu, PageNames.progress(skill.name))]
    );

    // Navigation
    if (index > 0) {
      page.pushObject(Button({
        id: 'paper',
        slot: 9,
        name: { text: 'Previous' },
        onClick: () => Menu.toPage(PageNames.onEvent(skill.name, index - 1))
      }));
    }
    if (index < pageCount - 1) {
      page.pushObject(Button({
        id: 'paper',
        slot: 10,
        name: { text: 'Next' },
        onClick: () => Menu.toPage(PageNames.onEvent(skill.name, index + 1))
      }));
    }

    // Events
    for (let j = 0; j < 18; j++) {
      const eventIndex = j + index * 18;
      if (eventIndex >= skill.SkillEvents.length) break;

      const event = skill.SkillEvents[eventIndex];
      page.pushObject(Button({
        id: event.item,
        slot: j,
        name: { text: `${event.name} (${event.xp} xp)`, color: 'yellow' },
        lore: [Errors.textNotImplemented()]
      }));
    }

    page.build();
  }
}