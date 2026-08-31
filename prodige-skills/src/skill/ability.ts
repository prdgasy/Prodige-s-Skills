import { Text } from "@prodigelib/gui";
import { Objective, Score } from "sandstone";

export class AbilityClass {
  name: string;
  description: string[]
  tier: Score;
  constructor(name: string, description: string[]) {
    this.name = name;
    this.description = description;
    this.tier = Objective.create(`${this.name}.ability.tier`)('@p');
  }
}

export function Ability({ name, description }: { name: string, description: string[] }) {
  return new AbilityClass(name, description);
}