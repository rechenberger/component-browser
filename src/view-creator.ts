import { Component } from './component-browser';
import * as _ from 'lodash'
import * as fs from "fs";
import { config } from "./config";
import * as nodepath from "path";
import * as mkdirp from "mkdirp";
import * as vscode from 'vscode';

export class ViewCreator {
  constructor(
    private components: Component[]
  ) {
    this.createView();
  }

  createView() {
    let html = `
      <h1>Component Browser</h1>
    `;

    html += _.map(this.components, c => {
      return `<a href="${c.path}">${c.name}</a>`
    }).join()

    

    const folderPath = nodepath.join(
      vscode.workspace.rootPath,
      config.folderName
    )

    mkdirp.sync(folderPath)

    const filePath = nodepath.join(
      folderPath,
      "index.html"
    )
    
    fs.writeFileSync(filePath, html)

    this.openView(filePath)
  }

  openView(filePath) {
    const uri = "file://" + filePath;
    vscode.commands.executeCommand('vscode.previewHtml', uri)
  }
}