import { createElementVNode as createElement } from "./utils"
import type { Fiber, VNode } from "./types"
import { performWorkOfUnit } from "./fiberProcess"
import { commitDeletion, commitWork } from "./commit"

let nextWorkOfUnit: Fiber | null = null
// work in progress
let wipRoot: Fiber | null
// 当前处理的fiber
let wipFiber: Fiber | null
export const setWipFiber = (fiber: Fiber) => (wipFiber = fiber)
// 更新时需要
let currentRoot: Fiber | null
// 收集要删除的fiber
const deletions: Fiber[] = []

function workLoop(deadline: IdleDeadline) {
  let shouldYield = false
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit, deletions)

    // 更新时，更新结束点是下一个兄弟节点之前
    if (nextWorkOfUnit?.type === wipRoot?.sibling?.type) {
      break
    }

    shouldYield = deadline.timeRemaining() < 1
  }
  if (!nextWorkOfUnit && wipRoot) {
    // 统一提交
    commitRoot()
  }
  if (!__TEST__) {
    requestIdleCallback(workLoop)
  }
}

function commitRoot() {
  deletions.forEach(commitDeletion)
  commitWork(wipRoot?.child)
  currentRoot = wipRoot
  wipRoot = null
  deletions.splice(0)
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
  const currentFiber = wipFiber
  return () => {
    wipRoot = {
      ...currentFiber!,
      alternate: currentFiber, // 绑定老的fiber
    }
    nextWorkOfUnit = wipRoot
    requestIdleCallback(workLoop)
  }
}

const React = {
  render,
  createElement,
  update,
}

export default React
