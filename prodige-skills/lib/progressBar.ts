import { _, DataVariable, Score } from "sandstone";

export function ProgressBar(
  progressRatio: Score,
  unlockedMotif: string = "█",
  lockedMotif: string = "█",
  unlockedColor: string = "§a",
  lockedColor: string = "§7",
  length: number = 10,
) {
  const filledLength = progressRatio["*"](length)["/"](100);
  const bar = DataVariable();

  for (let i = 0; i <= length; i++) {
    _.if(filledLength["=="](i), () => bar.set(`${unlockedColor}${unlockedMotif.repeat(i)}${lockedColor}${lockedMotif.repeat(length - i)}§r`));
  }

  return bar;
}