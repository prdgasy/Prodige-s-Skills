import { tellraw, Score } from "sandstone"
import { Player, playerOption } from "./const"


export function displayProgress(skillName: string, level: Score, xp: Score, xpTarget: Score) {
  tellraw(Player(playerOption.levelNotif), [skillName, level, " Progress: ", xp, "/", xpTarget]);
}