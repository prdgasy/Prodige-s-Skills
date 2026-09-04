import { goBack, PageNames } from "./const";
import { ToolList } from "../object/tool";
import { GUI, Page, Button } from "@prodigelib/gui";

export function initItem(Menu: GUI) {
  const page = Page(
    Menu,
    PageNames.item,
    [goBack(Menu, PageNames.shop)]
  );


  for (const tool of ToolList) {
    page.pushObject(Button({
      id: tool.item,
      slot: 10,
      name: { text: tool.name },
      lore: [
        ...tool.description,
        "",
        { text: 'Price: ' + tool.price, color: 'green' },
        "",
        { text: tool.rarity }
      ],
      onClick: () => { Menu.toPage(PageNames.item) }
    }));
  }

  page.build();
}