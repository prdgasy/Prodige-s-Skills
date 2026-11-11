import { Button, Gui, GuiMacro as $, Page } from "@prodigelib/gui";
import { Text } from "@lib/text";
import { Menu } from "@src/menu";
import { Main } from "@src/menu/main";
import { Reward } from "@src/misc/reward";
import { _, Objective, Score, Variable } from "sandstone";
import { Mask } from "../mask";
import { Player } from "@src/player";

const REWARDS_PER_PAGE = 18;

export class RewardVault {
	public static index = Objective.create('menu.rewards.index')('@s');

	public static getName() {
		return this.name;
	}

	public static init(g: Gui, p: Page) {
		const rewards = [...Reward.registry.values()];

		p.add(() => Mask.bottom(p, "magenta_stained_glass_pane"));

		p.add(() => {
			const hasRewardOnPage = Variable(0);
			const rewardCount = this.displayAll(p, rewards, hasRewardOnPage);
			const maxPage = Variable(0);
			_.if(rewardCount['>'](REWARDS_PER_PAGE), () => {
				maxPage.set(rewardCount['-'](1)['/'](REWARDS_PER_PAGE));
			});
			Menu.sliders(p, this.index, maxPage);

			_.if(_.not(hasRewardOnPage), () => {
				Mask.full(p, "red_stained_glass_pane");

				p.emit(new Button('barrier', 13, '§cYour Vault Is Empty', [
					'',
					'§6§l┃ No Rewards to Claim',
					...Text.wrap('Rewards from achievements, crates and skill levels will appear here.', '§6┃ §7'),
				], () => Player.send('Your Reward Vault is empty.', '§7')));
			})
		});


		p.add(Menu.back(g, Main));
		return p;
	}

	private static displayAll(p: Page, rewards: Reward[], hasRewardOnPage: Score): Score {
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

		return rewardIndex;
	}
	private static display(reward: Reward, slot: Score) {
		return new Button(
			reward.icon,
			$(slot),
			$`§6§l${reward.name} §8× §e${reward.pending}`,
			[
				'',
				`§6§l┃ ${reward.takesPlace ? 'Item Reward' : 'Reward'}`,
				...Text.wrap(
					reward.takesPlace ? 'This item is waiting safely in your vault.' : 'This reward is waiting safely in your vault.',
					'§6┃ §7'
				),
				'',
				$`§6┃ §7Available: §e${reward.pending}`,
				'',
				'§aClick to claim one!',
			],
			() => reward.claim()
		);
	}
}
