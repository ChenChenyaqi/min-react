import type { Fiber, VNode } from "./types"
import { createDom } from "./utils"

// 更新函数式组件
export function updateFunctionComponent(fiber: Fiber) {
  const children = [(fiber.type as Function)(fiber.props)]
  reconcileChildren(fiber, children)
}

// 更新普通dom
export function updateHostComponent(fiber: Fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber.type as string)
    updateProps(fiber.dom, fiber.props)
  }
  const children = fiber.props.children
  reconcileChildren(fiber, children)
}

// 更新props
export function updateProps(
  dom: HTMLElement | Text,
  nextProps?: Record<string, any>,
  preProps?: Record<string, any>
) {
  !nextProps && (nextProps = {})
  // 1.old 有 new 没有， 删除
  Object.keys(preProps || {}).forEach((key) => {
    if (key === "children") {
      return
    }
    if (!(key in nextProps)) {
      if (/^on/.test(key)) {
        const eventName = key.slice(2).toLowerCase()
        preProps && dom.removeEventListener(eventName, preProps[key])
      } else {
        ;(dom as HTMLElement).removeAttribute(key)
      }
    }
  })
  // 2.new 有 old 没有，添加
  // 3.new 有 old 有，修改
  Object.keys(nextProps).forEach((key) => {
    if (key === "children") {
      return
    }
    if (nextProps[key] !== preProps?.[key]) {
      if (/^on/.test(key)) {
        const eventName = key.slice(2).toLowerCase()
        if (preProps?.[key]) {
          dom.removeEventListener(eventName, preProps[key])
        }
        dom.addEventListener(eventName, nextProps[key])
      } else {
        dom[key] = nextProps[key]
      }
    }
  })
}

// 更新children
export function reconcileChildren(fiber: Fiber, children: VNode[]) {
  let oldChildFiber = fiber.alternate?.child
  // 转换链表
  let preChild: Fiber | null = null
  children?.forEach((child: any, index: number) => {
    const isSameType = oldChildFiber && oldChildFiber.type === child.type
    let newFiber: Fiber
    if (isSameType) {
      // update
      newFiber = {
        type: child.type,
        props: child.props,
        parent: fiber,
        child: null,
        sibling: null,
        dom: oldChildFiber?.dom,
        alternate: oldChildFiber,
        effectTag: "update",
      }
    } else {
      // create
      newFiber = {
        type: child.type,
        props: child.props,
        parent: fiber,
        child: null,
        sibling: null,
        dom: null,
        effectTag: "placement",
      }
    }

    if (oldChildFiber) {
      oldChildFiber = oldChildFiber.sibling
    }

    if (index === 0) {
      fiber.child = newFiber
    } else {
      ;(preChild as Fiber).sibling = newFiber
    }

    preChild = newFiber
  })
}
