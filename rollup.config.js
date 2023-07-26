import nodeResolve from "@rollup/plugin-node-resolve"
import executable from "rollup-plugin-executable"
import cleanup from "rollup-plugin-cleanup"
import commonjs from "@rollup/plugin-commonjs"

const rollupConfig = {
  input: "./src/run.js",
  output: {
    file: "dist/japScrap.js",
    format: "cjs",
    exports: "auto",
    globals: {
      "@inquirer/prompts": "input",
      puppeteer: "puppeteer",
      "user-agents": "UserAgent",
    },
  },
  plugins: [nodeResolve(), executable(), cleanup(), commonjs()],
  external: ["puppeteer", "user-agents", "@inquirer/prompts"],
}
export default rollupConfig
