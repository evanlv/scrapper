#!node

import puppeteer from "puppeteer-extra"
import StealthPlugin from "puppeteer-extra-plugin-stealth"
import { executablePath } from "puppeteer"
import UserAgent from "user-agents"

// Add this to open browser when running the script
const devPptConfig = {
  headless: false,
  slowMo: 50,
  defaultViewport: null,
  executablePath: executablePath(),
}

const manga = process.argv[2]
const website = `https://www.japscan.lol/manga/${manga}/`

const newUserAgent = new UserAgent().toString()

puppeteer.use(StealthPlugin())
;(async () => {
  const browser = await puppeteer.launch(
    { headless: "new" }
    // devPptConfig
  )
  console.log("⚠️  Disclaimer: This tool is only for personnal use ⚠️\n")

  const page = await browser.newPage()
  await page.setUserAgent(newUserAgent)

  await page.goto(website, {
    waitUntil: "domcontentloaded",
  })
  console.log(`Welcome to ${website.split(".")[1]}\n`)
  console.log(`You are looking for ${manga} scans.`)

  const selector = "div#chapters_list > div#collapse-1 > div > a"

  const url = await page.$$eval(selector, (elements) => {
    const links = elements.filter((el) => el.href).map((el) => el.href)
    return links
  })

  console.log("Click on chapter you want read")
  console.log(`Here, the last ${url.length} chapters:\n`)
  console.log(url)

  console.log("Enjoy~~\n")

  await browser.close()
})()
