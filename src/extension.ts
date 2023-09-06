// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { SidebarProvider } from "./SidebarProvider";
import {
  init,
  create,
  installMigrateConsul,
  isMigrateConsulWorkspace,
  isMigrateConsulInstalledGlobal,
} from "./util/util";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;

  if (workspacePath === undefined) {
    return;
  }

  const sidebarProvider = new SidebarProvider(context?.extensionUri, {
    workspacePath,
    isMigrateConsulProject: isMigrateConsulWorkspace(),
    isMigrateConsulInstalledGlobal: isMigrateConsulInstalledGlobal(),
  });
  let view = vscode.window.registerWebviewViewProvider(
    "migrate-consul-vscode-sidebar",
    sidebarProvider
  );
  context.subscriptions.push(view);

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "migrate-consul-vscode.new-project",
      async () => {
        await init(workspacePath);
      }
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "migrate-consul-vscode.new-migration",
      async (desc, key, value) => {
        await create(workspacePath, { desc, key, value });
      }
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "migrate-consul-vscode.install",
      async () => {
        await installMigrateConsul();
      }
    )
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
