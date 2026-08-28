import { _, DataPointClass, DataVariable, Score } from "sandstone";

export function ProgressBar(
  progressRatio: Score,
  unlockedMotif: string = "-",
  lockedMotif: string = "-",
  unlockedColor: string = "§a",
  lockedColor: string = "§f",
  length: number = 15,
): DataPointClass {
  const filledLength = progressRatio["*"](length)["/"](100);
  const bar = DataVariable();

  _.if(filledLength['<'](0), () => filledLength.set(0));
  _.if(filledLength['>'](length), () => filledLength.set(length));

  for (let i = 0; i <= length; i++) {
    _.if(filledLength["=="](i), () => {
      bar.set(`${unlockedColor}${unlockedMotif.repeat(i)}${lockedColor}${lockedMotif.repeat(length - i)}§r`);
    });
  }

  return bar;
}


