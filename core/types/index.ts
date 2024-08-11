interface VNode {
  type: Function | string
  props: {
    children: any[]
  }
}

interface Fiber {
  type?: Function | string
  dom?: HTMLElement | Text | null
  props: {
    children: VNode[]
  }
  child?: Fiber | null
  sibling?: Fiber | null
  parent?: Fiber | null
  alternate?: Fiber | null
  effectTag?: "placement" | "update"
  stateHooks?: {
    state: any
    queue: any[]
  }[]
  effectHooks?: {
    callback: () => any
    deps: any[]
  }[]
}

export type { VNode, Fiber }
