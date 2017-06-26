'use strict';
import * as vscode from 'vscode';


export function init() {
  const searchString = "**/*.component.ts"
  const excludeString = "**/node_modules/**"

  vscode.workspace.findFiles(searchString, excludeString)
    .then(files => files.map(f => f.path))
    .then(console.log)

  
    vscode.window.showInformationMessage('Done');
}