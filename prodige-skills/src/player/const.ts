import { Selector, Label, SelectorClass } from "sandstone";

/**
 * Player selector with custom tags, arguments
 */
export const playerOption = {
  progress: Label('playerOption.progress'),
  levelNotif: Label('playerOption.levelNotif')
}

/**
 * Custom selector for @p with multiple labels
 * Usage: Player(MyLabel, AnotherLabel)
 */
export function Player(...labels: ReturnType<typeof Label>[]) {
  return Selector('@p', {
    tag: labels.map(label => label.name)
  });
}
