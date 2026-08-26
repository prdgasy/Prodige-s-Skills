import { Objective, Score, Variable, _ } from "sandstone";
import { Criteria, ItemType } from "../types";
import { SkillClass } from "./skillClass";
import { BoosterScore } from "../player/scores";

type OnEventOptions = {
  name?: string;
  itemId: ItemType;
  parent: SkillClass;
  criteria?: Criteria;
  xp?: number;
  pts?: number;
}

export class OnEventClass {
  name: string;
  itemId: ItemType;
  parent: SkillClass;
  xp: number;
  pts: number;
  criteria: Criteria;

  watcher: Score;
  constructor(options: OnEventOptions) {
    this.name = options.name ?? String(options.itemId);
    this.parent = options.parent;
    this.itemId = options.itemId;
    this.xp = options.xp ?? 1;
    this.pts = options.pts ?? 1;
    this.criteria = options.criteria ?? 'dummy';

    this.watcher = Objective.create(`${this.parent.name}.event.${this.name.replace(' ', '')}`, this.criteria)('@p');
  }

  trigger() {
    const addedXp = Variable(this.xp)["*"](BoosterScore.xp);
    const addedPoint = Variable(this.pts)["*"](BoosterScore.point);

    this.parent.xp['+='](addedXp);

    this.parent.displayProgress(addedXp, addedPoint);

    _.if(_.and(this.parent.xp['>='](this.parent.xpTarget), this.parent.level['<'](100)), () => this.parent.levelUp());

    this.watcher.reset();
  }
}

export function OnEvent({
  name,
  itemId,
  parent,
  criteria,
  xp,
  pts
}: OnEventOptions) {
  return new OnEventClass({
    name,
    itemId,
    parent,
    criteria,
    xp,
    pts
  })
}
