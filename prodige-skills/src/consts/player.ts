import { Selector, Label, SelectorClass } from "sandstone";

/**
 * Player selector with custom tags, arguments
 */
export const Options = {
  progress: Label('Options.progress'),
  progressNotif: Label('Options.progressNotif'),
  levelNotif: Label('Options.levelNotif')
}

/**
 * Custom selector for @p with multiple labels
 * Usage: Player(MyLabel, AnotherLabel)
 */
export function Player(...labels: ReturnType<typeof Label>[]) {
  return Selector('@p', {
    tag: labels
  });
}
