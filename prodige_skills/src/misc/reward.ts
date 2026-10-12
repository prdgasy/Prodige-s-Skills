import { Text } from "@prodigelib/gui";
import { Skill } from "../skill";
import { Player } from "../player";
import { Tool } from "./tool";
import { _, Score } from "sandstone";


export type RewardOptions = {
  show: string;
  get: () => void;
}

export class Reward {
  show: string;
  get: () => void;

  constructor(options: RewardOptions) {
    this.show = options.show;
    this.get = options.get;
  }

  static join(rewards: Reward[]): string[] {
    return rewards.map(r => ` §8+ §r${r.show}`);
  }

  static get(rewards: Reward[]) {
    rewards.map(r => r.get());
  }

  static point(p: number): Reward {
    return new Reward({
      show: `§e${p} Pts`,
      get: () => Player.pts.add(p)
    });
  }

  static xp(x: number, skill: Skill): Reward {
    return new Reward({
      show: `§3${x} ${skill.name} Xp`,
      get: () => skill.xp.add(x)
    });
  }

  static tool(t: Tool): Reward {
    return new Reward({
      show: `${t}`,
      get: () => t.give()
    });
  }

  static common(skill: Skill): Reward[] {
    return [
      Reward.point(20),
      Reward.tool(Tool.list[0])
    ]
  }

  static forLevel(skill: Skill, level: number): Reward[] {
    return skill.rewards.get(level) ?? Reward.common(skill);
  }

  static giveRewards(skill: Skill) {
    if (skill.rewards.size > 0) {
      skill.rewards.forEach((rewards, level) => {
        _.if(skill.level["=="](level), () => {
          Reward.get(rewards);
        });
      });

      const notCustom = Array.from(skill.rewards.keys()).map(lvl => skill.level["!="](lvl));
      _.if(_.and(...notCustom), () => {
        Reward.get(Reward.common(skill));
      });
    } else {
      Reward.get(Reward.common(skill));
    }
  }

  static resolve(skill: Skill, lvl: Score, f: (r: string[]) => void) {
    if (skill.rewards.size > 0) {
      skill.rewards.forEach((r, i) => {
        _.if(lvl["=="](i), () => {
          f(Reward.join(r));
        });
      });
      const notCustom = Array.from(skill.rewards.keys()).map(i => lvl["!="](i));
      _.if(_.and(...notCustom), () => {
        f(Reward.join(Reward.common(skill)))
      });
    } else {
      f(Reward.join(Reward.common(skill)))
    }
  }
}
