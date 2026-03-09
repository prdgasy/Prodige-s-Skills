import { _, Objective, MCFunction, tellraw, Score, Data, say, execute } from 'sandstone'
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
        gainXp(skill.name, value, event.gain, event.name)
      })
    })
  })
}

/**
 * Runs the onEvents's tests from **eventList**
 */
export function processEvents() {
  registerEvents()
  MCFunction('__onevent/processevents', () => {
    execute.as('@a').run(() => {
      eventList.forEach(event => {
        _.if(event.score['>='](1), () => {
          event.callback(event.score)
          event.score.reset()
        })
      })
    })
  }, {
    runEvery: '5s'
  })
}