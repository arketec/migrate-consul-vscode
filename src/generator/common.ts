import { filesystem } from "../filesystem/filesystem";

function buildGenerate(): (opts: Record<string, any>) => Promise<string> {
  /**
   * Generates a file from a template.
   *
   * @param opts Generation options.
   * @return The generated string.
   */
  async function generate(opts: Record<string, any> = {}): Promise<string> {
    const ejs = require("ejs");
    // required
    const template = opts.template;

    // optional
    const props = opts.props || {};

    // add some goodies to the environment so templates can read them
    const data = {
      config: opts,
      props,
      filename: "",
    };

    // read the template
    const templateContent =
      opts.content ??
      (() => {
        // check the base directory for templates
        const baseDirectory = opts.rootDirectory;
        let templateDirectory = opts.directory || `${baseDirectory}/templates`;
        let pathToTemplate = `${templateDirectory}/${template}`;

        // check ./build/templates too, if that doesn't exist
        if (!filesystem.isFile(pathToTemplate)) {
          templateDirectory =
            opts.directory || `${baseDirectory}/build/templates`;
          pathToTemplate = `${templateDirectory}/${template}`;
        }

        // bomb if the template doesn't exist
        if (!filesystem.isFile(pathToTemplate)) {
          throw new Error(`template not found ${pathToTemplate}`);
        }

        // add template path to support includes
        data.filename = pathToTemplate;

        return filesystem.read(pathToTemplate);
      })();

    // render the template
    const content = ejs.render(templateContent, data);
    if (opts.target) {
      // prep the destination directory
      const dir = opts.target.replace(/$(\/)*/g, "");
      const dest = filesystem.path(dir);

      filesystem.write(dest, content);
    }

    // send back the rendered string
    return content;
  }

  return generate;
}

export { buildGenerate };
