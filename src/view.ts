import { Component } from './component-browser';
import * as _ from 'lodash'
import * as fs from "fs";
import { config } from "./config";
import * as nodepath from "path";
import * as mkdirp from "mkdirp";
import * as vscode from 'vscode';

export class ComponentBrowserView {
  constructor(
    private components: Component[]
  ) {
    this.createView()
    this.copyPlaceholder()
  }

  createView() {
    let html = this.getHtml()
    html += this.getCss()
    this.writeFile(html)
  }

  open() {
    const uri = "file://" + this.getFilePath();
    vscode.commands.executeCommand('vscode.previewHtml', uri, vscode.ViewColumn.One, "Component Browser")
  }

  getHtml() {
    let html = `
      <h1>Component Browser</h1>
    `;

    html += `<div class="components">`
    html += _.map(this.components, c => {
      return `
        <a href="${c.path}" class="component">
          <img class="preview" src="placeholder.png">
          <span class="title">${c.name}</span>
        </a>
      `
    }).join('')
    html += `</div>`
    return html
  }

  getCss() {
    const css = this.readAsset("style.css")
    return `
      <style>${css}</style>
    `
  }

  writeFile(html) {
    mkdirp.sync(this.getFolderPath())
    fs.writeFileSync(this.getFilePath(), html)
  }

  getFolderPath() {
    return nodepath.join(
      vscode.workspace.rootPath,
      config.folderName
    )
  }

  getFilePath(filename = "index.html") {
    return nodepath.join(
      this.getFolderPath(),
      filename
    )
  }


  copyPlaceholder() {
    const placeholder = this.readAsset('placeholder.png')
    fs.writeFileSync(this.getFilePath('placeholder.png'), placeholder)
  }

  readAsset(asset) {
    const path = nodepath.join(__dirname, "..", "..", "assets", asset)
    return fs.readFileSync(path)
  }
}