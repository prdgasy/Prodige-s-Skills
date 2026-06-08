import { _, execute, MCFunction, Score, Selector, Variable, say } from "sandstone";
import { playerOption } from "./consts";
import { SkillList } from "../skills";
import { SkillScore, EventScores, BoosterScore, Point } from "./scores";
import { levelUp } from "./levelUp";
import { progress } from "./displays";
import { SkillEvent } from "../types";

MCFunction('event_watcher', () => {
  execute.as(Selector('@a', { tag: playerOption.progress })).at('@s').run(() => {
    SkillList.forEach(skill => {
      skill.SkillEvents.forEach(event => {
        _.if(EventScores[skill.name][event.name][">"](0), () => {
          eventTriggered(skill.name, EventScores[skill.name][event.name], event);
        })
      })
    })
  })
}, { runEvery: '1s' })

function eventTriggered(skillName: string, eventScore: Score, event: SkillEvent) {
  const score = SkillScore[skillName];
  const addedXp = getXp(eventScore, event.xp);
  const addedPoint = getPoint(eventScore, event.point);
  const xpAfterEvent = Variable(score.xp["+="](addedXp));
  Point["+="](addedPoint);

  _.if(xpAfterEvent[">="](score.xpTarget), () => {
    levelUp(skillName, score.level, score.xp, score.xpTarget);
  })

  progress(skillName, score.level, score.xp, score.xpTarget, addedXp, addedPoint, event);

  eventScore.reset();
}

function getXp(baseScore: Score, xpEvent: number): Score {
  return baseScore["*"](BoosterScore.xp)["*"](xpEvent);
}

function getPoint(baseScore: Score, pointEvent: number): Score {
  return baseScore["*"](BoosterScore.point)["*"](pointEvent);
}