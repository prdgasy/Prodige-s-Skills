import { Label, Objective, Score, Variable, _ } from "sandstone";
import { Criteria, Item } from "@src/types";
import { Skill } from "@src/skill";
import { Player } from "@src/player";


export class OnEvent {
  static notifState = Label('on_event.notif')('@p');

  public parent: Skill;
  public name: string;
  public item: Item;
  public xp: number;
  public pts: number;


  public totalExecuted: Score;
  public totalXp: Score;
  public totalPts: Score;

  private criteria: Criteria;
  private watcher: Score;


  constructor(parent: Skill, name: string, item: Item, xp: number, pts: number, criteria = "dummy" as Criteria) {
    this.name = name;
    this.parent = parent;
    this.item = item;
    this.xp = xp;
    this.pts = pts;
    this.criteria = criteria;

    this.watcher = Objective.create(`${this.parent.name}.event.${this.name.replace(/\s+/g, '')}`, this.criteria)('@p');
    this.totalExecuted = Objective.create(`${this.parent.name}.total_event.${this.name.replace(/\s+/g, '')}`, this.criteria)('@p');
    this.totalXp = Objective.create(`${this.parent.name}.total_event.${this.name.replace(/\s+/g, '')}.xp`, 'dummy')('@p');
    this.totalPts = Objective.create(`${this.parent.name}.total_event.${this.name.replace(/\s+/g, '')}.pts`, 'dummy')('@p');
  }

  triggered() {
    const addedXp = Player.boosterScore.xp["*"](this.xp)["*"](this.watcher);
    const addedPoint = Player.boosterScore.point["*"](this.pts)["*"](this.watcher);

    this.totalPts['+='](addedPoint);
    this.totalXp['+='](addedXp);

    this.parent.onEventTriggered(addedXp, addedPoint);

    this.watcher.reset();
  }
}

