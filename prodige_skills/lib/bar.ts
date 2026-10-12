import { _, Data, DataPointClass, MCFunction, Score, Macro as $, defaultNamespace } from "sandstone";

type BarOptions = {
  length?: number;
  unlockedMotif?: string;
  lockedMotif?: string;
  unlockedColor?: string;
  lockedColor?: string;
}

export class Bar {
  private static ns = defaultNamespace.toString();
  private static storage = Data('storage', `${this.ns}:prodigelib`, 'bar');
  private out = Bar.storage.select('out');
  private static barsByLength = Bar.storage.select('barsByLength');

  private ratio: Score;

  constructor(ratio: Score);
  constructor(a: Score, b: Score);

  constructor(a: Score, b?: Score) {
    this.ratio = b
      ? a['*'](100)['/'](b)
      : a;
  }

  private init(length: number, unlockedMotif: string, lockedMotif: string, unlockedColor: string, lockedColor: string) {
    MCFunction(`__lib/bar/progress/set_length_${length}`, () => {
      const arr: string[] = [];
      for (let i = 0; i <= length; i++) {
        arr.push(`${unlockedColor}${unlockedMotif.repeat(i)}${lockedColor}${lockedMotif.repeat(length - i)}§r`);
      }
      Bar.barsByLength.set(arr);
    }, { runOnLoad: true, onConflict: 'ignore' });
  }

  public get(options?: BarOptions) {
    const length = options?.length ?? 15;
    const unlockedMotif = options?.unlockedMotif ?? "-";
    const lockedMotif = options?.lockedMotif ?? "-";
    const unlockedColor = options?.unlockedColor ?? "§a";
    const lockedColor = options?.lockedColor ?? "§f";

    this.init(length, unlockedMotif, lockedMotif, unlockedColor, lockedColor);

    const index = this.ratio["*"](length)["/"](100);
    _.if(index['<'](0), () => index.set(0));
    _.if(index['>'](length), () => index.set(length));

    _.with([index], () => {
      $.data.modify(this.out).set.from(Bar.barsByLength.select($`[${index}]`));
    })

    return this.out;

  }

}
