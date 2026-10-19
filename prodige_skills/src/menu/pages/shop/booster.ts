import { Button, Gui, PageClass } from "@prodigelib/gui";
import { tellraw } from "sandstone";

export class Boosters {
  public static getName() {
    return this.name;
  }

  public static init(g: Gui, p: PageClass) {
    for (let i = 1; i < 5; i++) {
      p.add(this.btn(i + 3, 'Xp', i + 1), this.btn(i + 13, 'Pts', i + 1));
    }
    return p;
  }

  private static btn(s: number, type: 'Xp' | 'Pts', m: number) {
    const item = type === 'Xp' ? 'gold_ingot' : 'stone';
    return new Button(
      item, s, `${m}x ${type} Booster`, [
      '§9Prodige Skill',
      '',
      '§eClick to buy!'
    ], () => { tellraw('@p', '§cNot implemented yet.') }
    );
  }
}