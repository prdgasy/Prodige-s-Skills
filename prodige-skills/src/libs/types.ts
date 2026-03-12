import { give, MCFunction } from "sandstone"

type MCFunctionType = ReturnType<typeof MCFunction>
type ITEMS = Parameters<typeof give>[1]

export {
  MCFunctionType, ITEMS
}