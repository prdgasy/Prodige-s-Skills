import { _, execute, MCFunction, Objective, say, scoreboard, tellraw, Macro as $, DataPointClass, DataArray, Variable, Score } from 'sandstone'
import { GUI, Button, GUIPage } from './libs/gui.ts'
import { processEvents } from './player/onEvent.ts'
import { xpHandler } from './player/statsHandler.ts'

MCFunction('main', () => {
  xpHandler()
  processEvents()

  const diamond: Button = {
    item: 'diamond',
    slot: 5,
    name: 'diamondItem',
  }

  const stone: Button = {
    item: 'stone',
    slot: 5,
    name: 'stoneItem',
  }

  const buttonList: Button[] = [diamond, stone]
  const PageMenu: GUIPage = {
    name: 'menu',
    buttons: buttonList,
  }

  const menu = new GUI('menu', 'open')
  menu.pushPage(PageMenu)
})
