import { Component } from './component-browser';
import { startCDP } from "./cdp";

export class ComponentBrowserCrawler {
  constructor(
    private components:Component[]
  ) {
    this.start()
  }

  start() {
    startCDP()
      .do((data) => console.log('data', data))
      .subscribe(() => null)
  }
}