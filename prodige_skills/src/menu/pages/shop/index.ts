import { Button, Gui, PageClass } from "@prodigelib/gui";
import { textWrapper } from "@lib/textWrapper";
import { Items } from "./items";
import { Boosters } from "./booster";
import { Crates } from "./crates";
import { Titles } from "./titles";

export class Shop {
  public static getName() {
    return this.name;
  }

  public static init(g: Gui, p: PageClass) {
    const items = new Button(
      "emerald",
      10,
      "§a§l⚒ Items & Gear",
      [
        ...textWrapper("§7Discover exclusive equipment designed to enhance your skills."),
        "",
        "§a§lWhat's inside?",
        "§7• §fExclusive tools & weapons",
        "§7• §fCustom item abilities",
        "§7• §fSpecialized gear",
        "",
        "§e➜ Click to browse items!"
      ],
      () => g.switch(Items.getName())
    );

    const boosters = new Button(
      "experience_bottle",
      12,
      "§b§l✦ Boosters",
      [
        ...textWrapper("§7Accelerate your progression with powerful multipliers."),
        "",
        "§b§lAvailable boosts",
        "§7• §fSkill experience multipliers",
        "§7• §fSkill point multipliers",
        "",
        "§e➜ Click to explore boosts!"
      ],
      () => g.switch(Boosters.getName())
    );

    const crates = new Button(
      "ender_chest",
      14,
      "§6§l✧ Crates",
      [
        ...textWrapper("§7Open mysterious crates and discover valuable rewards."),
        "",
        "§6§lPossible rewards",
        "§7• §fCommon & legendary loot",
        "§7• §6Rare jackpot rewards",
        "§7• §eExclusive titles & points",
        "",
        "§e➜ Click to discover crates!"
      ],
      () => g.switch(Crates.getName())
    );

    const titles = new Button(
      "name_tag",
      16,
      "§d§l✦ Titles",
      [
        ...textWrapper("§7Show off your achievements with prestigious cosmetic titles."),
        "",
        "§d§lPersonalize your profile",
        "§7• §fSkill-themed titles",
        "§7• §fCustom chat prefixes",
        "§7• §fShowcase your progress",
        "",
        "§e➜ Click to customize titles!"
      ],
      () => g.switch(Titles.getName())
    );

    p.add(items, boosters, crates, titles);
    return p;
  }
}

