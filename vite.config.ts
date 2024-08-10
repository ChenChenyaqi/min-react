import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: [path.resolve(__dirname, "./react.setup.ts")],
  },
  resolve: {
    alias: {
      "@core": path.resolve(__dirname, "./core"),
    },
  },
  define: {
    __TEST__:
      true &&
      process.env.NODE_ENV !== "development" &&
      process.env.NODE_ENV !== "product",
  },
})
