import { Component } from './component-browser';
import * as _ from 'lodash'
import * as fs from "fs";
import { config } from "./config";
import * as nodepath from "path";
import * as mkdirp from "mkdirp";
import * as vscode from 'vscode';

export function writeFile(name, content, encoding="utf-8") {
  fs.writeFileSync(this.getFilePath(name), content, encoding)
}

export function getFolderPath() {
  return nodepath.join(
    vscode.workspace.rootPath,
    config.folderName
  )
}

export function getFilePath(filename = "index.html") {
  return nodepath.join(
    this.getFolderPath(),
    filename
  )
}