import { Score, Objective } from 'sandstone';
import { SkillList } from '../skills';
import { GUI } from '@prodigelib/gui';
const ProgressPageIndex = Objective.create('prodiges_skills.progress_page_index')('@s');
/** Stores player level scores per skill */
const SkillLevelScore: Record<string, Score> = {};
const PrestigeLevelScore: Record<string, Score> = {};
SkillList.forEach(skill => {
  SkillLevelScore[skill.name] = Objective.create(`${skill.name}.level`)('@p');
  PrestigeLevelScore[skill.name] = Objective.create(`${skill.name}.prestige`)('@p');
});
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
  quest: (skillName: string): string => { return `quest_${skillName}`; },
  progress: (skillName: string): string => { return `progress_${skillName}`; },
  onEvent: (skillName: string, index: number): string => { return `onEvent_${skillName}_${index}`; },
}
const totalSlots = 17;
/**
   * Navigate back to a given page
   */
const goBack = (Menu: GUI.Init, previousPage: GUI.Page | string): GUI.Button => ({
  id: 'arrow',
  slot: 21,
  name: { text: 'Go back', color: 'red' },
  onClick: () => Menu.toPage(previousPage)
});
export { PageNames, ProgressPageIndex, SkillLevelScore, PrestigeLevelScore, totalSlots, goBack };