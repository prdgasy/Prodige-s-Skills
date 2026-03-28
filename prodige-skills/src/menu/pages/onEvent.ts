import { GUI } from "@prodigelib/gui";
import { SkillList } from "../../skills";
import { goBack, PageNames } from "../const";
import { Errors } from "../../errors";

/**
     * Creates paginated onEvent pages for a skill
     */
export function initOnEventPages(Menu: GUI.Init) {
  SkillList.forEach(skill => {
    const pageCount = Math.ceil(skill.onEvents.length / 18);

    for (let i = 0; i < pageCount; i++) {
      const index = i;
      const page: GUI.Page = {
        name: PageNames.onEvent(skill.name, index),
        Buttons: [goBack(Menu, PageNames.progress(skill.name))]
      };

      // Navigation
      if (index > 0) {
        page.Buttons?.push({
          id: 'paper',
          slot: 9,
          name: { text: 'Previous' },
          onClick: () => Menu.toPage(PageNames.onEvent(skill.name, index - 1))
        });
      }
      if (index < pageCount - 1) {
        page.Buttons?.push({
          id: 'paper',
          slot: 10,
          name: { text: 'Next' },
          onClick: () => Menu.toPage(PageNames.onEvent(skill.name, index + 1))
        });
      }

      // Events
      for (let j = 0; j < 18; j++) {
        const eventIndex = j + index * 18;
        if (eventIndex >= skill.onEvents.length) break;

        const event = skill.onEvents[eventIndex];
        page.Buttons?.push({
          id: event.item,
          slot: j,
          name: { text: `${event.name} (${event.gain} xp)`, color: 'yellow' },
          lore: [Errors.textNotImplemented()]
        });
      }

      Menu.pushPage(page);
    }
  })


}