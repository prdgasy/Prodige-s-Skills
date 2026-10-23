import { Gui, PageClass, GuiMacro as G, Button } from "@prodigelib/gui";
import { _, DataVariable, Objective, say, tellraw, Variable } from "sandstone";
import { Skill } from "@src/skill";
import { Reward } from "@src/misc/reward";
import { Roman } from "@lib/roman";
import { FloatVar } from "@prodigelib/floatVar";
import { Bar } from "@lib/bar";
import { Navigation } from "./navigation";

export class Progress {
	public static index = Objective.create('progress_page_index')('@s');

	public static getName(skill: Skill) {
		return this.name + skill.name;
	}

	public static init(g: Gui, p: PageClass, skill: Skill) {
		// Levels
		p.add(() => {
			_.for([0, 17], 'iterate', slot => {
				const processedLevel = Progress.index['*'](18)['+'](slot)['+'](1);
				_.if(processedLevel['<='](100), () => {
					const roman = Roman.get(processedLevel);
					const progress = new FloatVar(skill.xp["*"](100))["/"](skill.goal);
					const bar = new Bar(progress.toScore());
					const count = Variable(processedLevel);
					_.if(count['=='](100), () => count.set(1));
					Reward.cases(skill, processedLevel, (rewards: Reward[]) => {
						const rewardLore = rewards.map(r => ` §8• ${r.name}`);

						const notReached = new Button(
							"red_stained_glass_pane", G(slot), G`§c${skill.name} ${roman}`,
							[
								G`§9${skill.name} ${processedLevel}`,
								"",
								"§f§lRewards:",
								...rewardLore,
							], () => { }, G(count), ['max_stack_size=99'],
						);

						const current = new Button(
							"yellow_stained_glass_pane", G(slot), G`§e${skill.name} ${roman}`,
							[
								G`§9${skill.name} ${processedLevel}`,
								"",
								G`§f§lProgress: §e${progress.toData()}%`,
								G` §8> ${bar.toData()} §e${skill.xp}§6/§e${skill.goal}`,
								"",
								"§f§lRewards: ",
								...rewardLore,
							], () => { say('test'); }, G(count), ['max_stack_size=99']
						);

						const reached = new Button(
							"green_stained_glass_pane", G(slot), G`§a${skill.name} ${roman}`,
							[
								G`§9${skill.name} ${processedLevel}`,
								"",
								'§f§lRewards:',
								...rewardLore
							], () => { }, G(count), ['max_stack_size=99'],
						);


						const nextLevel = skill.level['+'](1);
						_.if(nextLevel['<'](processedLevel), () => {
							p.emit(notReached);
						})
							.elseIf(nextLevel['>'](processedLevel), () => {
								p.emit(reached);
							})
							.elseIf(nextLevel["=="](processedLevel), () => {
								p.emit(current);
							});
					});
				})
			});
		});

		// Navigation
		p.add(() => Navigation.render(g, p, skill));
		p.add(() => Navigation.generateSliders(p, Progress.index, 5))
		return p;
	}
}