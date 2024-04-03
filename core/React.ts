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

function createDom(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type)
}

function updateProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      dom[key] = props[key]
    }
  })
}

function initChildren(fiber, children) {
  // 转换链表
  let preChild = null as any
  children?.forEach((child: any, index: number) => {
    const newFiber = {
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
      preChild.sibling = newFiber
    }

    preChild = newFiber
  })
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)]
  initChildren(fiber, children)
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber.type)
    updateProps(fiber.dom, fiber.props)
  }
  const children = fiber.props.children
  initChildren(fiber, children)
}

let nextWorkOfUnit = null as any
let root
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

function performWorkOfUnit(fiber) {
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

  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling
    nextFiber = nextFiber.parent
  }
}

function commitRoot() {
  commitWork(root.child)
}

function commitWork(fiber) {
  if (!fiber) {
    return
  }
  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }
  if (fiber.dom) {
    fiberParent.dom.append(fiber.dom)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function render(el: any, container: HTMLElement) {
  root = nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  }

  requestIdleCallback(workLoop)
}

const React = {
  render,
  createElement,
}

export default React
