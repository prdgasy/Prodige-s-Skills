import { give } from "sandstone";
import { GUI } from '@prodigelib/gui';

export type ItemType = Parameters<typeof give>[1];

export type pageRecordType = Record<string, { progress: GUI.Page, onEvent: GUI.Page[] }>;

export type Event = {
  name: string
  item: ItemType
  criteria: string
  gain: number
};

export type Skill = {
  name: string
  item: ItemType
  startingXp: number
  onEvents: Event[]
};
