import { performWorkOfUnit } from "@core/fiberProcess"
import { Fiber } from "@core/types"
import { it, expect, describe, vi } from "vitest"
import React from "@core/React"
import { beforeEach } from "node:test"
import * as renderProcess from "@core/renderProcess"

const dom = document.createElement("div")
const updateFunctionComp = vi.fn()
const updateHostComp = vi.fn()
vi.spyOn(renderProcess, "updateFunctionComponent").mockImplementation(
  updateFunctionComp
)
vi.spyOn(renderProcess, "updateHostComponent").mockImplementation(
  updateHostComp
)
describe("fiberProcess/performWorkOfUnit", () => {
  beforeEach(() => {
    updateFunctionComp.mockClear()
    updateHostComp.mockClear()
  })
  it("happy path", () => {
    const App = () => {
      return <div></div>
    }
    const fiber: Fiber = {
      dom,
      props: {
        children: [<App />],
      },
    }
    performWorkOfUnit(fiber, [])
    expect(updateFunctionComp).toBeCalledTimes(0)
    expect(updateHostComp).toBeCalledTimes(1)
  })

  it("should return fiber child first", () => {
    const childFiber: Fiber = {} as any
    const sibling: Fiber = {} as any
    const fiber: Fiber = {
      dom,
      props: {
        children: [],
      },
      child: childFiber,
      sibling,
    }
    const res = performWorkOfUnit(fiber, [])
    expect(res).toBe(childFiber)
  })

  it("should return fiber sibling second when not child fiber", () => {
    const sibling: Fiber = {} as any
    const fiber: Fiber = {
      dom,
      props: {
        children: [],
      },
      child: sibling,
    }
    const res = performWorkOfUnit(fiber, [])
    expect(res).toBe(sibling)
  })

  it("should return parent's sibling when not child and sibling", () => {
    const sibling = {} as any
    const parent: Fiber = {
      parent: {
        sibling,
      },
    } as any
    const fiber: Fiber = {
      dom,
      props: {
        children: [],
      },
      parent,
    }
    const res = performWorkOfUnit(fiber, [])
    expect(res).toBe(sibling)
  })
})
