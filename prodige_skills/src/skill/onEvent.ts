import { Data, DataVariable, Label, MCFunction, Objective, Score, Variable, _, defaultNamespace, execute, raw } from "sandstone";
import { Criteria, Item } from "@src/types";
import { Skill } from "@src/skill";
import { Player } from "@src/player";


export class OnEvent {
  public parent: Skill;
  public name: string;
  public item: Item;
  public xp: number;
  public pts: number;


  public totalExecuted: Score;
  public totalXp: Score;
  public totalPts: Score;

  private criteria: Criteria;
  public watcher: Score;

  static score = Objective.create('on_event');


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

  private trigger(xp: Score, pts: Score, w: Score, tXp: Score, tPts: Score) {
    const fn = MCFunction('on_event/trigger', () => {
      const addedXp = Player.boosterScore.xp["*"](xp)["*"](w);
      const addedPoint = Player.boosterScore.point["*"](pts)["*"](w);

      tPts['+='](addedPoint);
      tXp['+='](addedXp);

      this.parent.onEventTriggered(addedXp, addedPoint);
    }, { onConflict: 'ignore' })
    return fn();
  }

  public static watch() {
    return MCFunction('on_event/watch', () => {
      execute.as('@a').at('@s').run(() => {
        for (const skill of Skill.list) for (const event of skill.onEvents) this.loop(event);
      })
    }, { runEvery: '5s' })
  }

  private static loop(event: OnEvent) {

    _.if(event.watcher[">"](0), () => {
      const pts = OnEvent.score('.pts').set(event.pts);
      const xp = OnEvent.score('.xp').set(event.xp);
      const w = OnEvent.score('.w').set(event.watcher);
      const tXp = OnEvent.score('.tXp').set(event.totalXp);
      const tPts = OnEvent.score('.tPts').set(event.totalPts);

      event.trigger(xp, pts, w, tXp, tPts)

      event.totalXp.set(tXp);
      event.totalPts.set(tPts);
      event.watcher.reset();
    })


  }
}

