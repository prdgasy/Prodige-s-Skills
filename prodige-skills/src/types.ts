import { give, Objective } from "sandstone";

/**
 * item that can be given to a player.
 * This is derived from the parameters of the 'give' function from sandstone.
 */
export type ItemType = Parameters<typeof give>[1];
export type Criteria = Parameters<typeof Objective.create>[1];
/**
 * event that can trigger skill progression.
 */
export type SkillEvent = {
  /** The unique name identifier for this event */
  name: string
  /** The item representation assiociated with this event */
  item: ItemType
  /** The Minecraft advancement criteria that triggers this event */
  criteria: Criteria
  /** The amount of experience points gained when this event occurs */
  xp: number,
  point: number
};

/**
 * Type representing a skill that players can develop.
 */
export type Skill = {
  /** The unique name identifier for this skill */
  name: string;
  /** Description of the skills */
  /** The item representing this skill in the UI */
  item: ItemType
  /** The initial experience points a player starts with for this skill */
  startingXp: number
  /** Array of events that can trigger progression in this skill */
  SkillEvents: SkillEvent[];
  customItems: { name: string, item: ItemType }[];
  titles: { name: string }[],
  Prestige: {
    name: string, powerPerLvl: number, func: null
  }
};
