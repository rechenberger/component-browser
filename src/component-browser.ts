import { Observable } from 'rxjs';
import { ComponentBrowserCrawler } from './crawler';
import { ComponentBrowserView } from './view';
'use strict';
import * as vscode from 'vscode';
import * as _ from 'lodash'
import * as nodepath from "path";
import { config } from "./config";
import { getFilePath } from "./file";

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
    Observable.fromPromise(this.initComponents())
      .switchMap(() => {
        this.crawler = new ComponentBrowserCrawler(this.components)
        return this.crawler.start()
      })
      .do(() => this.view.createView())
      .subscribe(() => null)
  }

  initComponents() {
    // TODO: get old component data from json
    return this.getAllFilePaths()
      .then(paths => _.map(paths, p => this.parsePath(p)))
      .then(components => this.components = components)
      .then(() => {
        this.view = new ComponentBrowserView(this.components);
      })

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