import { Text } from "@prodigelib/gui";
import { Objective, Score } from "sandstone";
import { ItemType } from "../types";
import { SkillClass } from "./skillClass";

export class AchievementClass {
  name: string;
  id: ItemType;
  target: number;
  progress: Score;

  constructor(parent: SkillClass, name: string, id: ItemType, target: number) {
    this.name = name;
    this.id = id;
    this.target = target;
    this.progress = Objective.create(`${parent.name}.achievement.${name}`)('@p');
  }
}

export function Achievement({ parent, name, id, target }: { parent: SkillClass, name: string, id: ItemType, target: number }) {
  return new AchievementClass(parent, name, id, target);
}