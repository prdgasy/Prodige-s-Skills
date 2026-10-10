import { Gui, PageClass } from "@prodigelib/gui";
import { Objective } from "sandstone";


import { Skill } from "@/skill";


export class Progress {
  static pageIndex = Objective.create('progress_page_index')('@s');

  static getName(skill: Skill) {
    return `progress_${skill.name}`;
  }

  static init(g: Gui, p: PageClass, skill: Skill) {
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

// }