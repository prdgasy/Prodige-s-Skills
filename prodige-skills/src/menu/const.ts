import { Objective } from 'sandstone';
import { Button, ButtonClass, GUI, PageClass } from '@prodigelib/gui';
import { textWrapper } from '../../lib/textWrapper';

export const ProgressPageIndex = Objective.create('progress_page_index')('@s');

export const PageNames = {
  main: 'Main',
  shop: 'Shop',
  booster: 'Booster',
  item: 'Item',
  title: 'Title',
  profile: 'Profile',
  crate: 'Crate',
  settings: 'Settings',
  leaderboard: 'Leaderboard',
  ability: (skillName: string): string => `Ability_${skillName}`,
  dailyTask: 'Daily_Tasks',
  milestone: 'Milestone',
  achievement: (skillName: string): string => `Achievement_${skillName}`,
  progress: (skillName: string): string => `Progress_${skillName}`,
  onEvent: (skillName: string): string => `Actions_${skillName}`,
}

/**
 * Navigate back to a given page
 */
export const goBack = (Menu: GUI, previousPage: PageClass | string): ButtonClass => {
  return Button({
    id: 'arrow',
    slot: 18,
    name: { text: 'Go back', color: 'red' },
    onClick: () => Menu.toPage(previousPage)
  })
};

export namespace Mask {
  export function navbar() {
    const mask: ButtonClass[] = [];
    for (let i = 18; i <= 26; i++) {
      mask.push(Button({
        id: 'black_stained_glass_pane',
        slot: i,
        name: ""
      }));
    }
    return mask;
  }

  export function gray() {
    const mask: ButtonClass[] = [];
    for (let i = 0; i <= 26; i++) {
      mask.push(Button({
        id: 'gray_stained_glass_pane',
        slot: i,
        name: ""
      }));
    }
    return mask;
  }

  export function Mask(): ButtonClass {
    throw new Error("Function not implemented.");
  }
}


