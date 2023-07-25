import axios from "axios"
import path from "node:path"
import fs from "node:fs"
import puppeteer, { executablePath } from "puppeteer"
import UserAgent from "user-agents"

const newUserAgent = new UserAgent().toString()

//
;(async () => {
  // Launch a headless browser
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
    defaultViewport: null,
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  })

  // Create a new page
  const page = await browser.newPage()

  await page.setUserAgent(newUserAgent)

  // Navigate to the website
  const url = "https://www.japscan.lol/lecture-en-ligne/kingdom/723/"
  await page.goto(url)

  // Wait for the image element to load (adjust the selector if needed)
  const imageSelector = "img.img-fluid" // You may need to find the correct selector for the image
  await page.waitForSelector(imageSelector)

  // Get the image URL
  const imageURL = await page.$eval(imageSelector, (img) => img.src)

  // Download the image
  const imageFilename = path.basename(imageURL)
  const imagePath = path.join(process.cwd(), imageFilename)

  const response = await axios.get(imageURL, { responseType: "arraybuffer" })
  fs.writeFileSync(imagePath, response.data)

  console.log(`Image downloaded: ${imagePath}`)

  // Close the browser
  await browser.close()
})()
