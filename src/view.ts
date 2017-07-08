import { Component } from './component-browser';
import * as _ from 'lodash'
import * as fs from "fs";
import { config } from "./config";
import * as nodepath from "path";
import * as mkdirp from "mkdirp";
import * as vscode from 'vscode';
import { getFilePath, getFolderPath, writeFile } from "./file";

export class ComponentBrowserView {
  constructor(
    private components: Component[]
  ) {
    mkdirp.sync(getFolderPath())
    this.copyPlaceholder()
  }

  createView() {
    let html = this.getHtml()
    html += this.getCss()
    writeFile("index.html", html)
  }

  open() {
    const uri = "file://" + getFilePath("index.html");
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
          <img class="preview" src="${this.getScreenshotUrl(c)}">
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

  copyPlaceholder() {
    const placeholder = this.readAsset('placeholder.png')
    writeFile('placeholder.png', placeholder)
  }

  readAsset(asset) {
    const path = nodepath.join(__dirname, "..", "..", "assets", asset)
    return fs.readFileSync(path)
  }

  getScreenshotUrl(component: Component) {
    console.log('component', component);
    if (!component.screenshotId) return "placeholder.png"
    return getFilePath(`screenshots/${component.screenshotId}.png`)
  }
}