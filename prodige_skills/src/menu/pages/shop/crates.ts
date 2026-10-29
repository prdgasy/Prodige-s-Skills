import { Text } from "@lib/text";
import { Button, Gui, PageClass } from "@prodigelib/gui";
import { Crate } from "@src/misc/crate";
import { Shop } from ".";
import { Menu } from "@src/menu";
import { _, Data, item, MCFunction, Objective, Score, Variable } from "sandstone";
import { ItemSlotSource } from "sandstone/commands";

export class Crates {
	public static frame = Objective.create('gui.crates.frame')('@s');

	public static getName() {
		return this.name;
	}

	public static init(g: Gui, p: PageClass) {
		p.add(this.howItWorks());

		const crates = Object.values(Crate.crates);
		for (const [i, crate] of crates.entries()) {
			p.add(
				this.crateButton(crate, 2 + i),
				this.keyButton(crate, 11 + i)
			);
		}

		p.add(() => Crates.animate());

		p.add(Shop.balance(), Menu.back(g, Shop, () => this.frame.reset()));
		return p;
	}

	private static animate() {
		const fn = MCFunction('misc/crate/animate', () => {
			_.if(Crates.frame['>='](0), () => {
				Crates.frame['++'];
				Crates.frame['%='](5);
				for (const [index, crate] of Object.values(Crate.crates).entries()) {
					if (crate.animated) this.setFrame(crate, index + 2, Crates.frame);
				}
				_.await.sleep('7t');
				fn();
			});
		}, { onConflict: 'ignore', asyncContext: true });
		return fn();
	}

	private static setFrame(crate: Crate, slot: number, frame: Score) {
		const titles = [
			`§b✦ §f${crate.name} §bCrate ✦`,
			`§3✧ §b${crate.name} §fCrate ✧`,
			`§d❖ §5${crate.name} §dCrate ❖`,
			`§5✹ §d${crate.name} §fCrate ✹`,
			`§f✧ §d${crate.name} §5Crate ✧`
		];

		for (let i = 0; i < titles.length; i++) {
			_.if(frame['=='](i), () => {
				const name = Data('entity', '@s', `Items[{Slot:${slot}b}].components."minecraft:custom_name"`);
				name.set(titles[i]);
			});
		}
	}

	private static crateButton(crate: Crate, slot: number) {
		return new Button(
			crate.item,
			slot,
			`${crate.name} Crate`,
			crate.getMenuDescription(),
			() => crate.tryOpen(), 1, ['enchantment_glint_override=1']
		);
	}

	private static keyButton(crate: Crate, slot: number) {
		return new Button(
			'tripwire_hook',
			slot,
			`§e${crate.name} Crate Key §8• §6${crate.key.price} Pts`,
			[
				'',
				'§e§l┃ Matching Crate Key',
				`§e┃ §7This key opens: §l${crate.name} Crate§7.`,
				'§e┃',
				`§e┃ §7Price: §6${crate.key.price} Pts`,
				'',
				'§eClick to buy!'
			],
			() => crate.key.buy()
		);
	}

	private static howItWorks() {
		return new Button(
			'knowledge_book',
			4,
			'§6§lHow Crates Work',
			[
				'',
				'§e§l┃ Buy the Matching Key',
				...Text.wrap('Purchase a key that matches the crate you want to open.', '§e┃ §7'),
				'',
				'§b§l┃ Open Your Crate',
				...Text.wrap('Hold the key in your main hand and click on the corresponding crate to open it!', '§b┃ §7'),
				'',
				'§8Reward chances are listed on each crate.'
			],
			() => { }
		);
	}
}