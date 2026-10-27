import { _, execute, Label, MCFunction, Objective, playsound, rel, tellraw } from "sandstone";
import { Booster } from "./misc/booster";
import { Skill } from "./skill";
import { Action } from "./skill/action";

type SoundType = Parameters<typeof playsound>[0];
export class Player {
	static hasJoined = Label('player.joined')('@p');
	static pts = Objective.create('pts')('@p');
	static boosterScore = new Booster();
	static sound = Label('player.sound')('@p');
	static onEventNotif = Label('player.on_event_notif')('@p');
	static achievementNotif = Label('player.achievement_notif')('@p');

	public static init() {
		this.load();
		Action.watch();
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
				for (const skill of Object.values(Skill.skills)) skill.firstJoin();

				this.onEventNotif.add();
				this.achievementNotif.add();

				this.sound.add();

				this.boosterScore.point.set(1);
				this.boosterScore.xp.set(1);

				this.hasJoined.add();
			})
			)
		}, { runEvery: '5s' })
	}

	public static playSound(type: 'error' | 'success' | 'levelup' | 'info') {
		const soundEvent = {
			sound: 'entity.ender_pearl.throw' as SoundType,
			pitch: 1
		};

		switch (type) {
			case 'success': soundEvent.sound = 'block.note_block.pling'; soundEvent.pitch = 2;
			case 'levelup': soundEvent.sound = 'entity.player.levelup'; soundEvent.pitch = 0;
			case 'info': soundEvent.sound = 'entity.experience_orb.pickup';
		}

		return _.if(Player.sound).run.execute.at('@p').run.playsound(soundEvent.sound, 'master', '@p', rel(0, 0, 0), 1, soundEvent.pitch);
	}

	public static throw(msg: string) {
		return `§c[Prodige Skill] • ${msg}`;
	}
}

