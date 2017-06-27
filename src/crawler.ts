import { Component } from './component-browser';

export class ComponentBrowserCrawler {
  constructor(
    private components:Component[]
  ) {
    console.log('components', components);
  }
}