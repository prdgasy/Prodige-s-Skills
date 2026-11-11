import { Button, Page } from "@prodigelib/gui";
import { Item } from "@src/types";

export class Mask {
	public static mainLayered = (p: Page) => this.layered(p, 'gray_stained_glass_pane', 'black_stained_glass_pane');

	public static layered(p: Page, filler1: Item, filler2: Item) {

		for (let i = 0; i < 9; i++) {
			p.emit(new Button(filler2, i, ''));
		}
		for (let i = 9; i < 18; i++) {
			p.emit(new Button(filler1, i, ''));
		}
		for (let i = 18; i < 27; i++) {
			p.emit(new Button(filler2, i, ''));
		}


	}

	public static full(p: Page, filler: Item) {

		for (let i = 0; i < 27; i++) {
			p.emit(new Button(filler, i, ''));
		}

	}

	public static bottom(p: Page, filler: Item, endSlot = 26) {

		for (let i = 18; i <= endSlot; i++) {
			p.emit(new Button(filler, i, ''));
		}

	}

	public static top(p: Page, filler: Item) {

		for (let i = 0; i < 9; i++) {
			p.emit(new Button(filler, i, ''));
		}

	}
}