import { Bar } from "@lib/bar";
import { Roman } from "@lib/roman";
import { Text } from "@lib/text";
import { Button, Gui, GuiMacro as $, PageClass } from "@prodigelib/gui";
import { Shop } from "@src/menu/shop";
import { Reward } from "@src/misc/reward";
import { Skill } from "@src/skill";
import { _, comment, DataVariable, tellraw, Variable, Macro as S } from "sandstone";
import { Progress } from "@src/menu/skill/progress";
import { Preferences } from "@src/menu/preferences";
import { Tasks } from "./tasks";
import { Player } from "@src/player";
import { Task } from "@src/misc/task";
import { Float } from "@prodigelib/floatVar";
import { Booster, BOOSTER_TYPE, BoosterType } from "@src/misc/booster";


export class Main {
	static getName() {
		return this.name;
	}

	public static init(g: Gui, p: PageClass) {
		p.add(() => {
			this.tasks(g, p);
			this.shop(g, p);
			this.infoAndPreferences(g, p);

			this.skillBts(g, p)
		});

		return p;
	}

	private static infoAndPreferences(g: Gui, p: PageClass) {
		const totalXp = Float.variable();
		for (const skill of Object.values(Skill.skills)) {
			totalXp['+='](skill.xp);
		}
		const boosterStatuses: ReturnType<typeof DataVariable>[] = [];

		for (const type of BOOSTER_TYPE) {
			const m = Booster.getMult(type);
			const t = Booster.getTimer(type);
			const c = Booster.getColor(type);
			const status = DataVariable(`§7No ${type} Booster active`);
			_.if(t['>'](0), () => {
				_.with([m, t], () =>
					S.data.modify(status).set.value(S`${c}x${m} ${type} Booster §8• §c${t}m`)
				);
			});
			boosterStatuses.push(status);
		}
		return p.emit(
			new Button('amethyst_shard', 4, '§bInfo & Preferences',
				[
					'',
					'§e§l┃ Player Stats',
					$`§e┃ §7Total Skill Xp: §b${totalXp.show()}`,
					$`§e┃ §7Available Points: §6${Player.pts}`,
					'',
					'§b§l┃ Active Boosters',
					...boosterStatuses.map(status => $`§b┃ ${status}`),
					'',
					'§eClick to view your preferences!'
				], () => g.switch(Preferences.getName())
			)
		);
	}

	private static shop(g: Gui, p: PageClass) {
		return p.emit(
			new Button('emerald', 21, `§aShop`,
				[
					'',
					'§a§l┃ Skill Shop',
					'§a┃ §7Browse items, boosters, crates, and titles.',
					'§a┃ §7Spend your points on useful rewards.',
					'',
					$`§e┃ §7Your balance: §6${Player.pts} Points`,
					'',
					'§eClick to explore the shop!'
				], () => {
					g.switch(Shop.getName());
					Player.playSound('block.amethyst_block.break')
					Player.playSound('block.amethyst_block.chime');
				}
			)
		);
	}

	private static tasks(g: Gui, p: PageClass) {
		const done = Variable(0);
		for (const task of Task.tasks) {
			_.if(_.or(Player.task(task.id, 'done'), Player.task(task.id, 'claimed')), () => {
				done['++'];
			});
		}

		const refresh = DataVariable('§aReady to roll');
		_.if(Task.timer['>'](0), () => {
			_.with([Task.timer], () => {
				S.data.modify(refresh).set.value(S`§c${Task.timer} min`);
			});
		});

		return p.emit(
			new Button("wheat", 23, $`§6Tasks §8• §e${done}§6/§e3`,
				[
					'',
					'§l§6┃ Challenge Board',
					'§6┃ §7Complete tasks to earn their rewards.',
					'§6┃ §7Claim finished tasks from this menu.',
					'',
					$`§e┃ §7Completed: §a${done}§8/§a3`,
					$`§e┃ §7Next refresh: ${refresh}`,
					'',
					'§eClick to view your tasks!'
				], () => {
					Player.playSound('block.chest.open', 0);
					g.switch(Tasks.getName());
				})
		);


	}

	private static skillBts(g: Gui, p: PageClass) {
		let slot = 10;

		for (const skill of Object.values(Skill.skills)) {
			comment(`skill_button::${skill.name}`);

			const s = slot++;
			const progress = skill.xp["*"](100)["/"](skill.goal);
			const nLvl = skill.level["+"](1);
			const lvlRoman = Roman.get(skill.level);
			const nextRoman = Roman.get(nLvl);
			const bar = new Bar(progress.toScore()).toData();

			Reward.cases(skill, nLvl, rewards => {
				p.emit(new Button(
					skill.item, s, $`§d${skill.name} ${lvlRoman}`, [
					$`§9${skill.name} ${skill.level}`,
					"",
					...Text.wrap(skill.description),
					"",
					"§f§lNext Level Goal:",
					$` §8• §7Target: §d${skill.name} ${nextRoman}`,
					$` §8• §7Progress: §e${progress.show()}%`,
					$` §8> ${bar} §e${skill.xp.show()}§6/§e${skill.goal}`,
					"",
					$`§f§l${skill.name} ${nextRoman} Rewards:`,
					...rewards.map(r => ` §8+§e ${r.name}`),
					"",
					"§eClick to view!",
				], () => {
					Progress.index.set(skill.level["/"](18));
					g.switch(Progress.getName(skill));
				},
					1,
					["!attribute_modifiers"],
				));
			});
		}

	}
}