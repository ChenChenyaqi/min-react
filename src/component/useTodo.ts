import { useState } from "@core/useState"

interface ToDoItem {
  id: string
  name: string
  done: boolean
}

export function useTodo() {
  const [todoList, setTodoList] = useState([])

  function addTodo(todoName: string) {
    if (!todoName) {
      return
    }
    setTodoList((preTodoList) => {
      return [
        ...preTodoList,
        {
          id: crypto.randomUUID(),
          name: todoName,
          done: false,
        },
      ]
    })
  }

  function deleteTodo(id: string) {
    if (!id) {
      return
    }
    setTodoList((preTodoList) => {
      return preTodoList.filter((todo) => todo.id !== id)
    })
  }

  function completeTodo(id: string) {
    if (!id) {
      return
    }
    setTodoList((preTodoList) => {
      return preTodoList.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            done: true,
          }
        } else {
          return todo
        }
      })
    })
  }

  function unCompleteTodo(id: string) {
    if (!id) {
      return
    }
    setTodoList((preTodoList) => {
      return preTodoList.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            done: false,
          }
        } else {
          return todo
        }
      })
    })
  }

  function loadTodoList() {
    const todoStr = localStorage.getItem("todoList")
    if (!todoStr) {
      return
    }
    const localTodoList = JSON.parse(todoStr)
    setTodoList(localTodoList)
  }

  function saveTodoList() {
    const todoStr = JSON.stringify(todoList)
    localStorage.setItem("todoList", todoStr)
  }

  return {
    todoList,
    addTodo,
    deleteTodo,
    completeTodo,
    unCompleteTodo,
    loadTodoList,
    saveTodoList,
  }
}
