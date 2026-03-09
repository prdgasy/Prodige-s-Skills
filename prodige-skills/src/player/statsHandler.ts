import { Skills } from '../database'
import { _, MCFunction, Objective, say, Score, Selector, tellraw } from 'sandstone'

const player = Selector('@s', { tag: ['skills.active'] })

function createScores() {
  Object.values(Skills).forEach(skill => {
    Objective.create(`${skill.name}.xp`)
    Objective.create(`${skill.name}.xpLvl`)
    Objective.create(`${skill.name}.xpGoal`)
  })
}

export function gainXp(skillName: string, value: Score, gain: number, eventName: string) {
  say('gained xp')
  const xp = Objective.get(`a.${skillName}.xp`)(player)
  const xpLvl = Objective.get(`a.${skillName}.xpLvl`)(player)
  const xpGoal = Objective.get(`a.${skillName}.xpGoal`)(player)

  const xpAdded = (value['*'](gain))
  xp['+='](xpAdded)

  tellraw('@s', ['Gained :', xpAdded, ' ', skillName, ' xp from ', eventName, ' (', gain.toString(), ' xp). New: ', xp, ' xp'])
  _.if(xp['>='](xpGoal), () => {
    xpLvl['+='](1)
  })
}

export function xpHandler() {
  createScores()
  MCFunction('player/xphandler', () => {
    // _.if()
  }, {
    runEvery: '5s'
  })
}

