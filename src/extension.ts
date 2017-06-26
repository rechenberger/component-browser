'use strict';
import * as vscode from 'vscode';
import { ComponentBrowser } from "./component-browser";

export function activate(context: vscode.ExtensionContext) {

  const cb = new ComponentBrowser()

  let disposable = vscode.commands.registerCommand('extension.cb.init', () => {
    // Does Nothing
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {
}