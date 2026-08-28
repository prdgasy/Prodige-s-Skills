import { execute, MCFunction, Selector, tellraw, _, Label, Objective } from "sandstone";
import { BoosterClass } from "./object/booster";
import { SkillList } from "./skill";

export namespace Player {
  export const option = {
    progress: Label('option.progress'),
    progressNotif: Label('option.progress_notif'),
    levelNotif: Label('option.level_notif')
  }

  /**
 * Custom selector for @p with multiple labels
 * Usage: Player(MyLabel, AnotherLabel)
 */
  export function select(...labels: ReturnType<typeof Label>[]) {
    return Selector('@p', {
      tag: labels
    });
  }

  export const pts = Objective.create('pts')('@p');

  export const boosterScore = new BoosterClass(); // make scores static inside booster class


}

MCFunction('player/load', () => {
  tellraw('@p', { text: "[Skills/Player] Loaded", color: 'yellow' });

}, { runOnLoad: true });

MCFunction('player/event_watcher', () => {
  execute.as(Selector('@a', { tag: Player.option.progress })).at('@s').run(() => {
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
    for (const label of Object.values(Player.option)) {
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

    Player.boosterScore.point.set(1);
    Player.boosterScore.xp.set(1);


    firstJoin('@s').add();
  })

}, { runEvery: '5s' })
