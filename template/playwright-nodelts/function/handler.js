'use strict'
const { chromium, devices } = require('playwright');

module.exports = async (event, context) => {
  const browser = await chromium.launch();

  const browserVersion = browser.version()
  console.log(`Started Chromium ${browserVersion}`)

  let page = await browser.newPage()
  let uri = "https://jonfriesen.ca"
  if(event.body && event.body.uri) {
    uri = event.body.uri
  }

  const response = await page.goto(uri)
  console.log("OK","for",uri,response.ok())

  let title = await page.title()
  const result = {
    "title": title
  }

  await browser.close()
  
  return context
    .status(200)
    .succeed(result)
}
