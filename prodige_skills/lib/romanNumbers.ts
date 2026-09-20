import { Data, DataPointClass, DataVariable, MCFunction, raw, Score, Macro as $, _, functionCmd } from "sandstone";

export class RomanNumbers {
  private out = DataVariable();
  private static numbers: DataPointClass;
  private static id = 0;

  constructor(s: Score) {
    const f = MCFunction(`__lib/roman_numbers/from_score/get_${RomanNumbers.id++}`, (_loop: any, s: Score) => {
      $.data.modify(this.out).set.from(RomanNumbers.numbers.select($`[${s}]`));
    });
    f(s);
  }

  // Initialisation statique automatique du tableau NBT
  static {
    const s: string[] = [""]; // Index 0 vide pour correspondre aux nombres (1 -> "I")
    for (let i = 1; i < 101; i++) {
      s.push(this.numberToRoman(i));
    }
    this.numbers = DataVariable(s);
  }

  private static numberToRoman(num: number): string {
    if (num <= 0) return "";
    const lookup: [number, string][] = [
      [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
      [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
    ];
    let roman = "";
    for (const [val, str] of lookup) {
      while (num >= val) {
        roman += str;
        num -= val;
      }
    }
    return roman;
  }




  // Méthodes de surcharge propres au lieu du constructeur
  public static convert(s: Score): DataPointClass<"storage">;
  public static convert(n: number): string;
  public static convert(value: number | Score): string | DataPointClass<"storage"> {
    if (typeof value === 'number') {
      return this.numberToRoman(value);
    }
    value;
    return new RomanNumbers(value).out;
  }
}