import { Objective } from 'sandstone';
import { Button, ButtonClass, GUI, PageClass } from '@prodigelib/gui';
import { textWrapper } from '../../lib/textWrapper';



/**
 * Navigate back to a given page
 */
export const goBack = (Menu: GUI, previousPage: PageClass | string): ButtonClass => {
  return Button({
    id: 'arrow',
    slot: 18,
    name: { text: 'Go back', color: 'red' },
    onClick: () => Menu.toPage(previousPage)
  })
};

export namespace Mask {
  export function upperBlack() {
    const mask: ButtonClass[] = [];
    for (let i = 0; i <= 8; i++) {
      mask.push(Button({
        id: 'black_stained_glass_pane',
        slot: i,
        name: " "
      }));
    }
    return mask;
  }
  export function navbar() {
    const mask: ButtonClass[] = [];
    for (let i = 18; i <= 26; i++) {
      mask.push(Button({
        id: 'black_stained_glass_pane',
        slot: i,
        name: " ",
      }));
    }
    return mask;
  }

  export function gray() {
    const mask: ButtonClass[] = [];
    for (let i = 0; i <= 26; i++) {
      mask.push(Button({
        id: 'gray_stained_glass_pane',
        slot: i,
        name: " "
      }));
    }
    return mask;
  }

  export function Mask(): ButtonClass {
    throw new Error("Function not implemented.");
  }
}