import { Observable } from 'rxjs';
import { Component } from './component-browser';
import { startCDP } from "./cdp";
import { writeFile, getAllFilesInFolder, deleteFile } from "./file";
import { config } from "./config";
import * as _ from 'lodash'
import { exec } from "child_process";
import { inject } from "./injector";

export class ComponentBrowserCrawler {

  screenshotId: string
  client: any

  constructor(
    private components: Component[]
  ) {
    // this.start()
  }

  start() {

    console.log('this.components', this.components);

    return Observable.of(true)
      // Start Chrome and wait some time until it has started
      .switchMap(() => this.startChrome())
      .switchMap(() => Observable.timer(3 * 1000))

      // Start CDP
      .switchMap(() => startCDP())
      .do((client) => this.client = client)
      .do((client) => console.log('got client'))

      // TODO: Multiple Times for Route Changes etc.
      // .switchMap(() => Observable.interval(config.delay))
      .switchMap(() => inject(this.client))
      .do(() => this.screenshotId = Date.now().toString())

      // Find Components
      .switchMap(() => this.findComponents())

      // Save Components
      .do(() => writeFile('components.json', JSON.stringify(this.components, null, 2)))
      .do(() => console.log("saved components"))

      // Make and Save Screenshot
      .switchMap(() => this.makeScreenshot())
      .do(data => writeFile(`screenshots/${this.screenshotId}.png`, data.buffer, 'base64'))

      .finally(() => this.cleanUp())

    // .subscribe(() => null)
  }

  async makeScreenshot() {
    // Force Viewport
    await this.client.Emulation.setVisibleSize({ width: config.viewportWidth, height: config.viewportHeight });
    // await client.Emulation.forceViewport({ x: 0, y: 0, scale: 1 });

    const format = config.format
    const screenshot = await this.client.Page.captureScreenshot({ format });
    const buffer = new Buffer(screenshot.data, 'base64');
    const data = {
      screenshot,
      buffer
    }
    return data;
  }

  async findComponents() {
    const DOM = this.client.DOM;
    const { root: { nodeId: documentNodeId } } = await DOM.getDocument();

    return Promise.all(_.map(this.components, async (component: Component) => {

      const compNode = await DOM.querySelector({
        selector: component.selector,
        nodeId: documentNodeId,
      });

      const compNodeId = compNode.nodeId

      if (!compNodeId) return

      const box = await this.getBoxModel(compNodeId)
      // console.log('box', component.selector, this.boxHasSize(box));
      component.box = box;
      component.screenshotId = this.screenshotId;

    }))
  }

  async getBoxModel(nodeId) {
    // console.log("checking", nodeId)
    const { DOM } = this.client;
    try {
      // Get Box
      const boxModel = await DOM.getBoxModel({ nodeId })
      const box = boxModel.model

      // Return if box has Size      
      if (this.boxHasSize(box)) return box;
      // console.log("has no box, looking for children");

      // Try to get first child
      const firstChild = await DOM.querySelector({
        selector: ':first-child',
        nodeId
      })
      if (!firstChild || !firstChild.nodeId) return null
      // console.log('foundChild');
      // return the child's size
      return await this.getBoxModel(firstChild.nodeId)
    } catch (error) {
      if (error.message == "Could not compute box model.") {
        return "box-error";
      }
      console.log("error", error)
      return "error"

    }
    // const firstChild: any = DOM.requestChildNodes({ nodeId })
  }

  boxHasSize(box: any) {
    if (!box) return false;
    if (!box.width) return false;
    if (!box.height) return false;
    // if (!box.content) return false;
    // if (!box.content.length) return false;
    return true;
  }

  startChrome() {
    return new Observable(observer => {
      const command = config.chromeShellCommand;
      const chrome = exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          observer.error(error)
          return;
        }
        // console.log(`stdout: ${stdout}`);
        // console.log(`stderr: ${stderr}`);
      })
      console.log("Started Chrome")
      observer.next()
      chrome.addListener('exit', (code, signal) => {
        console.log('chrome closed');
        observer.error(new Error("Chrome closed"))
      })
      return () => {
        chrome.kill();
      }
    })
  }

  cleanUp() {
    console.log("cleaning up");
    const screenshotsUsed = _(this.components)
      .map(c => c.screenshotId)
      .uniq()
      .value()

    const allScreenshots = getAllFilesInFolder('screenshots')
    _(allScreenshots)
      .filter(s => {
        const id = s.split('.png')[0]
        return !screenshotsUsed.includes(id)
      })
      .each(s => deleteFile('screenshots/' + s))
  }
}