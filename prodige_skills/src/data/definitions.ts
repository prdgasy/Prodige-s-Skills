import { CrateOption } from "@src/misc/crate";
import { AllRewards } from "@src/misc/reward";
import { ToolOptions } from "@src/misc/tool";
import { SkillOptions } from "@src/skill";
import { Ability } from "@src/skill/ability";

// ============================================================================
// TOOL DEFINITIONS
// Add a new tool here: its name is automatically available as a `ToolName`.
// ============================================================================
export const toolDefs = {
	'Novice Pickaxe': {
		item: 'stone_pickaxe', description: 'This is a simple description',
		rarity: '§f§lCOMMON', durability: 100,
		price: 2500
	},
	'Expert Sword': {
		item: 'diamond_sword', description: 'A very cool sword',
		rarity: '§d§lEPIC', durability: 2000,
		price: 5000
	},

} satisfies Record<string, Omit<ToolOptions, 'name'>>;

export type ToolName = keyof typeof toolDefs;

// ============================================================================
// CRATE DEFINITIONS
// Rewards are referenced name and resolved later inside `crates()`,
// ============================================================================
type CrateDef = Omit<CrateOption, 'name' | 'rewards'> & {
	rewards: Partial<Record<AllRewards, number>>;   // autocomplete on tool names
};

export const crateDefs = {
	'Common': {
		color: '§a§l', description: 'This is a simple crate',
		item: 'chest',
		rewards: { 'Novice Pickaxe': 0.5, 'Expert Sword': 0.2 },
		roll: 2
	}
} satisfies Record<string, CrateDef>;

export type CrateName = keyof typeof crateDefs;

// ============================================================================
// SKILL DEFINITIONS
// ============================================================================
export const skillDefs = {
	'Mining': {
		item: 'diamond_pickaxe', starting: 20,
		description: 'This is a mining description',
		ability: new Ability('Mining', 'Miner Speed', 'Increases mining speed when holding a pickaxe.')
	},
	'Foraging': {
		item: 'oak_sapling', starting: 20,
		description: 'Chop trees, gather wood, and master the art of forestry.',
		ability: new Ability('Foraging', 'Tree Feller', 'Increases choppping spead and wood yields when holding an axe')
	}

} satisfies Record<string, Omit<SkillOptions, 'name'>>;

export type SkillName = keyof typeof skillDefs;
