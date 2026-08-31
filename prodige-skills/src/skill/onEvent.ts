import { Objective, Score, Variable, _ } from "sandstone";
import { Criteria, ItemType } from "../types";
import { SkillClass } from ".";
import { Player } from "../player";

type OnEventOptions = {
  name?: string;
  itemId: ItemType;
  parent: SkillClass;
  criteria?: Criteria;
  Xp?: number;
  pts?: number;
}

export class OnEventClass {
  name: string;
  itemId: ItemType;
  parent: SkillClass;
  Xp: number;
  pts: number;
  criteria: Criteria;
  total: Score;

  watcher: Score;
  constructor(options: OnEventOptions) {
    this.name = options.name ?? String(options.itemId);
    this.parent = options.parent;
    this.itemId = options.itemId;
    this.Xp = options.Xp ?? 1;
    this.pts = options.pts ?? 1;
    this.criteria = options.criteria ?? 'dummy';

    this.watcher = Objective.create(`${this.parent.name}.event.${this.name.replace(' ', '')}`, this.criteria)('@p');
    this.total = Objective.create(`${this.parent.name}.total_event.${this.name.replace(' ', '')}`, 'dummy')('@p');
  }

  trigger() {
    const addedXp = Variable(this.Xp)["*"](Player.boosterScore.Xp);
    const addedPoint = Variable(this.pts)["*"](Player.boosterScore.point);

    this.parent.Xp['+='](addedXp);
    this.parent.totalXp['+='](addedXp);
    this.parent.totalPts['+='](addedPoint);

    this.parent.displayProgress(addedXp, addedPoint);

    _.if(_.and(this.parent.Xp['>='](this.parent.XpTarget), this.parent.level['<'](100)), () => this.parent.levelUp());

    this.watcher.reset();
  }
}

export function OnEvent({
  name,
  itemId,
  parent,
  criteria,
  Xp,
  pts
}: OnEventOptions) {
  return new OnEventClass({
    name,
    itemId,
    parent,
    criteria,
    Xp,
    pts
  })
}
