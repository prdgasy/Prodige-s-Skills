import { Data, Score, tellraw } from "sandstone";
import { Indexer } from "./indexer";

export function convertToRoman(value: Score) {
  // const numbers = Indexer({
  //   1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V',
  //   6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X'
  // });

  // // Renvoie directement le résultat de get() sans l'encapsuler dans une fonction
  // return numbers.get(value);

  tellraw("@p", value);
  // Si ton tier est un score Sandstone, l'indexer corrigé à l'étape 2 fonctionnera parfaitement.
  return "I";
}