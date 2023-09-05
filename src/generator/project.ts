import { nowAsString } from "./date";
import { buildGenerate } from "./common";
import { filesystem } from "../filesystem/filesystem";
import { window } from "vscode";
import configTemplate from "../templates/config";
import typesTemplate from "../templates/types";
import migrationTemplate from "../templates/migration";
export async function generateProject(
  root: string,
  migrationRoot: string | { migrationsDirName: string }
) {
  const logger = window.createOutputChannel("migrate-consul");
  logger.show();
  if (!root) {
    logger.appendLine(`no root path found`);
    return false;
  }
  const rootPath = root;

  if (
    !migrationRoot ||
    (typeof migrationRoot === "object" && !migrationRoot.migrationsDirName)
  ) {
    logger.appendLine(`no migration directory found`);

    return false;
  }
  const migrationDir =
    typeof migrationRoot === "string"
      ? migrationRoot
      : migrationRoot.migrationsDirName;
  const generate = buildGenerate();

  if (!(await filesystem.existsAsync(`${rootPath}/${migrationDir}`))) {
    logger.appendLine(`creating migration directory ${migrationDir}`);
    await generate({
      content: migrationTemplate(),
      target: `${rootPath}/${migrationDir}/${nowAsString()}-sample.ts`,
      props: {
        key: "sample",
        value: "Hello from migrate-consul",
        showExamples: true,
        includeTypes: true,
        types: [],
        isSample: true,
      },
    });
  }
  if (!(await filesystem.existsAsync(`${rootPath}/types`))) {
    logger.appendLine(`creating types directory`);
    await generate({
      content: typesTemplate(),
      target: `${rootPath}/types/types.ts`,
    });
  }
  const configFile = `${rootPath}/migrate-consul-config.jsonc`;
  if (!(await filesystem.existsAsync(configFile))) {
    logger.appendLine(`creating config file ${configFile}`);
    await generate({
      content: configTemplate(),
      target: configFile,
      props: {
        useMongo: true,
        mongoHost: "localhost",
        mongoPort: 27017,
        dbName: "consul_migrations",
        mongoConnectionString: null,
        mongoConnectionStringEnvVar: null,
        consulHost: "localhost",
        consulPort: 8500,
        consulSecure: false,
        useAcl: false,
        aclTokenEnvVar: null,
        migrationsDirectory: migrationDir,
        environment: "local",
        printSamples: true,
        generateTypesFromKeys: false,
        maxDiffLength: 10000,
        colors: {
          bg: "bgCyan",
          added: "green",
          removed: "red",
          unchanged: "grey",
        },
        includeTypes: true,
      },
    });
  }

  return true;
}
