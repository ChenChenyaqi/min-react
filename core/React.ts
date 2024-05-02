import { createElementVNode as createElement } from "./utils"
import type { Fiber, VNode } from "./types"
import { updateProps } from "./renderProcess"
import { performWorkOfUnit } from "./fiberProcess"

let nextWorkOfUnit: Fiber | null = null
// work in progress
let wipRoot: Fiber | null
// 更新时需要
let currentRoot: Fiber | null
// 收集要删除的fiber
const deletions: Fiber[] = []

function workLoop(deadline: IdleDeadline) {
  let shouldYield = false
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit, deletions)

    shouldYield = deadline.timeRemaining() < 1
  }
  if (!nextWorkOfUnit && wipRoot) {
    // 统一提交
    commitRoot()
  }
  requestIdleCallback(workLoop)
}

function commitRoot() {
  deletions.forEach(commitDeletion)
  commitWork(wipRoot?.child)
  currentRoot = wipRoot
  wipRoot = null
  deletions.splice(0)
}

function commitDeletion(fiber: Fiber) {
  if (fiber.dom) {
    let parentFiber = fiber.parent
    while (!parentFiber?.dom) {
      parentFiber = parentFiber?.parent
    }
    // 删除dom
    parentFiber.dom.removeChild(fiber.dom)
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

function render(el: VNode, container: HTMLElement) {
  wipRoot = {
    dom: container,
    props: {
      children: [el],
    },
  }
  nextWorkOfUnit = wipRoot
  requestIdleCallback(workLoop)
}

function update() {
  wipRoot = {
    dom: currentRoot?.dom,
    props: (currentRoot as Fiber).props,
    alternate: currentRoot, // 绑定老的root
  }
  nextWorkOfUnit = wipRoot
  requestIdleCallback(workLoop)
}

const React = {
  render,
  createElement,
  update,
}

export default React
