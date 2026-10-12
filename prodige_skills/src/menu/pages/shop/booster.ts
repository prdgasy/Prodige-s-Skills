import { GUI, Page, Button } from "@prodigelib/gui";
import { goBack, PageNames } from "../const";
import { Errors } from "../../../lib/errors";
import { Item } from "../../../types";


function boosterItem(type: 'Xp' | 'point', multiplier: number) {
  let itemRepr: Item;
  let name: string;
  let color: string;
  let onClick = () => { Errors.functionNotImplemented(); }
  if (type === 'Xp') {
    itemRepr = 'experience_bottle';
    name = `${multiplier}x Xp Booster`;
    color = 'aqua';
  } else {
    itemRepr = 'gold_ingot';
    name = `${multiplier}x Xp Booster`;
    color = 'gold';
  }
  return { itemRepr, name, color, multiplier, onClick };
}

export function initBoosterPage(Menu: GUI) {
  const page = Page(
    Menu,
    PageNames.booster,
    [goBack(Menu, PageNames.shop), Button({ id: 'stone_button', slot: 5, name: { text: 'testbutton' } })]
  );

  for (let i = 0; i < 5; i++) {
    const XpBooster = boosterItem('Xp', i);
    const pointBooster = boosterItem('point', i);

    page.pushObject(Button({
      id: XpBooster.itemRepr,
      slot: i + 5,
      name: { text: XpBooster.name },
      onClick: () => { XpBooster.onClick() }
    }), Button({
      id: pointBooster.itemRepr,
      slot: i + 10,
      name: { text: pointBooster.name },
      onClick: () => { pointBooster.onClick() }
    }));
  }

  page.build();
}