import { title, Score, say, Variable, tellraw } from "sandstone";
import { Options, Player } from "./consts";
import { SkillEvent } from "../types";
import { Errors } from "../errors";
import { Palette } from "../palette";

export namespace Displays {
  export function progress(
    skillName: string,
    level: Score,
    xp: Score,
    xpTarget: Score,
    xpGained: Score,
    pointGained: Score,
    event: SkillEvent
  ) {
    say('runned');
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
      `${Palette.codes.accent}+`, { score: { name: xpGained.target, objective: xpGained.objective.name }, color: Palette.colors.accent }, `${Palette.codes.accent} XP`,
      ` §8• ${Palette.codes.reward}+`, { score: { name: pointGained.target, objective: pointGained.objective.name }, color: Palette.colors.reward }, `${Palette.codes.reward} Point`,
      // Event
      ` §7(${event.name})`,
    ]);
  }

  export function lvl(
    skillName: string,
    level: Score,
    previousLevel: Score,
    nextLevel: Score,
    xp: Score,
    xpTarget: Score,
  ) {

    title(Player(Options.levelNotif)).title([
      `${Palette.codes.main}§lSKILL LEVEL UP!`
    ]);

    title(Player(Options.levelNotif)).subtitle([
      `${Palette.codes.main}${skillName.toUpperCase()} ${Palette.codes.secondary}`,
      { score: { name: previousLevel.target, objective: previousLevel.objective.name }, color: "gray" },
      ` §7➜ `,
      { score: { name: level.target, objective: level.objective.name }, color: Palette.colors.secondary, bold: true }
    ]);

    tellraw(Player(Options.levelNotif), [
      // 1. Cadre supérieur (Or)
      `${Palette.codes.secondary}§m-------------------------------------------\n\n`,

      // 2. Annonce du Level Up (Skill en Jaune vif, Niveaux en Or et Vert)
      `  ${Palette.codes.main}§lSKILL LEVEL UP! §r${Palette.codes.main}${skillName.toUpperCase()} `,
      { score: { name: previousLevel.target, objective: previousLevel.objective.name }, color: "gray" },
      ` §7➜ `,
      { score: { name: level.target, objective: level.objective.name }, color: Palette.colors.secondary, bold: true },
      `\n\n`,

      // 3. Barre de progression à 0% et détails de l'XP (En Aqua/Cyan et Gris)
      `  ${Palette.codes.accent}§lNEXT LEVEL: ${Palette.codes.main}LVL `, { score: { name: nextLevel.target, objective: nextLevel.objective.name }, color: Palette.colors.secondary }, `\n`,
      `  §8■■■■■■■■■■■■ `, { score: { name: xp.target, objective: xp.objective.name }, color: Palette.colors.main }, `${Palette.codes.secondary}/`, { score: { name: xpTarget.target, objective: xpTarget.objective.name }, color: Palette.colors.main }, `${Palette.codes.main} XP §7(%)\n\n`,

      // 4. Section Récompenses (Violet clair)
      `  ${Palette.codes.reward}§lREWARDS\n`,
      `  §8• `, Errors.textNotImplemented, `\n`,
      `  §8• `, Errors.textNotImplemented, `\n\n`,

      // 5. Cadre inférieur (Or)
      `${Palette.codes.secondary}§m-------------------------------------------`
    ]);
  }
}
