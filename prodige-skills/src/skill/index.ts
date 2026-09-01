import { ToolClass } from "../object/tool";
import { ItemType } from "../types";
import { OnEvent, OnEventClass } from "./onEvent";
import { TitleClass } from "./title";
import { Ability, AbilityClass } from "./ability";
import { Objective, Score, tellraw, title, Variable, _, say, playsound } from "sandstone";
import { Player } from "../player";
import { Achievement, AchievementClass } from "./achievement";
import { Reward, RewardClass } from "../object/reward";
import { textWrapper } from "../../lib/textWrapper";
import * as path from 'path';
import { loadSkillsFromCSV } from './skillLoader';
export * from "./ability";
export * from "./achievement";
export * from "./onEvent";
export * from "./title";

type SkillOptions = {
  name: string;
  itemId: ItemType;

  description?: string[];
  startingXp?: number;
  titles?: TitleClass[];
  ability?: AbilityClass;
  onEvents?: OnEventClass[];
  customItems?: ToolClass[];
  achievements?: AchievementClass[];
  rewards?: Map<number, RewardClass[]>;
}

export class SkillClass {
  static progression: Score = Objective.create('skill.progression')('@p');
  static notif: Score = Objective.create('skill.notif')('@p');
  name: string;
  itemId: ItemType;

  description: string[];
  startingXp: number;
  onEvents: OnEventClass[];
  customItems: (ToolClass)[];
  achievements: AchievementClass[];
  titles: TitleClass[];
  ability: AbilityClass;

  level: Score;
  xp: Score;
  xpTarget: Score;

  totalXp: Score;
  totalPts: Score;

  currentAchievement: Score;

  rewards: Map<number, RewardClass[]>;

  constructor(skillOptions: SkillOptions) {
    this.name = skillOptions.name;
    this.description = skillOptions.description ?? ["<description>"];
    this.itemId = skillOptions.itemId;
    this.startingXp = skillOptions.startingXp ?? 40;
    this.onEvents = skillOptions.onEvents ?? [];
    this.customItems = skillOptions.customItems ?? [];
    this.achievements = skillOptions.achievements ?? [];
    this.titles = skillOptions.titles ?? [];
    this.ability = skillOptions.ability ?? Ability({ parent: this, name: 'notimple', description: [] });

    this.level = Objective.create(`${this.name}.level`)('@p');
    this.xp = Objective.create(`${this.name}.Xp`)('@p');
    this.xpTarget = Objective.create(`${this.name}.XpTarget`)('@p');

    this.totalXp = Objective.create(`${this.name}.totalXp`)('@p');
    this.totalPts = Objective.create(`${this.name}.totalPts`)('@p');

    this.currentAchievement = Objective.create(`${this.name}.currentAchievement`)('@p');

    this.rewards = skillOptions.rewards ?? new Map<number, RewardClass[]>();
  }

  displayProgress(XpAdded: Score, pointAdded: Score) {
    _.if(OnEventClass.notif, () => title('@p').actionbar([
      { text: this.name }, this.level, '+', XpAdded, 'Xp + ', pointAdded, 'Point'
    ]));

  }

  levelUp() {
    // Reset xp
    this.xp["-="](this.xpTarget);

    // set new target
    this.xpTarget["*="](13)["/="](10);
    _.if(this.xpTarget['>'](5000), () => {
      this.xpTarget.set(5000);
    });

    // give reward
    RewardClass.giveRewards(this);

    // send notif
    const displayNotification = (rewards: string[]) => {
      _.if(SkillClass.notif, () => {
        title('@p').title([{ text: `${this.name} Level Up!` }]);
        title('@p').subtitle([Variable(this.level)['--'], `§8➜ `, Variable(this.level)['++']]);
        tellraw('@p', [
          `§m-------------------------------------------------§r\n`,
          '  ',
          { text: `${this.name} Level Up!\n `, color: 'green', bold: true },
          Variable(this.level)['--'], '§8➜ ', Variable(this.level)['++'], '\n\n',
          'Next Level: ', this.name, this.level, this.xp, '/', this.xpTarget, '\n',
          '==============\n',
          'Rewards: \n',
          ...rewards,
          '\n'
        ]);
      })
    };
    RewardClass.resolve(this, this.level, displayNotification);

    // add level
    this.level["++"];

    // ability tiers
    _.if(this.level["=="](10), () => {
      this.ability.tier["++"];
      _.if(SkillClass.notif, () => {
        tellraw('@p', ['Ability Unlokced! Unlocked tier I', this.ability.name, this.ability.tier]);
        _.if(Player.sound, () => playsound('entity.ender_dragon.growl', 'master', '@p', '~ ~ ~', 1, 0));
      })
    }).elseIf(this.level["%"](10)["=="](0), () => {
      tellraw('@p', ['Ability upgrade! ', this.ability.name, this.ability.tier]);
      _.if(Player.sound, () => playsound('entity.ender_dragon.growl', 'master', '@p', '~ ~ ~', 1, 0));
    })

    _.if(SkillClass.notif, () => tellraw('@p', `§m-------------------------------------------------§r`));
  }
}

export function Skill({
  name,
  itemId,
  description,
  startingXp,
  onEvents,
  customItems,
  achievements,
  titles,
  ability,
  rewards,
}: SkillOptions) {
  return new SkillClass({
    name,
    itemId,
    description,
    startingXp,
    onEvents,
    customItems,
    achievements,
    titles,
    ability,
    rewards
  })
}



// Importation automatique depuis le dossier où sont stockés tes CSV
export const SkillList = loadSkillsFromCSV(path.join(__dirname, 'csv_data'));

// On récupère le skill pour lui lier ses récompenses dynamiques (car les fonctions ne passent pas en CSV)
const Mining = SkillList.find(s => s.name === 'Mining');

if (Mining) {
  Mining.rewards.set(10, [Reward({ show: '§dCustom Reward', get: () => { say('got custom reward') } })]);
  Mining.rewards.set(20, [Reward({ show: '§dCustom Reward 2', get: () => { say('got custom reward 2') } })]);
}