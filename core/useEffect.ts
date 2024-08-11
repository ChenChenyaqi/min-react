import { wipFiber } from "./React"
import { Fiber } from "./types"

let effectHooks = [] as any[]
export const resetEffectHooks = () => (effectHooks = [])
export function useEffect(cb, deps?) {
  const effectHook = {
    callback: cb,
    deps,
    cleanup: undefined,
  }

  effectHooks.push(effectHook)

  wipFiber && (wipFiber.effectHooks = effectHooks)
}

export function commitEffect(wipRoot?: Fiber) {
  function run(fiber?: Fiber) {
    if (!fiber) {
      return
    }
    const oldFiber = fiber.alternate
    const oldEffectHooks = oldFiber?.effectHooks
    const effectHooks = fiber.effectHooks

    effectHooks?.forEach((effectHook, effectHookIndex) => {
      if (!oldFiber || !effectHook.deps) {
        effectHook.cleanup = effectHook.callback?.()
      } else {
        const needUpdated = oldEffectHooks?.[effectHookIndex]?.deps?.some(
          (dep, index) => {
            return dep !== effectHook?.deps?.[index]
          }
        )
        needUpdated && (effectHook.cleanup = effectHook.callback?.())
      }
    })
    run(fiber.child!)
    run(fiber.sibling!)
  }

  function runCleanup(fiber?: Fiber) {
    if (!fiber) {
      return
    }
    fiber.alternate?.effectHooks?.forEach((effectHook, effectHookIndex) => {
      if (effectHook.deps?.length > 0) {
        effectHook.cleanup?.()
      }
    })

    runCleanup(fiber.child!)
    runCleanup(fiber.sibling!)
  }

  runCleanup(wipRoot)
  run(wipRoot)
}
