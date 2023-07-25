import nodeResolve from "@rollup/plugin-node-resolve"
import executable from "rollup-plugin-executable"
import cleanup from "rollup-plugin-cleanup"

const rollupConfig = {
  input: "run.js",
  output: {
    file: "dist/runScrappe.js",
    format: "cjs",
    exports: "auto",
    globals: {
      "@inquirer/prompts": "input",
      puppeteer: "puppeteer",
      "user-agents": "UserAgent",
    },
  },
  plugins: [nodeResolve(), executable(), cleanup()],
  external: ["puppeteer", "user-agents", "@inquirer/prompts"],
}
export default rollupConfig
