import { _, execute, MCFunction, Objective, say, scoreboard, tellraw, Macro as $, DataPointClass, DataArray, Variable, Score, item, give, raw } from 'sandstone'
import { GUI, Button, GUIPage } from './libs/gui.ts'


MCFunction('main', () => {

  const diamond: Button = {
    id: 'minecrat:diamond',
    slot: 5,
    name: 'diamondItem $(param)',
    macroArgs: [{ key: 'param', value: '1b' }],
    isMacro: true
  }

  const stone: Button = {
    id: 'minecrat:diamond',
    slot: 5,
    name: 'diamondItem $(namer)',
    lore: ['this is $(count)'],
    macroArgs: [
      { key: 'namer', value: '1b' },
      { key: 'count', value: Objective.get('a')('@p') }
    ],
    isMacro: true
  }

  const PageMenu: GUIPage = {
    name: 'menuPage',
    buttons: [diamond, stone],
  }

  const menu = new GUI('menu', 'open')
  menu.pushPage(PageMenu)

})
