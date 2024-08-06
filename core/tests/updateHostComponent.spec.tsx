import { updateHostComponent } from "@core/renderProcess"
import * as renderProcess from "@core/renderProcess"
import { Fiber } from "@core/types"
import { it, expect, describe, vi } from "vitest"
import * as utils from "../utils"

describe("renderProcess/updateHostComponent", () => {
  it("should create dom by fiber.type", () => {
    const createDom = vi.fn()
    vi.spyOn(utils, "createDom").mockImplementation(createDom)
    vi.spyOn(renderProcess, "updateProps").mockImplementation(vi.fn())
    const fiber: Fiber = {
      type: "div",
      props: {
        children: [],
      },
    }
    updateHostComponent(fiber, [])
    expect(createDom).toBeCalledWith("div")
  })
})
