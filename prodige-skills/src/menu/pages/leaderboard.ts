import { GUI } from "@prodigelib/gui";
import { goBack, PageNames } from "../const";
import { SkillList } from "../../skills";

export function initLeaderboardPage(Menu: GUI.Init) {
  const globalTopBtn: GUI.Button = {
    id: 'nether_star',
    slot: 4,
    name: { text: 'Global Top 10', color: 'gold', bold: true },
    lore: [{ text: 'The strongest players overall', color: 'gray' }]
  };

  const page: GUI.Page = {
    name: PageNames.leaderboard, // Ajoute "leaderboard" à tes PageNames
    Buttons: [
      goBack(Menu, PageNames.profile),
      globalTopBtn
    ]
  };

  // On ajoute un bouton pour chaque skill pour voir leur top spécifique
  SkillList.forEach((skill, i) => {
    page.Buttons?.push({
      id: skill.item,
      slot: 10 + i,
      name: { text: `${skill.name} Rankings`, color: 'yellow' },
      onClick: () => { /* Logic to show top players for this skill */ }
    });
  });

  Menu.pushPage(page);
}