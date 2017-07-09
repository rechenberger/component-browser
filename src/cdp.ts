import * as CDP from 'chrome-remote-interface'
import * as file from 'fs'
import { Observable } from "rxjs"
import { config } from "./config";

export function startCDP() {
  // Start the Chrome Debugging Protocol
  return Observable.create((obs) => {

    CDP(async function (client) {
      // Extract used DevTools domains.
      const { DOM, Emulation, Network, Page, Runtime } = client;

      // Enable events on domains we are interested in.
      await Page.enable();
      await DOM.enable();
      await Network.enable();

      // If user agent override was specified, pass to Network domain
      if (config.userAgent) {
        const userAgent = config.userAgent;
        await Network.setUserAgentOverride({ userAgent });
      }

      // Set up viewport resolution, etc.
      const deviceMetrics = {
        width: config.viewportWidth,
        height: config.viewportHeight,
        deviceScaleFactor: 0,
        mobile: false,
        fitWindow: false,
      };
      await Emulation.setDeviceMetricsOverride(deviceMetrics);
      await Emulation.setVisibleSize({ width: config.viewportWidth, height: config.viewportHeight });

      // Navigate to target page
      const url = config.url;
      await Page.navigate({ url });

      // Wait for page load event to take screenshot
      Page.loadEventFired(async () => {

        obs.next(client);
        // obs.complete();

      });

      client.on("disconnect", () => {
        console.log("disconnect");
        obs.error(new Error("Chrome closed"));
      })
    }).on('error', err => {
      console.error('Cannot connect to browser:', err);
    });

  })

}

