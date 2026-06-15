import { Button, ButtonClass, GUI, MacroArgument, Page } from "@prodigelib/gui";
import { goBack, PageNames } from "../const";
import { _ } from "sandstone";
import { Options } from "../../player/consts";

export function initSettingsPage(Menu: GUI) {

  const progress = {
    label: Options.progress,
    button: (status: string, color: string): ButtonClass => {
      // 1. Initialisation des arguments de macro intelligents (Value Objects)
      const statusArg = MacroArgument(status);
      const colorArg = MacroArgument(color);

      return Button({
        id: 'gold_nugget',
        slot: 13,
        name: { text: 'progress ', color: 'yellow' },
        // 2. Utilisation de la méthode .call() pour injecter les clés automatiquement
        lore: [{ text: statusArg.call(), color: colorArg.call() }],
        onClick: () => { progress.label('@p').toggle(); },
        // 3. Passage des instances au tableau macroArgs
        macroArgs: [statusArg, colorArg]
      });
    }
  };

  const levelNotif = {
    label: Options.levelNotif,
    button: (status: string, color: string): ButtonClass => {
      // 1. Initialisation des arguments de macro intelligents
      const statusArg = MacroArgument(status);
      const colorArg = MacroArgument(color);

      return Button({
        id: 'jukebox',
        slot: 14,
        name: { text: 'level notif ', color: 'yellow' },
        // 2. Utilisation de la méthode .call()
        lore: [{ text: statusArg.call(), color: colorArg.call() }],
        onClick: () => { levelNotif.label('@p').toggle(); },
        // 3. Passage des instances au tableau macroArgs
        macroArgs: [statusArg, colorArg]
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
      _.if(button.label('@p'), () => { page.emitButton(button.button(enabledText, enabledColor)) })
        .else(() => { page.emitButton(button.button(disabledText, disabledColor)) });
    });
  };

  const page = Page(Menu, PageNames.settings, [goBack(Menu, PageNames.profile),]);

  page.pushObject(optionBtn);
  page.build();
}