import { crateDefs, CrateName, skillDefs, SkillName, toolDefs, ToolName } from '@src/data/definitions';
import { Crate } from '@src/misc/crate';
import { AllRewards, Reward } from '@src/misc/reward';
import { Tool } from '@src/misc/tool';
import { Ability } from '@src/skill/ability';
import { Achievement } from '@src/skill/achievement';
import { Skill } from '@src/skill/index';
import { Action } from '@src/skill/action';
import { Criteria } from '@src/types';
import * as fs from 'fs';
import * as path from 'path';
import { Task } from '@src/misc/task';

export class Loader {
	// ------------------------------------------------------------------------
	// CSV PARSING
	// ------------------------------------------------------------------------
	private static parseCSV(filePath: string): Record<string, string>[] {
		const content = fs.readFileSync(filePath, 'utf-8');
		const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
		if (lines.length === 0) return [];

		const headers = lines[0].split(',').map(h => h.trim());

		return lines.slice(1).map(line => {
			const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
			const row: Record<string, string> = {};

			headers.forEach((header, index) => {
				let val = values[index] ? values[index].trim() : '';

				// Strip surrounding quotes
				if (val.startsWith('"') && val.endsWith('"')) {
					val = val.slice(1, -1).replace(/""/g, '"');
				}

				row[header] = val;
			});

			return row;
		});
	}

	// ------------------------------------------------------------------------
	// CSV DATA LOADING (on_events.csv, achievements.csv)
	// ------------------------------------------------------------------------
	private static loadDataFromCSV(dirPath: string) {
		// -- On events --
		const onEventsData = Loader.parseCSV(path.join(dirPath, 'on_events.csv'));
		for (const row of onEventsData) {
			try {
				const skill = Skill.get(row.skillName as SkillName);
				skill.onEvents.push(new Action(skill, row.name, row.item as any, parseFloat(row.Xp) || 0, parseInt(row.pts, 10) || 0, row.criteria as Criteria));
			} catch (e) { throw Error(`${e}: Skill ${row.skillName} isn't define inside loader.ts`); }
		}

		// -- Achievements --
		const achievementsData = Loader.parseCSV(path.join(dirPath, 'achievements.csv'));
		for (const row of achievementsData) {
			try {
				const skill = Skill.get(row.skillName as SkillName);
				if (skill) skill.achievements.push(new Achievement(skill, row.name, row.item as any, parseInt(row.target, 10) || 0, row.description));
			} catch (e) {
				throw Error(`${e}: Skill ${row.skillName} isn't define inside loader.ts`);
			}
		}
	}

	// ------------------------------------------------------------------------
	// SKILL LEVEL REWARDS
	// ------------------------------------------------------------------------
	private static setSkillsRewards() {

		const Mining = Skill.get('Mining');
		const r1 = Reward.get('§bExpert Sword');
		const r2 = Reward.point(200);
		Mining.rewards.set(10, [r1, r2]);
		Mining.rewards.set(20, [r2, r2]);
		Mining.rewards.set(21, Reward.rare);
	}

	public static setAbilityRewards() {
		for (const skill of Object.values(Skill.skills)) {
			if (skill.ability) {
				for (let tier = 1; tier < 10; tier++) {
					const reward = Reward.ability(skill.ability, tier);
					const level = tier * 10;
					if (!skill.rewards.has(level)) skill.rewards.set(level, []);
					skill.rewards.get(level)?.push(reward);
				}
			}
		}
	}

	private static setDefaultRewards() {
		Reward.common = [Reward.point(100)];
		Reward.rare = [Reward.point(100), Reward.get('§aNovice Pickaxe')];
	}

	// ------------------------------------------------------------------------
	// FACTORIES (build instances from the definitions above)
	// ------------------------------------------------------------------------
	private static crates<T>(): T {
		return Object.fromEntries(Object.entries(crateDefs).map(([name, opt]) => {
			return [name, new Crate({ ...opt, name, rewards: opt.rewards() })]
		})) as T;
	}

	private static tools<T>(): T {
		return Object.fromEntries(Object.entries(toolDefs).map(([name, opt]) =>
			[name, new Tool({ name, ...opt })]
		)) as T;
	}

	private static skills<T>(): T {
		return Object.fromEntries(Object.entries(skillDefs).map(([name, opt]) =>
			[name, new Skill({ ...opt, name })]
		)) as T;
	}

	private static tasks(): Task[] {
		const t: Task[] = [];
		t.push(new Task('stone', 'Mine stone', 100, 'minecraft.mined:minecraft.stone', [Reward.point(100)]));
		t.push(new Task('dirt', 'Mine dirt', 1000, 'minecraft.mined:minecraft.dirt', [Reward.point(200)]));
		t.push(new Task('sand', 'Mine sand', 10000, 'minecraft.mined:minecraft.sand', [Reward.point(300)]));

		t.push(new Task('brick', 'Mine stone', 100, 'minecraft.mined:minecraft.stone', [Reward.point(100)]));
		t.push(new Task('diamond', 'Mine dirt', 1000, 'minecraft.mined:minecraft.dirt', [Reward.point(200)]));
		t.push(new Task('sandstone', 'Mine sand', 10000, 'minecraft.mined:minecraft.sand', [Reward.point(300)]));


		return t;
	}
	// ------------------------------------------------------------------------
	// INIT
	// Order matters: each step depends on the ones above it.
	// ------------------------------------------------------------------------
	public static init() {
		// 1. Skills (needed by the CSV data and the rewards)
		Skill.skills = Loader.skills<Record<SkillName, Skill>>();

		// 2. CSV data (attached to the skills)
		Loader.loadDataFromCSV(path.join(__dirname, 'csv'));

		// 3. Tools, then crates (crates look their rewards up among the tools)
		Tool.tools = Loader.tools<Record<ToolName, Tool>>();
		Crate.crates = Loader.crates<Record<CrateName, Crate>>();

		// 4. Skill level and default rewards (need skills and tools)
		Loader.setDefaultRewards();
		Loader.setSkillsRewards();
		Loader.setAbilityRewards();

		// TASKS
		Task.tasks = Loader.tasks();

	}
}