import { Bar } from "@lib/bar";
import { Text } from "@lib/text";
import { Float } from "@prodigelib/floatVar";
import { Button, Gui, GuiMacro as $, PageClass } from "@prodigelib/gui";
import { Task } from "@src/misc/task";
import { Player } from "@src/player";
import { _ } from "sandstone";

const SLOTS = [11, 13, 15];

export class Tasks {
	public static getName() {
		return this.name;
	}

	public static init(g: Gui, p: PageClass) {
		p.add(() => {
			_.if(_.not(Player.firstTask), () => {
				const noTask = (slot: number) =>
					new Button('gunpowder', slot, '§cNo task assigned', [
						'',
						'§7Click on §aRoll Tasks §7to get new Tasks!'
					], () => Player.throw('No task assigned yet!'));
				p.emit(noTask(SLOTS[0]));
				p.emit(noTask(SLOTS[1]));
				p.emit(noTask(SLOTS[2]));
			}).
				else(() => {
					const i = 0;
					for (const task of Task.tasks) {
						this.btn(p, task, i);
					}
				});

			this.getNewTasks(p);
		})

		return p;
	}

	private static getNewTasks(p: PageClass) {
		_.if(Task.timer['>'](0), () => {
			p.emit(new Button(
				'anvil', 4, $`§7Get new Tasks §8• §c${Task.timer} minutes left`,
				[
					...Text.wrap('Get new Task and start new adventures!'),
					'',
					'§7You cannot get new Tasks yet.'
				], () => { Player.throw('You cannot get new Tasks yet!'); }
			))
		}).
			else(() => {
				p.emit(new Button(
					'anvil', 4, '§eGet new Tasks',
					[
						...Text.wrap('Get new Task and start new adventures!'),
						'',
						...Text.wrap('§fNote: §7You can only get new Tasks every 1 hour.'),
						'',
						'§eClick to get new Tasks'
					], () => { Task.roll(); }
				))
			})
	}
	private static btn(p: PageClass, task: Task, i: number) {
		_.if(Player.task(task.id, 'assigned'), () => {
			const s = SLOTS[i];

			_.if(Player.task(task.id, 'progress'), () => this.progress(p, task, s)).
				elseIf(Player.task(task.id, 'done'), () => this.done(p, task, s)).
				elseIf(Player.task(task.id, 'claimed'), () => this.claimed(p, task, s));

		})
	}

	private static progress(p: PageClass, task: Task, s: number) {
		const progress = Float.variable(task.progress)['*='](100)['/='](task.goal);
		const bar = new Bar(progress.toScore()).toData();
		return p.emit(new Button(
			task.item, s, $`${task.name} §e${task.progress}§6/§e${task.goal}`,
			[
				$`§f§lProgress: §e${progress.show}%`,
				$` §8> ${bar}`,
				'',
				'§e• IN PROGRESS'
			], () => {
				Player.send('§eTask is still in progress.');
				Player.playSound('tick');
			}, 1, ['!attribute_modifiers']
		));
	}

	private static done(p: PageClass, task: Task, s: number) {
		return p.emit(new Button(
			task.item, s, `${task.name} §e${task.goal}/${task.goal} §8• §a§lClaim`,
			[
				`§f§lProgress: §e100%`,
				'§8 > §a---------------',
				'',
				'§a• DONE'
			], () => task.claim(), 1, ['!attribute_modifiers']
		))
	}

	private static claimed(p: PageClass, task: Task, s: number) {
		return p.emit(new Button(
			task.item, s, `${task.name} §e${task.goal}/${task.goal}`,
			[
				`§f§lProgress: §e100%`,
				'§8 > §a---------------',
				'',
				'§d• ClAIMED'
			], () => Player.throw('This Task has already been claimed!'), 1, ['!attribute_modifiers']
		));
	}
}