import { Gui } from "@prodigelib/gui";
import { Data, defaultNamespace } from "sandstone";

export class Global {
	public static ns = defaultNamespace.toString();
	public static storage = Data('storage', `${this.ns}:${this.ns}`, 'data');
	public static name = 'Prodige Skills';

	public static uninstall() {
		Gui.uninstall();
		this.storage.remove();
	};

	public static toMcFunction(name: string): string {
		return name.replace(/ /g, '').toLowerCase();
	}
}

