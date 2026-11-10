import { Global } from "@src/global";
import { Player } from "@src/player";
import { Item } from "@src/types";
import { _, execute, Label, MCFunction, NonEmptyString, team } from "sandstone";
import { EntityLabel } from "sandstone/variables";
import type { Skill } from "./index";
import { Buyable } from "@src/misc/buyable";

export type TitleOptions = {
	name: string;
	description: string;
	icon: Item;
} & (
		{ level: number; price?: never }
		| { price: number; level?: never }
	);

export class Title extends Buyable {
	public static allTitles: Title[] = [];
	public skill: Skill;
	public obtain: 'level' | 'price';
	public owned: EntityLabel;
	public requires: number;
	public equipped: EntityLabel;
	public team: string;

	constructor(skill: Skill, options: TitleOptions) {
		const obtain = options.level !== undefined ? 'level' : 'price';
		const requires = options.level ?? options.price;
		super(options.name, options.description, options.icon, obtain === 'price' ? requires : 0, () => this.unlock(), false);
		this.skill = skill;
		this.obtain = obtain;
		this.requires = requires;

		this.owned = Label(`title.owned.${this.resourceId}` as NonEmptyString)('@p');
		this.equipped = Label(`title.equipped.${this.resourceId}` as NonEmptyString)('@p');
		this.team = 'titel_' + this.resourceId;
		Title.allTitles.push(this);
	}

	public unlock() {
		_.if(_.not(this.owned), () => {
			this.owned.add();
		});
	}

	public purchaseOrToggle() {
		const fn = MCFunction(`title/interact/${this.resourceId}`, () => {
			_.if(_.not(this.owned), () => {
				if (this.obtain === 'level')
					Player.throw(`Reach level §d${this.requires} in §d${this.skill.name} to unlock this title.`);
				else this.buy();
			})
				.else(() => {
					_.if(this.equipped, () => {
						team.leave('@p');
						this.equipped.remove();
						Player.send(`The title ${this.name} §eis no longer displayed.`);
					}).else(() => {
						for (const title of Title.allTitles) title.equipped.remove();
						team.join(this.team, '@p');
						this.equipped.add();
						Player.send(`You are now displaying ${this.name}§e.`);
					})
				})
		});

		return fn();
	}

	public static init() {
		MCFunction('title/setup_teams', () => {
			for (const title of Title.allTitles) {
				team.add(title.team);
				team.modify(title.team, 'prefix', `§8[${title.name}§8] >> §r`);
				execute.as('@a').at('@s').run(() => {
					_.if(title.equipped, () => team.join(title.team, '@s'));
				});
			}
		}, { runOnLoad: true });
	}
}
