import { MacroArg as $, Button, ButtonClass, GUI, Page } from "@prodigelib/gui";
import { _ } from "sandstone";
import { Options } from "../../consts/consts";
import { goBack, PageNames } from "../consts/menu";

export function initSettingsPage(Menu: GUI) {

  const progress = {
    label: Options.progress,
    button: (status: string, color: string): ButtonClass => {
      return Button({
        id: 'gold_nugget',
        slot: 13,
        name: { text: 'progress ', color: 'yellow' },
        // 2. Utilisation de la méthode .call() pour injecter les clés automatiquement
        lore: [{ text: $(status), color: $(color) }],
        onClick: () => { progress.label('@p').toggle(); },
      });
    }
  };

  const levelNotif = {
    label: Options.levelNotif,
    button: (status: string, color: string): ButtonClass => {
      return Button({
        id: 'jukebox',
        slot: 14,
        name: { text: 'level notif ', color: 'yellow' },
        // 2. Utilisation de la méthode .call()
        lore: [{ text: $(status), color: $(color) }],
        onClick: () => { levelNotif.label('@p').toggle(); },
      });
    }
  };

  const buttons = [progress, levelNotif];

  const disabledText = "OFF";
  const disabledColor = "red";
  const enabledText = "ON";
  const enabledColor = "green";

  const optionBtn = () => {
    buttons.forEach(button => {
      _.if(button.label('@p'), () => { page.rawEmit(button.button(enabledText, enabledColor)) })
        .else(() => { page.rawEmit(button.button(disabledText, disabledColor)) });
    });
  };

  const page = Page(Menu, PageNames.settings, [goBack(Menu, PageNames.profile),]);

  page.pushObject(optionBtn);
  page.build();
}