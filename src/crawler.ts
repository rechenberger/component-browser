import { Component } from './component-browser';
import { startCDP } from "./cdp";
import { writeFile } from "./file";
import { config } from "./config";
import * as _ from 'lodash'


export class ComponentBrowserCrawler {

  screenshotId: string

  constructor(
    private components: Component[]
  ) {
    // this.start()
  }

  start() {

    console.log('this.components', this.components);

    return startCDP()
      .do((client) => console.log('got client'))

      // TODO: Multiple Times for Route Changes etc.
      .do(() => this.screenshotId = Date.now().toString())

      // Wait for page to load
      .delay(config.delay)

      // Find Components
      .switchMap(client => this.findComponents(client))

      // Save Components
      .do(() => writeFile('components.json', JSON.stringify(this.components, null, 2)))
      .do(() => console.log("saved components"))

      // Make and Save Screenshot
      .switchMap(client => this.makeScreenshot(client))
      .do(data => writeFile(`screenshots/${this.screenshotId}.png`, data.buffer, 'base64'))

    // .subscribe(() => null)
  }

  async makeScreenshot(client) {
    // Force Viewport
    await client.Emulation.setVisibleSize({ width: config.viewportWidth, height: config.viewportHeight });
    // await client.Emulation.forceViewport({ x: 0, y: 0, scale: 1 });

    const format = config.format
    const screenshot = await client.Page.captureScreenshot({ format });
    const buffer = new Buffer(screenshot.data, 'base64');
    const data = {
      screenshot,
      buffer
    }
    return data;
  }

  async findComponents(client) {
    const DOM = client.DOM;
    const { root: { nodeId: documentNodeId } } = await DOM.getDocument();

    return Promise.all(_.map(this.components, async (component: Component) => {

      const compNode = await DOM.querySelector({
        selector: component.selector,
        nodeId: documentNodeId,
      });

      const compNodeId = compNode.nodeId

      if (!compNodeId) return

      const box = await this.getBoxModel(client, compNodeId)
      // console.log('box', component.selector, this.boxHasSize(box));
      component.box = box;
      component.screenshotId = this.screenshotId;

    })).then(() => client)
  }

  async getBoxModel(client, nodeId) {
    const { DOM } = client;
    try {
      // Get Box
      const boxModel = await DOM.getBoxModel({ nodeId })
      const box = boxModel.model

      // Return if box has Size      
      if (this.boxHasSize(box)) return box;

      // Try to get first child
      const firstChild = DOM.querySelector({
        selector: ':first-child',
        nodeId
      })
      if (!firstChild || !firstChild.nodeId) return null
      // return the child's size
      return await this.getBoxModel(client, firstChild.nodeId)
    } catch (error) {
      console.log("error", error)
      return "error";
    }
    // const firstChild: any = DOM.requestChildNodes({ nodeId })
  }

  boxHasSize(box: any) {
    if (!box) return false;
    if (!box.width) return false;
    if (!box.height) return false;
    return true;
  }
}