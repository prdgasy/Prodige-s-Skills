import { goBack, PageNames } from "./const";
import { ToolList } from "../object/const";
import { Errors } from "../../lib/errors";
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