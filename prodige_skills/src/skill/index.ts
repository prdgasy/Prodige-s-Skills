import { ToolClass } from "../object/tool";
import { ItemType } from "../types";
import { OnEvent, OnEventClass } from "./onEvent";
import { TitleClass } from "./title";
import { Ability, AbilityClass } from "./ability";
import { Objective, Score, tellraw, title, Variable, _, say, playsound, scoreboard, raw } from "sandstone";
import { Player } from "../player";
import { Achievement, AchievementClass } from "./achievement";
import { Reward, RewardClass } from "../object/reward";
import { textWrapper } from "../../lib/textWrapper";
import * as path from 'path';
import { loadSkillsFromCSV } from './skillLoader';
import { ScoreDisplay } from "sandstone/variables";
import { ProgressBar } from "../../lib/progressBar";
import { richTellraw, macro as $ } from "@prodigelib/easymacro";

export * from "./ability";
export * from "./achievement";
export * from "./onEvent";
export * from "./title";

type SkillOptions = {
  name: string;
  itemId: ItemType;

  description?: string[];
  startingXp?: number;
  titles?: TitleClass[];
  ability?: AbilityClass;
  onEvents?: OnEventClass[];
  customItems?: ToolClass[];
  achievements?: AchievementClass[];
  rewards?: Map<number, RewardClass[]>;
}

export class SkillClass {
  static progression: Score = Objective.create('skill.progression')('@p');
  static notif: Score = Objective.create('skill.notif')('@p');
  name: string;
  itemId: ItemType;

  description: string[];
  startingXp: number;
  onEvents: OnEventClass[];
  customItems: (ToolClass)[];
  achievements: AchievementClass[];
  titles: TitleClass[];
  ability: AbilityClass;

  level: Score;
  xp: Score;
  xpTarget: Score;

  totalXp: Score;
  totalPts: Score;

  currentAchievement: Score;

  rewards: Map<number, RewardClass[]>;

  constructor(skillOptions: SkillOptions) {
    this.name = skillOptions.name;
    this.description = skillOptions.description ?? ["<description>"];
    this.itemId = skillOptions.itemId;
    this.startingXp = skillOptions.startingXp ?? 40;
    this.onEvents = skillOptions.onEvents ?? [];
    this.customItems = skillOptions.customItems ?? [];
    this.achievements = skillOptions.achievements ?? [];
    this.titles = skillOptions.titles ?? [];
    this.ability = skillOptions.ability ?? Ability({ parent: this, name: 'notimple', description: [] });

    this.level = Objective.create(`${this.name}.level`)('@p');
    this.xp = Objective.create(`${this.name}.xp`)('@p');
    this.xpTarget = Objective.create(`${this.name}.xpTarget`)('@p');

    this.totalXp = Objective.create(`${this.name}.totalXp`)('@p');
    this.totalPts = Objective.create(`${this.name}.totalPts`)('@p');

    this.currentAchievement = Objective.create(`${this.name}.currentAchievement`)('@p');

    this.rewards = skillOptions.rewards ?? new Map<number, RewardClass[]>();
  }

  displayProgress(XpAdded: Score, pointAdded: Score) {
    _.if(OnEventClass.notif, () => title('@p').actionbar([
      { text: this.name }, this.level, '+', XpAdded, 'Xp + ', pointAdded, 'Point'
    ]));

  }

  levelUp() {
    // Reset xp
    this.xp["-="](this.xpTarget);

    // set new target
    this.xpTarget["*="](13)["/="](10);
    _.if(this.xpTarget['>'](5000), () => {
      this.xpTarget.set(5000);
    });

    // add level
    this.level["++"];

    // give reward
    RewardClass.giveRewards(this);

    const isAbilityUnlocked = this.level['=='](10);
    const isAbilityUpgraded = _.and(this.level['>'](10), (this.level['%'](10)['=='](0)));

    _.if(_.or(isAbilityUnlocked, isAbilityUpgraded), () => this.ability.tier["++"]);
    // Notif
    const displayNotification = (rewards: string[]) => {
      _.if(SkillClass.notif, () => {
        // 1. Titres à l'écran
        title('@p').title([{ text: '§d§lSKILL LEVEL UP!', bold: true }]);
        title('@p').subtitle([
          { text: `§7${this.name} ` },
          this.level['-'](1),
          { text: ' §8➜ §dLevel ' },
          this.level
        ]);

        // 2. Audio
        _.if(Player.sound, () => playsound('entity.player.levelup', 'master', '@p', '~ ~ ~', 1, 1));
        _.if(_.or(isAbilityUnlocked, isAbilityUpgraded), () => {
          _.if(Player.sound, () => playsound('entity.ender_dragon.growl', 'master', '@p', '~ ~ ~', 0.8, 1));
        });

        const encapsuler = '§7§m------------------------------------------\n';
        const percentage = this.xp['*'](100)['/'](this.xpTarget);
        const bar = ProgressBar(percentage);

        // 3. Header & Progression actuelle
        richTellraw([
          encapsuler,
          $` §d§l${this.name.toUpperCase()} LEVEL UP!\n`,
          $` §f§lProgress to Level ${this.level['+'](1)}: §e${percentage}\n`,
          $` §f§lProgress: §d${this.xp} §6/ §d${this.xpTarget} XP\n`,
          $`  §8> ${bar} §d${this.xp} §6/ §d${this.xpTarget} XP\n`,
          $` §f§lRewards:\n`,
          ...rewards.map(r => ` ${r}\n`)
        ], '@p');

        // 4. Section Ability (si débloquée/améliorée à CE niveau)
        _.if(isAbilityUnlocked, () => {
          tellraw('@p', [
            ' \n',
            ' §a§lABILITY UNLOCKED!\n',
            `  §8• §7Ability: §b${this.ability.name}\n`,
            '  §8• §7Tier: §eTier I\n'
          ]);
        });

        _.if(isAbilityUpgraded, () => {
          tellraw('@p', [
            ' \n',
            ' §b§lABILITY UPGRADE!\n',
            `  §8• §7Ability: §b${this.ability.name}\n`,
            '  §8• §7New Tier: §eTier ', this.ability.tier, '\n'
          ]);
        });

        tellraw('@p', [encapsuler]);
      });
    };

    // Traitement des récompenses
    RewardClass.resolve(this, this.level, displayNotification);
  }
}

export function Skill({
  name,
  itemId,
  description,
  startingXp,
  onEvents,
  customItems,
  achievements,
  titles,
  ability,
  rewards,
}: SkillOptions) {
  return new SkillClass({
    name,
    itemId,
    description,
    startingXp,
    onEvents,
    customItems,
    achievements,
    titles,
    ability,
    rewards
  })
}



// Importation automatique depuis le dossier où sont stockés tes CSV
export const SkillList = loadSkillsFromCSV(path.join(__dirname, 'csv_data'));

// On récupère le skill pour lui lier ses récompenses dynamiques (car les fonctions ne passent pas en CSV)
const Mining = SkillList.find(s => s.name === 'Mining');

if (Mining) {
  Mining.rewards.set(10, [Reward({ show: '§dCustom Reward', get: () => { say('got custom reward') } })]);
  Mining.rewards.set(20, [Reward({ show: '§dCustom Reward 2', get: () => { say('got custom reward 2') } })]);
}