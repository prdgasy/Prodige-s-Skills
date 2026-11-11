import { Button, Gui, Page, GuiMacro as $ } from "@prodigelib/gui";
import { Text } from "@lib/text";
import { Items } from "./items";
import { Boosters } from "./booster";
import { Crates } from "./crates";
import { Titles } from "./titles";
import { Menu } from "@src/menu";
import { Main } from "@src/menu/main";
import { Player } from "@src/player";
import { macro as E } from "@prodigelib/easymacro";

export class Shop {
	public static getName() {
		return this.name;
	}

	public static init(g: Gui, p: Page) {
		p.add(
			this.items(g),
			this.boosters(g),
			this.crates(g),
			this.titles(g),
			this.balance()
		);

		p.add(Menu.back(g, Main));
		return p;
	}

	private static items(g: Gui) {
		return new Button(
			"emerald",
			11,
			"§a⚒ Items & Gear",
			[
				'',
				'§e§l┃ Gear for Your Journey',
				...Text.wrap('Browse equipment made to support your skill progression.', '§e┃ §7'),
				'',
				'§a§l┃ What You Can Find',
				'§a┃ §7Tools and weapons',
				'§a┃ §7Special item effects',
				'§a┃ §7Equipment details and prices',
				'',
				'§eClick to browse the gear!'
			],
			() => {
				Items.index.set(0);
				g.switch(Items.getName())
			}
		);
	}

	private static boosters(g: Gui) {
		return new Button(
			"experience_bottle",
			12,
			"§b✦ Boosters",
			[
				'',
				'§e§l┃ Speed Up Your Progress',
				...Text.wrap('Boosters multiply the rewards you earn from skill actions.', '§e┃ §7'),
				'',
				'§b§l┃ Booster Types',
				'§b┃ §7XP Boosters increase skill experience.',
				'§b┃ §7Point Boosters increase skill points.',
				'§b┃ §7Choose from multipliers ranging from §ex2 §7to §ex5§7!',
				'',
				'§eClick to view the available boosters!'
			],
			() => g.switch(Boosters.getName())
		);
	}

	private static crates(g: Gui) {
		return new Button(
			"ender_chest",
			14,
			"§6✧ Crates",
			[
				'',
				'§e§l┃ A Chance at Great Rewards',
				...Text.wrap('Open a crate to claim its rewards and add them to your collection.', '§e┃ §7'),
				'',
				'§6§l┃ Discover What Awaits',
				'§6┃ §7Check each crate for its rewards.',
				'§6┃ §7Choose a crate and see what luck brings!',
				'',
				'§eClick to explore the crates!'
			],
			() => {
				Crates.frame.set(0);
				g.switch(Crates.getName());

			}
		);
	}

	private static titles(g: Gui) {
		return new Button(
			"name_tag",
			15,
			"§d✦ Titles",
			[
				'',
				'§e§l┃ Make Your Mark',
				...Text.wrap('§7Discover titles earned through your skill progression.', '§e┃ §7'),
				'',
				'§d§l┃ Show Your Achievements',
				'§d┃ §7Titles celebrate your progress in each skill.',
				'§d┃ §7Read each description to learn how it was earned.',
				'',
				'§eClick to browse the titles!'
			],
			() => {
				Titles.index.set(0);
				g.switch(Titles.getName());
			}
		);
	}

	public static balance() {
		return new Button(
			'gold_block', 21, $`§eBalance §8• §6${Player.pts} Pts`, [],
			() => {
				Player.playSound('tick', 2);
				Player.smartSend(E`You have §6${Player.pts} Pts§e.`, '§e');
			}
		)
	}
}
