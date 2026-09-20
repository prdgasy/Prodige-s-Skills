import { _, Data, DataPointClass, DataVariable, Macro as $, MCFunction, Score } from "sandstone";

const bars = Data('storage', '__lib:progress_bar', 'bars');

let exist = false;
export function ProgressBar(
  progressRatio: Score,
  length: number = 15,
  unlockedMotif: string = "-",
  lockedMotif: string = "-",
  unlockedColor: string = "§a",
  lockedColor: string = "§f",

): DataPointClass {
  const f = MCFunction(`__lib/progress_bar/set/${length}`, () => {
    const filledLength = progressRatio["*"](length)["/"](100);

    _.if(filledLength['<'](0), () => filledLength.set(0));
    _.if(filledLength['>'](length), () => filledLength.set(length));

    for (let i = 0; i <= length; i++) {
      bars.select(`${length}.${i}`).set(`${unlockedColor}${unlockedMotif.repeat(i)}${lockedColor}${lockedMotif.repeat(length - i)}§r`);
    }
  });
  if (!exist) {
    f();
    exist = true;
  }

  const get = MCFunction(`__lib/progress_bar/get/${length}`, (loop: any, ratio: Score) => {
    $.data.modify(bars.select('out')).set.from(bars.select(String(length)).select($`[${ratio}]`));
  });
  get(progressRatio);

  return bars.select(String(length)).select('out');
}


