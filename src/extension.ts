'use strict';
import * as vscode from 'vscode';
import { ComponentBrowser } from "./component-browser";
import { startCDP } from "./cdp";

export function activate(context: vscode.ExtensionContext) {

  const cb = new ComponentBrowser()

  let disposable = vscode.commands.registerCommand('extension.cb.open', () => {
    cb.open()
    // startCDP()
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {
}