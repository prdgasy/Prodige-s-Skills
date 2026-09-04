import * as fs from 'fs';
import * as path from 'path';
import { textWrapper } from '../../lib/textWrapper'; // Ton path exact
import { Skill, SkillClass } from './index';
import { Ability } from './ability';
import { OnEvent } from './onEvent';
import { Achievement } from './achievement';

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

export function loadSkillsFromCSV(dirPath: string): SkillClass[] {
  const skillsMap = new Map<string, SkillClass>();

  // 1. Charger les Skills & Abilities
  const skillsData = parseCSV(path.join(dirPath, 'skills.csv'));
  for (const row of skillsData) {
    const skill = Skill({
      name: row.name,
      description: textWrapper(row.description),
      itemId: row.itemId as any,
      startingXp: parseInt(row.startingXp, 10) || 0,
    });

    if (row.abilityName) {
      skill.ability = Ability({
        parent: skill,
        name: row.abilityName,
        description: textWrapper(row.abilityDescription),
      });
    }

    skillsMap.set(row.name, skill);
  }

  // 2. Charger les OnEvents
  const onEventsData = parseCSV(path.join(dirPath, 'on_events.csv'));
  for (const row of onEventsData) {
    const skill = skillsMap.get(row.skillName);
    if (skill) {
      skill.onEvents.push(
        OnEvent({
          parent: skill,
          name: row.name,
          itemId: row.itemId as any,
          criteria: row.criteria as any,
          Xp: parseInt(row.Xp, 10) || 0,
          pts: parseInt(row.pts, 10) || 0,
        })
      );
    }
  }

  // 3. Charger les Achievements
  const achievementsData = parseCSV(path.join(dirPath, 'achievements.csv'));
  for (const row of achievementsData) {
    const skill = skillsMap.get(row.skillName);
    if (skill) {
      skill.achievements.push(
        Achievement({
          parent: skill,
          id: row.id,
          name: row.name,
          itemId: row.itemId as any,
          target: parseInt(row.target, 10) || 0,
          description: textWrapper(row.description),
        })
      );
    }
  }

  return Array.from(skillsMap.values());
}