import { GUI } from "@prodigelib/gui";
import { goBack, PageNames } from "../const";
import { _ } from "sandstone";
import { Options } from "../../player/consts";

export function initSettingsPage(Menu: GUI.Init) {
  const progress = {
    label: Options.progress,
    button: (status: string, color: string): GUI.Button => {
      return {
        id: 'gold_nugget',
        slot: 13,
        name: { text: 'progress ', color: 'yellow' },
        lore: [{ text: '$(status)', color: '$(color)' }],
        onClick: () => { levelNotif.label('@p').toggle(); },
        macroArgs: [{ status: status, color: color }]
      }
    }
  }

  const levelNotif = {
    label: Options.levelNotif,
    button: (status: string, color: string): GUI.Button => {
      return {
        id: 'jukebox',
        slot: 14,
        name: { text: 'level notif ', color: 'yellow' },
        lore: [{ text: '$(status)', color: '$(color)' }],
        onClick: () => { levelNotif.label('@p').toggle(); },
        macroArgs: [{ status: status, color: color }]
      }
    }
  }

  const buttons = [progress, levelNotif];

  const disabledText = "OFF";
  const disabledColor = "red";
  const enabledText = "ON";
  const enabledColor = "green";
  const fill = () => {
    buttons.forEach(button => {
      _.if(button.label('@p'), () => { Menu.placeItem(button.button(enabledText, enabledColor)) })
        .else(() => { Menu.placeItem(button.button(disabledText, disabledColor)) })
    })
  }
  const click = () => {
    buttons.forEach(button => {
      _.if(button.label('@p'), () => { Menu.detectClick(button.button(enabledText, enabledColor)) })
        .else(() => { Menu.detectClick(button.button(disabledText, disabledColor)) })
    })
  }

  const page: GUI.Page = {
    name: PageNames.settings,
    Buttons: [
      goBack(Menu, PageNames.profile),
    ]
  };

  Menu.pushInstruction(page, {
    fill: fill,
    click: click
  })



  Menu.pushPage(page);
}