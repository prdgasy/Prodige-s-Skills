import { GUI, Page, Button } from "@prodigelib/gui";
import { Errors } from "../../../lib/errors";
import { PageNames, goBack } from "../const";

export function initCratesPage(Menu: GUI) {
  const commonCrate = Button({
    id: 'chest',
    slot: 11,
    name: { text: 'Common Crate', color: 'white' },
    lore: [{ text: 'Price: 500 Points', color: 'gray' }],
    onClick: () => Errors.functionNotImplemented()
  });

  const legendaryCrate = Button({
    id: 'ender_chest',
    slot: 15,
    name: { text: 'Legendary Crate', color: 'gold', bold: true },
    lore: [{ text: 'Price: 5000 Points', color: 'gray' }],
    onClick: () => Errors.functionNotImplemented()
  });

  const page = Page(
    Menu,
    PageNames.crate,
    [goBack(Menu, PageNames.shop), commonCrate, legendaryCrate]
  );

  page.build();
}