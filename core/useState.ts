import React, { wipFiber } from "./React"

let stateHooks = [] as any[]
let stateHookIndex = 0
export const setStateHooks = (val) => (stateHooks = val)
export const setStateHookIndex = (val) => (stateHookIndex = val)

export function useState(initial) {
  const currentFiber = wipFiber
  const oldHooks = currentFiber?.alternate?.stateHooks
  const currentState = oldHooks?.[stateHookIndex].state || initial
  const stateHook = {
    state: currentState,
    queue: [] as any,
  }

  oldHooks?.[stateHookIndex].queue.forEach((action) => {
    stateHook.state = action(stateHook.state)
  })

  stateHookIndex++
  stateHooks.push(stateHook)
  currentFiber && (currentFiber.stateHooks = stateHooks)

  const update = React.update()
  let timer
  function setState(action) {
    stateHook.queue.push(action)
    clearTimeout(timer)
    timer = setTimeout(() => {
      update()
    })
  }

  return [stateHook.state, setState]
}
