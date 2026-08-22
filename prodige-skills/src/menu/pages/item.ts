import { SkillList } from "../../consts/skills";
import { goBack, PageNames } from "../../consts/menu";
import { Errors } from "../../errors";
import { GUI, Page, Button } from "@prodigelib/gui";

export function initItemPage(Menu: GUI) {
  const page = Page(
    Menu,
    PageNames.item,
    [goBack(Menu, PageNames.shop)]
  );
  let slot = 0;
  SkillList.forEach(skill => {
    skill.customItems.forEach(item => {
      slot++;
      page.pushObject(Button({
        id: item.item,
        slot: slot,
        name: { text: item.name },
        onClick: () => { Errors.functionNotImplemented() }
      }));
    })
  })

  page.build();
}