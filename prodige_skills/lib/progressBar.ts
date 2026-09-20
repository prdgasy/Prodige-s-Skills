import { _, Data, DataPointClass, MCFunction, Score, Macro as $ } from "sandstone";

const bars = Data('storage', '__lib:progress_bar', 'bars');

export function ProgressBar(
  progressRatio: Score,
  length: number = 15,
  unlockedMotif: string = "-",
  lockedMotif: string = "-",
  unlockedColor: string = "§a",
  lockedColor: string = "§f",
): DataPointClass {

  // 1. Initialise la liste NBT une seule fois au chargement

  MCFunction(`__lib/progress_bar/init_${length}`, () => {
    const arr: string[] = [];
    for (let i = 0; i <= length; i++) {
      arr.push(`${unlockedColor}${unlockedMotif.repeat(i)}${lockedColor}${lockedMotif.repeat(length - i)}§r`);
    }
    bars.select(String(length)).set(arr); // Assigne un vrai tableau NBT
  }, { runOnLoad: true });


  // 2. Convertit le % (0-100) en index (0-length) à CHAQUE exécution
  const index = progressRatio["*"](length)["/"](100);
  _.if(index['<'](0), () => index.set(0));
  _.if(index['>'](length), () => index.set(length));

  // 3. Récupère la bonne string
  const get = MCFunction(`__lib/progress_bar/get_${length}`, (_loop: any, ratio: Score) => {
    $.data.modify(bars.select('out')).set.from(bars.select(String(length)).select($`[${ratio}]`));
  });
  get(index);

  return bars.select('out');
}