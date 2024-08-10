;(window as any).requestIdleCallback = (fn) => {
  fn({ timeRemaining: () => 2 })
}
