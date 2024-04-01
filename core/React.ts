function createTextNode(text: string) {
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
      children: children.map((child) =>
        typeof child === "string" ? createTextNode(child) : child
      ),
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

function initChildren(fiber) {
  // 转换链表
  const children = fiber.props.children
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
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type))
  }

  updateProps(fiber.dom, fiber.props)

  initChildren(fiber)

  // 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child
  }

  if (fiber.sibling) {
    return fiber.sibling
  }

  return fiber.parent?.sibling
}

function commitRoot() {
  commitWork(root.child)
}

function commitWork(fiber) {
  if (!fiber) {
    return
  }
  fiber.parent.dom.append(fiber.dom)
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
