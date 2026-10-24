import { Gui } from "@prodigelib/gui";
import { data, Data, defaultNamespace, MCFunction } from "sandstone";

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

	public static generateCleanFn() {
		return MCFunction('clean_var', () => {
			for (let i = 0; i < 200; i++) {
				Data('storage', '__sandstone:variable', `anon_xTSjehSB_${i}`).remove();
			}
		});
	}

}

