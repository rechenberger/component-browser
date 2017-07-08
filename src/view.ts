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

  getHtml() {
    let html = `
      <h1>Component Browser</h1>
    `;

    html += `<div class="components">`
    html += _.map(this.components, c => {
      let style = ''
      if (c.box) {
        const coords = _.map(c.box.content, (pixel, index) => {
          const hundredPercent = (index % 2) ? config.viewportHeight : config.viewportWidth
          const percent = pixel / hundredPercent
          return `${(percent) * 100}%`
        })
        const coordString = _.map(coords, (c, i) => {
          let s = c + '';
          if ((i < coords.length - 1)) {
            if ((i % 2) == 1) s += ','
            s += ' '
          }
          return s
        }).join('')
        const clipPath = `polygon(${coordString})`
        style += `clip-path: ${clipPath};`
      }
      return `
        <a href="${c.path}" class="component">
          <img class="preview original" src="${this.getScreenshotUrl(c)}">
          <img class="preview clipped" src="${this.getScreenshotUrl(c)}" style="${style}">
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
    if (!component.screenshotId) return "placeholder.png"
    return getFilePath(`screenshots/${component.screenshotId}.png`)
  }
}