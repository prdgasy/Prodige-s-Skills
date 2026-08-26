import { execute, MCFunction, Selector, tellraw, _, Label } from "sandstone";
import { BoosterClass } from "./object/booster";
import { SkillList } from "./skill/const";

export const Booster = new BoosterClass();

MCFunction('player/load', () => {
  tellraw('@p', { text: "[Skills/Player] Loaded", color: 'yellow' });

}, { runOnLoad: true });

/**
 * Player selector with custom tags, arguments
 */
export const Options = {
  progress: Label('Options.progress'),
  progressNotif: Label('Options.progressNotif'),
  levelNotif: Label('Options.levelNotif')
}

/**
 * Custom selector for @p with multiple labels
 * Usage: Player(MyLabel, AnotherLabel)
 */
export function Player(...labels: ReturnType<typeof Label>[]) {
  return Selector('@p', {
    tag: labels
  });
}


MCFunction('player/event_watcher', () => {
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

MCFunction('player/first_join', () => {
  const firstJoin = Label('first_join');
  execute.as('@a').as(Selector('@s', { tag: [`!${firstJoin.fullName}`] })).run(() => {
    for (const label of Object.values(Options)) {
      label('@s').add();
    }

    for (const skill of SkillList) {
      skill.level.set(0);
      skill.xp.set(0);
      skill.xpTarget.set(skill.startingXp);
      skill.ability.tier.set(0);
      skill.currentAchievement.set(0);
      for (const achievement of skill.achievements) {
        achievement.progress.set(0);
      }
    }

    Booster.point.set(1);
    Booster.xp.set(1);

    firstJoin('@s').add();
  })

}, { runEvery: '5s' })
