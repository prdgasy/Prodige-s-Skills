import { goBack, PageNames } from "../../consts/menu";
import { ToolList } from "../../consts/tool";
import { Errors } from "../../errors";
import { GUI, Page, Button } from "@prodigelib/gui";

export function initItemPage(Menu: GUI) {
  const page = Page(
    Menu,
    PageNames.item,
    [goBack(Menu, PageNames.shop)]
  );


  for (const tool of ToolList) {
    page.pushObject(Button({
      id: tool.item,
      slot: 10,
      name: { text: tool.name, color: tool.rarity },
      lore: [
        ...tool.description,
        { text: '' },
        { text: 'Price: ' + tool.price, color: 'green' }
      ],
      onClick: () => { Menu.toPage(PageNames.item) }
    }));
  }

  page.build();
}