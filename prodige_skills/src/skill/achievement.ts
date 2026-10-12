import { Label, Objective, Score } from "sandstone";
import { Item } from "@src/types";
import { Skill } from "@src/skill";
import { Reward } from "@src/misc/reward";

export class Achievement {
  static notif = Label(`achievement.notification`)(`@p`);

  parent: Skill;
  /** Name of the achievement. */
  name: string;
  /** Unique ID of the achievement. */
  id: string;
  /** Description of the achievement. */
  description: string;
  /** Item to display in the achievement. */
  item: Item;
  /** Target progress of the achievement. */
  target: number;
  /** Progress score of the achievement. */
  progress: Score;
  /** Rewards of the achievement. */
  reward: Reward[];

  constructor(parent: Skill, name: string, item: Item, target: number, description: string, reward?: Reward[]) {
    this.parent = parent;
    this.name = name;
    this.id = name.toLowerCase().replace(" ", "_");
    this.item = item;
    this.target = target;
    this.description = description;
    this.progress = Objective.create(`${this.parent.name}.achievement.${this.id}`)('@p');
    this.reward = reward ?? Reward.common(this.parent);
  }
}