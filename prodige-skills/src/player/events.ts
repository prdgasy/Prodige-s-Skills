import { _, execute, MCFunction, Score, Selector, Variable, say } from "sandstone";
import { Options } from "./consts";
import { SkillList } from "../skills";
import { SkillScore, EventScores, BoosterScore, Point } from "./scores";
import { levelUp } from "./levelUp";
import { Displays } from "./displays";
import { SkillEvent } from "../types";

MCFunction('event_watcher', () => {
  execute.as(Selector('@a', { tag: Options.progress })).at('@s').run(() => {
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

  _.if(_.and(xpAfterEvent[">="](score.xpTarget), score.level["<"](100)), () => {
    levelUp(skillName, score.level, score.xp, score.xpTarget);
  })

  Displays.progress(skillName, score.level, score.xp, score.xpTarget, addedXp, addedPoint);

  eventScore.reset();
}

function getXp(baseScore: Score, xpEvent: number): Score {
  return baseScore["*"](BoosterScore.xp)["*"](xpEvent);
}

function getPoint(baseScore: Score, pointEvent: number): Score {
  return baseScore["*"](BoosterScore.point)["*"](pointEvent);
}