import { Button, ButtonClass, GUI, MacroArg as $, MenuObject, PageClass, PaginatedPageClass } from "@prodigelib/gui";
import { goBack, PageNames } from "../const";
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
}
let startSlot = 20;
const tabs: NavTabConfig[] = [
  { id: "redstone", slot: startSlot++, label: "Progress", color: "green", getPageName: (name) => PageNames.progress(name) },
  { id: "book", slot: startSlot++, label: "Actions", color: "gold", getPageName: (name) => PageNames.onEvent(name) },
  { id: "ender_eye", slot: startSlot++, label: "Ability", color: "light_purple", getPageName: (name) => PageNames.ability(name) },
  { id: "diamond", slot: startSlot++, label: "Achievements", color: "aqua", getPageName: (name) => PageNames.achievement(name) }
];

const glint = "enchantment_glint_override=1";

export function navbar(menu: GUI, skill: SkillClass, pageName: string, page: PageClass | PaginatedPageClass): MenuObject[] {

  // 1. Définition directe du bouton currentItem
  const percentage = skill.xp["*"](100)["/"](skill.xpTarget);
  const bar = (): DataPointClass => ProgressBar(percentage);
  const nextLevel = skill.level["+"](1);

  const currentItemBtn = Button({
    id: skill.itemId,
    slot: 19,
    name: { text: $`${skill.name} Skill`, color: "green" },
    lore: [
      ...skill.description,
      "",
      { text: $`Progress to Level ${nextLevel}: §e${percentage}%`, color: "gray" },
      { text: $`${bar} §e${skill.xp}§6/§e${skill.xpTarget}` }
    ],
    components: ['!attribute_modifiers', 'enchantment_glint_override=1']
  });

  // 2. Si c'est une PageClass normale, on peut wrapper l'émission avec rawEmit
  // Si c'est une PaginatedPageClass, on renvoie directement le ButtonClass pour qu'il soit dans staticObjects dès le départ !
  const currentItemObject: MenuObject = (page instanceof PageClass)
    ? () => page.rawEmit(currentItemBtn)
    : currentItemBtn;

  return [
    currentItemObject,
    goBack(menu, PageNames.main),
    ...tabs.map((tab) => {
      const targetPage = tab.getPageName(skill.name);
      const isCurrent = pageName === targetPage;

      return Button({
        id: tab.id,
        slot: tab.slot,
        name: {
          text: tab.label,
          color: tab.color,
          bold: isCurrent
        },
        components: isCurrent ? [glint, "!attribute_modifiers"] : ["!attribute_modifiers"],
        onClick: isCurrent ? undefined : () => menu.toPage(targetPage)
      });
    })
  ];
}