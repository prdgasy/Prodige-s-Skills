import { execute, MCFunction, Selector, tellraw, _, Label, Objective } from "sandstone";
import { BoosterClass } from "./object/booster";
import { AchievementClass, OnEventClass, SkillClass, SkillList } from "./skill";

export namespace Player {
  export const firstJoin = Objective.create('player.first_join')('@p');
  export const pts = Objective.create('pts')('@p');
  export const boosterScore = new BoosterClass(); // make scores static inside booster class

  export const sound = Objective.create('player.sound')('@p');
}

MCFunction('player/load', () => {
  tellraw('@p', { text: "[Skills/Player] Loaded", color: 'yellow' });

}, { runOnLoad: true });

MCFunction('player/event_watcher', () => {
  execute.as('@a').at('@s').run(() => {
    _.if(SkillClass.progression, () => {
      for (const skill of SkillList) {
        for (const event of skill.onEvents) {
          _.if(event.watcher[">"](0), () => {
            event.trigger();
          })
        }
      }
    });
  })
}, { runEvery: '1s' })

MCFunction('player/first_join', () => {
  execute.as('@a').run(() => {
    _.if(Player.firstJoin["=="](0), () => {
      for (const skill of SkillList) {

        skill.level.set(0);
        skill.xp.set(0);
        skill.xpTarget.set(skill.startingXp);

        skill.totalXp.set(0);
        skill.totalPts.set(0);

        skill.ability.tier.set(0);
        skill.ability.toggle.set(1);
        skill.currentAchievement.set(0);
        for (const achievement of skill.achievements) {
          achievement.progress.set(0);
        }
      }

      OnEventClass.notif.set(1);
      AchievementClass.notification.set(1);

      Player.boosterScore.point.set(1);
      Player.boosterScore.xp.set(1);


      Player.firstJoin.set(1);
    })

  })

}, { runEvery: '5s' })
