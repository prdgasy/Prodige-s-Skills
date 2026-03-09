import { execute, MCFunction, Objective, say, scoreboard } from 'sandstone'
import { GUI } from './libs/gui.ts'
import { processEvents } from './player/onEvent.ts'
import { xpHandler } from './player/statsHandler.ts'


MCFunction('test', () => {
  xpHandler()
  processEvents()
  const mygui = new GUI('guiname', 'triggercommand')
})