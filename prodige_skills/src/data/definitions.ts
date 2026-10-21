import { CrateOption } from "@src/misc/crate";
import { AllRewards, Reward } from "@src/misc/reward";
import { ToolOptions } from "@src/misc/tool";
import { SkillOptions } from "@src/skill";
import { Ability } from "@src/skill/ability";

// ============================================================================
// TOOL DEFINITIONS
// Add a new tool here: its name is automatically available as a `ToolName`.
// ============================================================================
export const toolDefs = {
	'§aNovice Pickaxe': {
		item: 'stone_pickaxe', description: 'This is a simple description',
		rarity: '§f§lCOMMON', durability: 100,
		price: 2500
	},
	'§bExpert Sword': {
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
	rewards: () => Map<Reward, number>
};

export const crateDefs = {
	'§aCommon': {
		description: 'This is a simple crate',
		item: 'chest',
		rewards: () => new Map<Reward, number>([
			[Reward.get('§aNovice Pickaxe'), 0.2], [Reward.point(100), 0.5]
		]),
		roll: 3
	},
	'§dSpecial': {
		description: 'This is a special crate',
		item: 'ender_chest',
		rewards: () => new Map<Reward, number>([
			[Reward.get('§bExpert Sword'), 0.2], [Reward.point(300), 0.5]
		]),
		roll: 5
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
