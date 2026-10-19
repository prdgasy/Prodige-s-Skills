import { Global } from "@src/global";
import { Player } from "@src/player";
import { _, Data, DataPointClass, MCFunctionClass, tellraw, Variable, Macro as $ } from "sandstone";
import { FinalCommandOutput } from "sandstone/commands";
import { MacroLiteral } from "sandstone/core";

export abstract class Buyable {
  public abstract name: string;
  public abstract price: number;
  public abstract description: string;
  public abstract give(): FinalCommandOutput;
  public static list: Buyable[] = [];

  public buy() {
    _.if(Player.pts['<'](this.price), () => {
      tellraw("@p", `§cYou don't have enough points to buy [${this.name}§c]!`);
      Player.playSound('error');
    })
      .elseIf(this.getItemCount()[">"](28), () => {
        tellraw("@p", "§cYour inventory is full!");
        Player.playSound('error');
      })
      .else(() => {
        Player.pts['-='](this.price);
        this.give();
        Player.playSound('success');
      });
  }

  public static giveFnName(name: string): string;
  public static giveFnName(name: DataPointClass): MacroLiteral;
  public static giveFnName(name: string | DataPointClass) {
    if (typeof name === 'string') return `misc/give/${Global.toMcFunction(name)}`;

    return $`misc/give/${name}`;
  }

  public getItemCount() {
    return Variable(Data('entity', '@p', 'Inventory'));
  }
}