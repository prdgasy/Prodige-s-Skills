import { Button, GUI, MacroArg as $, MenuObject, PageClass, PaginatedPageClass } from "@prodigelib/gui";
import { goBack, Mask, PageNames } from "../const";
import { SkillClass } from "../../skill";
import { ItemType } from "../../types";
import { DataPointClass } from "sandstone";
import { ProgressBar } from "../../../lib/progressBar";

type NavTabConfig = {
  id: ItemType;
  slot: number;
  label: string;
  color: string;
  getPageName: (skillName: string) => string;
};

let startSlot = 21;
const tabs: NavTabConfig[] = [
  { id: "redstone", slot: startSlot++, label: "Progress", color: "yellow", getPageName: (name) => PageNames.progress(name) },
  { id: "book", slot: startSlot++, label: "Actions", color: "yellow", getPageName: (name) => PageNames.onEvent(name) },
  { id: "ender_eye", slot: startSlot++, label: "Stats & Ability", color: "yellow", getPageName: (name) => PageNames.ability(name) },
  { id: "diamond", slot: startSlot++, label: "Achievements", color: "yellow", getPageName: (name) => PageNames.achievement(name) }
];

const glint = "enchantment_glint_override=1";

export function navbar(menu: GUI, skill: SkillClass, pageName: string, page: PageClass | PaginatedPageClass) {

  // 🟢 1. Définition de la fonction anonyme. 
  // Elle accepte `p` (l'instance réelle de PageClass) et NE S'EXÉCUTE PAS tout de suite.
  const renderCurrentItem = (p: PageClass) => {
    const percentage = skill.xp["*"](100)["/"](skill.xpTarget);
    const bar = (): DataPointClass => ProgressBar(percentage);
    const nextLevel = skill.level["+"](1);

    const currentItemBtn = Button({
      id: skill.itemId,
      slot: 20,
      name: $`§d${skill.name} Skill`,
      lore: [
        ...skill.description,
        "",
        "§f§lProgression Overview",
        $` §8• §7Target Level: §dLevel ${nextLevel}`,
        $` §8• §7Progress Ratio: §e${percentage}%`,
        $` §8> ${bar} §e${skill.xp}§6/§e${skill.xpTarget}`,
        "",
        "§8Skill progression overview."
      ],
      components: ['!attribute_modifiers', 'enchantment_glint_override=1']
    });

    // Émet le bouton dans le contexte actif (fill ou click) de la page p
    p.rawEmit(currentItemBtn);
  };

  const btns: (MenuObject | ((p: PageClass) => void))[] = [
    ...Mask.navbar(),
    renderCurrentItem, // 🟢 ON PASSE LA FONCTION SANS PARENTHÈSES () !
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
  ];

  // 🟢 2. Transmission aux objets statiques ou à la page
  btns.forEach(btn => {
    if (page instanceof PaginatedPageClass) {
      page.staticObjects.push(btn as any);
    } else {
      page.pushObject(btn as any);
    }
  });
}