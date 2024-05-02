import React from "@core/React"

let count = 1
function Counter({ num }) {
  const handleClick = () => {
    console.log("click")
    count++
    React.update()
  }

  return (
    <div>
      count: {count}
      <button onClick={handleClick}>click</button>
    </div>
  )
}

function App() {
  return (
    <div>
      hi-minApp
      <Counter num={10} />
    </div>
  )
}

export default App
