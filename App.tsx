import React from "@core/React"

function Counter({ num }) {
  return <div>count: <Number num={num} /></div>
}

function Number({ num }) {
  return <span>number: {num}</span>
}


function App() {
  return <div>hi-minApp
    <Counter num={10} />
    <Counter num={20} />
  </div>
}


export default App
