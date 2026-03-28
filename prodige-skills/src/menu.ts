import { _, MCFunction, Objective, say, Variable, Score, ObjectiveClass } from 'sandstone';
import { GUI } from '@prodigelib/gui';
import { SkillList } from './skills';
import type { Skill, ItemType } from "./types";
import { Errors } from './errors';

const depth = Objective.create('prodiges_skills.progress_depth')('@s');
/** Stores player level scores per skill */
const Scores: Record<string, { progress: Score, prestige: Score }> = {};
SkillList.forEach(skill => {
  Scores[skill.name] = {
    progress: Objective.create(`${skill.name}.level`)('@p'),
    prestige: Objective.create(`${skill.name}.prestige`)('@p')
  }
});

function boosterItem(type: 'xp' | 'point', multiplier: number) {
  let itemRepr: ItemType;
  let name: string;
  let color: string;
  let onClick = () => { Errors.functionNotImplemented(); }
  if (type === 'xp') {
    itemRepr = 'experience_bottle';
    name = `${multiplier}x XP Booster`;
    color = 'aqua';
  } else {
    itemRepr = 'gold_ingot';
    name = `${multiplier}x XP Booster`;
    color = 'gold';
  }
  return { itemRepr, name, color, multiplier, onClick };
}


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
    slot: 21,
    name: { text: 'Go back', color: 'red' },
    onClick: () => Menu.toPage(previousPage)
  });

  const progressPage = (skillName: string): string => {
    return `progress_${skillName}`;
  }
  const onEventPage = (skillName: string, index: number): string => {
    return `onEvent_${skillName}_${index}`;
  }
  const mainPage = 'main';
  const prestigePage = 'prestige';
  const shopPage = 'shop';
  const shopBoosterPage = 'shop_booster';
  const shopItemPage = 'shop_item';
  const shopTitlePage = 'shop_title';

  createMainPage();
  createSkillPages();
  createPrestigePage();
  createShopPage();
  createBoosterPage();
  createItemPage();
  createTitlePage();

  function createTitlePage() {
    const page: GUI.Page = {
      name: shopTitlePage,
      Buttons: [goBack(shopPage)]
    }
    let slot = 0;
    SkillList.forEach(skill => {
      skill.titles.forEach(item => {
        slot++;
        page.Buttons?.push({
          id: 'name_tag',
          slot: slot,
          name: { text: item.name },
          onClick: () => { Errors.functionNotImplemented() }
        })
      })
    })

    Menu.pushPage(page);
  }

  function createItemPage() {
    const page: GUI.Page = {
      name: shopItemPage,
      Buttons: [goBack(shopPage)]
    }
    let slot = 0;
    SkillList.forEach(skill => {
      skill.customItems.forEach(item => {
        slot++;
        page.Buttons?.push({
          id: item.item,
          slot: slot,
          name: { text: item.name },
          onClick: () => { Errors.functionNotImplemented() }
        })
      })
    })

    Menu.pushPage(page);
  }

  function createBoosterPage() {
    const page: GUI.Page = {
      name: shopBoosterPage,
      Buttons: [goBack(shopPage), { id: 'stone_button', slot: 5, name: { text: 'testbutton' } }]
    }

    for (let i = 0; i < 5; i++) {
      const xpBooster = boosterItem('xp', i);
      const pointBooster = boosterItem('point', i);

      page.Buttons?.push({
        id: xpBooster.itemRepr,
        slot: i + 5,
        name: { text: xpBooster.name },
        onClick: () => { xpBooster.onClick() }
      }, {
        id: pointBooster.itemRepr,
        slot: i + 10,
        name: { text: pointBooster.name },
        onClick: () => { pointBooster.onClick() }
      });
    }

    Menu.pushPage(page);
  }

  function createShopPage() {
    const page: GUI.Page = {
      name: shopPage,
      Buttons: [goBack(mainPage)]
    }

    const itemsButton: GUI.Button = {
      id: 'emerald',
      slot: 10,
      name: { text: 'Items', color: 'green' },
      lore: [Errors.textNotImplemented()],
      onClick: () => { Menu.toPage(shopItemPage) }
    }
    const boostersButton: GUI.Button = {
      id: 'experience_bottle',
      slot: 11,
      name: { text: 'Boosters', color: 'aqua' },
      lore: [Errors.textNotImplemented()],
      onClick: () => { Menu.toPage(shopBoosterPage) }
    }
    const titlesButton: GUI.Button = {
      id: 'name_tag',
      slot: 12,
      name: { text: 'Titles', color: 'yellow' },
      lore: [Errors.textNotImplemented()],
      onClick: () => { Menu.toPage(shopTitlePage) }
    }

    page.Buttons?.push(itemsButton, boostersButton, titlesButton);
    Menu.pushPage(page);
  }

  function createPrestigePage() {
    const page: GUI.Page = {
      name: prestigePage,
      Buttons: [goBack(mainPage)]
    }

    const skillPrestigeButton = (id: ItemType, slot: number, name: string, playerPrestigeLevel: Score): GUI.Button => ({
      id,
      slot,
      name: { text: name, color: 'yellow' },
      lore: [{ text: `${name} $(level)` }],
      onClick: () => {
        Errors.functionNotImplemented();
      },
      macroArgs: [Errors.macroArgumentNotImplemented('level')]
    });

    SkillList.forEach((skill, index) => {
      page.Buttons?.push(skillPrestigeButton(skill.item, index + 10, skill.name, Scores[skill.name].prestige))
    })

    Menu.pushPage(page);
  }

  function createMainPage() {
    const page: GUI.Page = {
      name: mainPage,
      Buttons: []
    };

    /**
     * Creates a skill button displayed in main menu
     */
    const skillButton = (id: ItemType, slot: number, name: string, playerLevel: Score): GUI.Button => ({
      id: id,
      slot: slot,
      name: { text: name, color: 'yellow' },
      lore: [{ text: `${name} $(level)` }],
      onClick: () => {
        depth.set(playerLevel['/='](18));
        Menu.toPage(progressPage(name));
      },
      macroArgs: [Errors.macroArgumentNotImplemented('level')]
    });


    const prestigeButton: GUI.Button = {
      id: 'netherite_scrap',
      slot: 20,
      name: { text: 'Prestige' },
      lore: [Errors.textNotImplemented()],
      onClick: () => { Menu.toPage(prestigePage) }
    }
    const shopButton: GUI.Button = {
      id: 'emerald',
      slot: 22,
      name: { text: 'Shop', color: 'green' },
      onClick: () => { Menu.toPage(shopPage); }
    }

    Menu.pushInstruction(page, {
      fill: () => {
        SkillList.forEach((skill, i) => {
          Menu.placeItem(skillButton(skill.item, 10 + i, skill.name, Scores[skill.name].progress));
        });
      },
      click: () => {
        SkillList.forEach((skill, i) => {
          Menu.detectClick(skillButton(skill.item, 10 + i, skill.name, Scores[skill.name].progress));
        });
      }
    });

    page.Buttons?.push(prestigeButton, shopButton);

    Menu.pushPage(page);
  }

  function createSkillPages() {
    SkillList.forEach(skill => {
      createProgressPage(skill);
      createOnEventPages(skill);
    });

    /**
   * Creates the progress page for a given skill
   */
    function createProgressPage(skill: Skill) {
      const playerLevel = Scores[skill.name].progress;

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
          { 'level': level },
          { 'slot': slot }
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
          { id: 'paper', slot: 8, onClick: () => depth['+='](1) },
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
          Buttons: [goBack(progressPage(skill.name)), goBack(progressPage(skill.name))]
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
            lore: [Errors.textNotImplemented()]
          });
        }

        Menu.pushPage(page);
      }


    }
  }
}, { runOnLoad: true });


