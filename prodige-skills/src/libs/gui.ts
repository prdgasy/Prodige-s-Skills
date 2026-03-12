import {
  _, Data, execute, Label, MCFunction, Objective, rel, Score, scoreboard,
  Selector, summon, tellraw, functionCmd, raw, kill, tp, abs,
  forceload, loot, Variable, clear
} from 'sandstone'

import { LabelClass, ObjectiveClass } from 'sandstone/variables'

import { ITEMS, MCFunctionType } from './types'
import { Item } from './item'


/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type MacroArg = {
  key: string
  value: any
}


/**
 * Represents a clickable GUI button.
 */
export class Button {

  id: ITEMS
  slot: number
  count?: number

  name?: string
  lore?: string[]
  components?: string[]

  onClick?: MCFunctionType

  macroArgs?: MacroArg[]
  isMacro?: boolean
  isFiller?: boolean

  constructor(
    id: ITEMS,
    slot: number,
    count?: number,
    onClick?: MCFunctionType,
    name?: string,
    lore?: string[],
    components?: string[],
    macroArgs?: MacroArg[],
    isMacro?: boolean,
    isFiller?: boolean
  ) {

    this.id = id
    this.slot = slot
    this.count = count ?? 1

    this.onClick = onClick

    this.name = name ?? id
    this.lore = lore
    this.components = components

    this.macroArgs = macroArgs
    this.isMacro = isMacro

    this.isFiller = isFiller ?? false
  }

  /**
   * Converts the button into a valid Minecraft item string.
   */
  toString(): string {
    return new Item(this.id, this.name, this.lore, this.components).toString()
  }
}


/**
 * Represents a GUI page.
 */
export type GUIPage = {
  name: string
  buttons: Button[]
  id?: number
}



/* -------------------------------------------------------------------------- */
/*                                   GUI                                      */
/* -------------------------------------------------------------------------- */

/**
 * Main GUI controller.
 * Handles page management, click detection and entity linking.
 */
export class GUI {

  name: string
  triggerCmd: string

  Pages: GUIPage[] = []
  pageId = 0

  pageIdScore: Score

  Ids: ObjectiveClass
  GUILabel: LabelClass

  refresh: MCFunctionType
  clickFinder: MCFunctionType


  constructor(name: string, triggerCmd: string, pages?: GUIPage[]) {

    this.name = name
    this.triggerCmd = triggerCmd

    this.pageIdScore = Objective.create(`${name}.gui.page`)('@s')

    this.Ids = Objective.create(`${name}.gui.id`)
    this.GUILabel = Label(`${name}.gui`)

    if (pages) {
      this.initPages(pages)
    }

    this.defineTrigger()
    this.findObjs()

    this.refresh = this.defineRefresh()
    this.clickFinder = this.defineClickFinder()

    forceload.add([930005, 930005])
  }


  /* -------------------------------------------------------------------------- */
  /*                             ENTITY MANAGEMENT                              */
  /* -------------------------------------------------------------------------- */

  /**
   * Links players and GUI entities that share the same ID.
   */
  findObjs(): MCFunctionType {

    return MCFunction('findobjs', () => {

      execute
        .as('@a')
        .at('@s')
        .as(Selector('@e', { type: 'chest_minecart', tag: [this.GUILabel] }))
        .run(() => {

          _.if(this.Ids('@p')['=='](this.Ids('@s')), () => {
            this.main()
          })

        })

    }, { runEveryTick: true })
  }


  /**
   * Main GUI loop.
   */
  main() {

    _.if(_.not(Selector('@p', { distance: [1] })), () => {
      this.close()
    })

    this.returnItems()
    this.clickDetection()
  }


  /**
   * Closes the GUI entity.
   */
  close() {

    this.Ids('@p').reset()

    tp(rel(0, -1000, 0))
    kill('@s')
  }


  /* -------------------------------------------------------------------------- */
  /*                              CLICK DETECTION                               */
  /* -------------------------------------------------------------------------- */

  /**
   * Detects item removal (click events).
   */
  clickDetection() {

    const clicked = Variable(0)

    execute.store.success(clicked).run(() => {
      clear('@p', '*[custom_data={prodiges_skills:1b}')
    })

    _.if(clicked, () => {
      this.clickFinder()
    })
  }


  /**
   * Returns items removed from the GUI to the player.
   */
  returnItems() {

    const copiedItems = Data('block', abs(930005, 0, 930005), 'Items')
    const guiItems = Data('entity', '@s', 'Items')

    copiedItems.set(guiItems)

    copiedItems
      .select('[{components: {"minecraft:custom_data": {prodiges_skills: 1b}}}]')
      .remove()

    const returnedItem = Variable(0)

    execute.store.result(returnedItem).run(() => {
      loot.give('@p')
        .mine(abs(930005, 0, 930005), 'stick[custom_data = {drop_contents: 1b}]')
    })

    _.if(returnedItem, () => {
      this.refresh()
    })
  }


  /* -------------------------------------------------------------------------- */
  /*                              PAGE MANAGEMENT                               */
  /* -------------------------------------------------------------------------- */

  /**
   * Initializes all pages.
   */
  initPages(pages: GUIPage[]) {

    pages.forEach(page => {
      this.pushPage(page)
    })
  }


  /**
   * Adds a page to the GUI.
   */
  pushPage(page: GUIPage) {

    const newPageId = this.pageId++
    let macroId = 0

    page.id = newPageId

    this.Pages.push(page)

    this.filler(page, macroId, newPageId)
    this.clicker(page, macroId, newPageId)
  }


  /**
   * Generates the function that fills the inventory for a page.
   */
  filler(page: GUIPage, macroId: number, newPageId: number): MCFunctionType {

    return MCFunction(`__gui/${this.name}/pages/fill/${newPageId}`, () => {

      page.buttons.forEach(button => {

        const buttonString = new Item(
          button.id,
          button.name,
          button.lore,
          button.components
        ).toString()

        if (button.isMacro) {

          this.setMacroArgs(button)

          functionCmd(
            MCFunction(`__gui/${this.name}/pages/fill/${newPageId}/macro_${macroId++}`, () => {
              raw(`$item replace entity @s container.${button.slot} with ${buttonString}`)
            }),
            'with',
            'storage',
            'prodiges_skills:gui',
            'pushPage'
          )

        } else {

          raw(`item replace entity @s container.${button.slot} with ${buttonString}`)

        }

      })

    })
  }


  /**
   * Generates the click detection function for a page.
   */
  clicker(page: GUIPage, macroId: number, newPageId: number): MCFunctionType {

    return MCFunction(`__gui/${this.name}/pages/click/${newPageId}`, () => {

      page.buttons.forEach(button => {

        if (!button.isFiller) {

          _.if(_.not(_.data(Data('entity', '@s', `Items[{slot:${button.slot}b}]`))), () => {

            if (button.onClick) {
              button.onClick()
            }

          })

        }

      })

    })
  }


  /**
   * Sets macro arguments inside storage.
   */
  setMacroArgs(button: Button) {

    if (!button.macroArgs) {
      throw Error('No macro arguments given')
    }

    button.macroArgs.forEach(argument => {

      Data('storage', 'prodiges_skills:gui', 'pushPage')
        .select(argument.key)
        .set(argument.value)

    })
  }


  /* -------------------------------------------------------------------------- */
  /*                               GUI TRIGGER                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Creates the trigger command handler.
   */
  defineTrigger(): MCFunctionType {

    return MCFunction(`__gui/${this.name}/trigger`, () => {

      execute.as('@a').run(() => {

        const triggerScore = Objective.create(this.triggerCmd, 'trigger')

        _.if(triggerScore('@s'), () => {

          triggerScore('@s').reset()

          this.summonEntity()

        })

        scoreboard.players.enable('@s', triggerScore)

      })

    }, { runEveryTick: true })
  }


  /**
   * Spawns the GUI entity.
   */
  summonEntity() {

    const isfree = _.block(rel(0, 0, 0), 'air')
    const newGui = Label('newGui')

    _.if(
      _.and(
        Selector('@e', { type: 'chest_minecart', tag: [this.GUILabel] }),
        _.not(isfree)
      ),
      () => {

        summon(
          'chest_minecart',
          rel(0, 1, 0),
          { Tags: [this.GUILabel, newGui], Silent: true, Invulnerable: true, NoGravity: true }
        )

        const globalId = this.Ids('.global')
        const playerId = this.Ids('@s')

        const guiEntity = Selector('@e', { limit: 1, tag: [this.GUILabel, newGui] })
        const guiEntityId = this.Ids(guiEntity)

        playerId.set(guiEntityId.set(globalId))

        Objective.get(`a.${this.name}.gui.page`)(guiEntity).set(0)

        execute.as(guiEntity).run(() => {
          this.refresh()
        })

        newGui(guiEntity).remove()

      }
    ).else(() => {

      tellraw('@s', 'No space, or too close to another GUI')

    })
  }


  /* -------------------------------------------------------------------------- */
  /*                               PAGE UPDATE                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Regenerates the inventory content for the current page.
   */
  defineRefresh(): MCFunctionType {

    return MCFunction(`__gui/${this.name}/refresh`, () => {

      Data('entity', '@s').select('Items').remove()

      Data('storage', 'prodiges_skills:gui', 'pageId')
        .set(this.pageIdScore)

      functionCmd(
        MCFunction(`__gui/${this.name}/pages/fillfindpage`, () => {
          raw('$function prodiges_skills:__gui/menu/pages/fill/$(pageId)')
        }),
        'with',
        'storage',
        'prodiges_skills:gui',
        'pageId'
      )

    })
  }


  /**
   * Finds the correct click handler for the current page.
   */
  defineClickFinder(): MCFunctionType {

    return MCFunction(`__gui/${this.name}/clickfinder`, () => {

      Data('storage', 'prodiges_skills:gui', 'pageId')
        .set(this.pageIdScore)

      functionCmd(
        MCFunction(`__gui/${this.name}/pages/clickfindpage`, () => {
          raw('$function prodiges_skills:__gui/menu/pages/click/$(pageId)')
        }),
        'with',
        'storage',
        'prodiges_skills:gui',
        'pageId'
      )

    })
  }


  /* -------------------------------------------------------------------------- */
  /*                                PUBLIC API                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Switches the GUI to another page.
   */
  public toPage(page: GUIPage) {

    this.pageIdScore.set(page.id as number)

    this.refresh()
  }

}