import { Component } from './component-browser';
import { startCDP } from "./cdp";
import { writeFile } from "./file";


export class ComponentBrowserCrawler {
  constructor(
    private components: Component[]
  ) {
    this.start()
  }

  start() {
    startCDP()
      .do((data) => console.log('data', data))
      .do(data => {
        writeFile('output.png', data.buffer, 'base64')
        // file.writeFile('output.png', data.buffer, 'base64')
      })
      .subscribe(() => null)
  }
}