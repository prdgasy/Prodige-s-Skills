import { _, execute, MCFunction, Score, Selector, Variable } from "sandstone";
import { playerOption } from "./const";
import { SkillList } from "../skills";
import { SkillScore, Event, BoosterScore, Point } from "./scores";
import { levelUp } from "./levelUp";
import { displayProgress } from "./displayProgress";
export const eventWatcher = MCFunction('eventWatcher', () => {
  execute.as(Selector('@a', { tag: playerOption.progress })).at('@s').run(() => {
    SkillList.forEach(skill => {
      skill.Events.forEach(event => {
        _.if(Event[skill.name][event.name], () => {
          eventTriggered(skill.name, Event[skill.name][event.name], event.xp, event.point);
        })
      })
    })
  })
}, { runEvery: '5s' })

function eventTriggered(skillName: string, eventScore: Score, xpEvent: number, pointEvent: number) {
  const addedXp = getXp(eventScore, xpEvent);
  const addedPoint = getPoint(eventScore, pointEvent);
  const xpAfterEvent = Variable(SkillScore[skillName].xp["+="](addedXp));
  Point["+="](addedPoint);

  _.if(xpAfterEvent[">="](SkillScore[skillName].xpTarget), () => {
    levelUp(skillName, SkillScore[skillName].level, SkillScore[skillName].xp, SkillScore[skillName].xpTarget);
  })

  displayProgress(skillName, SkillScore[skillName].level, SkillScore[skillName].xp, SkillScore[skillName].xpTarget);

  eventScore.reset();
}

function getXp(baseScore: Score, xpEvent: number): Score {
  return baseScore["*"](BoosterScore.xp)["*"](xpEvent);
}

function getPoint(baseScore: Score, pointEvent: number): Score {
  return baseScore["*"](BoosterScore.point)["*"](pointEvent);
}