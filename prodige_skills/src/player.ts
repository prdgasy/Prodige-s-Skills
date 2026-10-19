import { execute, MCFunction, tellraw, _, Objective, Label, SoundEvent, rel } from "sandstone";
import { BoosterClass } from "./misc/booster";
import { Skill } from "./skill";
import { OnEvent } from "./skill/onEvent";
import { SoundEventArguments } from "sandstone/core";
import { SOUND_EVENTS } from "node_modules/sandstone/dist/_internal/types/arguments/generated/_registry/sound_events";

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

  public static playSound(type: 'error' | 'success' | 'levelup' | 'info') {
    const soundEvent = {
      sound: 'entity.ender_pearl.throw' as SOUND_EVENTS,
      pitch: 1
    };

    switch (type) {
      case 'success': soundEvent.sound = 'block.note_block.pling'; soundEvent.pitch = 2;
      case 'levelup': soundEvent.sound = 'entity.player.levelup'; soundEvent.pitch = 0;
      case 'info': soundEvent.sound = 'entity.experience_orb.pickup';
    }

    return _.if(Player.sound).run.playsound(soundEvent.sound, 'master', '@p', rel(0, 0, 0), 1, soundEvent.pitch);
  }
}

Player.initFn();