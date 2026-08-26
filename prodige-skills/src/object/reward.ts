import { Text } from "@prodigelib/gui";

export type RewardType = 'ability' | 'item' | 'booster' | 'title';
export type RewardOptions = {
  name: string;
  description: Text[];
  type: RewardType;
}

export class RewardClass {
  name: string;
  description: Text[];
  type: RewardType;

  constructor(options: RewardOptions) {
    this.name = options.name;
    this.description = options.description;
    this.type = options.type;
  }

  static join(rewards: RewardClass[]): Text[] {
    return rewards.map(reward => reward.toString());
  }

  toString() {
    return { text: this.name };
  }
}