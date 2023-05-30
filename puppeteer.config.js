import { join } from "path"

/**
 * @type {import("puppeteer").Configuration}
 */
const puppeteerConfig = {
  cacheDirectory: join(__dirname, ".cache", "puppeteer"),
}

console.log(puppeteerConfig.cacheDirectory)

export default puppeteerConfig
