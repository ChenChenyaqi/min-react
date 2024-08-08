import { updateProps } from "@core/renderProcess"
import { it, expect, describe, vi } from "vitest"

describe("renderProcess/updateProps", () => {
  describe("add props", () => {
    it("should add props", () => {
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

  describe("remove props", () => {
    it("should remove props", () => {
      const div = document.createElement("div")
      const nextProps = {
        foo: "foo",
      }
      updateProps(div, nextProps)
      expect((div as any).foo).toBe(nextProps.foo)

      updateProps(div, {}, nextProps)
      expect((div as any).foo).toBeUndefined()
    })

    it("should remove onXXX events", () => {
      const div = document.createElement("div")
      const onClick = vi.fn()
      const nextProps = {
        onClick,
      }
      updateProps(div, nextProps)
      div.dispatchEvent(new MouseEvent("click"))
      expect(onClick).toBeCalledTimes(1)

      updateProps(div, {}, nextProps)
      div.dispatchEvent(new MouseEvent("click"))
      expect(onClick).toBeCalledTimes(1)
    })
  })

  describe("update props", () => {
    it("should update props", () => {
      const div = document.createElement("div")
      const nextProps = {
        foo: "foo",
        bar: "bar",
        baz: "baz",
      }
      updateProps(div, nextProps)
      expect((div as any).foo).toBe(nextProps.foo)

      updateProps(
        div,
        {
          foo: "foo1",
          baz: "baz",
          demi: "demi",
        },
        nextProps
      )
      expect((div as any).foo).toBe("foo1")
      expect((div as any).baz).toBe("baz")
      expect((div as any).demi).toBe("demi")
      expect((div as any).bar).toBeUndefined()
    })

    it("should update events", () => {
      const div = document.createElement("div")
      const onMouseup = vi.fn()
      const onMousedown = vi.fn()
      const nextProps = {
        onMouseup,
        onMousedown,
      }
      updateProps(div, nextProps)
      div.dispatchEvent(new MouseEvent("mouseup"))
      div.dispatchEvent(new MouseEvent("mousedown"))
      expect(onMouseup).toBeCalledTimes(1)
      expect(onMousedown).toBeCalledTimes(1)

      const onMouseup2 = vi.fn()
      const onMousemove = vi.fn()
      updateProps(
        div,
        {
          onMouseup: onMouseup2,
          onMousemove,
        },
        nextProps
      )
      div.dispatchEvent(new MouseEvent("mouseup"))
      div.dispatchEvent(new MouseEvent("mousedown"))
      div.dispatchEvent(new MouseEvent("mousemove"))
      expect(onMouseup2).toBeCalledTimes(1)
      expect(onMousedown).toBeCalledTimes(1)
      expect(onMousemove).toBeCalledTimes(1)
    })
  })
})
