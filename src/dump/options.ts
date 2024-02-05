type Mode = "directory" | "archive";

export type Options = {
  mode: Mode;
  path: string;
};

// Parse the options from the environment variables.
// This is the recommended way to parse options for
// mongosh scripts because mongosh cannot interpret
// conventional "--" arguments yet.
export function getOptions(): Options {
  let options = {} as Options;

  switch (process.env.DUMP_TYPE) {
    case undefined:
    case "directory":
      options.mode = "directory";
      break;
    case "archive":
      options.mode = "archive";
      break;
    default:
      throw new Error(
        `Unknown DUMP_TYPE value '${process.env.mode}'. ` +
          `DUMP_TYPE must be one of ['directory', 'archive']`
      );
  }

  options.path = process.env.DUMP_PATH;

  return options;
}
