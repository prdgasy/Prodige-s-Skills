import { Button, GUI, Page } from "@prodigelib/gui";
import { goBack, PageNames } from "../const";
import { textWrapper } from "../../../lib/textWrapper";

export function initShop(Menu: GUI) {
  const item = Button({
    id: 'emerald',
    slot: 10,
    name: { text: 'Items', color: 'green', bold: true },
    lore: [
      ...textWrapper({ text: 'Browse and purchase custom items and specialized gear crafted to enhance your skill progression.', color: 'gray' }),
      { text: '' },
      { text: 'Includes:', color: 'gold' },
      { text: ' • Exclusive tools & weapons', color: 'white' },
      { text: ' • Custom item abilities', color: 'white' },
      { text: '' },
      { text: 'Click to browse items!', color: 'yellow' }
    ],
    onClick: () => { Menu.toPage(PageNames.item) }
  });

  const booster = Button({
    id: 'experience_bottle',
    slot: 12,
    name: { text: 'Boosters', color: 'aqua', bold: true },
    lore: [
      ...textWrapper({ text: 'Supercharge your leveling with powerful XP & Point multipliers.', color: 'gray' }),
      { text: '' },
      { text: 'Includes:', color: 'gold' },
      { text: ' • Skill XP Boosters', color: 'white' },
      { text: ' • Skill Point Boosters', color: 'white' },
      { text: '' },
      { text: 'Click to view boosters!', color: 'yellow' }
    ],
    onClick: () => { Menu.toPage(PageNames.booster) }
  });

  const crate = Button({
    id: 'ender_chest',
    slot: 14,
    name: { text: 'Crates', color: 'light_purple', bold: true },
    lore: [
      ...textWrapper({ text: 'Open mystery crates to obtain rare loot, titles, and points.', color: 'gray' }),
      { text: '' },
      { text: 'Contains:', color: 'gold' },
      { text: ' • Common & Legendary Crates', color: 'white' },
      { text: ' • Rare jackpot rewards', color: 'white' },
      { text: '' },
      { text: 'Click to open crates!', color: 'yellow' }
    ],
    onClick: () => { Menu.toPage(PageNames.crate) }
  });

  const title = Button({
    id: 'name_tag',
    slot: 16,
    name: { text: 'Titles', color: 'yellow', bold: true },
    lore: [
      ...textWrapper({ text: 'Unlock and equip prestigious titles to showcase your achievements.', color: 'gray' }),
      { text: '' },
      { text: 'Features:', color: 'gold' },
      { text: ' • Skill-themed cosmetic badges', color: 'white' },
      { text: ' • Chat prefix customization', color: 'white' },
      { text: '' },
      { text: 'Click to customize titles!', color: 'yellow' }
    ],
    onClick: () => { Menu.toPage(PageNames.title) }
  });

  const page = Page(
    Menu,
    PageNames.shop,
    [
      goBack(Menu, PageNames.main),
      item,
      booster,
      crate,
      title
    ]
  );
  page.build();

}