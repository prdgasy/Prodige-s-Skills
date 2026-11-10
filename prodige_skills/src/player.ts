import { _, Data, execute, Label, MCFunction, NonEmptyString, Objective, playsound, rel, tellraw, Macro as $, Score, Variable } from "sandstone";
import type { ConditionClass } from "sandstone/variables";
import { macro as E, smartTellraw } from "@prodigelib/easymacro";

type SoundType = Parameters<typeof playsound>[0];
export class Player {
	static hasJoined = Label('player.joined')('@p');
	static pts = Objective.create('player.pts')('@p');
	static sound = Label('player.sound')('@p');
	static onEventNotif = Label('player.on_event_notif')('@p');
	static achievementNotif = Label('player.achievement_notif')('@p');
	public static taskNotif = Label('player.task_notif')('@p');
	public static gotFirstTask = Label('player.gotFirstTask')('@p');

	public static init(setup: () => void) {
		MCFunction('player/first_join', () => {
			execute.as('@a').at('@s').run(() => _.if(_.not(Player.hasJoined), () => {
				setup();
				Player.taskNotif.add();
				Player.onEventNotif.add();
				Player.achievementNotif.add();
				Player.sound.add();
				Player.hasJoined.add();
			}));
		}, { runEvery: '5s' });
	}

	private static load() {
		return
	}

	public static isInvFull(): ConditionClass {
		return Variable(Data('entity', '@p', 'Inventory'))['>'](35);
	}

	public static playSound(sound: 'error' | 'success' | 'levelup' | 'info' | 'tick' | SoundType, pitch: number = 1) {
		let id: SoundType;

		switch (sound) {
			case 'success': id = 'block.note_block.pling'; break;
			case 'levelup': id = 'entity.player.levelup'; break;
			case 'info': id = 'entity.experience_orb.pickup'; break;
			case 'tick': id = 'block.note_block.hat'; break;
			case 'error': id = 'entity.enderman.teleport'; break;
			default: id = sound;
		}

		return _.if(Player.sound).run.execute.at('@p').run.playsound(id, 'master', '@p', rel(0, 0, 0), 1, pitch);
	}

	public static smartThrow(msg: string) {
		Player.playSound('error');
		return smartTellraw([
			E`§c[Prodige Skill] §8• §c${msg}`
		], '@p');
	}

	public static throw(msg: string) {
		Player.playSound('error');
		return tellraw('@p', `§c[Prodige Skill] §8• §c${msg}`);
	}

	public static send(msg: string, color = '§e') {
		return tellraw('@p', `${color}[Prodige Skill] §8• ${color}${msg}`);
	}

	public static smartSend(msg: string, color = '§e') {
		return smartTellraw([E`${color}[Prodige Skill] §8• ${color}${msg}`], '@p');
	}

	public static addMacroTask(id: Score, type: 'progress' | 'done' | 'claimed' | 'assigned') {
		return $.tag('@p').add($`prodige_skills.misc.task.${id}.${type}`);
	}

	public static task(id: number, type: 'progress' | 'done' | 'claimed' | 'assigned') {
		return Label(`misc.task.${id}.${type}` as NonEmptyString)('@p');
	}
}