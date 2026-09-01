import { Text } from "@prodigelib/gui";
import { Objective, Score } from "sandstone";
import { SkillClass } from ".";

export class AbilityClass {
  parent: SkillClass;
  name: string;
  description: string[]
  tier: Score;
  constructor(parent: SkillClass, name: string, description: string[]) {
    this.parent = parent;
    this.name = name;
    this.description = description;
    this.tier = Objective.create(`${this.parent.name}.ability.tier`)('@p');
  }
}

export function Ability({ parent, name, description }: { parent: SkillClass, name: string, description: string[] }) {
  return new AbilityClass(parent, name, description);
}