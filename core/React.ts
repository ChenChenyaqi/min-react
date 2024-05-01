function createTextNode(text: string | number) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

function createElement(
  type: string,
  props: Record<string, any> | null,
  ...children: any[]
): { type: string; props: { children: any[]; [propName: string]: any } } {
  return {
    type,
    props: {
      ...(props ?? {}),
      children: children.map((child) => {
        const isTextNode =
          typeof child === "string" || typeof child === "number"
        return isTextNode ? createTextNode(child) : child
      }),
    },
  }
}

function createDom(type: string) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type)
}

function updateProps(dom: HTMLElement | Text, props: Record<string, any>) {
  Object.keys(props).forEach((key) => {
    if (key === "children") return
    if (/^on/.test(key)) {
      const eventName = key.slice(2).toLowerCase()
      dom.removeEventListener(eventName, props[key])
      dom.addEventListener(eventName, props[key])
    } else {
      dom[key] = props[key]
    }
  })
}

function initChildren(fiber: Fiber, children) {
  // 转换链表
  let preChild: Fiber | null = null
  children?.forEach((child: any, index: number) => {
    const newFiber: Fiber = {
      type: child.type,
      props: child.props,
      parent: fiber,
      child: null,
      sibling: null,
      dom: null,
    }
    if (index === 0) {
      fiber.child = newFiber
    } else {
      ;(preChild as Fiber).sibling = newFiber
    }

    preChild = newFiber
  })
}

function updateFunctionComponent(fiber: Fiber) {
  const children = [(fiber.type as Function)(fiber.props)]
  initChildren(fiber, children)
}

function updateHostComponent(fiber: Fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber.type as string)
    updateProps(fiber.dom, fiber.props)
  }
  const children = fiber.props.children
  initChildren(fiber, children)
}

interface Fiber {
  type?: Function | string
  dom?: HTMLElement | Text | null
  props: {
    children: VNode[]
  }
  child?: Fiber | null
  sibling?: Fiber | null
  parent?: Fiber | null
}
let nextWorkOfUnit: Fiber | null = null
let root: Fiber | null
function workLoop(deadline: IdleDeadline) {
  let shouldYield = false
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)

    shouldYield = deadline.timeRemaining() < 1
  }
  if (!nextWorkOfUnit && root) {
    // 统一提交
    commitRoot()
    root = null
  }
  requestIdleCallback(workLoop)
}

function performWorkOfUnit(fiber: Fiber): Fiber | null {
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

function commitRoot() {
  commitWork(root?.child)
}

function commitWork(fiber?: Fiber | null) {
  if (!fiber) {
    return
  }
  let fiberParent = fiber.parent
  while (!fiberParent?.dom) {
    fiberParent = fiberParent?.parent
  }
  if (fiber.dom) {
    ;(fiberParent.dom as HTMLElement).append(fiber.dom)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

interface VNode {
  type: Function | string
  props: {
    children: any[]
  }
}

function render(el: VNode, container: HTMLElement) {
  root = nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  }
}

requestIdleCallback(workLoop)

const React = {
  render,
  createElement,
}

export default React
