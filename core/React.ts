function createTextNode(text: string) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

function createElement(
  type: string,
  props: Record<string, any> | null,
  ...children: any[]
): { type: string; props: { children: any[]; [propName: string]: any } } {
  return {
    type,
    props: {
      ...(props ?? {}),
      children: children.map((child) =>
        typeof child === "string" ? createTextNode(child) : child
      ),
    },
  }
}

function render(el: any, container: HTMLElement) {
  const { type, props } = el
  const dom =
    type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(type)

  if (props) {
    Object.keys(props).forEach((key) => {
      if (key !== "children") {
        dom[key] = props[key]
      }
    })

    const children = props.children
    children?.forEach((child: any) => {
      render(child, dom)
    })
  }

  container.append(dom)
}

const React = {
  render,
  createElement,
}

export default React
