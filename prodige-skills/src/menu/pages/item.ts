import { SkillList } from "../../skills";
import { goBack, PageNames } from "../const";
import { Errors } from "../../errors";
import { GUI } from "@prodigelib/gui";

export function initItemPage(Menu: GUI.Init) {
  const page: GUI.Page = {
    name: PageNames.item,
    Buttons: [goBack(Menu, PageNames.shop)]
  }
  let slot = 0;
  SkillList.forEach(skill => {
    skill.customItems.forEach(item => {
      slot++;
      page.Buttons?.push({
        id: item.item,
        slot: slot,
        name: { text: item.name },
        onClick: () => { Errors.functionNotImplemented() }
      })
    })
  })

  Menu.pushPage(page);
}