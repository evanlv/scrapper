import puppeteer from "puppeteer-extra"
import UserAgent from "user-agents"
import StealthPlugin from "puppeteer-extra-plugin-anonymize-ua"
import { input } from "@inquirer/prompts"

import paginate from "./paginate.js"

const newUserAgent = new UserAgent().toString()

puppeteer.use(StealthPlugin())

const website = "https://www.japscan.lol"
const searchInputSelector = "input#searchInput"
const firstItemSelector = "div#results a.list-group-item"
const chapterSelector = "div#chapters_list div.collapse div a"
const PAGE_SIZE = 10
const viewportWidth = 1280
const viewportHeight = 800

;(async () => {
  console.dir("Disclaimer: This tool is only for personal use!")

  const searchQuery = await input({
    message: "Which manga are you looking for?",
  })

  const browser = await puppeteer.launch({
    headless: "new",
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  })

  const page = await browser.newPage()

  await page.setUserAgent(newUserAgent)
  await page.setViewport({
    width: viewportWidth,
    height: viewportHeight,
  })
  await page.goto(website)
  await page.type(searchInputSelector, searchQuery)
  await page.waitForSelector(searchInputSelector)
  await page.keyboard.press("Enter")
  await page.waitForSelector(firstItemSelector)
  await page.click(firstItemSelector)
  await page.waitForSelector(chapterSelector)

  const chapterURL = await page.$$eval(chapterSelector, (elements) => {
    const links = elements.filter((el) => el.href).map((el) => el.href)

    return links
  })

  console.log(`\nWelcome to ${website.split(".")[1]}\n`)
  console.log(`You are looking for ${searchQuery} scans.`)
  console.log(`Here, the last ${chapterURL.length} chapters:\n`)

  let currentPage = 1
  let displayLinks = paginate(chapterURL, PAGE_SIZE, currentPage)

  while (displayLinks.length > 0) {
    console.log("Click on the chapter you want to read:")
    console.dir("To open a URL, press cmd + click (or double-click)")
    console.log(displayLinks)
    console.log("Enjoy~~\n")

    const inputPrompt = await input({
      message: "Enter 'n' to view the next page, or press 'q' to exit",
      default: "n",
    })

    if (inputPrompt === "n") {
      currentPage++
      displayLinks = paginate(chapterURL, PAGE_SIZE, currentPage)
    } else if (inputPrompt === "q") {
      break
    }
  }

  await browser.close()
})()
