import { _, MCFunction, Objective, say, Variable, Score } from 'sandstone';
import { GUI } from '@prodigelib/gui';
import { SkillList } from './skills';
import type { pageRecordType, Skill, ItemType } from "./types";
import { Errors } from './errors';

const depth = Objective.create('prodiges_skills.progress_depth')('@s');
/** Stores player level scores per skill */
const Scores: Record<string, Score> = {};
SkillList.forEach(skill => {
  Scores[skill.name] = Objective.create(`prodige_skills.${skill.name}.level`)('@p');
});

/**
 * Main entry point for the GUI system.
 * Initializes scores, menu, and all pages.
 */
MCFunction('menu', () => {


  const Menu = new GUI.Init('hayichan', 'cmd');

  /**
   * Navigate back to a given page
   */
  const goBack = (previousPage: GUI.Page | string): GUI.Button => ({
    id: 'arrow',
    slot: 17,
    name: { text: 'Go back', color: 'red' },
    onClick: () => Menu.toPage(previousPage)
  });

  /**
   * Navigate to main menu
   */
  const goMain = (): GUI.Button => ({
    id: 'arrow',
    slot: 17,
    name: { text: 'Go main', color: 'yellow' },
    onClick: () => Menu.toPage('main')
  });

  const progressPage = (skillName: string): string => {
    return `progress_${skillName}`;
  }
  const onEventPage = (skillName: string, index: number): string => {
    return `onEvent_${skillName}_${index}`;
  }
  const mainPage = 'main';
  const prestigePage = 'prestige';



  createMainPage();
  createSkillPages();
  createPrestigePage();
  say('a');

  function createPrestigePage() {

  }
  /**
   * Creates the main menu page
   */
  function createMainPage(): GUI.Page {
    const page: GUI.Page = {
      name: mainPage,
      Buttons: [{ id: 'stick', slot: 0 }]
    };

    /**
     * Creates a skill button displayed in main menu
     */
    const skillButton = (
      id: ItemType,
      slot: number,
      name: string,
      playerLevel: Score
    ): GUI.Button => ({
      id,
      slot,
      name: { text: name, color: 'yellow' },
      lore: [{ text: `${name} $(level)` }],
      onClick: () => {
        depth.set(playerLevel['/='](18));
        Menu.toPage(progressPage(name));
      },
      macroArgs: [{ key: 'level', value: '<level>' }]
    });

    const prestigeButton: GUI.Button = {
      id: 'netherite_scrap',
      slot: 20,
      name: { text: 'Prestige' },
      lore: [Errors.notImplemented],
      onClick: () => { Menu.toPage(prestigePage) }
    }

    Menu.pushInstruction(page, {
      fill: () => {
        SkillList.forEach((skill, i) => {
          Menu.placeItem(skillButton(skill.item, 10 + i, skill.name, Scores[skill.name]));
        });
      },
      click: () => {
        SkillList.forEach((skill, i) => {
          Menu.detectClick(skillButton(skill.item, 10 + i, skill.name, Scores[skill.name]));
        });
      }
    });

    page.Buttons?.push(prestigeButton);

    Menu.pushPage(page);
    return page;
  }

  /**
   * Generates all skill-related pages
   */
  function createSkillPages() {
    SkillList.forEach(skill => {
      createProgressPage(skill);
      createOnEventPages(skill);
    });
  }

  /**
   * Creates the progress page for a given skill
   */
  function createProgressPage(skill: Skill) {
    const playerLevel = Scores[skill.name];

    /**
     * Factory for level state buttons
     */
    const createLevelButton = (
      color: string,
      message: string,
      slot: Score,
      level: Score
    ): GUI.Button => ({
      id: `${color}_stained_glass_pane` as ItemType,
      slot: '$(slot)',
      name: { text: `Level $(level)`, color },
      onClick: () => say(message),
      macroArgs: [
        { key: 'level', value: level },
        { key: 'slot', value: slot }
      ]
    });

    const fill = () => {
      _.for([0, 18], 'iterate', i => {
        const slot = Variable(i);
        const testLevel = Variable(i)['+='](depth['*='](18));

        _.if(playerLevel['<'](testLevel), () => {
          Menu.placeItem(createLevelButton('red', 'Not reached', slot, testLevel));
        })
          .elseIf(playerLevel['=='](testLevel), () => {
            Menu.placeItem(createLevelButton('yellow', 'In progress', slot, testLevel));
          })
          .else(() => {
            Menu.placeItem(createLevelButton('green', 'Reached', slot, testLevel));
          });
      });
    };

    const click = () => {
      _.for([0, 18], 'iterate', i => {
        const slot = Variable(i);
        const testLevel = Variable(i)['+='](depth['*='](18));

        _.if(playerLevel['<'](testLevel), () => {
          Menu.detectClick(createLevelButton('red', 'Not reached', slot, testLevel));
        })
          .elseIf(playerLevel['=='](testLevel), () => {
            Menu.detectClick(createLevelButton('yellow', 'In progress', slot, testLevel));
          })
          .else(() => {
            Menu.detectClick(createLevelButton('green', 'Reached', slot, testLevel));
          });
      });
    };

    const page: GUI.Page = {
      name: progressPage(skill.name),
      Buttons: [
        goBack('main'),
        { id: 'paper', slot: 19, onClick: () => depth['+='](1) },
        { id: 'paper', slot: 17, onClick: () => depth['-='](1) },
        {
          id: 'book',
          slot: 20,
          name: { text: 'onEvent page', color: 'green' },
          onClick: () => Menu.toPage(onEventPage(skill.name, 0))
        }
      ]
    };

    Menu.pushInstruction(page, { fill, click });
    Menu.pushPage(page);
  }

  /**
   * Creates paginated onEvent pages for a skill
   */
  function createOnEventPages(skill: Skill) {
    const pageCount = Math.ceil(skill.onEvents.length / 18);

    for (let i = 0; i < pageCount; i++) {
      const index = i;
      const page: GUI.Page = {
        name: onEventPage(skill.name, index),
        Buttons: [goBack(progressPage(skill.name)), goMain()]
      };

      // Navigation
      if (index > 0) {
        page.Buttons?.push({
          id: 'paper',
          slot: 9,
          name: { text: 'Previous' },
          onClick: () => Menu.toPage(onEventPage(skill.name, index - 1))
        });
      }
      if (index < pageCount - 1) {
        page.Buttons?.push({
          id: 'paper',
          slot: 10,
          name: { text: 'Next' },
          onClick: () => Menu.toPage(onEventPage(skill.name, index + 1))
        });
      }

      // Events
      for (let j = 0; j < 18; j++) {
        const eventIndex = j + index * 18;
        if (eventIndex >= skill.onEvents.length) break;

        const event = skill.onEvents[eventIndex];
        page.Buttons?.push({
          id: event.item,
          slot: j,
          name: { text: `${event.name} (${event.gain} xp)`, color: 'yellow' },
          lore: [Errors.notImplemented]
        });
      }

      Menu.pushPage(page);
    }


  }
}, { runOnLoad: true });
