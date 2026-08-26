import { Text } from "@prodigelib/gui";
import { ToolClass } from "../object/tool";
import { ItemType } from "../types";
import { OnEventClass } from "./onEvent";
import { TitleClass } from "./title";
import { Ability, AbilityClass } from "./ability";
import { Errors } from "../../lib/errors";
import { Objective, Score, tellraw, title, Variable, _ } from "sandstone";
import { Player, Options } from "../player";
import { AchievementClass } from "./achievement";
import { RewardClass } from "../object/reward";

type SkillOptions = {
  name: string;
  itemId: ItemType;

  description?: Text[];
  startingXp?: number;
  titles?: TitleClass[];
  ability?: AbilityClass;
  onEvents?: OnEventClass[];
  customItems?: ToolClass[];
  achievements?: AchievementClass[];
  rewards?: RewardClass[];
}

export class SkillClass {
  name: string;
  itemId: ItemType;

  description: Text[];
  startingXp: number;
  onEvents: OnEventClass[];
  customItems: (ToolClass)[];
  achievements: AchievementClass[];
  titles: TitleClass[];
  ability: AbilityClass;

  level: Score;
  xp: Score;
  xpTarget: Score;

  currentAchievement: Score;

  rewards: RewardClass[];

  constructor(skillOptions: SkillOptions) {
    this.name = skillOptions.name;
    this.description = skillOptions.description ?? [Errors.textNotImplemented()];
    this.itemId = skillOptions.itemId;
    this.startingXp = skillOptions.startingXp ?? 40;
    this.onEvents = skillOptions.onEvents ?? [];
    this.customItems = skillOptions.customItems ?? [];
    this.achievements = skillOptions.achievements ?? [];
    this.titles = skillOptions.titles ?? [];
    this.ability = skillOptions.ability ?? Ability({ name: 'notimple', description: [] });

    this.level = Objective.create(`${this.name}.level`)('@p');
    this.xp = Objective.create(`${this.name}.xp`)('@p');
    this.xpTarget = Objective.create(`${this.name}.xpTarget`)('@p');

    this.currentAchievement = Objective.create(`${this.name}.currentAchievement`)('@p');

    this.rewards = skillOptions.rewards ?? [];
  }

  displayProgress(xpAdded: Score, pointAdded: Score) {
    title(Player(Options.progressNotif)).actionbar([
      { text: this.name }, this.level, '+', xpAdded, 'Xp + ', pointAdded, 'Point'
    ]);
  }

  levelUp() {
    this.xpTarget["*="](13)["/="](10);
    _.if(this.xpTarget['>'](5000), () => {
      this.xpTarget.set(5000);
    })

    title(Player(Options.levelNotif)).title([
      { text: `${this.name} Level Up!` }
    ]);
    title(Player(Options.levelNotif)).subtitle([
      Variable(this.level)['--'], `§8➜ `, Variable(this.level)['++']
    ]);

    tellraw(Player(Options.levelNotif), [
      `§m-------------------------------------------------§r\n`,
      '  ',
      { text: `${this.name} Level Up!\n `, color: 'green', bold: true },
      Variable(this.level)['--'], '§8➜ ', Variable(this.level)['++'], '\n\n',
      'Next Level: ', this.name, this.level, this.xp, '/', this.xpTarget, '\n',
      '==============\n',
      'Rewards: \n',
      ...RewardClass.join(this.rewards),
      '  §8• ', '\n',
      `§m-------------------------------------------------§r`
    ])

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