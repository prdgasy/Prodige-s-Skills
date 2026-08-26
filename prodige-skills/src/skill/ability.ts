import { Text } from "@prodigelib/gui";
import { Objective, Score } from "sandstone";

export class AbilityClass {
  name: string;
  description: Text[]
  tier: Score;
  constructor(name: string, description: Text[]) {
    this.name = name;
    this.description = description;
    this.tier = Objective.create(`${this.name}.ability.tier`)('@p');
  }
}

export function Ability({ name, description }: { name: string, description: Text[] }) {
  return new AbilityClass(name, description);
}