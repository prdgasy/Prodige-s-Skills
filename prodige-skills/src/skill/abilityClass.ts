import { Text } from "@prodigelib/gui";

export class AbilityClass {
  name: string;
  description: Text[]
  constructor(name: string, description: Text[]) {
    this.name = name;
    this.description = description;
  }
}

export function Ability({ name, description }: { name: string, description: Text[] }) {
  return new AbilityClass(name, description);
}