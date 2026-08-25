import { _, execute, MCFunction, Selector } from "sandstone";
import { Options } from "../consts/player";
import { SkillList } from "../consts/skills";

MCFunction('event_watcher', () => {
  execute.as(Selector('@a', { tag: Options.progress })).at('@s').run(() => {
    for (const skill of SkillList) {
      for (const event of skill.onEvents) {
        _.if(event.watcher[">"](0), () => {
          event.trigger();
        })
      }
    }
  })
}, { runEvery: '1s' })
