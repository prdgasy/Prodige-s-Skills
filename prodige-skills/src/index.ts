import { _, execute, MCFunction, Objective, say, scoreboard, tellraw, Macro as $, DataPointClass, DataArray, Variable, Score, item, give, raw, Data } from 'sandstone'
import { GUI, Button, GUIPage } from './libs/gui.ts'


MCFunction('main', () => {


  const diamond: Button = {
    id: 'minecrat:diamond',
    slot: 5,
    name: 'diamondItem $(param)',
    macroArgs: [{ key: 'param', value: '1b' }],
    isMacro: true,
    isFiller: true
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
    isMacro: true,
    onClick: MCFunction('hello', () => { say('clicked on stone'); gui.toPage(Shop) })
  }

  const Menu: GUIPage = {
    name: 'Menu',
    buttons: [diamond, stone],
  }

  const back: Button = {
    id: 'minecrat:arrow',
    slot: 0,
    name: 'Go back',
    lore: ['Click to go back'],
    onClick: MCFunction('back', () => { gui.toPage(Menu) })
  }

  const Shop: GUIPage = {
    name: 'Shop',
    buttons: [diamond, back]
  }

  const gui = new GUI('gui', 'open', [Menu, Shop])
})
