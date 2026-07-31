import { Data, DataPointClass, Score } from "sandstone";

type BarType = Record<string, string>;

class IndexerClass {
  indexId: number;
  dataPointer: DataPointClass<'storage'>;
  static globalId = 0;

  constructor(values: BarType) {
    this.indexId = IndexerClass.globalId++;
    this.dataPointer = Data('storage', '__gui:indexer', `barindexer_${this.indexId}`);
  }

  set(key: string | Score, value: string) {
    this.dataPointer.select(key).set(value);
  }

  get(key: string | Score) {
    return this.dataPointer.select(key);
  };
}

export function Indexer(values?: BarType): IndexerClass {
  return new IndexerClass(
    values ?? {}
  );
}