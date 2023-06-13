import { input } from "@inquirer/prompts"
import puppeteer from "puppeteer"
import UserAgent from "user-agents"
import chalk from "chalk"

// Add this to open browser when running the script
// const devPptConfig = {
//   headless: false,
//   slowMo: 50,
//   defaultViewport: null,
//   executablePath: executablePath(),
// }

const newUserAgent = new UserAgent().toString()
const PAGE_SIZE = 10

const paginate = (array, pageSize, pageNumber) => {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
}

;(async () => {
  console.log(
    chalk.yellow(
      "/!\\ Disclaimer: This tool is only for personnal use! /!\\ \n"
    )
  )

  const browser = await puppeteer.launch({
    headless: "new",
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  })
  9
  const page = await browser.newPage()

  await page.setUserAgent(newUserAgent)

  const answer = await input({ message: "Which manga are you looking for?" })
  const website = `https://www.japscan.lol/manga/${answer}/`
  await page.goto(website, {
    waitUntil: "domcontentloaded",
  })

  console.log(`Welcome to ${website.split(".")[1]}\n`)

  console.log(`You are looking for ${answer} scans.`)

  const selector = "div#chapters_list > div.collapse > div > a"
  const url = await page.$$eval(selector, (elements) => {
    const links = elements.filter((el) => el.href).map((el) => el.href)

    return links
  })

  console.log(`Here, the last ${url.length} chapters:\n`)

  let currentPage = 1
  let displayLinks = paginate(url, PAGE_SIZE, currentPage)

  while (displayLinks.length > 0) {
    console.log("Click on the chapter you want to read:")
    console.log(chalk.blue("To open an url, press cmd + click"))
    console.log(displayLinks)
    console.log("Enjoy~~\n")

    const inputPrompt = await input({
      message: "Enter 'n' to view the next page, or press any key to exit",
      default: "n",
    })

    if (inputPrompt === "n") {
      currentPage++
      displayLinks = paginate(url, PAGE_SIZE, currentPage)
    } else {
      break
    }
  }

  await browser.close()
})()
