import { Text } from "@prodigelib/gui";
import { Score } from "sandstone";
import { ItemType } from "../types";

export class AchievementClass {
  name: string;
  id: ItemType;
  target: number;
  current: Score;

  constructor(name: string, id: ItemType, target: number, current: Score) {
    this.name = name;
    this.id = id;
    this.target = target;
    this.current = current;
  }
}

export function Achievement({ name, id, target, current }: { name: string, id: ItemType, target: number, current: Score }) {
  return new AchievementClass(name, id, target, current);
}