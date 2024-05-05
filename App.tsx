import React from "@core/React"

let showBar = false
function Counter() {
  // const foo = <div>foo</div>
  const foo = (
    <div>
      foo
      <div>child</div>
    </div>
  )
  function Foo() {
    return (
      <div>
        foo
        <div>child</div>
      </div>
    )
  }
  const bar = <p>bar</p>
  function handleShowBar() {
    showBar = !showBar
    React.update()
  }

  return (
    <div>
      Counter
      <div>{showBar ? bar : foo}</div>
      <button onClick={handleShowBar}>showBar</button>
    </div>
  )
}

function App() {
  return (
    <div>
      hi-minApp
      <Counter />
    </div>
  )
}

export default App
