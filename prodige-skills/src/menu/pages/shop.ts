import { GUI } from "@prodigelib/gui";
import { Errors } from "../../errors";
import { goBack, PageNames } from "../const";

export function initShopPage(Menu: GUI.Init) {
  const page: GUI.Page = {
    name: PageNames.shop,
    Buttons: [goBack(Menu, PageNames.main)]
  }

  const itemsButton: GUI.Button = {
    id: 'emerald',
    slot: 10,
    name: { text: 'Items', color: 'green' },
    lore: [Errors.textNotImplemented()],
    onClick: () => { Menu.toPage(PageNames.item) }
  }
  const boostersButton: GUI.Button = {
    id: 'experience_bottle',
    slot: 11,
    name: { text: 'Boosters', color: 'aqua' },
    lore: [Errors.textNotImplemented()],
    onClick: () => { Menu.toPage(PageNames.booster) }
  }
  const titlesButton: GUI.Button = {
    id: 'name_tag',
    slot: 12,
    name: { text: 'Titles', color: 'yellow' },
    lore: [Errors.textNotImplemented()],
    onClick: () => { Menu.toPage(PageNames.title) }
  }

  page.Buttons?.push(itemsButton, boostersButton, titlesButton);
  Menu.pushPage(page);
}