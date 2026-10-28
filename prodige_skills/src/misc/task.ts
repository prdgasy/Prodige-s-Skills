import { smartTellraw, macro as E } from "@prodigelib/easymacro";
import { Global } from "@src/global";
import { Player } from "@src/player";
import { Criteria, Item } from "@src/types";
import { _, execute, MCFunction, Objective, Score, Variable, Macro as S } from "sandstone";
import { Reward } from "./reward";
import { Float } from "@prodigelib/floatVar";

export class Task {
	public static tasks: Task[] = [];
	public static nextId = 0;
	public static timer = Objective.create('task.timer')('@p');
	public static bossbar = Variable(0);
	public executed: Score;
	public name: string;
	public item: Item;
	public resource: string;
	public goal: number;
	public watcher: Score;
	public id = Task.nextId++;
	public rewards: Reward[];

	constructor(item: Item, name: string, goal: number, criteria: Criteria, rewards: Reward[]) {
		this.item = item;
		this.name = name;
		this.resource = Global.toResource(this.name);
		this.goal = goal;
		this.executed = Objective.create(`task.progress.${this.resource}`)('@p');
		this.watcher = Objective.create(`task.watcher.${this.resource}`, criteria)('@p');

		this.rewards = rewards;
		Task.tasks.push(this);
	}

	public static init() {
		this.manageTimer();
	}

	private display() {
		const fn = MCFunction(`skill/${this.resource}/show`, () => {
			Task.bossbar['++'];
			const key = Variable(Task.bossbar);
			const progress = Float.variable(this.executed)['*='](100)['/='](this.goal).show();

			_.with([key, progress, this.executed], () => {
				const id = S`prodige_skills.task.${this.resource}.${key}`;

				S.bossbar.add(id, S`"§6§lTASK §8| §9${this.name} §8• §e${this.executed}§6/§e${this.goal} §8• §7${progress}%"`);

				S.bossbar.set(id).max(this.goal);
				S.bossbar.set(id).value(S`${this.executed}`);
				S.bossbar.set(id).color('blue');
				S.bossbar.set(id).style('progress');
				S.bossbar.set(id).players('@s');
			});

			_.await.sleep("5s");

			// clean
			_.with([key], () => {
				S.bossbar.remove(S`prodige_skills.task.${this.resource}.${key}`);
			});
			Task.bossbar['--'];
		}, { asyncContext: true });

		return fn();
	}

	private onEvent() {
		const fn = MCFunction(`misc/task/on_event/${this.id}`, () => {
			this.executed['+='](this.watcher);
			_.if(Player.taskNotif, () => this.display());
			_.if(this.executed['>='](this.goal), () => {
				this.finished();
			})
		})

		return fn();
	}

	private finished() {
		_.if(Player.sound, () => Player.playSound('info'));
		Player.task(this.id, 'progress').remove();
		Player.task(this.id, 'done').add();
		Player.send(`Task done! ${this.name} §8• §e${this.goal}§6/§e${this.goal} §7§o(Claim in the Menu)`, '§6');
	}

	public claim() {
		Reward.giveAll(this.rewards);
		Player.task(this.id, 'claimed').add();
		Player.task(this.id, 'done').remove();
		Player.playSound('levelup', 2);
		smartTellraw([
			Global.encapsuler + '\n',
			` §6§lTASK COMPLETE!\n\n`,
			` §f§lTask:\n`,
			`  §8• §9${this.name}§7: §e${this.goal}§6/§e${this.goal}\n\n`,
			' §f§lRewards Collected:\n',
			...this.rewards.map(r => `  §8• ${r.name}\n`),
			'\n',
			' §8Keep going and take on your next challenge!\n',
			Global.encapsuler
		], '@p');

	}

	public static manageTimer() {
		return MCFunction('misc/task/timer', () => {
			execute.as('@a').run(() => {
				_.if(Task.timer['>'](0), () => Task.timer['--']);
			});
		}, { runEvery: '60s' })
	}

	public static roll() {
		const fn = MCFunction('misc/task/roll', () => {
			Player.firstTask.add();
			Player.playSound('success', 2);
			this.reset();
			const assigned: Score[] = [];
			const taskCount = Task.tasks.length;
			for (let i = 0; i < 3; i++) {
				const roll = Variable();
				execute.store.result(roll).run.random.value([0, taskCount - 1]);

				for (let attempt = 0; attempt < taskCount; attempt++) for (const previous of assigned) {
					_.if(roll['=='](previous), () => {
						roll['++'];
						_.if(roll['>='](taskCount), () => roll.set(0));
					});
				}

				_.with([roll], () => {
					Player.addMacroTask(roll, "progress");
					Player.addMacroTask(roll, "assigned");
				});
				assigned.push(Variable(roll));
			}

			Task.timer.set(60);
		}, { onConflict: 'ignore' });

		return fn();
	}

	public static reset() {
		for (const task of Task.tasks) {
			task.executed.reset();
			Player.task(task.id, 'progress').remove();
			Player.task(task.id, 'done').remove();
			Player.task(task.id, 'claimed').remove();
			Player.task(task.id, 'assigned').remove();
		}
	}

	public static watch() {
		return MCFunction('misc/task/watch', () => {
			execute.as('@a').run(() => {
				for (const task of Task.tasks) {
					_.if(task.watcher['>'](0), () => {
						_.if(Player.task(task.id, 'progress'), () => {
							task.onEvent();
						})
						task.watcher.reset();
					})
				}
			});
		}, { runEvery: '5s' });
	}

	public static firstJoin() {
		Task.reset();
	}
}