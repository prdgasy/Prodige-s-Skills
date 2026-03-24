import { _, MCFunction, Objective, say, Variable, Score } from 'sandstone';
import { GUI } from '@prodigelib/gui';
import { SkillList } from './skills';
import type { pageRecordType, Skill, ItemType } from "./types";

/**
 * Main entry point for the GUI system.
 * Initializes scores, menu, and all pages.
 */
MCFunction('menu', () => {
  const depth = Objective.create('prodiges_skills.progress_depth')('@s');

  /** Stores player level scores per skill */
  const Scores: Record<string, Score> = {};
  SkillList.forEach(skill => {
    Scores[skill.name] = Objective.create(`prodige_skills.${skill.name}.level`)('@p');
  });

  const menu = new GUI.Init('hayichan', 'cmd');

  /**
   * Navigate back to a given page
   */
  const goBack = (previousPage: GUI.Page): GUI.Button => ({
    id: 'arrow',
    slot: 17,
    name: { text: 'Go back', color: 'red' },
    onClick: () => menu.toPage(previousPage)
  });

  /**
   * Navigate to main menu
   */
  const goMain = (): GUI.Button => ({
    id: 'arrow',
    slot: 17,
    name: { text: 'Go main', color: 'yellow' },
    onClick: () => menu.toPage(mainPage)
  });

  /** Stores all generated pages */
  const pageRecord: pageRecordType = {};

  const mainPage = createMainPage();
  createSkillPages();

  /**
   * Creates the main menu page
   */
  function createMainPage(): GUI.Page {
    const page: GUI.Page = {
      name: 'Menu',
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
        menu.toPage(pageRecord[name].progress);
      },
      macroArgs: [{ key: 'level', value: '<level>' }]
    });

    menu.pushInstruction(page, {
      fill: () => {
        SkillList.forEach((skill, i) => {
          menu.placeItem(skillButton(skill.item, 10 + i, skill.name, Scores[skill.name]));
        });
      },
      click: () => {
        SkillList.forEach((skill, i) => {
          menu.detectClick(skillButton(skill.item, 10 + i, skill.name, Scores[skill.name]));
        });
      }
    });

    menu.pushPage(page);
    return page;
  }

  /**
   * Generates all skill-related pages
   */
  function createSkillPages() {
    SkillList.forEach(skill => {
      pageRecord[skill.name] = {
        progress: { name: skill.name + ' progress' },
        onEvent: [{ name: skill.name + ' onEvent' }]
      };

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
          menu.placeItem(createLevelButton('red', 'Not reached', slot, testLevel));
        })
          .elseIf(playerLevel['=='](testLevel), () => {
            menu.placeItem(createLevelButton('yellow', 'In progress', slot, testLevel));
          })
          .else(() => {
            menu.placeItem(createLevelButton('green', 'Reached', slot, testLevel));
          });
      });
    };

    const click = () => {
      _.for([0, 18], 'iterate', i => {
        const slot = Variable(i);
        const testLevel = Variable(i)['+='](depth['*='](18));

        _.if(playerLevel['<'](testLevel), () => {
          menu.detectClick(createLevelButton('red', 'Not reached', slot, testLevel));
        })
          .elseIf(playerLevel['=='](testLevel), () => {
            menu.detectClick(createLevelButton('yellow', 'In progress', slot, testLevel));
          })
          .else(() => {
            menu.detectClick(createLevelButton('green', 'Reached', slot, testLevel));
          });
      });
    };

    const page: GUI.Page = {
      name: skill.name + ' progress',
      Buttons: [
        goBack(mainPage),
        { id: 'paper', slot: 19, onClick: () => depth['+='](1) },
        { id: 'paper', slot: 17, onClick: () => depth['-='](1) },
        {
          id: 'book',
          slot: 20,
          name: { text: 'onEvent page', color: 'green' },
          onClick: () => menu.toPage(pageRecord[skill.name].onEvent[0])
        }
      ]
    };

    menu.pushInstruction(page, { fill, click });
    pageRecord[skill.name].progress = page;
    menu.pushPage(page);
  }

  /**
   * Creates paginated onEvent pages for a skill
   */
  function createOnEventPages(skill: Skill) {
    const pages: GUI.Page[] = [];
    const pageCount = Math.ceil(skill.onEvents.length / 18);

    for (let i = 0; i < pageCount; i++) {
      const page: GUI.Page = {
        name: `${skill.name} onEvent ${i}`,
        Buttons: [goBack(pageRecord[skill.name].progress), goMain()]
      };
      pages.push(page);
    }

    pages.forEach((page, index) => {
      const buttons: GUI.Button[] = [];

      // Navigation
      if (index > 0) {
        buttons.push({
          id: 'paper',
          slot: 9,
          name: { text: 'Previous' },
          onClick: () => menu.toPage(pages[index - 1])
        });
      }

      if (index < pages.length - 1) {
        buttons.push({
          id: 'paper',
          slot: 10,
          name: { text: 'Next' },
          onClick: () => menu.toPage(pages[index + 1])
        });
      }

      // Events
      for (let j = 0; j < 18; j++) {
        const eventIndex = j + index * 18;
        if (eventIndex >= skill.onEvents.length) break;

        const event = skill.onEvents[eventIndex];
        buttons.push({
          id: event.item,
          slot: j,
          name: { text: `${event.name} (${event.gain} xp)`, color: 'yellow' },
          lore: [{ text: `<lore.onEvent>` }]
        });
      }

      page.Buttons?.push(...buttons);
      menu.pushPage(page);
      pageRecord[skill.name].onEvent.push(page);
    });
  }
}, { runOnLoad: true });
