import React, { wipFiber } from "./React"

let stateHooks = [] as any[]
let stateHookIndex = 0
export const setStateHooks = (val) => (stateHooks = val)
export const setStateHookIndex = (val) => (stateHookIndex = val)

export function useState(initial) {
  const currentFiber = wipFiber
  const oldHooks = currentFiber?.alternate?.stateHooks
  const stateHook = {
    state: oldHooks?.[stateHookIndex].state || initial,
  }

  stateHookIndex++
  stateHooks.push(stateHook)
  currentFiber && (currentFiber.stateHooks = stateHooks)

  const update = React.update()

  function setState(action) {
    const res = action(stateHook.state)
    stateHook.state = res
    update()
  }

  return [stateHook.state, setState]
}
