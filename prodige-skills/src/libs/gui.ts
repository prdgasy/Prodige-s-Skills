import { _, Data, execute, Label, MCFunction, Objective, rel, Score, scoreboard, Selector, summon, tellraw, functionCmd, raw, say, kill, tp, abs, forceload, loot, Variable, clear } from 'sandstone'
import { LabelClass, ObjectiveClass } from 'sandstone/variables'
import { ITEMS, MCFunctionType } from './types'
import { Item } from './item'

type macroArg = {
  key: string,
  value: any
}
export class Button {
  id: ITEMS
  slot: number
  count?: number
  onClick?: MCFunctionType
  name?: string
  lore?: string[]
  components?: string[]
  macroArgs?: macroArg[]
  isMacro?: boolean
  isFiller?: boolean

  constructor(id: ITEMS, slot: number, count?: number, onClick?: MCFunctionType, name?: string, lore?: string[], components?: string[], macroArgs?: macroArg[], isMacro?: boolean, isFiller?: boolean) {
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

  toString(): string {
    return new Item(this.id, this.name, this.lore, this.components).toString()
  }
}

export type GUIPage = {
  name: string
  buttons: Button[]
  id?: number
}


export class GUI {
  name: string
  pageIdScore: Score
  Pages: GUIPage[]
  pageId: number = 0
  getButton: any
  setItem: any
  Ids: ObjectiveClass
  GUILabel: LabelClass
  refresh: MCFunctionType
  triggerCmd: string
  clickFinder: MCFunctionType

  constructor(name: string, triggerCmd: string, pages?: GUIPage[]) {
    this.name = name
    this.pageIdScore = Objective.create(`${this.name}.gui.page`)('@s')
    this.Pages = pages ?? []
    this.Ids = Objective.create(`${this.name}.gui.id`)
    this.GUILabel = Label(`${this.name}.gui`)
    this.triggerCmd = triggerCmd

    if (pages) this.initPages(pages)

    this.defineTrigger()
    this.findObjs()
    this.refresh = this.defineRefresh()
    this.clickFinder = this.defineClickFinder()
    forceload.add([930005, 930005])
  }


  /**
   * Link the gui entity to the player having the same score ID
   */
  findObjs(): MCFunctionType {
    return MCFunction('findobjs', () => {
      execute.as('@a').at('@s').as(Selector('@e', { type: 'chest_minecart', tag: [this.GUILabel] })).run(() => {
        _.if(this.Ids('@p')['=='](this.Ids('@s')), () => {
          this.main()
        })
      })
    }, { runEveryTick: true })
  }

  main() {
    _.if(_.not(Selector('@p', { distance: [1] })), () => {
      this.close()
    })

    this.returnItems()
    this.clickDetection()
  }

  /**
   * Returns outside items without the gui tag to the player
   */
  returnItems() {
    const copiedItems = Data('block', abs(930005, 0, 930005), 'Items')
    const guiItems = Data('entity', '@s', 'Items')
    copiedItems.set(guiItems)
    copiedItems.select('[{components: {"minecraft:custom_data": {prodiges_skills: 1b}}}]').remove()

    const returnedItem = Variable(0)
    execute.store.result(returnedItem).run(() => { loot.give('@p').mine(abs(930005, 0, 930005), 'stick[custom_data = {drop_contents: 1b}]') })
    _.if(returnedItem, () => {
      this.refresh()
    })
  }

  clickDetection() {
    const clicked = Variable(0)
    execute.store.success(clicked).run(() => { clear('@p', '*[custom_data={prodiges_skills:1b}') })

    _.if(clicked, () => {
      this.clickFinder()
    })

  }

  close() {
    this.Ids('@p').reset()
    tp(rel(0, -1000, 0))
    kill('@s')
  }

  /**
   * GUI custom command handler
   */
  defineTrigger(): MCFunctionType {
    return MCFunction(`__gui/${this.name}/trigger`, () => {
      execute.as('@a').run(() => {
        const triggerScore = Objective.create(this.triggerCmd, 'trigger')

        _.if(triggerScore('@s')['>='](1), () => {
          triggerScore('@s').reset()
          this.summonEntity()
        })

        scoreboard.players.enable('@s', triggerScore)
      })
    }, {
      runEveryTick: true
    })
  }

  /**
   * Initializes and pushes every pages into place
   * @param pages Page list
   */
  initPages(pages: GUIPage[]) {
    this.Pages = pages
    pages.forEach(page => {
      this.pushPage(page)
    })
  }

  pushPage(page: GUIPage) {
    let macroId = 0
    const newPageId = this.pageId++
    page.id = newPageId

    this.Pages.push(page)
    this.filler(page, macroId, newPageId)
    this.clicker(page, macroId, newPageId)
  }

  filler(page: GUIPage, macroId: number, newPageId: number): MCFunctionType {
    return MCFunction(`__gui/${this.name}/pages/fill/${newPageId}`, () => {
      // Loop through every buttons
      page.buttons.forEach(button => {
        // Emit string
        const buttonString = new Item(button.id, button.name, button.lore, button.components).toString()

        if (button.isMacro) {
          // Resolve macro arguments
          this.setMacroArgs(button)
          functionCmd(MCFunction(`__gui/${this.name}/pages/fill/${newPageId}/macro_${macroId++}`, () => {
            raw(`$item replace entity @s container.${button.slot} with ${buttonString}`)
          }), 'with', 'storage', 'prodiges_skills:gui', 'pushPage')
        } else {
          // Normal emit
          raw(`item replace entity @s container.${button.slot} with ${buttonString}`)
        }
      })
    })
  }

  clicker(page: GUIPage, macroId: number, newPageId: number): MCFunctionType {
    return MCFunction(`__gui/${this.name}/pages/click/${newPageId}`, () => {
      // Loop through every buttons
      page.buttons.forEach(button => {
        // Test if button is filler
        if (!button.isFiller) {
          // Test if button is on it's slot
          _.if(_.not(_.data(Data('entity', '@s', `Items[{slot:${button.slot}b}]`))), () => {
            if (button.onClick) button.onClick()
          })
        }
      })
    })
  }

  setMacroArgs(button: Button) {
    if (!button.macroArgs) { throw Error('No macro arguments given') }
    button.macroArgs.forEach(argument => {
      Data('storage', 'prodiges_skills:gui', 'pushPage').select(argument.key).set(argument.value)
    })
  }

  /**
   * Summons the minecart GUI and inits the page to 0
   */
  summonEntity() {
    // Create the GUI minecart near the player
    // Unique ID management
    const isfree = _.block(rel(0, 0, 0), 'air')
    const newGui = Label('newGui')

    _.if(_.and(Selector('@e', { type: 'chest_minecart', tag: [this.GUILabel] }), _.not(isfree)), () => {
      summon('chest_minecart', rel(0, 1, 0), { Tags: [this.GUILabel, newGui], Silent: true, Invulnerable: true, NoGravity: true })

      // ID
      const globalId = this.Ids('.global')['+='](1)
      const playerId = this.Ids('@s')

      const guiEntity = Selector('@e', { limit: 1, tag: [this.GUILabel, newGui] })
      const guiEntityId = this.Ids(guiEntity)

      playerId.set(guiEntityId.set(globalId))

      // Init page
      Objective.get(`a.${this.name}.gui.page`)(guiEntity).set(0)
      execute.as(guiEntity).run(() => { this.refresh() })
      newGui(guiEntity).remove()

    }).else(() => {
      tellraw('@s', 'No space, or to close to another gui')
    })
  }

  /**
   * Refresh items positions, and modified data to originale state
   */
  defineRefresh(): MCFunctionType {
    return MCFunction(`__gui/${this.name}/refresh`, () => {
      Data('entity', '@s').select('Items').remove()

      Data('storage', 'prodiges_skills:gui', 'pageId').set(this.pageIdScore)
      functionCmd(MCFunction(`__gui/${this.name}/pages/fillfindpage`, () => {
        raw('$function prodiges_skills:__gui/menu/pages/fill/$(pageId)')
      }), 'with', 'storage', 'prodiges_skills:gui', 'pageId')
    })
  }

  defineClickFinder(): MCFunctionType {
    return MCFunction(`__gui/${this.name}/clickfinder`, () => {

      Data('storage', 'prodiges_skills:gui', 'pageId').set(this.pageIdScore)
      functionCmd(MCFunction(`__gui/${this.name}/pages/clickfindpage`, () => {
        raw('$function prodiges_skills:__gui/menu/pages/click/$(pageId)')
      }), 'with', 'storage', 'prodiges_skills:gui', 'pageId')
    })
  }

  public toPage(page: GUIPage) {
    // if (!page.id) throw Error('This page has not been added yet')
    this.pageIdScore.set(page.id as number)
    this.refresh()
  }
}