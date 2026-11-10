import { Button, PageClass } from "@prodigelib/gui";
import { Item } from "@src/types";

export class Mask {
	public static mainLayered = (p: PageClass) => this.layered(p, 'gray_stained_glass_pane', 'black_stained_glass_pane');

	public static layered(p: PageClass, filler1: Item, filler2: Item) {

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

	public static full(p: PageClass, filler: Item) {

		for (let i = 0; i < 27; i++) {
			p.emit(new Button(filler, i, ''));
		}

	}

	public static bottom(p: PageClass, filler: Item) {

		for (let i = 18; i < 27; i++) {
			p.emit(new Button(filler, i, ''));
		}

	}

	public static top(p: PageClass, filler: Item) {

		for (let i = 0; i < 9; i++) {
			p.emit(new Button(filler, i, ''));
		}

	}
}