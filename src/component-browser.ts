import { ComponentBrowserCrawler } from './crawler';
import { ComponentBrowserView } from './view';
'use strict';
import * as vscode from 'vscode';
import * as _ from 'lodash'
import * as nodepath from "path";
import { config } from "./config";

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

  constructor() {
    this.initComponents()
      .then(() => new ComponentBrowserCrawler(this.components))
  }

  initComponents() {
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
    this.view.open()
  }


} 