import { Button, GUI, MacroArg as $, MenuObject, PageClass, PaginatedPageClass } from "@prodigelib/gui";
import { goBack, Mask, PageNames } from "../const";
import { SkillClass } from "../../skill";
import { ItemType } from "../../types";
import { DataPointClass, Variable } from "sandstone"; // 🟢 Ajout de Variable
import { ProgressBar } from "../../../lib/progressBar";

type NavTabConfig = {
  id: ItemType;
  slot: number;
  label: string;
  color: string;
  getPageName: (skillName: string) => string;
}
let startSlot = 21;
const tabs: NavTabConfig[] = [
  { id: "redstone", slot: startSlot++, label: "Progress", color: "yellow", getPageName: (name) => PageNames.progress(name) },
  { id: "book", slot: startSlot++, label: "Actions", color: "yellow", getPageName: (name) => PageNames.onEvent(name) },
  { id: "ender_eye", slot: startSlot++, label: "Stats & Ability", color: "yellow", getPageName: (name) => PageNames.ability(name) },
  { id: "diamond", slot: startSlot++, label: "Achievements", color: "yellow", getPageName: (name) => PageNames.achievement(name) }
];

const glint = "enchantment_glint_override=1";

export function navbar(menu: GUI, skill: SkillClass, pageName: string, page: PageClass | PaginatedPageClass) {
  const btns: MenuObject[] = [];

  // 1. On encapsule la logique dynamique dans une fonction pour éviter l'exécution dans le "load"
  const currentItemFunc = () => {
    const percentage = skill.Xp["*"](100)["/"](skill.XpTarget);
    const bar = (): DataPointClass => ProgressBar(percentage);

    // 🟢 CORRECTION SANDSTONE: On copie le level pour ne pas modifier le VRAI niveau du joueur en jeu
    const nextLevel = Variable(skill.level);
    nextLevel["+="](1);

    const currentItemBtn = Button({
      id: skill.itemId,
      slot: 20,
      name: $`§d${skill.name} Skill`,
      lore: [
        ...skill.description,
        "",
        $`§7Progress to Level ${nextLevel}: §e${percentage}%`,
        $`${bar} §e${skill.Xp}§6/§e${skill.XpTarget}`
      ],
      components: ['!attribute_modifiers', 'enchantment_glint_override=1']
    });

    if (page instanceof PageClass) {
      page.rawEmit(currentItemBtn); // Ici on peut utiliser rawEmit car on a un vrai ButtonClass
    } else {
      page.staticObjects.push(currentItemBtn);
    }
  }

  btns.push(
    ...Mask.navbar(),
    currentItemFunc, // 🟢 On passe la fonction SANS les (), pour qu'elle s'exécute à la construction de la page
    goBack(menu, PageNames.main),
    ...tabs.map((tab) => {
      const targetPage = tab.getPageName(skill.name);
      const isCurrent = pageName === targetPage;

      return Button({
        id: tab.id,
        slot: tab.slot,
        name: {
          text: tab.label,
          color: isCurrent ? tab.color : "dark_gray",
        },
        components: isCurrent ? [glint, "!attribute_modifiers"] : ["!attribute_modifiers"],
        onClick: isCurrent ? undefined : () => menu.toPage(targetPage)
      });
    })
  );

  btns.forEach(btn => {
    if (page instanceof PaginatedPageClass) {
      page.staticObjects.push(btn);
    } else {
      // 🟢 CORRECTION DE L'ERREUR : On utilise pushObject au lieu de rawEmit
      // pushObject accepte tous les MenuObject (Fonctions, Masques FillClick, Boutons...)
      page.pushObject(btn);
    }
  });
}