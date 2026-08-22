import { title, Score, say, Variable, tellraw, _ } from "sandstone";
import { Options, Player } from "../consts/consts";
import { SkillEvent } from "../types";
import { Errors } from "../errors";
import { Palette } from "../palette";
import { BoosterScore } from "./scores";

export namespace Displays {
  export function progress(
    skillName: string,
    level: Score,
    xp: Score,
    xpTarget: Score,
    xpGained: Score,
    pointGained: Score,
  ) {
    const xpBoosted = [`${Palette.codes.accent}(x`, { score: { name: BoosterScore.xp.target, objective: BoosterScore.xp.objective.name }, color: Palette.colors.accent }, `${Palette.codes.accent}) `];
    const pointBoosted = [`${Palette.codes.reward}(x`, { score: { name: BoosterScore.point.target, objective: BoosterScore.point.objective.name }, color: Palette.colors.reward }, `${Palette.codes.reward}) `];

    title(Player(Options.levelNotif)).actionbar([
      // SKILL & NIVEAU : Nom du Skill en jaune vif, Niveau en Or
      `${Palette.codes.main}§l${skillName.toUpperCase()} §r${Palette.codes.secondary}LVL `,
      { score: { name: level.target, objective: level.objective.name }, color: Palette.colors.secondary },

      ` §8│ `,

      // PROGRESSION : Chiffres d'XP en Aqua / Cyan
      `${Palette.codes.accent}`, { score: { name: xp.target, objective: xp.objective.name }, color: Palette.colors.main },
      `${Palette.codes.secondary}/`, { score: { name: xpTarget.target, objective: xpTarget.objective.name }, color: Palette.colors.main },
      `${Palette.codes.secondary} XP`,

      ` §8│ `,

      // GAINS RÉCENTS : XP gagnée (Vert) · Points gagnés (Violet)
      `${Palette.codes.accent}+`, { score: { name: xpGained.target, objective: xpGained.objective.name }, color: Palette.colors.accent }, `${Palette.codes.accent} XP `, xpBoosted,
      `§8• ${Palette.codes.reward}+`, { score: { name: pointGained.target, objective: pointGained.objective.name }, color: Palette.colors.reward }, `${Palette.codes.reward} Point `, pointBoosted,
    ]);
  }

  export function lvl(
    skillName: string,
    level: Score,
    previousLevel: Score,
    nextLevel: Score,
    xp: Score,
    xpTarget: Score,
    progress: Score
  ) {

    title(Player(Options.levelNotif)).title([
      `${Palette.codes.success}${skillName} Level Up`
    ]);

    title(Player(Options.levelNotif)).subtitle([
      { score: { name: previousLevel.target, objective: previousLevel.objective.name }, color: Palette.colors.secondary },
      ` ${Palette.codes.secondary}➜ `,
      { score: { name: level.target, objective: level.objective.name }, color: Palette.colors.secondary }
    ]);

    tellraw(Player(Options.levelNotif), [
      // 1. Cadre supérieur
      `${Palette.codes.secondary}§m-------------------------------------------\n`,

      // 2. Annonce du Level Up
      `  ${Palette.codes.success}§lSkill Level Up! ${Palette.codes.main}${skillName} `,
      { score: { name: previousLevel.target, objective: previousLevel.objective.name }, color: "dark_gray" },
      ` §8➜ `,
      { score: { name: level.target, objective: level.objective.name }, color: Palette.colors.secondary, bold: true },

      `\n\n`,

      // 3. Barre de progression à 0% et détails de l'XP
      `  ${Palette.codes.accent}§lNext Level\n  §8• ${Palette.codes.accent}${skillName} `, { score: { name: nextLevel.target, objective: nextLevel.objective.name }, color: Palette.colors.accentDark }, ' ', { score: { name: xp.target, objective: xp.objective.name }, color: Palette.colors.accent }, `${Palette.codes.accentDark}/`, { score: { name: xpTarget.target, objective: xpTarget.objective.name }, color: Palette.colors.accent }, ` ${Palette.codes.accent}XP §7(`, { score: { name: progress.target, objective: progress.objective.name }, color: "gray" }, `§7%)\n\n`,

      // 4. Section Récompenses
      `  ${Palette.codes.reward}§lRewards\n`,
      `  §8• `, Errors.textNotImplemented(), `\n`,
      `  §8• `, Errors.textNotImplemented(), `\n`,

      // 5. Cadre inférieur
      `${Palette.codes.secondary}§m-------------------------------------------`
    ]);
  }

  export function maxLvl(
    skillName: string,
  ) {

    title(Player(Options.levelNotif)).title([
      `${Palette.codes.success}${skillName} Level Up`
    ]);

    title(Player(Options.levelNotif)).subtitle([
      `${Palette.codes.secondary}99 ➜ 100`,
    ]);

    tellraw(Player(Options.levelNotif), [
      // 1. Cadre supérieur
      `${Palette.codes.secondary}§m-------------------------------------------\n`,

      // 2. Annonce du Level Up
      `  ${Palette.codes.success}§lSkill Level Up! ${Palette.codes.main}${skillName} §899 ➜ §l100`,

      `\n\n`,

      // 3. Barre de progression
      `  ${Palette.codes.accent}§lMax Level Reached\n  §8• ${Palette.codes.accent}<prestigeText>\n\n`,

      // 4. Section Récompenses
      `  ${Palette.codes.reward}§lRewards\n`,
      `  §8• `, Errors.textNotImplemented(), `\n`,
      `  §8• `, Errors.textNotImplemented(), `\n`,

      // 5. Cadre inférieur
      `${Palette.codes.secondary}§m-------------------------------------------`
    ]);
  }
}
