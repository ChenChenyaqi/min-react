import { reconcileChildren } from "@core/renderProcess"
import { Fiber, VNode } from "@core/types"
import { it, expect, describe } from "vitest"
describe("core/renderProcess/reconcileChildren", () => {
  describe("create child fiber", () => {
    it("can create one child fiber", () => {
      const fiber: Fiber = {
        props: {
          children: [],
        },
      }
      const children: VNode[] = [
        {
          type: "div",
          props: {
            children: [],
          },
        },
      ]
      reconcileChildren(fiber, children, [])
      expect(fiber.child?.type).toBe("div")
    })

    it("can create many child fiber and sibling", () => {
      const fiber: Fiber = {
        props: {
          children: [],
        },
      }
      const children: VNode[] = [
        {
          type: "div1",
          props: {
            children: [],
          },
        },
        {
          type: "div2",
          props: {
            children: [],
          },
        },
        {
          type: "div3",
          props: {
            children: [],
          },
        },
      ]
      reconcileChildren(fiber, children, [])
      expect(fiber.child?.type).toBe("div1")
      expect(fiber.child?.sibling?.type).toBe("div2")
      expect(fiber.child?.sibling?.sibling?.type).toBe("div3")
    })
  })

  describe("update child fiber", () => {
    it("can update same fiber", () => {
      const fiber: Fiber = {
        props: {
          children: [],
        },
      }
      const children: VNode[] = [
        {
          type: "div",
          props: {
            foo: "foo",
            children: [],
          } as any,
        },
      ]
      reconcileChildren(fiber, children, [])
      const newFiber: Fiber = {
        props: {
          children: [],
        },
        alternate: fiber,
      }
      const newChildren = [
        {
          type: "div",
          props: {
            bar: "bar",
            children: [],
          } as any,
        },
      ]
      reconcileChildren(newFiber, newChildren, [])
      expect(newFiber.child?.props).toEqual({
        bar: "bar",
        children: [],
      })
    })

    it("can update differ fiber and collect delete fiber", () => {
      const fiber: Fiber = {
        props: {
          children: [],
        },
      }
      const children: VNode[] = [
        {
          type: "div",
          props: {
            foo: "foo",
            children: [],
          } as any,
        },
      ]
      reconcileChildren(fiber, children, [])
      const newFiber: Fiber = {
        props: {
          children: [],
        },
        alternate: fiber,
      }
      const newChildren = [
        {
          type: "span",
          props: {
            bar: "bar",
            children: [],
          } as any,
        },
      ]
      const deletions = []
      reconcileChildren(newFiber, newChildren, deletions)
      expect(newFiber.child?.props).toEqual({
        bar: "bar",
        children: [],
      })
      expect(deletions.length).toBe(1)
      expect(deletions[0]).toBe(fiber.child)
    })
  })
})
