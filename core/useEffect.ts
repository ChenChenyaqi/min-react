import { wipFiber } from "./React"
import { Fiber } from "./types"

let effectHooks = [] as any[]
export const resetEffectHooks = () => (effectHooks = [])
export function useEffect(cb, deps?) {
  const effectHook = {
    callback: cb,
    deps,
  }

  effectHooks.push(effectHook)

  wipFiber && (wipFiber.effectHooks = effectHooks)
}

export function commitEffect(wipRoot?: Fiber) {
  if (!wipRoot) {
    return
  }
  const oldFiber = wipRoot.alternate
  const oldEffectHooks = oldFiber?.effectHooks
  const effectHooks = wipRoot.effectHooks

  effectHooks?.forEach((effectHook, effectHookIndex) => {
    if (!oldFiber || !effectHook.deps) {
      effectHook?.callback?.()
    } else {
      const needUpdated = oldEffectHooks?.[effectHookIndex]?.deps?.some(
        (dep, index) => {
          return dep !== effectHook?.deps?.[index]
        }
      )
      needUpdated && effectHook?.callback?.()
    }
  })

  commitEffect(wipRoot.child!)
  commitEffect(wipRoot.sibling!)
}
