import { updateProps } from "@core/renderProcess"
import { it, expect, describe, vi } from "vitest"

describe("renderProcess/updateProps", () => {
  describe("add props", () => {
    it("happy path", () => {
      const div = document.createElement("div")
      const nextProps = {
        foo: "foo",
      }
      updateProps(div, nextProps)
      expect((div as any).foo).toBe(nextProps.foo)
    })

    it("should add onXXX events", () => {
      const div = document.createElement("div")
      const onClick = vi.fn()
      const nextProps = {
        onClick,
      }
      updateProps(div, nextProps)
      div.dispatchEvent(new MouseEvent("click"))
      expect(onClick).toBeCalledTimes(1)
    })
  })
})
