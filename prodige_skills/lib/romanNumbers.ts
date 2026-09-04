import { _, Data, DataPointClass, Score } from "sandstone";

const romanNumbers = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export function convertToRoman(value: Score, dataVar: DataPointClass<'storage'>) {
  romanNumbers.forEach((roman, index) => {
    _.if(value["=="](index + 1), () => {
      dataVar.set(roman);
    });
  });
}