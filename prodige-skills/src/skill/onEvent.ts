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
  static notif: Score = Objective.create('on_event.notif')('@p');
  name: string;
  itemId: ItemType;
  parent: SkillClass;
  xp: number;
  pts: number;
  criteria: Criteria;

  totalExecuted: Score;
  totalXp: Score;
  totalPts: Score;

  watcher: Score;


  constructor(options: OnEventOptions) {
    this.name = options.name ?? String(options.itemId);
    this.parent = options.parent;
    this.itemId = options.itemId;
    this.xp = options.Xp ?? 1;
    this.pts = options.pts ?? 1;
    this.criteria = options.criteria ?? 'dummy';

    this.watcher = Objective.create(`${this.parent.name}.event.${this.name.replace(/\s+/g, '')}`, this.criteria)('@p');
    this.totalExecuted = Objective.create(`${this.parent.name}.total_event.${this.name.replace(/\s+/g, '')}`, this.criteria)('@p');
    this.totalXp = Objective.create(`${this.parent.name}.total_event.${this.name.replace(/\s+/g, '')}.xp`, 'dummy')('@p');
    this.totalPts = Objective.create(`${this.parent.name}.total_event.${this.name.replace(/\s+/g, '')}.pts`, 'dummy')('@p');
  }

  trigger() {
    const addedXp = Player.boosterScore.xp["*"](this.xp)["*"](this.watcher);
    const addedPoint = Player.boosterScore.point["*"](this.pts)["*"](this.watcher);

    this.totalPts['+='](addedPoint);
    this.totalXp['+='](addedXp);

    this.parent.xp['+='](addedXp);
    this.parent.totalXp['+='](addedXp);
    this.parent.totalPts['+='](addedPoint);

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
