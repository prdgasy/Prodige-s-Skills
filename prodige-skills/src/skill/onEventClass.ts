import { Objective, Score, Variable, _ } from "sandstone";
import { Criteria, ItemType } from "../types";
import { SkillClass } from "./skillClass";
import { BoosterScore } from "../player/scores";

type OnEventOptions = {
  name?: string;
  id: ItemType;
  parent: SkillClass;
  criteria?: Criteria;
  xp?: number;
  point?: number;
}

export class OnEventClass {
  name: string;
  id: ItemType;
  parent: SkillClass;
  xp: number;
  point: number;
  criteria: Criteria;

  watcher: Score;
  constructor(options: OnEventOptions) {
    this.name = options.name ?? String(options.id);
    this.parent = options.parent;
    this.id = options.id;
    this.xp = options.xp ?? 1;
    this.point = options.point ?? 1;
    this.criteria = options.criteria ?? 'dummy';

    this.watcher = Objective.create(`${this.parent.name}.event.${this.name.replace(' ', '')}`, this.criteria)('@p');
  }

  trigger() {
    const addedXp = Variable(this.xp)["*"](BoosterScore.xp);
    const addedPoint = Variable(this.point)["*"](BoosterScore.point);

    this.parent.xp['+='](addedXp);

    this.parent.displayProgress(addedXp, addedPoint);

    _.if(_.and(this.parent.xp['>='](this.parent.xpTarget), this.parent.level['<'](100)), () => this.parent.levelUp());

    this.watcher.reset();
  }
}

export function OnEvent({
  name,
  id,
  parent,
  criteria,
  xp,
  point
}: OnEventOptions) {
  return new OnEventClass({
    name,
    id,
    parent,
    criteria,
    xp,
    point
  })
}
