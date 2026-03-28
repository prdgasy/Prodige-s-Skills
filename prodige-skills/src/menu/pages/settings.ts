import { GUI } from "@prodigelib/gui";
import { goBack, PageNames } from "../const";

export function initSettingsPage(Menu: GUI.Init) {
  const particlesBtn: GUI.Button = {
    id: 'blaze_powder',
    slot: 11,
    name: { text: 'Skill Particles', color: 'aqua' },
    lore: [{ text: 'Currently: ', color: 'gray' }, { text: 'ENABLED', color: 'green' }],
    onClick: () => { /* Logic to toggle */ }
  };

  const soundsBtn: GUI.Button = {
    id: 'jukebox',
    slot: 13,
    name: { text: 'Notification Sounds', color: 'yellow' },
    lore: [{ text: 'Currently: ', color: 'gray' }, { text: 'ENABLED', color: 'green' }],
    onClick: () => { /* Logic to toggle */ }
  };

  const page: GUI.Page = {
    name: PageNames.settings,
    Buttons: [
      goBack(Menu, PageNames.profile),
      particlesBtn,
      soundsBtn
    ]
  };

  Menu.pushPage(page);
}