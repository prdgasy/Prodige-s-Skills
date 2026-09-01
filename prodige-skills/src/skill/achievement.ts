import { Text } from "@prodigelib/gui";
import { Objective, Score } from "sandstone";
import { ItemType } from "../types";
import { SkillClass } from ".";
import { RewardClass } from "../object/reward";

export class AchievementClass {
  name: string;
  description: string[];
  itemId: ItemType;
  target: number;
  progress: Score;
  id: string;
  reward: RewardClass[];

  constructor(parent: SkillClass, name: string, id: string, itemId: ItemType, target: number, description: string[], reward?: RewardClass[]) {
    this.name = name;
    this.itemId = itemId;
    this.id = id;
    this.target = target;
    this.description = description;
    this.progress = Objective.create(`${parent.name}.achievement.${id}`)('@p');
    this.reward = reward ?? RewardClass.common(parent);
  }
}

export function Achievement({ parent, name, id, target, itemId, description, reward }: { parent: SkillClass, name: string, id: string, target: number, itemId: ItemType, description: string[], reward?: RewardClass[] }) {
  return new AchievementClass(parent, name, id, itemId, target, description, reward);
}