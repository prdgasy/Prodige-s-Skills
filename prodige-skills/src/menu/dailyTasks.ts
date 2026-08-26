import { GUI, Page, Button } from "@prodigelib/gui";
import { goBack, PageNames } from "./const";
import { Errors } from "../../lib/errors";

export function initDailyTasks(Menu: GUI) {
  const task1 = Button({
    id: 'iron_sword',
    slot: 11,
    name: { text: 'Daily Slayer', color: 'red' },
    lore: [
      { text: 'Kill 50 Mobs', color: 'gray' },
      { text: 'Progress: ', color: 'gray' }, { text: '12/50', color: 'yellow' }
    ],
    onClick: () => Errors.functionNotImplemented()
  });

  const task2 = Button({
    id: 'wheat',
    slot: 13,
    name: { text: 'Grand Harvest', color: 'green' },
    lore: [
      { text: 'Harvest 200 Crops', color: 'gray' },
      { text: 'Progress: ', color: 'gray' }, { text: '0/200', color: 'red' }
    ],
    onClick: () => Errors.functionNotImplemented()
  });

  const task3 = Button({
    id: 'fishing_rod',
    slot: 15,
    name: { text: 'Ocean Hunter', color: 'aqua' },
    lore: [
      { text: 'Catch 10 Rare Fish', color: 'gray' },
      { text: 'Progress: ', color: 'gray' }, { text: 'DONE', color: 'green', bold: true }
    ],
    onClick: () => Errors.functionNotImplemented()
  });

  const page = Page(
    Menu,
    PageNames.dailyTask,
    [
      goBack(Menu, PageNames.main),
      task1,
      task2,
      task3
    ]
  );

  page.build();
}