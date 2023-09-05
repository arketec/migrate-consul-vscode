import * as jetpack from "fs-jetpack";
const filesystem = {
  isFile: (path: string) => jetpack.exists(path) === "file",
  read: (path: string) => jetpack.read(path),
  existsAsync: (path: string) => jetpack.existsAsync(path),
  path: (path: string) => jetpack.path(path),
  write: (path: string, content: string) => jetpack.write(path, content),
};

export { filesystem };
