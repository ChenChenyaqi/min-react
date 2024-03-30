import React from "./React"

const ReactDOM = {
  createRoot(container: HTMLElement) {
    return {
      render(App: any) {
        React.render(App, container)
      },
    }
  },
}

export default ReactDOM
