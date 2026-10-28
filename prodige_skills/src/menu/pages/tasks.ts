import { Bar } from "@lib/bar";
import { Text } from "@lib/text";
import { Float } from "@prodigelib/floatVar";
import { Button, Gui, GuiMacro as $, PageClass } from "@prodigelib/gui";
import { Task } from "@src/misc/task";
import { Player } from "@src/player";
import { _, Score, Variable } from "sandstone";
import { Menu } from "@src/menu";
import { Main } from "@src/menu/main";

const SLOTS = [11, 13, 15];

export class Tasks {
	public static getName() {
		return this.name;
	}

	public static init(g: Gui, p: PageClass) {
		p.add(() => {
			_.if(_.not(Player.firstTask), () => {
				const noTask = (slot: number) =>
					new Button('gunpowder', slot, '§7§lNo Task', [
						'',
						'§7This slot is waiting for a task.',
						'§7Roll a new set to begin!',
						'',
						'§eUse §6Get New Tasks §eto get started.'
					], () => Player.throw('No task assigned yet!'));
				p.emit(noTask(SLOTS[0]));
				p.emit(noTask(SLOTS[1]));
				p.emit(noTask(SLOTS[2]));
			}).
				else(() => {
					const s = Variable(SLOTS[0]);
					for (const task of Task.tasks) {
						_.if(Player.task(task.id, 'assigned'), () => {
							this.btn(p, task, s);
							s['+='](2);
						});
					}
				});

			this.getNewTasks(p);
		})
		p.add(Menu.back(g, Main));

		return p;
	}

	private static getNewTasks(p: PageClass) {
		_.if(Task.timer['>'](0), () => {
			p.emit(new Button(
				'anvil', 4, $`§cTask Refresh §8• §c${Task.timer}m`,
				[
					'',
					...Text.wrap('A fresh set of challenges is on its way.', '§7'),
					'',
					$`§7Time until refresh: §c${Task.timer}m`,
				], () => {
					Player.throw('You cannot get new Tasks yet!');
				}
			))
		}).
			else(() => {
				p.emit(new Button(
					'compass', 4, '§6Get New Tasks',
					[
						'',
						...Text.wrap('Take on fresh challenges and earn rewards as you complete them.', '§7'),
						'',
						'§7Refresh available: §aReady',
						'§8A new set can be rolled every hour.',
						'',
						'§eClick to roll your tasks!'
					], () => { Task.roll(); }
				))
			})
	}

	private static btn(p: PageClass, task: Task, s: Score) {
		_.if(Player.task(task.id, 'progress'), () => this.progress(p, task, s)).
			elseIf(Player.task(task.id, 'done'), () => this.done(p, task, s)).
			elseIf(Player.task(task.id, 'claimed'), () => this.claimed(p, task, s));
	}

	private static progress(p: PageClass, task: Task, s: Score) {
		const progress = Float.variable(task.executed)['*='](100)['/='](task.goal);
		const bar = new Bar(progress.toScore()).toData({ length: 10 });
		return p.emit(new Button(
			task.item, $(s), $`§9${task.name} §8• §e${task.executed}§6/§e${task.goal}`,
			[
				'',
				$`§7Progress: §e${progress.show()}%`,
				$` §8> ${bar} §e${task.executed}§6/§e${task.goal}`,
				'',
				'§f§lRewards:',
				...task.rewards.map(r => ` §8• ${r.name}`),
				'',
				'§e• IN PROGRESS',
			], () => {
				Player.send('This task is still in progress.');
				Player.playSound('tick');
			}, 1, ['!attribute_modifiers']
		));
	}

	private static done(p: PageClass, task: Task, s: Score) {
		return p.emit(new Button(
			task.item, $(s), `§9${task.name} §8• §e${task.goal}§6/§e${task.goal} §8• §a§lCLAIM`,
			[
				'',
				'§f§lProgress: §e100%',
				$` §8> §a----------- §e${task.executed}§6/§e${task.goal}`,
				'',
				'§a• §lTASK COMPLETE',
				'§7Your reward is ready to claim.',
				'',
				'§f§lRewards:',
				...task.rewards.map(r => ` §8• ${r.name}`),
				'',
				'§eClick to collect!'
			], () => task.claim(), 1, ['!attribute_modifiers', 'enchantment_glint_override=true']
		))
	}

	private static claimed(p: PageClass, task: Task, s: Score) {
		return p.emit(new Button(
			'gunpowder', $(s), `§7${task.name} §8• §7${task.goal}§8/§7${task.goal}`,
			[
				'',
				'§7This task has already been completed.',
				'',
				'§d• REWARD CLAIMED',
				'§8Keep an eye out for your next challenge!'
			], () => Player.throw('This Task has already been claimed!'), 1, ['!attribute_modifiers']
		));
	}
}