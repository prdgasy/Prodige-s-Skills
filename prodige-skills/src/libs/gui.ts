import { _, Data, execute, Label, MCFunction, Objective, rel, Score, scoreboard, Selector, summon, tellraw, functionCmd, Macro as $, item, raw } from 'sandstone'
import { DataPointClass, LabelClass, ObjectiveClass } from 'sandstone/variables'

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
  pageIdScore: Score
  Pages: GUIPage[]
  pageId: number = 0
  getButton: any
  setItem: any
  Ids: ObjectiveClass
  GUILabel: LabelClass

  constructor(name: string, triggerCommand: string, pages?: GUIPage[]) {
    this.name = name
    this.pageIdScore = Objective.create(`${this.name}.gui.page`)('@s')
    this.Pages = pages ?? []
    this.Ids = Objective.create(`${this.name}.gui.id`)
    this.GUILabel = Label(`${this.name}.gui`)


    if (pages) this.initPages(pages)

    this.triggerCommand(triggerCommand)



    this.findObjs()
  }

  /**
   * Link the gui entity to the player having the same score ID
   */
  findObjs() {
    MCFunction('findobjs', () => {
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

    MCFunction(`__gui/${this.name}/pages/${this.pageId++}`, () => {

      page.buttons.forEach(button => {
        item.replace.entity('@s', `${button.slot}`).with(button.item as any)
      })
    })
  }

  convertButtons(buttons: Button[]) {

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
  refresh() { // Changer en parametre pour etre appelé correctement.
    MCFunction(`__gui/${this.name}/refresh`, () => {
      Data('entity', '@s').select('Items').remove()

      Data('storage', 'prodiges_skills:env', 'pageId').set(this.pageIdScore)
      functionCmd(MCFunction(`__gui/${this.name}/findpage/`, () => {
        raw('$function __gui/menu/pages/$(pageId)')
      }), 'with', 'storage', 'prodiges_skills:env', 'pageId')
    })
  }
}