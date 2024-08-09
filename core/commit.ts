import { updateProps } from "./renderProcess"
import { Fiber } from "./types"

export function commitDeletion(fiber: Fiber) {
  if (fiber.dom) {
    let parentFiber = fiber.parent
    if (!parentFiber) {
      return
    }
    while (!parentFiber!.dom) {
      parentFiber = parentFiber!.parent
    }
    // 删除dom
    parentFiber!.dom.removeChild(fiber.dom)
  } else {
    // 删除函数组件
    fiber.child && commitDeletion(fiber.child)
  }
}

export function commitWork(fiber?: Fiber | null) {
  if (!fiber) {
    return
  }
  let fiberParent = fiber.parent
  while (!fiberParent?.dom) {
    fiberParent = fiberParent?.parent
  }
  if (fiber.effectTag === "update") {
    updateProps(fiber.dom!, fiber.props, fiber.alternate?.props)
  } else if (fiber.effectTag === "placement") {
    if (fiber.dom) {
      ;(fiberParent.dom as HTMLElement).append(fiber.dom)
    }
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
