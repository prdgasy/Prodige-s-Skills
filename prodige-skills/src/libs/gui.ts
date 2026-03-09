import { _, Data, execute, Label, MCFunction, Objective, rel, Score, scoreboard, Selector, summon, tellraw, Macro as $, DataArray, Variable, functionCmd } from 'sandstone'
import { DataPointClass } from 'sandstone/variables'

export type Button = {
  item: string
  slot: number
  name?: string
  lore?: string[]
  actions?: any[]
}

export type GUIPage = {
  name: string
  buttons: Button[]
}

export class GUI {
  name: string
  pageId: Score
  Pages: GUIPage[]
  pageData: ReturnType<typeof DataArray>
  getButton: any
  setItem: any
  buttonList = Data('storage', 'prodiges_skills:gui', 'buttonList')
  button = Data('storage', 'prodiges_skills:gui', 'button')

  constructor(name: string, triggerCommand: string, pages?: GUIPage[]) {
    this.name = name
    this.pageId = Objective.create(`${this.name}.gui.page`)('@s')
    this.pageData = DataArray([])
    this.Pages = pages ?? []

    if (pages) this.initPages(pages)

    this.triggerCommand(triggerCommand)

    this.initMacroFunctions()
  }

  /**
   * Macros functions that cannot be ran inline
   */
  initMacroFunctions() {
    this.getButton = MCFunction(`__gui/${this.name}/getbutton`, (_loop: any, index: Score) => {
      this.button.set(this.buttonList.select($`[${index}]`))
    })

    this.setItem = MCFunction(`__gui/${this.name}/setitem`, (_loop: any, item: DataPointClass, slot: DataPointClass) => {
      $.item.replace.entity('@s', $`container.${slot}`).with(item)
    })
  }

  /**
   * GUI custom command handler
   * @param triggerCommand Command name
   */
  triggerCommand(triggerCommand: string) {
    MCFunction(`__gui/${this.name}/trigger`, () => {
      execute.as('@a').run(() => {
        const triggerScore = Objective.create(triggerCommand, 'trigger')

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
    this.Pages.push(page)
    this.pageData.push(page.buttons)
  }


  /**
   * Summons the minecart GUI and inits the page to 0
   */
  summonEntity() {
    // Create the GUI minecart near the player
    // Unique ID management
    const isfree = _.block(rel(0, 0, 0), 'air')
    const tag = Label(`${this.name}.gui`)
    const newGui = Label('newGui')

    _.if(_.and(Selector('@e', { type: 'chest_minecart', tag: [tag] }), _.not(isfree)), () => {
      summon('chest_minecart', rel(0, 1, 0), { Tags: [tag, newGui], Silent: true, Invulnerable: true, NoGravity: true })

      // ID
      const id = Objective.create(`${this.name}.gui.id`)
      const globalId = id('.global')['+='](1)
      const playerId = id('@s')

      const guiEntity = Selector('@e', { limit: 1, tag: [tag, newGui] })
      const guiEntityId = id(guiEntity)

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
  refresh() {
    MCFunction(`__gui/${this.name}/refresh`, () => {
      Data('entity', '@s').select('Items').remove()

      const buttons = this.pageData.get(this.pageId)
      this.buttonList.set(buttons)
      this.fillItems(buttons)
    })()
  }

  fillItems(buttons: DataPointClass) {
    this.getButton(Variable(222))

    const itemId = this.button.select('item')
    const slot = this.button.select('slot')
    this.setItem(itemId, slot)

    tellraw('@s', [this.button, 'cool text'])
  }


}