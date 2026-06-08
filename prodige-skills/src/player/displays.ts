import { title, Score, say } from "sandstone";
import { playerOption, Player } from "./consts";
import { SkillEvent } from "../types";

export function progress(
  skillName: string,
  level: Score,
  xp: Score,
  xpTarget: Score,
  xpGained: Score,
  pointGained: Score,
  event: SkillEvent
) {
  title(Player(playerOption.levelNotif)).actionbar([
    // 1. Événement et début du Skill (Gras)
    `§7[${event.name.toUpperCase()}] §b§l${skillName.toUpperCase()} `,

    // 2. Niveau (§r reset le gras, couleur aqua sur le score)
    `§r§bLVL `,
    { score: { name: level.target, objective: level.objective.name }, color: "aqua" },

    // 3. Barre d'XP numérique (Or et Jaune)
    ` §8» §6`,
    { score: { name: xp.target, objective: xp.objective.name }, color: "gold" },
    `§8/§e`,
    { score: { name: xpTarget.target, objective: xpTarget.objective.name }, color: "yellow" },
    `§6 XP`,

    // 4. Gains d'XP (Vert) et de Points (Violet clair + Italique)
    ` §8| §a+`,
    { score: { name: xpGained.target, objective: xpGained.objective.name }, color: "green" },
    `§a XP §d§o(+`,
    { score: { name: pointGained.target, objective: pointGained.objective.name }, color: "light_purple", italic: true },
    `§d§o Point)`
  ]);
}