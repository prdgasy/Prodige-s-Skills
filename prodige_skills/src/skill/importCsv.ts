import * as fs from 'fs';
import * as path from 'path';
import { Skill } from './index';
import { Ability } from './ability';
import { OnEvent } from './onEvent';
import { Achievement } from './achievement';
import { Criteria } from '@src/types';
import { Reward } from '@src/misc/reward';
import { say } from 'sandstone';

// Utility pour parser un fichier CSV simplement (gère les guillemets)
// Utility pour parser un fichier CSV simplement (gère les guillemets et les espaces)
function parseCSV(filePath: string): Record<string, string>[] {
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

function loadSkillsFromCSV(dirPath: string): Skill[] {
  const skillsMap = new Map<string, Skill>();

  // 1. Charger les Skills & Abilities
  const skillsData = parseCSV(path.join(dirPath, 'skills.csv'));
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

  const onEventsData = parseCSV(path.join(dirPath, 'on_events.csv'));
  for (const row of onEventsData) {
    const skill = skillsMap.get(row.skillName);
    if (skill) skill.onEvents.push(new OnEvent(skill, row.name, row.item as any, parseInt(row.Xp, 10) || 0, parseInt(row.pts, 10) || 0, row.criteria as Criteria));
  }

  const achievementsData = parseCSV(path.join(dirPath, 'achievements.csv'));
  for (const row of achievementsData) {
    const skill = skillsMap.get(row.skillName);
    if (skill) skill.achievements.push(new Achievement(skill, row.name, row.item as any, parseInt(row.target, 10) || 0, row.description));
  }

  return Array.from(skillsMap.values());
}

Skill.list = loadSkillsFromCSV(path.join(__dirname, 'data'));

const Mining = Skill.list.find(s => s.name === 'Mining');
if (Mining) {
  Mining.rewards.set(10, [new Reward({ show: '§dCustom Reward', get: () => { say('got custom reward') } })]);
  Mining.rewards.set(20, [new Reward({ show: '§dCustom Reward 2', get: () => { say('got custom reward 2') } })]);
}