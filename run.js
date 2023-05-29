import puppeteer from "puppeteer-extra"
import StealthPlugin from "puppeteer-extra-plugin-stealth"
import { executablePath } from "puppeteer"
import UserAgent from "user-agents"
import input from "@inquirer/input"

// Add this to open browser when running the script
const devPptConfig = {
  headless: false,
  slowMo: 50,
  defaultViewport: null,
  executablePath: executablePath(),
}

const newUserAgent = new UserAgent().toString()

puppeteer.use(StealthPlugin())
;(async () => {
  const answer = await input({ message: "Which manga are you looking for?" })

  const browser = await puppeteer.launch(
    { headless: "new" }
    // devPptConfig
  )
  console.log("⚠️  Disclaimer: This tool is only for personnal use ⚠️\n")

  const page = await browser.newPage()
  await page.setUserAgent(newUserAgent)

  const website = `https://www.japscan.lol/manga/${answer}/`
  await page.goto(website, {
    waitUntil: "domcontentloaded",
  })

  console.log(`Welcome to ${website.split(".")[1]}\n`)
  console.log(`You are looking for ${answer} scans.`)

  const selector = "div#chapters_list > div#collapse-1 > div > a"
  const url = await page.$$eval(selector, (elements) => {
    const links = elements.filter((el) => el.href).map((el) => el.href)
    return links
  })

  console.log(`Here, the last ${url.length} chapters:\n`)
  console.log("Click on the chapter you want read")
  console.log(url)

  console.log("Enjoy~~\n")

  await browser.close()
})()
