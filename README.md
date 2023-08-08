# openfaas-playwright-template

> note: this template was based off and borrows heavily from the [alexellis/openfaas-puppeteer-template](https://github.com/alexellis/openfaas-puppeteer-template). I'd like to extend a special thank-you to Alex for the awesome work he has done. Please consider [supporting](https://github.com/sponsors/alexellis) him!

This [OpenFaaS template](https://www.openfaas.com/) uses a container image published by the [Playwright project](https://playwright.dev/docs/docker) to give you access to [Playwright](https://playwright.dev/). Playwright is a popular tool that can automate a headless web browsers for scraping fully-rendered web pages.

Use-cases:

* Run your end to end tests with mocha/jest against a real website
* Capture screenshots of sites and diff them
* Capture / scrape text from sites which have no API or are only rendered in the DOM
* Automate websites which have no API
* Create visual assets from HTML/CSS - like social sharing banners

Why do we need an OpenFaaS template? Templates provide an easy way to scaffold a microservice or function and to deploy that at scale on a Kubernetes cluster. The [faasd](https://github.com/openfaas/faasd) project also gives a way for small teams to get on the experience curve, without learning anything about Kubernetes.

OpenFaaS benefits / features:

* Extend timeouts to whatever you want
* Run asynchronously, and in parallel
* Get a callback with the result when done
* Limit concurrency with `max_inflight` environment variable in stack.yml
* Trigger from cron, or events
* Get metrics on duration, HTTP exit codes, scale out across multiple nodes
* Start small with [faasd](https://github.com/openfaas/faasd)

See also: [Playwright docs](https://playwright.dev)

## See the full tutorial on the OpenFaaS blog

## Quickstart

### Get OpenFaaS

[Deploy OpenFaaS](https://docs.openfaas.com/deployment/) to Kubernetes, or to faasd (single-node with just containerd)

### Create a function with the template and deploy it to OpenFaaS

```bash
faas-cli template pull https://github.com/jonfriesen/openfaas-playwright-template

faas-cli new --lang playwright-nodelts scrape-title --prefix jonfriesen

faas-cli up -f scrape-title.yml
```

### Example functions and invocations

#### Get the title of a webpage passed in via a JSON body

```javascript
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
```

```bash
echo '{"uri": "https://inlets.dev/blog"}' | faas-cli invoke scrape-title \
  --header "Content-type=application/json"
```

Alternatively run async:

```bash
echo '{"uri": "https://inlets.dev/blog"}' | faas-cli invoke scrape-title \
  --async \
  --header "Content-type=application/json"
```

Run async, post the response to another service or receiver function:

```bash
echo '{"uri": "https://inlets.dev/blog"}' | faas-cli invoke scrape-title \
  --async \
  --header "Content-type=application/json" \
  --header "X-Callback-Url=https://en98kppbwx32.x.pipedream.net"
```

## Emojis and more

For emojis add:

```yaml
    build_options:
      - emojis
```

For emojis and language packs add:

```yaml
    build_options:
      - emojis
      - languages
```

These packages will increase the size of the container image by 100-200MB.

## You may also like

### Serverless Node.js that you can run anywhere

Serverless doesn’t have to mean using a function, bring your favourite micro HTTP framework with you: [Serverless Node.js that you can run anywhere](https://www.openfaas.com/blog/serverless-nodejs/)

### faasd with TLS on DigitalOcean

* [Bring a lightweight Serverless experience to DigitalOcean with Terraform and faasd](https://www.openfaas.com/blog/faasd-tls-terraform/)

