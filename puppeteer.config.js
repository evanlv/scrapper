import { join } from "node:path"

/**
 * @type {import("puppeteer").Configuration}
 */
const puppeteerConfig = {
  cacheDirectory: join(__dirname, ".cache", "puppeteer"),
}

console.log(puppeteerConfig.cacheDirectory)

export default puppeteerConfig
