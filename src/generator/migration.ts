import { nowAsString } from "./date";
import { buildGenerate } from "./common";
import { window } from "vscode";
import migrationTemplate from "../templates/migration";

export async function generateMigration(
  workspacePath: string,
  desc: string,
  key: string,
  value: string,
  originalValue?: string
) {
  const target = `${workspacePath}/migrations/${nowAsString()}-${desc}.ts`;
  const logger = window.createOutputChannel("migrate-consul");
  logger.show();
  logger.appendLine(`Generating migration ${target} for ${key}`);

  await buildGenerate()({
    content: migrationTemplate(),
    target: target,
    props: {
      key: key,
      value: value,
      originalValue: originalValue,
      showExamples: false,
      debug: false,
      includeTypes: false,
      types: [],
      isSample: false,
    },
  });
  logger.appendLine(`Migration ${target} generated`);

  return target;
}
