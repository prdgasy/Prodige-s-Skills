import { Item } from "@src/types";
import { Label, LabelClass, NonEmptyString, tellraw } from "sandstone";

export class Title {
  public name: string;
  public description: string;
  public item: Item;
  public tag: LabelClass;

  constructor(name: string, description: string, item: Item) {
    this.name = name;
    this.description = description;
    this.item = item;
    this.tag = Label(this.name.toLowerCase().replace(" ", "") as NonEmptyString);
  }

  public unlock() {
    tellraw("@p", "Unlocked title" + this.name);

    this.tag("@s").add();
  }
}