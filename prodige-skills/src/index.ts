import { _, execute, MCFunction, Objective, say, scoreboard, tellraw, Macro as $, DataPointClass, DataArray, Variable, Score, item, give, raw, Data } from 'sandstone'
import { GUI } from '@prodigelib/gui'
import { SkillList, Skill } from './skills'
import { ItemType } from './types'

MCFunction('main', () => {
  const depth = Objective.create('prodiges_skills.progress_depth')('@s');
  const Scores: Record<string, Score> = {}
  SkillList.forEach(skill => {
    Scores[skill.name] = Objective.create(`prodige_skills.${skill.name}.level`)('@p');
  })


  const menu = new GUI.Init('haichan', 'cmd')

  const goBackButton = (previousPage: GUI.Page): GUI.Button => {
    return {
      id: 'arrow',
      slot: 17,
      name: { text: 'Go back', color: 'red' },
      onClick: () => { menu.toPage(previousPage); }
    }
  }
  const pageRecord: Record<string, { progress: GUI.Page, onEvent: GUI.Page }> = {};

  const mainPage = defMainPage();
  const skillPage = defSkillPages(mainPage);



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

  function defSkillPages(mainPage: GUI.Page) {
    SkillList.map(skill => {
      pageRecord[skill.name] = { progress: undefined as any, onEvent: undefined as any };
      const progressPage = defProgressPages(skill, Scores[skill.name], mainPage);
      defOnEventPages(skill, progressPage);
    });
  }

  /**
   * Push progress pages to see progress
   * @param skill Skill
   * @param pageRecord Dictionnary of stored pages
   * @param menu Controller
   */
  function defProgressPages(skill: Skill, playerLevel: Score, mainPage: GUI.Page): GUI.Page {
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

    const page: GUI.Page = {
      name: skill.name + ' progress',
      Buttons: [goBackButton(mainPage), addDepth, removeDepth]
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
    return page;
  }

  /**
   * Push onEvent pages to see every action and xp
   * @param skill Skill
   * @param pageRecord Dictionnary of stored pages
   * @param menu Controller
   */
  function defOnEventPages(skill: Skill, progressPage: GUI.Page): GUI.Page {
    const page: GUI.Page = {
      name: skill.name + ' onEvent',
      Buttons: [goBackButton(progressPage)]
    };

    pageRecord[skill.name].onEvent = page;
    menu.pushPage(page);
    return page;
  }

});


