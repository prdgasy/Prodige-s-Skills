import { GUI } from "@prodigelib/gui";
import { goBack, PageNames } from "../const";
import { Errors } from "../../errors";

export function initDailyTasksPage(Menu: GUI.Init) {
  const task1: GUI.Button = {
    id: 'iron_sword',
    slot: 11,
    name: { text: 'Daily Slayer', color: 'red' },
    lore: [
      { text: 'Kill 50 Mobs', color: 'gray' },
      { text: 'Progress: ', color: 'gray' }, { text: '12/50', color: 'yellow' }
    ],
    onClick: () => Errors.functionNotImplemented()
  };

  const task2: GUI.Button = {
    id: 'wheat',
    slot: 13,
    name: { text: 'Grand Harvest', color: 'green' },
    lore: [
      { text: 'Harvest 200 Crops', color: 'gray' },
      { text: 'Progress: ', color: 'gray' }, { text: '0/200', color: 'red' }
    ],
    onClick: () => Errors.functionNotImplemented()
  };

  const task3: GUI.Button = {
    id: 'fishing_rod',
    slot: 15,
    name: { text: 'Ocean Hunter', color: 'aqua' },
    lore: [
      { text: 'Catch 10 Rare Fish', color: 'gray' },
      { text: 'Progress: ', color: 'gray' }, { text: 'DONE', color: 'green', bold: true }
    ],
    onClick: () => Errors.functionNotImplemented()
  };

  const page: GUI.Page = {
    name: PageNames.dailyTask,
    Buttons: [
      goBack(Menu, PageNames.profile),
      task1,
      task2,
      task3
    ]
  };

  Menu.pushPage(page);
}