import { Buyable } from '@src/misc/buyable';
import { Crate } from '@src/misc/crate';
import { Reward } from '@src/misc/reward';
import { Tool } from '@src/misc/tool';
import { Ability } from '@src/skill/ability';
import { Achievement } from '@src/skill/achievement';
import { Skill } from '@src/skill/index';
import { OnEvent } from '@src/skill/onEvent';
import { Criteria } from '@src/types';
import * as fs from 'fs';
import * as path from 'path';

export class Loader {
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
		const Mining = Loader.getSkill('Mining');
		const r1 = Tool.list[0];
		const r2 = Reward.point(200);
		Mining.rewards.set(10, [r1, r2]);
		Mining.rewards.set(20, [r2, r2]);
	}

	private static crates(tools: Tool[]): Crate[] {
		const c: Crate[] = [];
		const commonReward = new Map<Buyable, number>([
			[tools[0], 0.5], [tools[1], 0.5],
		]);
		const common = new Crate('Common', '§a§l', 'This is a simple description', 'chest', 3, commonReward);
		c.push(common);
		return c;
	}

	private static tools(): Tool[] {
		const t: Tool[] = [];
		const NovicePickaxe = new Tool({
			name: "Novice Miners Pickaxe",
			item: "iron_pickaxe",
			price: 50,
			description: '§7A reliable pickaxe for aspiring miners, ideal for extracting basic ores.',
			characteristics: ["test", "test3"],
			rarity: "§f§lCOMMON",
			durability: 250,
			onUse: () => { },
			onBreak: () => { },
			onHold: () => { }
		});
		t.push(NovicePickaxe);

		const DeepDelverPickaxe = new Tool({
			name: "Deep Delver Pickaxe",
			item: "diamond_pickaxe",
			price: 250,
			description: '§7Forged in deep caverns, this sturdy pickaxe effortlessly breaks through the toughest stone.',
			characteristics: [],
			rarity: "§9§lRARE",
			durability: 1000,
			onUse: () => { },
			onBreak: () => { },
			onHold: () => { }
		});
		t.push(DeepDelverPickaxe);

		return t;
	}

	public static init() {
		Skill.list = Loader.loadSkillsFromCSV(path.join(__dirname, 'csv'));

		Loader.setRewards();
		Tool.list = Loader.tools();
		Crate.list = Loader.crates(Tool.list);
	}

	public static getSkill(skill: 'Mining' | 'Foraging'): Skill {
		return Skill.list.find(s => s.name === skill) as Skill;
	}
}