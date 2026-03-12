import { _, Data, execute, Label, MCFunction, Objective, rel, Score, scoreboard, Selector, summon, tellraw, functionCmd, Macro as $, item, raw, say } from 'sandstone'
import { DataPointClass, LabelClass, ObjectiveClass } from 'sandstone/variables'
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
  toPage?: GUIPage
  name?: string
  lore?: string[]
  components?: string[]
  macroArgs?: macroArg[]
  isMacro?: boolean

  constructor(id: ITEMS, slot: number, count?: number, onClick?: MCFunctionType, toPage?: GUIPage, name?: string, lore?: string[], components?: string[], macroArgs?: macroArg[], isMacro?: boolean) {
    this.id = id
    this.slot = slot
    this.count = count ?? 1
    this.onClick = onClick
    this.toPage = toPage
    this.name = name ?? id
    this.lore = lore
    this.components = components

    this.macroArgs = macroArgs
    this.isMacro = isMacro
  }

  toString(): string {
    return new Item(this.id, this.name, this.lore, this.components).toString()
  }
}

export type GUIPage = {
  name: string
  buttons: Button[]
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

  constructor(name: string, triggerCmd: string, pages?: GUIPage[]) {
    this.name = name
    this.pageIdScore = Objective.create(`${this.name}.gui.page`)('@s')
    this.Pages = pages ?? []
    this.Ids = Objective.create(`${this.name}.gui.id`)
    this.GUILabel = Label(`${this.name}.gui`)
    this.triggerCmd = triggerCmd

    if (pages) this.initPages(pages)

    this.defineTrigger()
    this.defineFindObjs()
    this.refresh = this.defineRefresh()
  }


  /**
   * Link the gui entity to the player having the same score ID
   */
  defineFindObjs(): MCFunctionType {
    return MCFunction('findobjs', () => {
      execute.as('@a').at('@s').as(Selector('@e', { type: 'chest_minecart', tag: [this.GUILabel] })).run(() => {
        _.if(this.Ids('@p')['=='](this.Ids('@s')), () => {
          this.main()
        })
      })
    }, { runEveryTick: true })
  }

  main() {

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

  pushPage(page: GUIPage): MCFunctionType {
    this.Pages.push(page)
    let macroId = 0
    const newPageId = this.pageId++
    return MCFunction(`__gui/${this.name}/pages/${newPageId}`, () => {

      page.buttons.forEach(button => {
        const buttonString = new Item(button.id, button.name, button.lore, button.components).toString()
        if (button.isMacro) {
          this.setMacroArgs(button)
          functionCmd(MCFunction(`__gui/${this.name}/pages/${newPageId}/macro_${macroId++}`, () => {

            raw(`$item replace entity @s container.${button.slot} with ${buttonString}`)
          }), 'with', 'storage', 'prodiges_skills:gui', 'pushPage')

        } else {
          raw(`item replace entity @s container.${button.slot} with ${buttonString}`)
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

      Data('storage', 'prodiges_skills:env', 'pageId').set(this.pageIdScore)
      functionCmd(MCFunction(`__gui/${this.name}/findpage/`, () => {
        raw('$function __gui/menu/pages/$(pageId)')
      }), 'with', 'storage', 'prodiges_skills:env', 'pageId')
    })
  }
}