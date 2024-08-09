import { commitDeletion, commitWork } from "@core/commit"
import { Fiber } from "@core/types"
import { it, expect, describe, vi } from "vitest"
import * as renderProcess from "../renderProcess"

describe("commit", () => {
  describe("commit/commitDeletion", () => {
    it("should delete fiber from dom", () => {
      const childDom = createElement("div")
      const parentDom = createElement("div")
      parentDom.appendChild(childDom)
      const fiber: Fiber = {
        props: {
          children: [],
        },
        dom: childDom,
        parent: {
          props: {
            children: [],
          },
          dom: undefined,
          parent: {
            props: { children: [] },
            dom: parentDom,
          },
        },
      }
      expect(parentDom.children[0]).toBe(childDom)
      commitDeletion(fiber)
      expect(parentDom.children[0]).toBeUndefined()
    })

    it("should delete function component fiber dom", () => {
      const childDom = createElement("div")
      const parentDom = createElement("div")
      parentDom.appendChild(childDom)
      const fiber: Fiber = {
        props: {
          children: [],
        },
        parent: {
          props: {
            children: [],
          },
          dom: undefined,
          parent: {
            props: { children: [] },
            dom: parentDom,
          },
        },
      }
      const child = {
        props: { children: [] },
        dom: childDom,
        parent: fiber,
      }
      fiber.child = child
      expect(parentDom.children[0]).toBe(childDom)
      commitDeletion(fiber)
      expect(parentDom.children[0]).toBeUndefined()
    })
  })

  describe("commit/commitWork", () => {
    it("update fiber props", () => {
      const updateProps = vi.fn()
      vi.spyOn(renderProcess, "updateProps").mockImplementation(updateProps)
      const rootFiber: Fiber = {
        dom: createElement("div"),
        props: { children: [] },
      }
      const childFiber: Fiber = {
        props: {
          children: [],
        },
        effectTag: "update",
        parent: rootFiber,
        alternate: {
          props: {
            children: [],
          },
        },
      }

      commitWork(childFiber)
      expect(updateProps).toBeCalled()
    })
  })
})

function createElement(tag: string) {
  return document.createElement(tag)
}
