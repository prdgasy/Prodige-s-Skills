/**
 * This file is just an example.
 * You can delete it!
 */

import { MCFunction, tellraw } from 'sandstone'

MCFunction('a', () => { tellraw('@s', 'hello') }, { runEveryTick: true })