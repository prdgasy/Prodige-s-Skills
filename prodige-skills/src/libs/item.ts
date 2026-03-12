import { ITEMS } from "./types"

export class Item {
  id: ITEMS
  name?: string
  lore?: string[]
  components?: string[]


  constructor(itemId: ITEMS, name?: string, lore?: string[], components?: string[]) {
    this.id = itemId
    this.name = name
    this.lore = lore
    this.components = components
  }

  convertLore(): string[] {
    const loreEmit: string[] = []
    if (this.lore) {
      this.lore.forEach(line => {
        loreEmit.push(`'{"text":"${line}"}'`)
      })
    }
    return loreEmit
  }

  toString() {
    const loreEmit = this.convertLore()
    if (this.components) {
      return `${this.id}[${this.components.toString()},custom_name='{"text":"${this.name}"}', lore=[${loreEmit.toString()}]]`
    } else {
      return `${this.id}[custom_name='{"text":"${this.name}"}', lore=[${loreEmit.toString()}]]`
    }

  }
}