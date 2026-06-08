import { execute, Label, MCFunction, Selector } from "sandstone";
import { playerOption } from "./consts";
import { BoosterScore } from "./scores";

MCFunction('player/first_join', () => {
  const firstJoin = Label('firstJoin');
  execute.as('@a').run(() => {
    execute.as(Selector('@s', { tag: [`!${firstJoin.fullName}`] })).run(() => {
      for (const label of Object.values(playerOption)) {
        label('@s').add();
      }

      BoosterScore.point.set(1);
      BoosterScore.xp.set(1);
    })
    firstJoin('@s').add();
  })

}, { runOnLoad: true })

