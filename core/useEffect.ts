import { wipFiber } from "./React"
import { Fiber } from "./types"

export function useEffect(cb, deps?) {
  const effectHook = {
    callback: cb,
    deps,
  }

  wipFiber && (wipFiber.effectHook = effectHook)
}

export function commitEffect(wipRoot?: Fiber) {
  if (!wipRoot) {
    return
  }
  const oldFiber = wipRoot.alternate
  const effectHook = wipRoot.effectHook
  if (!oldFiber || !effectHook?.deps) {
    effectHook?.callback?.()
  } else {
    const oldEffectHook = wipRoot.alternate?.effectHook
    const needUpdated = oldEffectHook?.deps?.some((dep, index) => {
      return dep !== wipRoot.effectHook?.deps?.[index]
    })
    needUpdated && effectHook?.callback?.()
  }
  commitEffect(wipRoot.child!)
  commitEffect(wipRoot.sibling!)
}
