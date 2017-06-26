'use strict';
import * as vscode from 'vscode';
import { ComponentBrowser } from "./init";

export function activate(context: vscode.ExtensionContext) {

  new ComponentBrowser()

  console.log('Congratulations, your extension "component-browser" is now active!')

  let disposable = vscode.commands.registerCommand('extension.cb.init', () => {
    // Does Nothing
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {
}