import React from "@core/React"
import { it, expect, describe, beforeEach, vi } from "vitest"

describe("core/React/update", () => {
  describe("manual update", () => {
    let count = 0
    const countCalled = vi.fn()
    let countUpdate
    const setCount = () => {
      count++
      countUpdate()
    }
    function Counter() {
      countCalled()
      countUpdate = React.update()
      return <div>{count}</div>
    }

    let foo = 0
    const fooCalled = vi.fn()
    let fooUpdate
    const setFoo = () => {
      foo++
      fooUpdate()
    }
    function Foo() {
      fooCalled()
      fooUpdate = React.update()
      return <div>{foo}</div>
    }
    beforeEach(() => {
      count = 0
      foo = 0
      countCalled.mockClear()
      fooCalled.mockClear()
    })
    it("should update function component when called React.update", () => {
      const root = document.createElement("div")
      function App() {
        return <Counter></Counter>
      }
      React.render(<App />, root)
      setCount()
      expect(count).toBe(1)
      expect(root).toMatchSnapshot()
    })

    it("should update specific function component when called React.update", () => {
      const root = document.createElement("div")
      function App() {
        return (
          <div>
            <Counter></Counter>
            <Foo></Foo>
          </div>
        )
      }
      React.render(<App />, root)
      countCalled.mockClear()
      fooCalled.mockClear()
      setCount()
      expect(count).toBe(1)
      expect(fooCalled).toBeCalledTimes(0)
      expect(countCalled).toBeCalledTimes(1)
    })
  })
})
