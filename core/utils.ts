export function createTextVNode(text: string | number) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

export function createElementVNode(
  type: string,
  props: Record<string, any> | null,
  ...children: any[]
): { type: string; props: { children: any[]; [propName: string]: any } } {
  return {
    type,
    props: {
      ...(props ?? {}),
      children: children.map((child) => {
        const isTextNode =
          typeof child === "string" || typeof child === "number"
        return isTextNode ? createTextVNode(child) : child
      }),
    },
  }
}

export function createDom(type: string) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type)
}
