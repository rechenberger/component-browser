'use strict';
import * as vscode from 'vscode';
import * as _ from 'lodash'
import * as nodepath from "path";

const ending = `.component.ts`
const searchString = `**/*${ending}`
const excludeString = `**/node_modules/**`
const selectorPrefix = `app-`

export class ComponentBrowser {

  components = []

  constructor() {
    this.initComponents();
  }

  initComponents() {
    this.getAllFilePaths()
      .then(paths => _.map(paths, p => this.parsePath(p)))
      .then(components => this.components = components)
      .then(data => console.log(data))

    vscode.window.showInformationMessage('Components Initialized');
  }

  getAllFilePaths() {
    return vscode.workspace.findFiles(searchString, excludeString)
      .then(files => files.map(f => f.path))
  }

  parsePath(path) {
    const p = nodepath.parse(path)
    const name = p.base.replace(ending, '')
    const selector = selectorPrefix + name;
    return {
      path,
      name,
      selector
    };
  }


} 