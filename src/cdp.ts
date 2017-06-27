import * as CDP from 'chrome-remote-interface'
import * as file from 'fs'
import { Observable } from "rx-node";

// Args
const url = 'https://kolibri-29df0.firebaseapp.com/'
const format = 'png'
const viewportWidth = 1440
const viewportHeight = 900
const delay = 0
const userAgent = false
const fullPage = false

export function startCDP() {
  // Start the Chrome Debugging Protocol
  return  new Observable((obs) => {
    
    CDP(async function (client) {
    // Extract used DevTools domains.
    const { DOM, Emulation, Network, Page, Runtime } = client;

    // Enable events on domains we are interested in.
    await Page.enable();
    await DOM.enable();
    await Network.enable();

    // If user agent override was specified, pass to Network domain
    if (userAgent) {
      await Network.setUserAgentOverride({ userAgent });
    }

    // Set up viewport resolution, etc.
    const deviceMetrics = {
      width: viewportWidth,
      height: viewportHeight,
      deviceScaleFactor: 0,
      mobile: false,
      fitWindow: false,
    };
    await Emulation.setDeviceMetricsOverride(deviceMetrics);
    await Emulation.setVisibleSize({ width: viewportWidth, height: viewportHeight });

    // Navigate to target page
    await Page.navigate({ url });

    // Wait for page load event to take screenshot
    Page.loadEventFired(async () => {
      // If the `full` CLI option was passed, we need to measure the height of
      // the rendered page and use Emulation.setVisibleSize
      if (fullPage) {
        const { root: { nodeId: documentNodeId } } = await DOM.getDocument();
        const { nodeId: bodyNodeId } = await DOM.querySelector({
          selector: 'body',
          nodeId: documentNodeId,
        });
        const { model: { height } } = await DOM.getBoxModel({ nodeId: bodyNodeId });

        await Emulation.setVisibleSize({ width: viewportWidth, height: height });
        // This forceViewport call ensures that content outside the viewport is
        // rendered, otherwise it shows up as grey. Possibly a bug?
        await Emulation.forceViewport({ x: 0, y: 0, scale: 1 });
      }

      setTimeout(async function () {
        const screenshot = await Page.captureScreenshot({ format });
        const buffer = new Buffer(screenshot.data, 'base64');
        const data = {
          screenshot,
          buffer
        }
        obs.next(data)
        // file.writeFile('output.png', buffer, 'base64')
      }, delay);
    });
  }).on('error', err => {
    console.error('Cannot connect to browser:', err);
  });

  })
  
}

