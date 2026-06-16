import { Score, Objective } from 'sandstone';
import { SkillList } from '../skills';
import { Button, ButtonClass, GUI, PageClass } from '@prodigelib/gui';
const ProgressPageIndex = Objective.create('progress_page_index')('@s');

const PageNames = {
  main: 'main',
  prestige: 'prestige',
  shop: 'shop',
  booster: 'booster',
  item: 'item',
  title: 'title',
  profile: 'profile',
  crate: 'crate',
  settings: 'settings',
  leaderboard: 'leaderboard',
  ability: (skillName: string): string => { return `ability_${skillName}`; },
  dailyTask: 'dailyTasks',
  milestone: 'milestone',
  quest: (skillName: string): string => { return `quest_${skillName}`; },
  progress: (skillName: string): string => { return `progress_${skillName}`; },
  onEvent: (skillName: string, index: number): string => { return `onEvent_${skillName}_${index}`; },
}
const totalSlots = 17;
/**
 * Navigate back to a given page
 */
const goBack = (Menu: GUI, previousPage: PageClass | string): ButtonClass => {
  return Button({
    id: 'arrow',
    slot: 21,
    name: { text: 'Go back', color: 'red' },
    onClick: () => Menu.toPage(previousPage)
  })
};

export { PageNames, ProgressPageIndex, totalSlots, goBack };