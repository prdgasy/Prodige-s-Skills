import { Button, Gui, GuiMacro as $, PageClass } from "@prodigelib/gui";
import { Text } from "@lib/text";
import { Menu } from "@src/menu";
import { Main } from "@src/menu/main";
import { Reward } from "@src/misc/reward";
import { _, Objective, Score, Variable } from "sandstone";
import { Mask } from "../mask";

const REWARDS_PER_PAGE = 18;

export class RewardVault {
	public static index = Objective.create('menu.rewards.index')('@s');

	public static getName() {
		return this.name;
	}

	public static init(g: Gui, p: PageClass) {
		const rewards = [...Reward.registry.values()].filter(reward => reward.takesPlace);

		p.add(() => Mask.bottom(p, "magenta_stained_glass_pane"));

		p.add(() => {
			const hasRewardOnPage = Variable(0);
			this.displayAll(p, rewards, hasRewardOnPage)

			_.if(_.not(hasRewardOnPage), () => {
				Mask.full(p, "red_stained_glass_pane");

				p.emit(new Button('barrier', 13, '§cYour Vault Is Empty', [
					'',
					'§6§l┃ No Items to Claim',
					...Text.wrap('Items won from crates and skill levels will appear here.', '§6┃ §7'),
				], () => {
					p.add(() => Menu.sliders(p, this.index, Math.max(0, Math.ceil(rewards.length / REWARDS_PER_PAGE) - 1)));
				}));
			})
		});


		p.add(Menu.back(g, Main));
		return p;
	}

	private static displayAll(p: PageClass, rewards: Reward[], hasRewardOnPage: Score) {
		const rewardIndex = Variable(0);

		for (const reward of rewards) {
			_.if(reward.pending['>'](0), () => {
				const page = rewardIndex['/'](REWARDS_PER_PAGE);
				const slot = rewardIndex['%'](REWARDS_PER_PAGE);
				_.if(this.index['=='](page), () => {
					p.emit(this.display(reward, slot));
					hasRewardOnPage.set(1);
				});
				rewardIndex['++'];
			});
		}
	}
	private static display(reward: Reward, slot: Score) {
		return new Button(
			reward.icon,
			$(slot),
			$`§6§l${reward.name} §8× §e${reward.pending}`,
			[
				'',
				'§6§l┃ Item Reward',
				...Text.wrap('This item is waiting safely in your vault.', '§6┃ §7'),
				'',
				$`§6┃ §7Available: §e${reward.pending}`,
				'',
				'§aClick to claim one!',
			],
			() => reward.claim()
		);
	}
}
