import React from "@core/React"
import { useEffect } from "@core/useEffect"
import { useState } from "@core/useState"
import { it, expect, describe, vi } from "vitest"
describe("core/useEffect", () => {
  it("should run callback after mounted", () => {
    const root = document.createElement("div")
    const cb = vi.fn()
    function Counter() {
      useEffect(() => {
        cb()
      }, [])
      return <div></div>
    }
    Counter()
    expect(cb).toBeCalledTimes(0)
    React.render(<Counter />, root)
    expect(cb).toBeCalledTimes(1)
  })

  it("should run callback when component updated without deps", () => {
    const root = document.createElement("div")
    vi.useFakeTimers()
    const cb = vi.fn()
    let setState
    function Counter() {
      const [count, setCount] = useState(1)
      setState = setCount
      useEffect(() => {
        cb()
      })
      return <div></div>
    }
    React.render(<Counter />, root)
    expect(cb).toBeCalledTimes(1)
    // 更新后
    setState(2)
    vi.runAllTimers()
    expect(cb).toBeCalledTimes(2)
  })

  it("should run callback once with empty deps", () => {
    const root = document.createElement("div")
    vi.useFakeTimers()
    const cb = vi.fn()
    let setState
    function Counter() {
      const [count, setCount] = useState(1)
      setState = setCount
      useEffect(() => {
        cb()
      }, [])
      return <div></div>
    }
    React.render(<Counter />, root)
    expect(cb).toBeCalledTimes(1)
    // 更新后
    setState(2)
    vi.runAllTimers()
    expect(cb).toBeCalledTimes(1)
  })

  it("should run callback again when deps state updated", () => {
    const root = document.createElement("div")
    vi.useFakeTimers()
    const cb = vi.fn()
    let setState
    let state
    function Counter() {
      const [count, setCount] = useState(1)
      state = count
      setState = setCount
      useEffect(() => {
        cb()
      }, [count])
      return <div></div>
    }
    React.render(<Counter />, root)
    expect(cb).toBeCalledTimes(1)
    // 更新后
    setState(2)
    vi.runAllTimers()
    expect(state).toBe(2)
    expect(cb).toBeCalledTimes(2)
  })
})
