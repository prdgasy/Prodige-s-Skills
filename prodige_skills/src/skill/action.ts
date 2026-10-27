import { Global } from "@src/global";
import { Player } from "@src/player";
import { Skill } from "@src/skill";
import { Criteria, Item } from "@src/types";
import { MCFunction, Objective, Score, Variable, _, execute, say } from "sandstone";
import { Float } from "@prodigelib/floatVar";
export class Action {
	public parent: Skill;
	public name: string;
	public item: Item;
	public xp: number;
	public pts: number;

	public totalExecuted: Score;
	public totalXp: Float;
	public totalPts: Score;

	public static addedXp = Float.variable();
	public static addedPts = Variable();

	private criteria: Criteria;
	private watcher: Score;

	// static score = Objective.create('on_event');

	constructor(parent: Skill, name: string, item: Item, xp: number, pts: number, criteria = "dummy" as Criteria) {
		this.name = name;
		this.parent = parent;
		this.item = item;
		this.xp = xp;
		this.pts = pts;
		this.criteria = criteria;

		this.watcher = Objective.create(`${this.parent.name}.event.${this.name.replace(/\s+/g, '')}`, this.criteria)('@p');
		this.totalExecuted = Objective.create(`${this.parent.name}.total_event.${this.name.replace(/\s+/g, '')}`, this.criteria)('@p');
		this.totalXp = Float.objective(`${this.parent.name}.total_event.${this.name.replace(/\s+/g, '')}.xp`)('@p');
		this.totalPts = Objective.create(`${this.parent.name}.total_event.${this.name.replace(/\s+/g, '')}.pts`, 'dummy')('@p');
	}

	private trigger() {
		const fn = MCFunction(`on_event/trigger/${Global.toResource(this.name)}`, () => {
			Action.addedXp.set(Float.variable(this.xp)['*'](Player.boosterScore.xp)["*"](this.watcher));
			Action.addedPts.set(Player.boosterScore.point["*"](this.pts)["*"](this.watcher));

			this.totalPts['+='](Action.addedPts);
			this.totalXp['+='](Action.addedXp);
			this.totalExecuted['+='](this.watcher);

			this.parent.onEventTriggered(Action.addedXp, Action.addedPts);

			this.watcher.reset();
		}, { onConflict: 'ignore' });

		return fn();
	}

	public static watch() {
		return MCFunction('on_event/watch', () =>
			execute.as('@a').at('@s').run(() => {
				for (const skill of Object.values(Skill.skills))
					for (const event of skill.onEvents)
						_.if(event.watcher['>'](0), () => event.trigger())
			})
			, { runEvery: '5s' })
	}
}