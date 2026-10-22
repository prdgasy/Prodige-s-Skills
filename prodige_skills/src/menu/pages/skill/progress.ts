import { Gui, PageClass, GuiMacro as G, Button } from "@prodigelib/gui";
import { _, DataVariable, Objective, say, tellraw } from "sandstone";
import { Skill } from "@src/skill";
import { Reward } from "@src/misc/reward";
import { Roman } from "@lib/roman";
import { FloatVar } from "@prodigelib/floatVar";
import { Bar } from "@lib/bar";
import { Navigation } from "./navigation";

export class Progress {
	public static pageIndex = Objective.create('progress_page_index')('@s');

	public static getName(skill: Skill) {
		return this.name + skill.name;
	}

	public static init(g: Gui, p: PageClass, skill: Skill) {
		// Levels
		p.add(() => {
			_.for([0, 17], 'iterate', slot => {
				const processedLevel = Progress.pageIndex['*'](17)['+'](slot)['+'](1);
				const roman = Roman.get(processedLevel);
				const progress = new FloatVar(skill.xp["*"](100))["/"](skill.goal);
				const bar = new Bar(progress.toScore());
				Reward.cases(skill, processedLevel, (rewards: Reward[]) => {
					const rewardLore = rewards.map(r => ` §8• ${r.name}`);

					const notReached = new Button(
						"red_stained_glass_pane", G(slot), G`§c${skill.name} ${roman}`,
						[
							G`§9${skill.name} ${processedLevel}`,
							"",
							"§f§lRewards:",
							...rewardLore,
						], () => { }, G(processedLevel), ['max_stack_size=99'],
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
						], () => { say('test'); }, G(processedLevel), ['max_stack_size=99']
					);

					const reached = new Button(
						"green_stained_glass_pane", G(slot), G`§a${skill.name} ${roman}`,
						[
							G`§9${skill.name} ${processedLevel}`,
							"",
							'§f§lRewards:',
							...rewardLore
						], () => { }, G(processedLevel), ['max_stack_size=99'],
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
			});
		});

		// Navigation
		p.add(() => Navigation.render(g, p, skill));
		return p;
	}
}

// const totalSlots = 17;

// export function initProgress(Menu: GUI, skill: Skill) {

//   const page = Page(Menu, PageNames.progress(skill.name));
//   // --- Loop & State Generator ---
//   const levels = () => {
//     const percentage = skill.xp["*"](100)["/"](skill.xpTarget);
//     const nextLevel = skill.level["+"](1);

//     _.for([0, totalSlots], 'iterate', i => {
//       const processedLevel = i['+'](ProgressPageIndex['*'](totalSlots))["++"];
//       processedLevel['+='](ProgressPageIndex);
//       const r = RomanNumbers.convert(processedLevel);
//       const emitBtn = (rewards: string[]) => {
//         const notReached = Button({
//           id: "red_stained_glass_pane",
//           slot: $(i),
//           name: $`§c${skill.name} ${r}`,
//           lore: [
//             $`§9${skill.name} ${processedLevel}`,
//             '',
//             "",
//             "§f§lRewards",
//             ...rewards,
//           ],
//           count: $(processedLevel),
//           components: ['max_stack_size=99']
//         });
//         const inProgress = Button({
//           id: "yellow_stained_glass_pane",
//           name: $`§e${skill.name} ${r}`,
//           slot: $(i),
//           lore: [
//             $`§9${skill.name} ${processedLevel}`,
//             '',
//             "",
//             $`§f§lProgress: §e${percentage}%`,
//             $` §8> ${ProgressBar(percentage)} §e${skill.xp}§6/§e${skill.xpTarget}`,
//             "",
//             "§f§lRewards: ",
//             ...rewards,
//           ],
//           count: $(processedLevel),
//           components: ['max_stack_size=99']
//         });
//         const reached = Button({
//           id: "green_stained_glass_pane",
//           name: $`§a${skill.name} ${r}`,
//           lore: [
//             $`§9${skill.name} ${processedLevel}`,
//             '',
//             "",
//             '§f§lRewards:',
//             ...rewards
//           ],
//           slot: $(i),
//           count: $(processedLevel),
//           components: ['max_stack_size=99']
//         });

//         _.if(nextLevel['<'](processedLevel), () => {
//           page.rawEmit(notReached);
//         })
//           .elseIf(nextLevel['>'](processedLevel), () => {
//             page.rawEmit(reached);
//           })
//           .elseIf(nextLevel["=="](processedLevel), () => {
//             page.rawEmit(inProgress);
//           });
//       };
//       RewardClass.resolve(skill, processedLevel, emitBtn);
//     });
//   };

//   // --- Navigation & Action Buttons ---

//   const prev = Button({
//     id: 'paper',
//     slot: 25,
//     name: "§ePrevious",
//     onClick: () => _.if(ProgressPageIndex['>'](0), () => ProgressPageIndex['--'])
//   });

//   const next = Button({
//     id: 'paper',
//     slot: 26,
//     name: "§eNext",
//     onClick: () => _.if(ProgressPageIndex['<'](5), () => ProgressPageIndex['++'])
//   });

//   // --- Page Registration & Build ---
//   navbar(Menu, skill, PageNames.progress(skill.name), page)
//   page.pushObject(

//     prev,
//     next,
//     levels,
//   );

//   page.build();

