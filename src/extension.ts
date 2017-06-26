'use strict';
import * as vscode from 'vscode';
import { init } from "./init";

export function activate(context: vscode.ExtensionContext) {

  console.log('Congratulations, your extension "component-browser" is now active!');

  let disposable = vscode.commands.registerCommand('extension.cb.init', () => {
    init()
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {
}