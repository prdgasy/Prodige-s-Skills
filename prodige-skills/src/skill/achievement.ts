import { Text } from "@prodigelib/gui";
import { Objective, Score } from "sandstone";
import { ItemType } from "../types";
import { SkillClass } from ".";

export class AchievementClass {
  name: string;
  itemId: ItemType;
  target: number;
  progress: Score;
  id: string;

  constructor(parent: SkillClass, name: string, id: string, itemId: ItemType, target: number) {
    this.name = name;
    this.itemId = itemId;
    this.id = id;
    this.target = target;
    this.progress = Objective.create(`${parent.name}.achievement.${id}`)('@p');
  }
}

export function Achievement({ parent, name, id, target, itemId }: { parent: SkillClass, name: string, id: string, target: number, itemId: ItemType }) {
  return new AchievementClass(parent, name, id, itemId, target);
}