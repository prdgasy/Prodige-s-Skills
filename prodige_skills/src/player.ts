import { execute, MCFunction, tellraw, _, Objective, Label } from "sandstone";
import { BoosterClass } from "./misc/booster";
import { Skill } from "./skill";
import { OnEvent } from "./skill/onEvent";

export class Player {
  static hasJoined = Label('player.joined')('@p');
  static pts = Objective.create('pts')('@p');
  static boosterScore = new BoosterClass();
  static sound = Label('player.sound')('@p');
  static onEventNotif = Label('player.on_event_notif')('@p');
  static achievementNotif = Label('player.achievement_notif')('@p');

  public static initFn() {
    this.load();
    OnEvent.watch();
    this.firstJoin();
  }

  private static load() {
    return MCFunction('player/load', () => {
      tellraw('@p', '§e[Skills/Player] Loaded');
    }, { runOnLoad: true });
  }

  private static firstJoin() {
    return MCFunction('player/first_join', () => {
      execute.as('@a').run(() => _.if(_.not(this.hasJoined), () => {
        for (const skill of Skill.list) skill.firstJoin();

        this.onEventNotif.add();
        this.achievementNotif.add();

        Player.boosterScore.point.set(1);
        Player.boosterScore.xp.set(1);

        this.hasJoined.add();
      })
      )
    }, { runEvery: '5s' })
  }
}

Player.initFn();