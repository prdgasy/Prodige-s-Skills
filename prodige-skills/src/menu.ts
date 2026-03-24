import { _, execute, MCFunction, Objective, say, scoreboard, tellraw, Macro as $, DataPointClass, DataArray, Variable, Score, item, give, raw, Data } from 'sandstone';
import { GUI } from '@prodigelib/gui';
import { SkillList } from './skills';
import type { pageRecordType, Skill, ItemType } from "./types";

MCFunction('menu', () => {
  const depth = Objective.create('prodiges_skills.progress_depth')('@s');
  const Scores: Record<string, Score> = {};
  SkillList.forEach(skill => {
    Scores[skill.name] = Objective.create(`prodige_skills.${skill.name}.level`)('@p');
  });

  const menu = new GUI.Init('haichan', 'cmd');

  const goBack = (previousPage: GUI.Page): GUI.Button => {
    return {
      id: 'arrow',
      slot: 17,
      name: { text: 'Go back', color: 'red' },
      onClick: () => { menu.toPage(previousPage); }
    }
  };

  const goMain = (): GUI.Button => {
    return {
      id: 'arrow',
      slot: 17,
      name: { text: 'Go main', color: 'yellow' },
      onClick: () => { menu.toPage(mainPage); }
    }
  };

  const pageRecord: pageRecordType = {};

  const mainPage = defMainPage();
  const skillPage = defSkillPages();

  function defMainPage(): GUI.Page {
    const Main: GUI.Page = {
      name: 'Menu',
      Buttons: [{ id: 'stick', slot: 0 }]
    }

    const skillButton = (id: ItemType, slot: number, name: string, playerLevel: Score): GUI.Button => {
      return {
        id: id,
        slot: slot,
        name: { text: name, color: 'yellow' },
        lore: [{ text: `${name} $(level)` }],
        onClick: () => {
          depth.set(playerLevel['/='](18));
          menu.toPage(pageRecord[name].progress);
        },
        macroArgs: [{ key: 'level', value: '<level>' }]
      }
    }
    menu.pushInstruction(Main, {
      fill: () => {
        for (let i = 0; i < SkillList.length; i++) {
          const skill = SkillList[i];
          const id = skill.item;
          const name = skill.name;
          menu.placeItem(skillButton(id, 10 + i, name, Scores[skill.name]));
        }
      },
      click: () => {
        for (let i = 0; i < SkillList.length; i++) {
          const skill = SkillList[i];
          const id = skill.item;
          const name = skill.name;
          menu.detectClick(skillButton(id, 10 + i, name, Scores[skill.name]));
        }
      }
    });

    menu.pushPage(Main);
    return Main;
  }

  function defSkillPages() {
    SkillList.map(skill => {
      pageRecord[skill.name] = {
        progress: { name: skill.name + ' progress' },
        onEvent: [{ name: skill.name + ' onEvent' }]
      };

      defProgressPages(skill);
      defOnEventPages(skill);
    });
  }

  /**
   * Push progress pages to see progress
   * @param skill Skill
   * @param pageRecord Dictionnary of stored pages
   * @param menu Controller
   */
  function defProgressPages(skill: Skill) {
    const levelNotReachedButton = (skillName: string, slot: Score, level: Score): GUI.Button => {
      return {
        id: 'red_stained_glass_pane',
        slot: '$(slot)',
        name: { text: `Level $(level)`, color: 'red' },
        onClick: () => { say('This level has not been reached yet'); },
        macroArgs: [{ 'level': level }, { 'slot': slot }]
      };
    }

    const levelReachingButton = (skillName: string, slot: Score, level: Score): GUI.Button => {
      return {
        id: 'yellow_stained_glass_pane',
        slot: '$(slot)',
        name: { text: `Level $(level)`, color: 'yellow' },
        onClick: () => { say('in progress'); },
        macroArgs: [{ 'level': level }, { 'slot': slot }]
      };
    }

    const levelReachedButton = (skillName: string, slot: Score, level: Score): GUI.Button => {
      return {
        id: 'green_stained_glass_pane',
        slot: '$(slot)',
        name: { text: `Level $(level)`, color: 'green' },
        onClick: () => { say('level reached'); },
        macroArgs: [{ 'level': level }, { 'slot': slot }]
      };
    }

    const playerLevel = Scores[skill.name]

    const fillInstruction = () => {
      _.for([0, 18], 'iterate', (i) => {
        const testLevel = Variable(i)['+='](depth['*='](18));
        const slot = Variable(i);

        _.if(playerLevel['<'](testLevel), () => { menu.placeItem(levelNotReachedButton(skill.name, slot, testLevel)); })
          .elseIf(playerLevel['=='](testLevel), () => { menu.placeItem(levelReachingButton(skill.name, slot, testLevel)); })
          .else(() => { menu.placeItem(levelReachedButton(skill.name, slot, testLevel)); })
      })
    }

    const clickInstruction = () => {
      _.for([0, 18], 'iterate', (i) => {
        const testLevel = Variable(i)['+='](depth['*='](18));
        const slot = Variable(i);

        _.if(playerLevel['<'](testLevel), () => { menu.detectClick(levelNotReachedButton(skill.name, slot, testLevel)); })
          .elseIf(playerLevel['=='](testLevel), () => { menu.detectClick(levelReachingButton(skill.name, slot, testLevel)); })
          .else(() => { menu.detectClick(levelReachedButton(skill.name, slot, testLevel)); })
      })
    }


    const addDepth: GUI.Button = {
      id: 'paper',
      slot: 19,
      onClick: () => { depth['+='](1); }
    }
    const removeDepth: GUI.Button = {
      id: 'paper',
      slot: 17,
      onClick: () => { depth['-='](1); }
    }

    const toOnEvent: GUI.Button = {
      id: 'book',
      slot: 20,
      name: { text: 'onEvent page', color: 'green' },
      onClick: () => { menu.toPage(pageRecord[skill.name].onEvent[0]) }
    }

    const page: GUI.Page = {
      name: skill.name + ' progress',
      Buttons: [goBack(mainPage), addDepth, removeDepth, toOnEvent]
    }

    menu.pushInstruction(page, {
      fill: () => {
        fillInstruction();
      },
      click: () => {
        clickInstruction();
      }
    })

    pageRecord[skill.name].progress = page;
    menu.pushPage(page);
  }

  /**
   * Push onEvent pages to see every action and xp
   * @param skill Skill
   * @param pageRecord Dictionnary of stored pages
   * @param menu Controller
   */
  function defOnEventPages(skill: Skill) {
    const pages: GUI.Page[] = [];

    for (let i = 0; i < skill.onEvents.length / 18; i++) {
      const page = {
        name: skill.name + ' onEvent ' + i,
        Buttons: [goBack(pageRecord[skill.name].progress), goMain()]
      }

      pages.push(page);
    }

    for (let i = 0; i < skill.onEvents.length / 18; i++) {
      const index = i;

      const next: GUI.Button = {
        id: 'paper',
        slot: 10,
        name: { text: 'Next onEvents' },
        onClick: () => {
          // say(JSON.stringify(pages[index + 1]));
          if (index + 1 < skill.onEvents.length / 18) menu.toPage(pages[index + 1]);
        }
      };

      const prev: GUI.Button = {
        id: 'paper',
        slot: 9,
        name: { text: 'previous onEvents' },
        onClick: () => {
          if (index - 1 >= 0) menu.toPage(pages[index - 1]);
        }
      };

      // ADD HERE ONEVENTS
      const buttonToPush: GUI.Button[] = [next, prev];
      for (let j = 0; (j < 18) && ((j + index * 18) < skill.onEvents.length); j++) {
        const event = skill.onEvents[(j + index * 18)];
        buttonToPush.push({
          id: event.item,
          slot: j,
          name: { text: `${event.name} (${event.gain} xp)`, color: 'yellow' },
          lore: [{ text: `<lore.onEvent.buttonToPush>` }]
        })
      }

      pages[index].Buttons?.push(...buttonToPush);
      menu.pushPage(pages[index]);
      pageRecord[skill.name].onEvent.push(pages[index]);
    }
  }
}, {
  runOnLoad: true
})

