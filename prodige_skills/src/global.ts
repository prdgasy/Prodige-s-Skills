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

	public static toResource(s: string): string {
		return s
			.replace(/§./g, '')
			.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
			.trim()
			.toLowerCase()
			.replace(/\s+/g, '_')
			.replace(/[^a-z0-9_.\-\/]/g, '');
	}
}

