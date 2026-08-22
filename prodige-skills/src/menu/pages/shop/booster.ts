import { GUI, Page, Button } from "@prodigelib/gui";
import { goBack, PageNames } from "../../../consts/menu";
import { Errors } from "../../../errors";
import { ItemType } from "../../../types";


function boosterItem(type: 'xp' | 'point', multiplier: number) {
  let itemRepr: ItemType;
  let name: string;
  let color: string;
  let onClick = () => { Errors.functionNotImplemented(); }
  if (type === 'xp') {
    itemRepr = 'experience_bottle';
    name = `${multiplier}x XP Booster`;
    color = 'aqua';
  } else {
    itemRepr = 'gold_ingot';
    name = `${multiplier}x XP Booster`;
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
    const xpBooster = boosterItem('xp', i);
    const pointBooster = boosterItem('point', i);

    page.pushObject(Button({
      id: xpBooster.itemRepr,
      slot: i + 5,
      name: { text: xpBooster.name },
      onClick: () => { xpBooster.onClick() }
    }), Button({
      id: pointBooster.itemRepr,
      slot: i + 10,
      name: { text: pointBooster.name },
      onClick: () => { pointBooster.onClick() }
    }));
  }

  page.build();
}