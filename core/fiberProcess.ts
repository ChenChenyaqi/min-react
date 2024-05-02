import { updateFunctionComponent, updateHostComponent } from "./renderProcess"
import type { Fiber } from "./types"

export function performWorkOfUnit(fiber: Fiber): Fiber | null {
  const isFunctionComponent = typeof fiber.type === "function"

  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  // 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child
  }

  if (fiber.sibling) {
    return fiber.sibling
  }

  let nextFiber: Fiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling
    nextFiber = nextFiber.parent as Fiber
  }
  return null
}
