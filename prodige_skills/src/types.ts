import { give, Objective } from "sandstone";

/**
 * item that can be given to a player.
 * This is derived from the parameters of the 'give' function from sandstone.
 */
export type ItemType = Parameters<typeof give>[1];
export type Criteria = Parameters<typeof Objective.create>[1];


