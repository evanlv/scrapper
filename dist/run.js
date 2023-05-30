'use strict';

var prompts = require('@inquirer/prompts');
var puppeteer = require('puppeteer');
var UserAgent = require('user-agents');

const newUserAgent = new UserAgent().toString()
;(async () => {
  console.dir("⚠️  Disclaimer: This tool is only for personnal use ⚠️");
  const answer = await prompts.input({ message: "Which manga are you looking for?" });
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const page = await browser.newPage();
  await page.setUserAgent(newUserAgent);
  const website = `https://www.japscan.lol/manga/${answer}/`;
  await page.goto(website, {
    waitUntil: "domcontentloaded",
  });
  console.log(`Welcome to ${website.split(".")[1]}\n`);
  console.log(`You are looking for ${answer} scans.`);
  const selector = "div#chapters_list > div#collapse-1 > div > a";
  const url = await page.$$eval(selector, (elements) => {
    const links = elements.filter((el) => el.href).map((el) => el.href);
    return links
  });
  console.log(`Here, the last ${url.length} chapters:\n`);
  console.log("Click on the chapter you want read");
  console.log(url);
  console.log("Enjoy~~\n");
  await browser.close();
})();
