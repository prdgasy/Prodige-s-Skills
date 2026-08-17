import { Macro as $, Data, DataPointClass, MCFunction, Objective, Score } from "sandstone";

type BarType = Record<string, string>;

class IndexerClass {
  indexId: number;
  dataPointer: DataPointClass<'storage'>;
  static globalId = 0;
  getMacro: any;
  macroEnv: DataPointClass<'storage'>;

  constructor(values: BarType) {
    this.indexId = IndexerClass.globalId++;
    this.dataPointer = Data('storage', '__gui:indexer', `barindexer_${this.indexId}`);

    this.macroEnv = Data('storage', '__gui:simplemacro', 'arg');
    this.getMacro = MCFunction(`__indexer/macros/${this.indexId}`, (_loop: any, macroKey: Score) => {
      $.data.modify(this.dataPointer.select("0")).set.from(this.dataPointer.select($`${macroKey}`));
    });
  }


  set(key: string | Score, value: string) {
    this.dataPointer.select(key).set(value);
  }

  get(key: string | Score) {
    if (key instanceof Score) {
      // this.macroEnv.set(key);
      this.getMacro(key, Objective.create("a")("@s"), Objective.create("b")("@s"));
      return this.dataPointer.select("0");
    } else { return this.dataPointer.select(key); }

  };
}

export function Indexer(values?: BarType): IndexerClass {
  return new IndexerClass(
    values ?? {}
  );
}