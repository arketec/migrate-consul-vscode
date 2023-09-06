import * as vscode from "vscode";
import * as childProcess from "child_process";
import { promisify } from "util";
import { existsSync } from "fs";

const exec = promisify(childProcess.exec);
export async function installMigrateConsul() {
  await execute(`npm install --global typescript`);
  await execute(`npm install --global migrate-consul`);
}

export async function init(workspacePath: string | undefined) {
  if (workspacePath === undefined) {
    return;
  }
  await execute(`migrate-consul init ${workspacePath}`);
}
export async function create(
  workspacePath: string | undefined,
  { desc, key, value }: { desc: string; key: string; value: string }
) {
  if (workspacePath === undefined) {
    return;
  }
  await execute(
    `migrate-consul create ${
      desc
        ? desc
            .toLowerCase()
            .replace(/\s/g, "_")
            .replace(/[^a-z0-9_\-.]/g, "")
        : "new-migration"
    } --key "${key ?? "sample"}" --value "${
      value ?? "foo"
    }" --configPath ${workspacePath} --path ${workspacePath}`,
    true
  );
}

async function execute(cmd: string, open?: boolean) {
  try {
    const { stdout, stderr } = await exec(cmd);
    vscode.window.showInformationMessage(stdout);
    if (stderr) {
      vscode.window.showErrorMessage(stderr);
    }
    if (open) {
      await vscode.workspace
        .openTextDocument(
          stdout.replace("Generated migration file at ", "").trim()
        )
        .then((doc) => vscode.window.showTextDocument(doc));
    }
  } catch (e: any) {
    vscode.window.showErrorMessage(e.message);
  }
}

export function isMigrateConsulWorkspace() {
  return existsSync(
    `${vscode.workspace.workspaceFolders?.[0].uri.fsPath}/migrate-consul-config.jsonc`
  );
}

export function isMigrateConsulInstalledGlobal() {
  try {
    return childProcess
      .execSync("npm list -g migrate-consul")
      .toString("utf-8")
      .includes("migrate-consul");
  } catch {
    return false;
  }
}
