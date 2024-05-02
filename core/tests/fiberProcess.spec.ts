import { performWorkOfUnit } from "@core/fiberProcess"
import { it, expect, describe, vi } from "vitest"
import type { Fiber } from "@core/types"
import {
  updateFunctionComponent,
  updateHostComponent,
} from "@core/renderProcess"

vi.mock("../renderProcess.ts")
const mockUpdateFunctionComponent = vi.fn()
const mockUpdateHostComponent = vi.fn()
vi.mocked(updateFunctionComponent).mockImplementation(
  mockUpdateFunctionComponent
)
vi.mocked(updateHostComponent).mockImplementation(mockUpdateHostComponent)
describe("test fiberProcess", () => {
  it("can process Function Component", () => {
    const fiber: Fiber = {
      type: () => {},
      props: {
        children: [],
      },
    }

    const nextFiber = performWorkOfUnit(fiber)
    expect(mockUpdateFunctionComponent).toBeCalled()
    expect(nextFiber).toEqual(null)
  })

  it("can process Host Component", () => {
    const fiber: Fiber = {
      type: "div",
      props: {
        children: [],
      },
    }

    const nextFiber = performWorkOfUnit(fiber)
    expect(mockUpdateFunctionComponent).toBeCalled()
    expect(nextFiber).toEqual(null)
  })

  it("当没有子节点以及兄弟节点时，可以向上返回父级的兄弟节点", () => {
    const props = {
      children: [],
    }
    const root: Fiber = {
      type: "root",
      props,
    }
    const parent: Fiber = {
      type: "parent",
      props,
    }
    const parentSibling: Fiber = {
      type: "parentSibling",
      props,
    }
    const child: Fiber = {
      type: "child",
      props,
    }

    root.child = parent
    parent.parent = root
    parent.child = child
    child.parent = parent
    parent.sibling = parentSibling

    const nextFiber = performWorkOfUnit(child)
    expect(nextFiber?.type).toEqual(parentSibling.type)
  })

  it("可以按照 child、sibling、parent sibling的顺序依次返回", () => {
    const props = {
      children: [],
    }
    const root: Fiber = {
      type: "root",
      props,
    }
    const parent: Fiber = {
      type: "parent",
      props,
    }
    const parentSibling: Fiber = {
      type: "parentSibling",
      props,
    }
    const child: Fiber = {
      type: "child",
      props,
    }
    const childSibling: Fiber = {
      type: "childSibling",
      props,
    }

    root.child = parent
    parent.parent = root
    parent.child = child
    child.parent = parent
    child.sibling = childSibling
    childSibling.parent = parent
    parent.sibling = parentSibling

    const result: string[] = []
    let nextFiber: Fiber | null = root
    while (nextFiber) {
      nextFiber = performWorkOfUnit(nextFiber)
      if (nextFiber) {
        result.push(nextFiber.type as string)
      }
    }
    expect(result).toEqual(["parent", "child", "childSibling", "parentSibling"])
  })
})
