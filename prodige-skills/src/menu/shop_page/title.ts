import { GUI, Page, Button } from "@prodigelib/gui";
import { Errors } from "../../../lib/errors";
import { SkillList } from "../../skill/const";
import { goBack, PageNames } from "../const";

export function initTitlePage(Menu: GUI) {
  const page = Page(
    Menu,
    PageNames.title,
    [goBack(Menu, PageNames.shop)]
  );
  let slot = 0;
  SkillList.forEach(skill => {
    skill.titles.forEach(item => {
      slot++;
      page.pushObject(Button({
        id: 'name_tag',
        slot: slot,
        name: { text: item.name },
        onClick: () => { Errors.functionNotImplemented() }
      }));
    })
  })

  page.build();
}