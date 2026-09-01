import { ToolClass } from "../object/tool";
import { ItemType } from "../types";
import { OnEvent, OnEventClass } from "./onEvent";
import { TitleClass } from "./title";
import { Ability, AbilityClass } from "./ability";
import { Objective, Score, tellraw, title, Variable, _, say } from "sandstone";
import { Player } from "../player";
import { Achievement, AchievementClass } from "./achievement";
import { Reward, RewardClass } from "../object/reward";
import { textWrapper } from "../../lib/textWrapper";
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
  Xp: Score;
  XpTarget: Score;

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
    this.Xp = Objective.create(`${this.name}.Xp`)('@p');
    this.XpTarget = Objective.create(`${this.name}.XpTarget`)('@p');

    this.totalXp = Objective.create(`${this.name}.totalXp`)('@p');
    this.totalPts = Objective.create(`${this.name}.totalPts`)('@p');

    this.currentAchievement = Objective.create(`${this.name}.currentAchievement`)('@p');

    this.rewards = skillOptions.rewards ?? new Map<number, RewardClass[]>();
  }

  displayProgress(XpAdded: Score, pointAdded: Score) {
    title(Player.select(Player.option.progressNotif)).actionbar([
      { text: this.name }, this.level, '+', XpAdded, 'Xp + ', pointAdded, 'Point'
    ]);
  }

  levelUp() {
    this.XpTarget["*="](13)["/="](10);
    _.if(this.XpTarget['>'](5000), () => {
      this.XpTarget.set(5000);
    })

    title(Player.select(Player.option.levelNotif)).title([
      { text: `${this.name} Level Up!` }
    ]);
    title(Player.select(Player.option.levelNotif)).subtitle([
      Variable(this.level)['--'], `§8➜ `, Variable(this.level)['++']
    ]);

    RewardClass.giveRewards(this);

    const displayNotification = (rewards: RewardClass[]) => {
      tellraw(Player.select(Player.option.levelNotif), [
        `§m-------------------------------------------------§r\n`,
        '  ',
        { text: `${this.name} Level Up!\n `, color: 'green', bold: true },
        Variable(this.level)['--'], '§8➜ ', Variable(this.level)['++'], '\n\n',
        'Next Level: ', this.name, this.level, this.Xp, '/', this.XpTarget, '\n',
        '==============\n',
        'Rewards: \n',
        ...RewardClass.joinString(rewards),
        '\n',
        `§m-------------------------------------------------§r`
      ]);
    };

    if (this.rewards.size > 0) {
      this.rewards.forEach((rewards, lvl) => {
        _.if(this.level["=="](lvl), () => {
          displayNotification(rewards);
        });
      });
      const notCustom = Array.from(this.rewards.keys()).map(lvl => this.level["!="](lvl));
      _.if(_.and(...notCustom), () => {
        displayNotification(RewardClass.common(this));
      });
    } else {
      displayNotification(RewardClass.common(this));
    }
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

const Mining = Skill({
  name: 'Mining',
  description: textWrapper('Mine, mine, mien, very long too. Lets see how it goes'),
  itemId: 'diamond_pickaxe',
  startingXp: 15,
});
Mining.ability = Ability({
  parent: Mining,
  name: 'Miner Speed',
  description: textWrapper('Increases mining speed when hodling a pickaxe, but this is also very coow'),

})
Mining.onEvents.push(
  OnEvent({ parent: Mining, name: 'Stone', itemId: 'stone', criteria: 'minecraft.mined:minecraft.stone', Xp: 1, pts: 5 }),
  OnEvent({ parent: Mining, name: 'Coal Ore', itemId: 'coal_ore', criteria: 'minecraft.mined:minecraft.coal_ore', Xp: 3, pts: 5 }),
  OnEvent({ parent: Mining, itemId: 'iron_ore' })
);
Mining.achievements.push(
  Achievement({
    parent: Mining,
    itemId: 'charcoal',
    id: 'mine_coal_ach',
    name: 'Mine 1000 stone',
    target: 1000,
  }),
  Achievement({
    parent: Mining,
    itemId: 'stone',
    id: 'mine_stone_ach',
    name: 'Mine 1000 stone',
    target: 1000,
  }),
  Achievement({
    parent: Mining,
    itemId: 'diamond_ore',
    id: 'mine_diamond_ach',
    name: 'Mine 1000 stone',
    target: 1000,
  })
);

Mining.rewards.set(10, [Reward({ show: '§dCustom Reward', get: () => { say('got custom reward') } })]);
Mining.rewards.set(20, [Reward({ show: '§dCustom Reward 2', get: () => { say('got custom reward 2') } })]);


export const SkillList: SkillClass[] = [Mining];