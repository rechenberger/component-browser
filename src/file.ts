import { Component } from './component-browser';
import * as _ from 'lodash'
import * as fs from "fs";
import { config } from "./config";
import * as nodepath from "path";
import * as mkdirp from "mkdirp";
import * as vscode from 'vscode';

export function writeFile(name, content, encoding = "utf-8") {
  const parts = name.split('/')

  if (parts.length > 1) {
    const file = parts.pop();
    mkdir(parts)
  }

  const path = getFilePath(name)
  fs.writeFileSync(path, content, encoding)
}

export function mkdir(path: any[]) {
  mkdirp.sync(nodepath.join(
    getFolderPath(),
    ...path
  ));
}

export function getFolderPath() {
  return nodepath.join(
    vscode.workspace.rootPath,
    config.folderName
  )
}

export function getFilePath(filename = "index.html") {
  return nodepath.join(
    getFolderPath(),
    filename
  )
}

export function readFile(filename) {
  const path = getFilePath(filename)
  return fs.readFileSync(path)
}

export function getAllFilesInFolder(folder) {
  const path = getFilePath(folder)
  return fs.readdirSync(path)
}

export function deleteFile(filename) {
  const path = getFilePath(filename)
  fs.unlinkSync(path)
}