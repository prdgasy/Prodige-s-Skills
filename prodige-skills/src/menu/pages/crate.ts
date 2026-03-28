import { GUI } from "@prodigelib/gui";
import { Errors } from "../../errors";
import { PageNames, goBack } from "../const";

export function initCratesPage(Menu: GUI.Init) {
  const commonCrate: GUI.Button = {
    id: 'chest',
    slot: 11,
    name: { text: 'Common Crate', color: 'white' },
    lore: [{ text: 'Price: 500 Points', color: 'gray' }],
    onClick: () => Errors.functionNotImplemented()
  };

  const legendaryCrate: GUI.Button = {
    id: 'ender_chest',
    slot: 15,
    name: { text: 'Legendary Crate', color: 'gold', bold: true },
    lore: [{ text: 'Price: 5000 Points', color: 'gray' }],
    onClick: () => Errors.functionNotImplemented()
  };

  const page: GUI.Page = {
    name: PageNames.crate,
    Buttons: [goBack(Menu, PageNames.shop), commonCrate, legendaryCrate]
  };

  Menu.pushPage(page);
}