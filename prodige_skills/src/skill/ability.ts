import { Objective, Score } from "sandstone";
import { Skill } from ".";

export class AbilityClass {
  parent: Skill;
  name: string;
  description: string[]
  tier: Score;
  toggle: Score;

  constructor(parent: Skill, name: string, description: string[]) {
    this.parent = parent;
    this.name = name;
    this.description = description;
    this.tier = Objective.create(`${this.parent.name}.ability.tier`)('@p');
    this.toggle = Objective.create(`${this.parent.name}.ability.toggle`)('@p');
  }
}

export function Ability({ parent, name, description }: { parent: Skill, name: string, description: string[] }) {
  return new AbilityClass(parent, name, description);
}