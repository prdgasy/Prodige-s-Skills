import { Roman } from "@lib/roman";
import { Float } from "@prodigelib/floatVar";
import { Button, PageClass, Gui, GuiMacro as $ } from "@prodigelib/gui";
import { Skill } from "@src/skill";
import { _, DataPointClass, DataVariable, raw, say, Score, tellraw } from "sandstone";
import { Item, SubSkillPage } from '@src/types';
import { Progress } from "./progress";
import { Actions } from "./actions";
import { Bar } from "@lib/bar";
import { Global } from "@src/global";
import { Achievements } from "./achievements";
import { StatsAbility } from "./statsability";
import { Main } from "@src/menu/main";

type Tab = {
	name: string,
	item: Item,
	page: SubSkillPage
	f?: () => void;
}

export class Navigation {
	public static storage = Global.storage.select('navigation');
	public static generateTabs(g: Gui, p: PageClass, skill: Skill) {
		const tabs: Tab[] = [
			{ name: 'Actions', item: 'book', page: Actions, f: () => Actions.index.set(0) },
			{ name: 'Stats & Ability', item: 'ender_eye', page: StatsAbility },
			{ name: 'Achievements', item: 'diamond', page: Achievements }
		];
		let slot = 21;
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
		const progress = skill.xp['*'](100)['/'](skill.goal);
		const bar = new Bar(progress.toScore()).toData();
		const next = Roman.get(skill.level['+'](1));
		const currentSkill = new Button(
			skill.item, 20, '§aProgress',
			[
				$`§9${skill.name} ${skill.level}`,
				'',
				skill.description,
				"",
				"§f§lProgression Overview:",
				$` §8• §7Target Level: §d${skill.name} ${next}`,
				$` §8• §7Progress: §e${progress.show()}%`,
				$` §8> ${bar} §e${skill.xp.show()}§6/§e${skill.goal}`,
				"",
				"§eClick to view!"
			], () => g.switch(Progress.getName(skill)), $(skill.level), ['!attribute_modifiers', 'enchantment_glint_override=1', 'max_stack_size=99', '!max_damage']
		);

		p.emit(currentSkill);
		this.generateTabs(g, p, skill);
		p.emit(new Button(
			'arrow', 18, '§cBack', [], () => g.switch(Main.getName())
		))
	}

	public static generateSliders(p: PageClass, slider: Score, max: number) {
		const bottom = slider['=='](0);
		const top = slider['=='](max);

		const p_name = DataVariable('§cPrevious');
		_.if(bottom, () => p_name.set('§7Previous'));
		const previous = new Button(
			'paper', 25, $`${p_name}`, [],
			() => { _.if(_.not(bottom), () => { slider['--']; }) }
		)

		const n_name = DataVariable('§aNext');
		_.if(top, () => n_name.set('§7Next'));
		const next = new Button(
			'paper', 26, $`${n_name}`, [],
			() => { _.if(_.not(top), () => { slider['++']; }) }
		)

		p.emit(previous);
		p.emit(next);


	}
}