import { Observable } from 'rxjs';
import { ComponentBrowserCrawler } from './crawler';
import { ComponentBrowserView } from './view';
'use strict';
import * as vscode from 'vscode';
import * as _ from 'lodash'
import * as nodepath from "path";
import { config } from "./config";
import { getFilePath, readFile } from "./file";

export interface Component {
  path: string,
  name: string,
  selector: string,
  box?: any,
  screenshotId?: string
}

export class ComponentBrowser {

  components = []
  view: ComponentBrowserView
  crawler: ComponentBrowserCrawler

  constructor() {
  }

  crawl() {
    return Observable.fromPromise(this.initComponents())
      .switchMap(() => {
        this.crawler = new ComponentBrowserCrawler(this.components)
        return this.crawler.start()
      })
      .do(() => this.view.createView())
      .catch(error => {
        if (error.message == "Chrome closed") return Observable.of(true)
        console.log("error", error);
        return Observable.of(false)
      })
  }

  initComponents() {
    this.components = this.readComponentsFromFile()
    return this.getAllFilePaths()
      .then(paths => _.map(paths, p => this.parsePath(p)))
      .then(newCs => this.mergeComponentLists(this.components, newCs))
      .then(() => this.view = new ComponentBrowserView(this.components))
  }

  mergeComponentLists(oldCs, newCs) {
    _.each(newCs, newC => {
      const oldC = _.find(oldCs, c => c.selector == newC.selector)

      // Not Found
      if (!oldC) {
        oldCs.push(newC)
        return
      }

      // Found Old Component, Edit it
      Object.assign(oldC, newC)
    })
  }

  readComponentsFromFile() {
    const path = getFilePath('components.json')
    try {
      return require(path)
    } catch (error) {
      return []
    }
  }

  getAllFilePaths() {
    return vscode.workspace.findFiles(config.searchString, config.excludeString)
      .then(files => files.map(f => f.path))
  }

  parsePath(path) {
    const p = nodepath.parse(path)
    const name = p.base.replace(config.ending, '')
    const selector = config.selectorPrefix + name;
    return {
      path,
      name,
      selector
    };
  }

  open() {
    const uri = "file://" + getFilePath("index.html");
    vscode.commands.executeCommand('vscode.previewHtml', uri, vscode.ViewColumn.One, "Component Browser")
  }


} 