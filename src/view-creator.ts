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
    this.copyPlaceholder()
    this.createView()
  }

  createView() {
    let html = `
      <h1>Component Browser</h1>
    `;

    html += `<div class="components">`
    html += _.map(this.components, c => {
      return `
        <a href="${c.path}" class="component">
          <img class="preview" src="https://www.sketchappsources.com/resources/source-image/material_card_thanasis.png">
          <span class="title">${c.name}</span>
        </a>
      `
    }).join()
    html += `</div>`

    html += this.getCss()

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

  copyPlaceholder() {
    console.log(__dirname);
  }

  getCss() {
    const css = `
      .components {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap = wrap;
}

.component {
  width: 25%;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.component img {
  width: 100%;
}
    `

    return `
      <style>${css}</style>
    `
  }
}