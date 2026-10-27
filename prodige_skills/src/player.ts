import { _, execute, Label, MCFunction, NonEmptyString, Objective, playsound, rel, tellraw, Macro as $, Score } from "sandstone";
import { Booster } from "./misc/booster";
import { Skill } from "./skill";
import { Action } from "./skill/action";
import { Task } from "./misc/task";
import { FinalCommandOutput } from "sandstone/commands";
import { EntityLabel } from "sandstone/variables";

type SoundType = Parameters<typeof playsound>[0];
export class Player {
	static hasJoined = Label('player.joined')('@p');
	static pts = Objective.create('pts')('@p');
	static boosterScore = new Booster();
	static sound = Label('player.sound')('@p');
	static onEventNotif = Label('player.on_event_notif')('@p');
	static achievementNotif = Label('player.achievement_notif')('@p');
	public static taskProgress = Label('player.task_progress')('@p');
	public static firstTask = Label('player.firstTask')('@p'); // do not init

	public static init() {
		this.load();
		Action.watch();
		Task.watch();
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
				Task.firstJoin();

				this.taskProgress.add();
				this.onEventNotif.add();
				this.achievementNotif.add();
				Skill.levelUpNotifState.add();

				this.sound.add();

				this.boosterScore.point.set(1);
				this.boosterScore.xp.set(1);

				this.hasJoined.add();
			})
			)
		}, { runEvery: '5s' })
	}

	public static playSound(sound: 'error' | 'success' | 'levelup' | 'info' | 'tick' | SoundType) {
		const soundEvent = {
			sound: 'entity.ender_pearl.throw' as SoundType,
			pitch: 1
		};

		switch (sound) {
			case 'success': soundEvent.sound = 'block.note_block.pling'; soundEvent.pitch = 2;
			case 'levelup': soundEvent.sound = 'entity.player.levelup'; soundEvent.pitch = 0;
			case 'info': soundEvent.sound = 'entity.experience_orb.pickup';
			case 'tick': soundEvent.sound = 'block.note_block.hat';
		}

		return _.if(Player.sound).run.execute.at('@p').run.playsound(soundEvent.sound, 'master', '@p', rel(0, 0, 0), 1, soundEvent.pitch);
	}

	public static throw(msg: string) {
		return `§c[Prodige Skill] §8• §c${msg}`;
	}

	public static send(msg: string, color = '§e') {
		return `${color}[Prodige Skill] §8• ${color}${msg}`;
	}

	public static removeTask(id: Score, type: 'progress' | 'done' | 'claimed' | 'assigned') {
		return $.tag('@p').remove($`task.${id}.${type}`);
	}

	public static addTask(id: Score, type: 'progress' | 'done' | 'claimed' | 'assigned') {
		return $.tag('@p').add($`task.${id}.${type}`);
	}

	public static task(id: number, type: 'progress' | 'done' | 'claimed' | 'assigned') {
		return Label(`player.task.${id}.${type}` as NonEmptyString)('@p');
	}
}

