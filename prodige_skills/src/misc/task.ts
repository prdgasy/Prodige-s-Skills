import { smartTellraw, macro as E } from "@prodigelib/easymacro";
import { Global } from "@src/global";
import { Player } from "@src/player";
import { Criteria, Item } from "@src/types";
import { _, execute, MCFunction, Objective, Score, Variable } from "sandstone";
import { Reward } from "./reward";

export class Task {
	public static tasks: Task[] = [];
	public static nextId = 0;
	public static timer = Objective.create('task.timer')('@p');
	public progress: Score;
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
		this.progress = Objective.create(`task.progress.${this.resource}`)('@p');
		this.watcher = Objective.create(`task.watcher.${this.resource}`, criteria)('@p');

		this.rewards = rewards;
		Task.tasks.push(this);
	}

	private onEvent() {
		const fn = MCFunction(`misc/task/on_event/${this.id}`, () => {
			this.progress['+='](this.watcher);

			_.if(this.progress['>='](this.goal), () => {
				this.finished();
			})
		})

		return fn();
	}

	private finished() {
		_.if(Player.sound, () => Player.playSound('info'));
		smartTellraw([
			Global.encapsuler + '\n',
			` §6§lTASK COMPLETE!\n\n`,
			` §b§lTask: ${this.name} §8• §b${this.goal}§3/§b${this.goal}\n\n`,
			' §a§lRewards:\n',
			...Reward.join(this.rewards) + '\n\n',
			' §7§oClaim your rewards in the Menu!\n',
			Global.encapsuler
		], '@p');
		Player.task(this.id, 'progress').remove();
		Player.task(this.id, 'done').add();
	}

	public claim() {
		Reward.giveAll(this.rewards);
		Player.task(this.id, 'claimed').add();
	}

	public static manageTimer() {
		return MCFunction('misc/task/timer', () => {
			execute.as('@a').run(() => {
				_.if(Task.timer['>'](0), () => Task.timer['--']);
			});
		}, { runEvery: '60s' })
	}

	public static roll() {
		this.reset();
		const roll = Variable();
		for (let i = 0; i < 3; i++) {
			execute.store.result(roll).run.random.value([0, Task.tasks.length]);
			_.with([roll], () => {
				Player.addTask(roll, "progress");
				Player.addTask(roll, "assigned");
			});
		}
		Task.timer.set(60);
	}

	public static reset() {
		for (const task of Task.tasks) {
			task.progress.reset();
			Player.task(task.id, 'progress').remove();
			Player.task(task.id, 'done').remove();
			Player.task(task.id, 'claimed').remove();
			Player.task(task.id, 'assigned').remove();
		}
	}

	public static watch() {
		return MCFunction('misc/task/watch', () => {
			execute.as('@a').run(() => _.if(Player.taskProgress, () => {
				for (const task of Task.tasks) {
					_.if(task.watcher['>'](0), () => {
						_.if(Player.task(task.id, 'progress'), () => {
							task.onEvent();
						})
						task.watcher.reset();
					})
				}
			}));
		}, { runEvery: '5s' });
	}

	public static firstJoin() {
		Task.reset();
	}
}