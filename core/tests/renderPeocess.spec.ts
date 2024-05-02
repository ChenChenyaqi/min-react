import { reconcileChildren, updateProps } from "@core/renderProcess"
import { Fiber, VNode } from "@core/types"
import { it, expect, describe, vi, beforeEach } from "vitest"

const mockRemoveEventListener = vi.fn()
const mockRemoveAttribute = vi.fn((key) => {
  delete dom[key]
})
const mockAddEventListener = vi.fn()

const rawDom = {
  removeEventListener: mockRemoveEventListener,
  removeAttribute: mockRemoveAttribute,
  addEventListener: mockAddEventListener,
}
let dom = {
  ...rawDom,
}

describe("test updateProps", () => {
  beforeEach(() => {
    dom = {
      ...rawDom,
    }
    mockAddEventListener.mockClear()
    mockRemoveAttribute.mockClear()
    mockRemoveEventListener.mockClear()
  })
  it("只有newProps，没有preProps，应该添加newProps", () => {
    const handleClick = () => {}
    const newProps = {
      id: "1",
      children: [],
      onClick: handleClick,
    }
    updateProps(dom as any, newProps)
    expect(dom).toEqual({
      id: "1",
      ...rawDom,
    })
    expect(mockAddEventListener).toBeCalledWith("click", handleClick)
    expect(mockRemoveEventListener).toBeCalledTimes(0)
    expect(mockRemoveAttribute).toBeCalledTimes(0)
  })

  it("只有preProps, 应该删除preProps", () => {
    const handleClick = () => {}
    const preProps = {
      id: "1",
      children: [],
      onClick: handleClick,
    }
    updateProps(dom as any, undefined, preProps)
    expect(dom).toEqual({
      ...rawDom,
    })
    expect(mockAddEventListener).toBeCalledTimes(0)
    expect(mockRemoveEventListener).toBeCalledWith("click", handleClick)
    expect(mockRemoveAttribute).toBeCalledWith("id")
  })

  it("同时有nextProps和preProps，应该更新props", () => {
    const handleClick = () => {}
    const handleClick2 = () => {}
    const handleBlur = () => {}
    const preProps = {
      id: "1",
      name: "chen",
      children: [],
      onClick: handleClick,
    }
    const nextProps = {
      name: "wang",
      age: 18,
      children: [],
      onClick: handleClick2,
      onBlur: handleBlur,
    }
    updateProps(dom as any, nextProps, preProps)

    expect(dom).toEqual({
      name: "wang",
      age: 18,
      ...rawDom,
    })
    expect(mockRemoveEventListener).toBeCalledWith("click", handleClick)
    expect(mockAddEventListener).toBeCalledWith("blur", handleBlur)
    expect(mockAddEventListener).toBeCalledWith("click", handleClick2)
    expect(mockAddEventListener).toBeCalledTimes(2)
  })
})

describe("test reconcileChildren", () => {
  it("挂载时，可以建立起child、parent、sibling的关系", () => {
    const props = {
      children: [],
    }
    const fiber: Fiber = {
      type: "root",
      props,
    }
    const children: VNode[] = [
      {
        type: "div",
        props,
      },
      {
        type: "span",
        props,
      },
    ]
    reconcileChildren(fiber, children)

    expect(fiber.child?.type).toBe("div")
    expect(fiber.child?.sibling?.type).toBe("span")
    expect(fiber.child?.parent?.type).toBe("root")
    expect(fiber.child?.sibling?.parent?.type).toBe("root")
    expect(fiber.child?.sibling?.child).toBe(null)
    expect(fiber.child?.sibling?.sibling).toBe(null)
    expect(fiber.child?.child).toBe(null)
  })

  it("更新时，可以建立alternate关系", () => {
    const props = {
      children: [],
    }
    const fiber: Fiber = {
      type: "root",
      props,
    }
    const divVNode = {
      type: "div",
      props,
    }
    const divVNode2 = {
      type: "div",
      props: {
        newTag: true,
        children: [],
      },
    }
    const spanVNode = {
      type: "span",
      props,
    }
    const spanVNode2 = {
      type: "span",
      props: {
        newTag: true,
        children: [],
      },
    }

    const children: VNode[] = [divVNode, spanVNode]
    const children2 = [divVNode2, spanVNode2]

    reconcileChildren(fiber, children)

    fiber.alternate = fiber
    reconcileChildren(fiber, children2)

    expect((fiber.child?.props as any).newTag).toBeTruthy()
    expect((fiber.child?.alternate?.props as any).newTag).toBeFalsy()
    expect((fiber.child?.sibling?.props as any).newTag).toBeTruthy()
    expect((fiber.child?.sibling?.alternate?.props as any).newTag).toBeFalsy()
  })
})
