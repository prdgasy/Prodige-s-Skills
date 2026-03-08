import { MCFunction } from 'sandstone'

let anonId = 0
export function ANF<T extends any[]>(
  fn: (...args: T) => void
) {
  return MCFunction(`__functions/anonymous/${anonId}`, (_loop: any, ...args: T) => fn(...args))
}