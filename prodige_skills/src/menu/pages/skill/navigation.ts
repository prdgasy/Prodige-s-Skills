import { Roman } from "@lib/roman";
import { FloatVar } from "@prodigelib/floatVar";
import { Button, GuiMacro as $, PageClass, Gui } from "@prodigelib/gui";
import { Skill } from "@src/skill";
import { DataPointClass, raw, say } from "sandstone";
import { Item, SubSkillPage } from '@src/types';
import { Progress } from "./progress";
import { Actions } from "./actions";
import { Gunzip } from "node:zlib";
import { Bar } from "@lib/bar";

type Tab = {
	name: string,
	item: Item,
	page: SubSkillPage
	f?: () => void;
}

export class Navigation {

	public static generateTabs(g: Gui, p: PageClass, skill: Skill) {
		let slot = 22;
		const tabs: Tab[] = [
			{ name: 'Actions', item: 'book', page: Actions, f: () => Actions.index.set(0) },
			// { name: 'Stats & Ability', item: 'ender_eye', page: StatsAbility },
			// { name: 'Achievements', item: 'diamond', page: Achievements }
		];

		for (const t of tabs) {
			p.emit(new Button(
				t.item, slot++, t.name, [],
				() => {
					t.f?.();
					g.switch(t.page.getName(skill))
				}// add custom sound later
			));
		}
	}

	public static render(g: Gui, p: PageClass, skill: Skill) {
		raw('execute if score anon_xTSjehSB_1 __sandstone matches 0 run say hey');
		const progress = new FloatVar(skill.xp)['*'](100)['/'](skill.goal);
		const bar = new Bar(progress.toScore()).toData();
		const next = Roman.get(skill.level['+'](1));
		const currentSkill = new Button(
			skill.item, 21, '§aProgress',
			[
				$`§9${skill.name} ${skill.level}`,
				'',
				skill.description,
				"",
				"§f§lProgression Overview:",
				$` §8• §7Target Level: §d${skill.name} ${next}`,
				$` §8• §7Progress: §e${progress.toData()}%`,
				$` §8> ${bar} §e${skill.xp}§6/§e${skill.goal}`,
				"",
				"§eClick to view!"
			], () => g.switch(Progress.getName(skill)), $(skill.level), ['!attribute_modifiers', 'enchantment_glint_override=1', 'max_stack_size=99', '!max_damage']
		);

		p.emit(currentSkill);
		this.generateTabs(g, p, skill);
	}
}

// type NavTabConfig = {
// 	id: ItemType;
// 	slot: number;
// 	label: string;
// 	color: string;
// 	getPageName: (skillName: string) => string;
// };

// let startSlot = 21;
// const tabs: NavTabConfig[] = [
// 	{ id: "redstone", slot: startSlot++, label: "Progress", color: "yellow", getPageName: (name) => PageNames.progress(name) },
// 	{ id: "book", slot: startSlot++, label: "Actions", color: "yellow", getPageName: (name) => PageNames.onEvent(name) },
// 	{ id: "ender_eye", slot: startSlot++, label: "Stats & Ability", color: "yellow", getPageName: (name) => PageNames.ability(name) },
// 	{ id: "diamond", slot: startSlot++, label: "Achievements", color: "yellow", getPageName: (name) => PageNames.achievement(name) }
// ];

// const glint = "enchantment_glint_override=1";

// export function navbar(menu: GUI, skill: Skill, pageName: string, page: PageClass | PaginatedPageClass) {

// 	// 🟢 1. Définition de la fonction anonyme.
// 	// Elle accepte `p` (l'instance réelle de PageClass) et NE S'EXÉCUTE PAS tout de suite.
// 	const renderCurrentItem = (p: PageClass) => {
// 		const percentage = skill.xp["*"](100)["/"](skill.xpTarget);
// 		const bar = (): DataPointClass => ProgressBar(percentage);
// 		const nextLevel = skill.level["+"](1);

// 		const currentItemBtn = Button({
// 			id: skill.itemId,
// 			slot: 20,
// 			name: $`§d${skill.name} ${RomanNumbers.convert(skill.level)}`,
// 			lore: [
// 				"",
// 				...skill.description,
// 				"",
// 				"§f§lProgression Overview",
// 				$` §8• §7Target Level: §d${skill.name} ${RomanNumbers.convert(nextLevel)}`,
// 				$` §8• §7Progress: §e${percentage}%`,
// 				$` §8> ${bar} §e${skill.xp}§6/§e${skill.xpTarget}`,
// 				"",
// 				"§8Skill progression overview."
// 			],
// 			count: $(skill.level),
// 			components: ['!attribute_modifiers', 'enchantment_glint_override=1', 'max_stack_size=99', '!max_damage']
// 		});

// 		// Émet le bouton dans le contexte actif (fill ou click) de la page p
// 		p.rawEmit(currentItemBtn);
// 	};

// 	const btns: (MenuObject | ((p: PageClass) => void))[] = [
// 		...Mask.navbar(),
// 		renderCurrentItem, // 🟢 ON PASSE LA FONCTION SANS PARENTHÈSES () !
// 		goBack(menu, PageNames.main),
// 		...tabs.map((tab) => {
// 			const targetPage = tab.getPageName(skill.name);
// 			const isCurrent = pageName === targetPage;

// 			return Button({
// 				id: tab.id,
// 				slot: tab.slot,
// 				name: {
// 					text: tab.label,
// 					color: isCurrent ? tab.color : "dark_gray",
// 				},
// 				components: isCurrent ? [glint, "!attribute_modifiers"] : ["!attribute_modifiers"],
// 				onClick: isCurrent ? undefined : () => menu.toPage(targetPage)
// 			});
// 		})
// 	];

// 	// 🟢 2. Transmission aux objets statiques ou à la page
// 	btns.forEach(btn => {
// 		if (page instanceof PaginatedPageClass) {
// 			page.staticObjects.push(btn as any);
// 		} else {
// 			page.pushObject(btn as any);
// 		}
// 	});
// }