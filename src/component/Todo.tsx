import { useState } from "@core/useState"
import React from "../../core/React"
import { useTodo } from "./useTodo"
import "./todo.css"
import { useEffect } from "@core/useEffect"

function TodoItem({ todo, deleteTodo, unCompleteTodo, completeTodo }) {
  return (
    <li>
      <span className={todo.done ? "done" : "undone"}>{todo.name}</span>
      <button onClick={() => deleteTodo(todo.id)}>remove</button>
      {todo.done ? (
        <button onClick={() => unCompleteTodo(todo.id)}>unDone</button>
      ) : (
        <button onClick={() => completeTodo(todo.id)}>done</button>
      )}
    </li>
  )
}

export default function ToDo() {
  const [inputValue, setInputValue] = useState("")
  const {
    todoList,
    addTodo,
    deleteTodo,
    completeTodo,
    unCompleteTodo,
    loadTodoList,
    saveTodoList,
  } = useTodo()

  useEffect(() => {
    loadTodoList()
  }, [])
  return (
    <div>
      <h1>TODOS</h1>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}></input>{" "}
      <button onClick={() => addTodo(inputValue)}>add</button>
      <div>
        <button onClick={saveTodoList}>save</button>
      </div>
      <ul>
        {...todoList.map((todo) => {
          return (
            <TodoItem
              todo={todo}
              deleteTodo={deleteTodo}
              unCompleteTodo={unCompleteTodo}
              completeTodo={completeTodo}
            />
          )
        })}
      </ul>
    </div>
  )
}
