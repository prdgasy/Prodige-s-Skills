import { GUI } from "@prodigelib/gui";
import { goBack, PageNames } from "../const";
import { Errors } from "../../errors";

export function initShopPage(Menu: GUI.Init) {
  const itemsBtn: GUI.Button = {
    id: 'emerald',
    slot: 10,
    name: { text: 'Items', color: 'green' },
    onClick: () => { Menu.toPage(PageNames.item) }
  };

  const boostersBtn: GUI.Button = {
    id: 'experience_bottle',
    slot: 12,
    name: { text: 'Boosters', color: 'aqua' },
    onClick: () => { Menu.toPage(PageNames.booster) }
  };

  const cratesBtn: GUI.Button = {
    id: 'ender_chest',
    slot: 14,
    name: { text: 'Crates', color: 'light_purple' },
    onClick: () => { Menu.toPage(PageNames.crate) }
  };

  const titlesBtn: GUI.Button = {
    id: 'name_tag',
    slot: 16,
    name: { text: 'Titles', color: 'yellow' },
    onClick: () => { Menu.toPage(PageNames.title) }
  };

  const page: GUI.Page = {
    name: 'shop',
    Buttons: [
      goBack(Menu, PageNames.main),
      itemsBtn,
      boostersBtn,
      cratesBtn,
      titlesBtn
    ]
  };

  Menu.pushPage(page);
}