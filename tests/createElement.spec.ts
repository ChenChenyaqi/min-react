import React from "@core/React"
import { it, expect, describe } from "vitest"

describe("createElement", () => {
  it("props is null", () => {
    const el = React.createElement("div", null, "hi")
    expect(el).toEqual({
      type: "div",
      props: {
        children: [
          {
            type: "TEXT_ELEMENT",
            props: {
              nodeValue: "hi",
              children: [],
            },
          },
        ],
      },
    })
  })

  it("should return vDom", () => {
    const el = React.createElement("div", { id: "1" }, "hi")
    expect(el).toEqual({
      type: "div",
      props: {
        id: "1",
        children: [
          {
            type: "TEXT_ELEMENT",
            props: {
              nodeValue: "hi",
              children: [],
            },
          },
        ],
      },
    })
  })
})
