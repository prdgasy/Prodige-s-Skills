import { Gui, PageClass } from "@prodigelib/gui";
import { give, Objective } from "sandstone";
import { Skill } from "@src/skill";

/**
 * item that can be given to a player.
 * This is derived from the parameters of the 'give' function from sandstone.
 */
export type Item = Parameters<typeof give>[1];
export type Criteria = Parameters<typeof Objective.create>[1];


export type SkillPage = {
	getName: () => string;
	init: (g: Gui, page: PageClass) => PageClass;
};

export type SubSkillPage = {
	getName: (skill: Skill) => string;
	init: (g: Gui, page: PageClass, skill: Skill) => PageClass;
};