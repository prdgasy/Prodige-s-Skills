import { Text } from "@prodigelib/gui";
import { SkillClass } from "../skill";
import { Player } from "../player";
import { NovicePickaxe, ToolClass } from "./tool";
import { _ } from "sandstone";


export type RewardOptions = {
  show: string;
  get: () => void;
}

export class RewardClass {
  show: string;
  get: () => void;

  constructor(options: RewardOptions) {
    this.show = options.show;
    this.get = options.get;
  }

  static joinToText(rewards: RewardClass[]): Text[] {
    const t: Text[] = [];
    for (const r of rewards) {
      t.push({ text: `  §8+ §r${r.show}` });
    }
    return t;
  }

  static joinToString(rewards: RewardClass[]): string[] {
    return rewards.map(r => `  §8+ §r${r.show}`);
  }

  static get(rewards: RewardClass[]) {
    rewards.map(r => r.get());
  }

  static point(p: number): RewardClass {
    return Reward({
      show: `§6${p} Pts`,
      get: () => Player.pts.add(p)
    });
  }

  static xp(x: number, skill: SkillClass): RewardClass {
    return Reward({
      show: `§b${x} ${skill.name} Xp`,
      get: () => skill.xp.add(x)
    });
  }

  static tool(t: ToolClass): RewardClass {
    return Reward({
      show: `${t}`,
      get: () => t.give()
    });
  }

  static common(skill: SkillClass): RewardClass[] {
    return [
      RewardClass.point(20),
      RewardClass.xp(30, skill),
      RewardClass.tool(NovicePickaxe)
    ]
  }

  static forLevel(skill: SkillClass, level: number): RewardClass[] {
    return skill.rewards.get(level) ?? RewardClass.common(skill);
  }

  static giveRewards(skill: SkillClass) {
    if (skill.rewards.size > 0) {
      skill.rewards.forEach((rewards, level) => {
        _.if(skill.level["=="](level), () => {
          RewardClass.get(rewards);
        });
      });

      const notCustom = Array.from(skill.rewards.keys()).map(lvl => skill.level["!="](lvl));
      _.if(_.and(...notCustom), () => {
        RewardClass.get(RewardClass.common(skill));
      });
    } else {
      RewardClass.get(RewardClass.common(skill));
    }
  }
}

export function Reward({ show, get }: RewardOptions): RewardClass {
  return new RewardClass({ show, get });
}

