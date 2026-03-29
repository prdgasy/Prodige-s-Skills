import { GUI } from "@prodigelib/gui";
import { Errors } from "../../../errors";
import { SkillList } from "../../../skills";
import { goBack, PageNames } from "../../const";

export function initTitlePage(Menu: GUI.Init) {
  const page: GUI.Page = {
    name: PageNames.title,
    Buttons: [goBack(Menu, PageNames.shop)]
  }
  let slot = 0;
  SkillList.forEach(skill => {
    skill.titles.forEach(item => {
      slot++;
      page.Buttons?.push({
        id: 'name_tag',
        slot: slot,
        name: { text: item.name },
        onClick: () => { Errors.functionNotImplemented() }
      })
    })
  })

  Menu.pushPage(page);
}