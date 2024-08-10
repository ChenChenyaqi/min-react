import React from "@core/React"
import { useState } from "@core/useState"
import { it, expect, describe, vi } from "vitest"

describe("core/useState", () => {
  const root = document.createElement("div")
  it("should return state by initial", () => {
    let innerState
    function Counter() {
      const [count, setCount] = useState(1)
      innerState = count
      return <div>{count}</div>
    }
    React.render(<Counter />, root)
    expect(innerState).toBe(1)
  })

  it("should update state when call setState", () => {
    vi.useFakeTimers()
    let innerState
    let setState
    const counterCalled = vi.fn()
    function Counter() {
      const [count, setCount] = useState(1)
      innerState = count
      setState = setCount
      counterCalled()
      return <div>{count}</div>
    }
    React.render(<Counter />, root)
    setState((val) => val + 1)
    vi.runAllTimers()
    expect(innerState).toBe(2)
    expect(counterCalled).toBeCalledTimes(2)
  })

  it("should update two state when call setState", () => {
    vi.useFakeTimers()
    let innerCounterState
    let innerFooState
    let setCounterState
    let setFooState
    const counterCalled = vi.fn()
    function Counter() {
      const [count, setCount] = useState(1)
      const [foo, setFoo] = useState("foo")
      innerCounterState = count
      innerFooState = foo
      setCounterState = setCount
      setFooState = setFoo
      counterCalled()
      return (
        <div>
          {count} <span>{foo}</span>
        </div>
      )
    }
    React.render(<Counter />, root)
    counterCalled.mockClear()
    setCounterState((val) => val + 1)
    setFooState((val) => val + "foo")
    vi.runAllTimers()
    expect(innerCounterState).toBe(2)
    expect(innerFooState).toBe("foofoo")
    expect(counterCalled).toBeCalledTimes(2)
  })

  it("should bath update state when call setState", () => {
    vi.useFakeTimers()
    let innerCounterState
    let setCounterState
    const counterCalled = vi.fn()
    function Counter() {
      const [count, setCount] = useState(1)
      const [foo, setFoo] = useState("foo")
      innerCounterState = count
      setCounterState = setCount
      counterCalled()
      return (
        <div>
          {count} <span>{foo}</span>
        </div>
      )
    }
    React.render(<Counter />, root)
    counterCalled.mockClear()
    setCounterState((val) => val + 1)
    setCounterState((val) => val + 1)
    setCounterState((val) => val + 1)
    vi.runAllTimers()
    expect(innerCounterState).toBe(4)
    expect(counterCalled).toBeCalledTimes(1)
  })
})
