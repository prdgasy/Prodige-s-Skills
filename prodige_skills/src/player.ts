import { _, execute, Label, MCFunction, NonEmptyString, Objective, playsound, rel, tellraw, Macro as $, Score, say, Variable, Data } from "sandstone";
import { Booster } from "./misc/booster";
import { Skill } from "./skill";
import { Action } from "./skill/action";
import { Task } from "./misc/task";
import { FinalCommandOutput } from "sandstone/commands";
import { ConditionClass, EntityLabel } from "sandstone/variables";
import { macro as E, Macroable, smartTellraw } from "@prodigelib/easymacro";

type SoundType = Parameters<typeof playsound>[0];
export class Player {
	static hasJoined = Label('player.joined')('@p');
	static pts = Objective.create('pts')('@p');
	static boosterScore = new Booster();
	static sound = Label('player.sound')('@p');
	static onEventNotif = Label('player.on_event_notif')('@p');
	static achievementNotif = Label('player.achievement_notif')('@p');
	public static taskNotif = Label('player.task_notif')('@p');
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

	public static isInvFull(): ConditionClass {
		return Variable(Data('entity', '@p', 'Inventory'))['>'](28);
	}

	private static firstJoin() {
		return MCFunction('player/first_join', () => {
			execute.as('@a').run(() => _.if(_.not(this.hasJoined), () => {
				for (const skill of Object.values(Skill.skills)) skill.firstJoin();
				Task.firstJoin();

				this.taskNotif.add();
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

	public static playSound(sound: 'error' | 'success' | 'levelup' | 'info' | 'tick' | SoundType, pitch: number = 1) {
		let s: SoundType;

		switch (sound) {
			case 'success': s = 'block.note_block.pling'; break
			case 'levelup': s = 'entity.player.levelup'; break
			case 'info': s = 'entity.experience_orb.pickup'; break
			case 'tick': s = 'block.note_block.hat'; break
			case 'error': s = 'entity.enderman.teleport'; break
			default: s = sound as SoundType;
		}

		return _.if(Player.sound).run.execute.at('@p').run.playsound(s, 'master', '@p', rel(0, 0, 0), 1, pitch);
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

