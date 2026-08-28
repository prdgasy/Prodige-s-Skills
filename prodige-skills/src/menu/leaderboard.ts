import { GUI, Page, Button } from "@prodigelib/gui";
import { goBack, PageNames } from "./const";
import { SkillList } from "../skill";

export function initLeaderboard(Menu: GUI) {
  const globalTopBtn = Button({
    id: 'nether_star',
    slot: 4,
    name: { text: 'Global Top 10', color: 'gold', bold: true },
    lore: [{ text: 'The strongest players overall', color: 'gray' }]
  });

  const page = Page(
    Menu,
    PageNames.leaderboard, // Ajoute "leaderboard" à tes PageNames
    [
      goBack(Menu, PageNames.profile),
      globalTopBtn
    ]
  );

  // On ajoute un bouton pour chaque skill pour voir leur top spécifique
  SkillList.forEach((skill, i) => {
    page.pushObject(Button({
      id: skill.itemId,
      slot: 10 + i,
      name: { text: `${skill.name} Rankings`, color: 'yellow' },
      onClick: () => { /* Logic to show top players for this skill */ }
    }));
  });

  page.build();
}