'use strict';
import * as vscode from 'vscode';
import { ComponentBrowser } from "./component-browser";
import { startCDP } from "./cdp";

export function activate(context: vscode.ExtensionContext) {

  const cb = new ComponentBrowser()

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.cb.open', () => {
      cb.open()
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.cb.crawl', () => {
      cb.crawl()
    })
  )
}

export function deactivate() {
}