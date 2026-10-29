import { CrateOption } from "@src/misc/crate";
import { AllRewards, Reward } from "@src/misc/reward";
import { ToolOptions } from "@src/misc/tool";
import { Skill, SkillOptions } from "@src/skill";
import { Ability } from "@src/skill/ability";
import { say } from "sandstone";

// TOOL
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

// CRATE
type CrateDef = Omit<CrateOption, 'name' | 'rewards'> & {
	rewards: () => Map<Reward, number>
};

export const crateDefs = {
	'§a§lCommon': {
		description: 'A crate with dependable rewards for every skill adventurer.',
		item: 'chest',
		keyPrice: 250,
		rewards: () => new Map<Reward, number>([
			[Reward.point(100), 65],
			[Reward.get('§aNovice Pickaxe'), 35]
		]),
		roll: 1
	},
	'§9§lRare': {
		description: 'A rare collection of useful gear and valuable points.',
		item: 'barrel',
		keyPrice: 750,
		rewards: () => new Map<Reward, number>([
			[Reward.point(250), 55],
			[Reward.get('§aNovice Pickaxe'), 30],
			[Reward.get('§bExpert Sword'), 15]
		]),
		roll: 1
	},
	'§5§lEpic': {
		description: 'A mythic cache with powerful gear and a generous points reward.',
		item: 'ender_chest',
		keyPrice: 1500,
		animated: true,
		rewards: () => new Map<Reward, number>([
			[Reward.point(500), 55],
			[Reward.get('§bExpert Sword'), 35],
			[Reward.get('§aNovice Pickaxe'), 10]
		]),
		roll: 1
	},
	'§6§lLegendary': {
		description: 'A legendary chest holding exceptional rewards for dedicated players.',
		item: 'ancient_debris',
		keyPrice: 5000,
		animated: true,
		rewards: () => new Map<Reward, number>([
			[Reward.point(1000), 50],
			[Reward.get('§bExpert Sword'), 40],
			[Reward.point(2000), 10]
		]),
		roll: 1
	},
	'§c§lMythic': {
		description: 'An epic trove packed with the most valuable rewards in the shop.',
		item: 'dragon_egg',
		keyPrice: 10000,
		animated: true,
		rewards: () => new Map<Reward, number>([
			[Reward.point(2000), 55],
			[Reward.get('§bExpert Sword'), 35],
			[Reward.get('§aNovice Pickaxe'), 10]
		]),
		roll: 1
	}
} satisfies Record<string, CrateDef>;

export type CrateName = keyof typeof crateDefs;

// SKILL
type SkillDefType = Omit<SkillOptions, 'name'>;
export const skillDefs = {
	'Mining': {
		item: 'diamond_pickaxe', starting: 20,
		description: 'This is a mining description',
		ability: { name: 'Miner', description: 'Cool miner', basePrice: 100, trigger: () => say('Miner ability triggered') }
	},
	'Foraging': {
		item: 'oak_sapling', starting: 10,
		description: 'Chop trees, gather wood, and master the art of forestry.',
		ability: { name: 'Pro Forager', description: 'Cool Forager', basePrice: 150, trigger: () => say('Forager ability triggered') }
	}
} satisfies Record<string, SkillDefType>;
export type SkillName = keyof typeof skillDefs;