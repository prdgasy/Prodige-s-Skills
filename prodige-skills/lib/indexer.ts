import { Macro as $, Data, DataPointClass, MCFunction, Objective, Score } from "sandstone";

type ValueType = Record<string | number, string>;

class IndexerClass {
  id: number;
  storage: DataPointClass<'storage'>;
  static globalId = 0;
  getMacro: any;
  macroEnv: DataPointClass<'storage'>;

  constructor(values: ValueType) {
    this.id = IndexerClass.globalId++;
    this.storage = Data('storage', '__gui:indexer', `indexer_${this.id}`).set(values);

    this.macroEnv = Data('storage', '__gui:simplemacro', 'arg');
    this.getMacro = MCFunction(`__indexer/macros/${this.id}`, (_loop: any, macroKey: Score) => {
      $.data.modify(this.storage.select("out")).set.from(this.storage.select($`${macroKey}`));
    });
  }


  set(key: string | Score, value: string) {
    this.storage.select(key).set(value);
  }

  get(key: string | Score) {
    if (key instanceof Score) {
      // this.macroEnv.set(key);
      this.getMacro(key);
      return this.storage.select("out");
    } else { return this.storage.select(key); }

  };
}

export function Indexer(values?: ValueType): IndexerClass {
  return new IndexerClass(
    values ?? {}
  );
}