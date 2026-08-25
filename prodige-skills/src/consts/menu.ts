import { Objective } from 'sandstone';
import { Button, ButtonClass, GUI, PageClass } from '@prodigelib/gui';
import { textWrapper } from '../../lib/textWrapper';

export const ProgressPageIndex = Objective.create('progress_page_index')('@s');

export const PageNames = {
  main: 'main',
  shop: 'shop',
  booster: 'booster',
  item: 'item',
  title: 'title',
  profile: 'profile',
  crate: 'crate',
  settings: 'settings',
  leaderboard: 'leaderboard',
  ability: (skillName: string): string => `ability_${skillName}`,
  dailyTask: 'dailyTasks',
  milestone: 'milestone',
  achievement: (skillName: string): string => `achievement_${skillName}`,
  progress: (skillName: string): string => `progress_${skillName}`,
  onEvent: (skillName: string): string => `onEvent_${skillName}`,
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



