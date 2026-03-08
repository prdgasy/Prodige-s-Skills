import { _, Objective, MCFunction, tellraw, Score, Data } from 'sandstone'
import { Skills } from '../database.ts'
import { gainXp } from './statsHandler.ts'
type EventEntry = {
  score: Score,
  callback: (value: Score) => void
}
const eventList: EventEntry[] = []

/**
 * Detect when an action is performed and returns its value
 * @param name Name of the event
 * @param criteria Criteria
 * @param callback Function to run
 */
function onEvent(
  name: string,
  criteria: any,
  func: (value: Score) => void
) {
  const score = Objective.create(name, criteria)('@s')
  eventList.push({
    score,
    callback: func
  })
}

/**
 * Runs the onEvents from **skillsMap**
 */
function registerEvents() {
  Object.values(Skills).forEach(skill => {
    skill.onEvents.forEach(event => {
      onEvent(event.name, event.criteria, value => {
        gainXp(skill.name, value, event.gain)
      })
    })
  })
}

/**
 * Runs the onEvents's tests from **eventList**
 */
function processEvents() {
  registerEvents()
  MCFunction('__onevent/processevents', () => {
    eventList.forEach(event => {
      _.if(event.score, () => {
        event.callback(event.score)
        event.score.reset()
      })
    })
  }, {
    runEvery: '5s'
  })
}
export { processEvents }