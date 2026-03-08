import { _, Data, execute, Label, MCFunction, Objective, rel, sandstonePack, Score, scoreboard, Selector, summon, tellraw, Macro as $, DataArray, say } from 'sandstone'
import { DataPointClass } from 'sandstone/variables'

type Button = {
  item: string
  slot: number
  name: string
  lore: string[]
  actions: any[]
}

type GUIPage = {
  name: string
  buttons: Button[]
}

export class GUI {
  name: string
  pageId: Score
  Pages: GUIPage[]
  pageData: ReturnType<typeof DataArray>


  constructor(name: string, triggerCommand: string, pages?: GUIPage[]) {
    this.name = name
    this.pageId = Objective.create(`${this.name}.gui.page`)('@s')
    this.pageData = DataArray([])

    if (pages) {
      this.Pages = pages
      pages.forEach(page => {
        this.pushPage(page)
      })
    } else {
      this.Pages = []
    }

    MCFunction(`__gui/${this.name}/trigger`, () => {
      say('hello')
      execute.as('@a').run(() => {
        const triggerScore = Objective.create(triggerCommand, 'trigger')

        _.if(triggerScore('@s')['>='](1), () => {
          triggerScore('@s').reset()
          scoreboard.players.enable('@s', triggerScore)

          this.trigger()
        })
      })
    }, {
      runEveryTick: true
    })
  }

  /**
   * Summons the minecart GUI and inits the page to 0
   */
  trigger() {
    // Create the GUI minecart near the player
    // Unique ID management
    const isfree = _.block(rel(0, 0, 0), 'air')
    const tag = Label(`${this.name}.gui`)
    const newGui = Label('newGui')

    _.if(_.not(_.and(Selector('@e', { type: 'chest_minecart', tag: [tag] }), isfree)), () => {
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

      const items = this.pageData.get(this.pageId)
      this.fillItems(items)
    }, {
      runEveryTick: true
    })
  }

  fillItems(items: DataPointClass) {

  }

  pushPage(page: GUIPage) {
    this.Pages.push(page)
    this.pageData.push(page.buttons)
  }
}

