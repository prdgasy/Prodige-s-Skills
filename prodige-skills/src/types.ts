import { give } from "sandstone";
import { GUI } from '@prodigelib/gui';

/**
 * item that can be given to a player.
 * This is derived from the parameters of the 'give' function from sandstone.
 */
export type ItemType = Parameters<typeof give>[1];

/**
 * record of pages for skills and events.
 * Keys are skill/event names, values contain progress and event pages.
 */
export type pageRecordType = Record<string, { progress: GUI.Page, onEvent: GUI.Page[] }>;

/**
 * event that can trigger skill progression.
 */
export type Event = {
  /** The unique name identifier for this event */
  name: string
  /** The item representation assiociated with this event */
  item: ItemType
  /** The Minecraft advancement criteria that triggers this event */
  criteria: string
  /** The amount of experience points gained when this event occurs */
  gain: number
};

/**
 * Type representing a skill that players can develop.
 */
export type Skill = {
  /** The unique name identifier for this skill */
  name: string
  /** The item representing this skill in the UI */
  item: ItemType
  /** The initial experience points a player starts with for this skill */
  startingXp: number
  /** Array of events that can trigger progression in this skill */
  onEvents: Event[]
};
