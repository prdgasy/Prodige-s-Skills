import { Crate } from '@src/misc/crate';
import { Reward } from '@src/misc/reward';
import { Tool, ToolOptions } from '@src/misc/tool';
import { Ability } from '@src/skill/ability';
import { Achievement } from '@src/skill/achievement';
import { Skill } from '@src/skill/index';
import { OnEvent } from '@src/skill/onEvent';
import { Criteria } from '@src/types';
import * as fs from 'fs';
import * as path from 'path';

const toolDefs = {
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

export class Loader {
	public static skillNames = ['Mining', 'Foraging'] as const;

	private static parseCSV(filePath: string): Record<string, string>[] {
		const content = fs.readFileSync(filePath, 'utf-8');
		const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
		if (lines.length === 0) return [];

		const headers = lines[0].split(',').map(h => h.trim());

		return lines.slice(1).map(line => {
			// Sépare sur les virgules UNIQUEMENT si elles ne sont pas entourées de guillemets
			const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
			const row: Record<string, string> = {};

			headers.forEach((header, index) => {
				let val = values[index] ? values[index].trim() : '';

				// Nettoyage des guillemets
				if (val.startsWith('"') && val.endsWith('"')) {
					val = val.slice(1, -1).replace(/""/g, '"');
				}

				row[header] = val;
			});

			return row;
		});
	}

	private static loadSkillsFromCSV(dirPath: string): Skill[] {
		const skillsMap = new Map<string, Skill>();

		// 1. Charger les Skills & Abilities
		const skillsData = Loader.parseCSV(path.join(dirPath, 'skills.csv'));
		for (const row of skillsData) {
			const skill = new Skill({
				name: row.name,
				description: row.description,
				item: row.item as any,
				starting: parseInt(row.starting, 10) || 0,
			});

			if (row.abilityName) {
				skill.ability = new Ability(skill, row.abilityName, row.abilityDescription);
			}

			skillsMap.set(row.name, skill);
		}

		const onEventsData = Loader.parseCSV(path.join(dirPath, 'on_events.csv'));
		for (const row of onEventsData) {
			const skill = skillsMap.get(row.skillName);
			if (skill) skill.onEvents.push(new OnEvent(skill, row.name, row.item as any, parseInt(row.Xp, 10) || 0, parseInt(row.pts, 10) || 0, row.criteria as Criteria));
		}

		const achievementsData = Loader.parseCSV(path.join(dirPath, 'achievements.csv'));
		for (const row of achievementsData) {
			const skill = skillsMap.get(row.skillName);
			if (skill) skill.achievements.push(new Achievement(skill, row.name, row.item as any, parseInt(row.target, 10) || 0, row.description));
		}

		return Array.from(skillsMap.values());

	}

	private static setRewards() {
		const Mining = Skill.get('Mining');
		const r1 = Tool.get('Expert Sword');
		const r2 = Reward.point(200);
		Mining.rewards.set(10, [r1, r2]);
		Mining.rewards.set(20, [r2, r2]);
	}

	private static crates(): Crate[] {
		const c: Crate[] = [];
		const commonReward = new Map<Reward, number>([
			[Tool.get('Expert Sword'), 0.2], [Tool.get('Novice Pickaxe'), 0.5]
		]);
		const common = new Crate('Common', '§a§l', 'This is a simple description', 'chest', 3, commonReward);
		c.push(common);
		return c;
	}

	private static tools() {
		return Object.fromEntries(Object.entries(toolDefs).map(([name, opt]) =>
			[name, new Tool({ name: name, ...opt })]
		)) as Record<ToolName, Tool>;
	}

	public static init() {
		Skill.list = Loader.loadSkillsFromCSV(path.join(__dirname, 'csv'));

		Tool.tools = Loader.tools();
		Loader.setRewards();
		Crate.list = Loader.crates();
	}
}