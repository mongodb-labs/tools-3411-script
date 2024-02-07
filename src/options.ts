type Mode = "directory" | "archive";
export type Verbosity = "full" | "collectionNameOnly";

export type Options = {
  mode: Mode;
  path: string;
  verbosity: Verbosity;
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
  switch (process.env.VERBOSITY) {
    case undefined:
    case "full":
      options.verbosity = "full";
      break;
    case "collectionNameOnly":
      options.verbosity = "collectionNameOnly";
      break;
    default:
      throw new Error(
        `Unknown VERBOSITY value '${process.env.VERBOSITY}'. ` +
          `VERBOSITY must be one of ['full', 'collectionNameOnly']`
      );
  }
  options.path = process.env.DUMP_PATH;
  return options;
}
