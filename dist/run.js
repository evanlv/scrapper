'use strict';

var prompts = require('@inquirer/prompts');
var puppeteer = require('puppeteer');
var UserAgent = require('user-agents');

const newUserAgent = new UserAgent().toString();
const PAGE_SIZE = 10;
const paginate = (array, pageSize, pageNumber) => {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
}
;(async () => {
  console.dir("⚠️  Disclaimer: This tool is only for personnal use ⚠️");
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const page = await browser.newPage();
  await page.setUserAgent(newUserAgent);
  const answer = await prompts.input({ message: "Which manga are you looking for?" });
  const website = `https://www.japscan.lol/manga/${answer}/`;
  await page.goto(website, {
    waitUntil: "domcontentloaded",
  });
  console.log(`Welcome to ${website.split(".")[1]}\n`);
  console.log(`You are looking for ${answer} scans.`);
  const selector = "div#chapters_list > div.collapse > div > a";
  const url = await page.$$eval(selector, (elements) => {
    const links = elements.filter((el) => el.href).map((el) => el.href);
    return links
  });
  console.log(`Here, the last ${url.length} chapters:\n`);
  let currentPage = 1;
  let displayLinks = paginate(url, PAGE_SIZE, currentPage);
  console.log("Click on the chapter you want read");
  while (displayLinks.length > 0) {
    console.log("Click on the chapter you want to read:");
    console.log(displayLinks);
    console.log("Enjoy~~\n");
    const inputPrompt = await prompts.input({
      message: "Enter 'n' to view the next page, or press any key to exit",
    });
    if (inputPrompt === "n") {
      currentPage++;
      displayLinks = paginate(url, PAGE_SIZE, currentPage);
    } else {
      break
    }
  }
  await browser.close();
})();
