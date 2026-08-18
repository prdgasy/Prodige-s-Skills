import { Text } from "@prodigelib/gui";
import { Skill } from "./types"

function wrapText(rawText: string, wordsPerLine: number = 5): Text[] {
  const words = rawText.split(' ');
  const result: Text[] = [];
  let currentLine: string[] = [];
  let spaceAfterFirst = ''
  words.forEach(word=>{
    currentLine.push(word);
    if (currentLine.length == wordsPerLine) {
      result.push({text: spaceAfterFirst + currentLine.join(' ')});
      spaceAfterFirst = ' '
      currentLine = [];
    }
  });

  if (currentLine.length > 0) result.push({text: spaceAfterFirst + currentLine.join(' ')});

  return result;
}

const Mining: Skill = {
  name: 'Mining',
  description: wrapText('Mine, mine, mien, very long too. Let s see how it goes'),
  item: 'diamond_pickaxe',
  startingXp: 15,
  SkillEvents: [
    { name: 'Stone', item: 'stone', criteria: 'minecraft.mined:minecraft.stone', xp: 1, point: 5 },
    { name: 'Coal Ore', item: 'coal_ore', criteria: 'minecraft.mined:minecraft.coal_ore', xp: 3, point: 5 },
    { name: 'Iron Ore', item: 'iron_ore', criteria: 'minecraft.mined:minecraft.iron_ore', xp: 5, point: 5 }
  ],
  customItems: [{ name: 'Drill Prototype', item: 'golden_pickaxe' }],
  titles: [{ name: 'Deep Delver' }, { name: 'Mountain King' }],
  ability: {
    name: 'Miner', description: wrapText('test description cool long. Very long actually')
  }
}

export const SkillList: Skill[] = [Mining];