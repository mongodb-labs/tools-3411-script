import { parseDirectory } from "./directory";
import { parseArchive } from "./archive";
import { getOptions, Options } from "./options";
import { logCollectionResults } from "../output";

async function main() {
  const options = getOptions();
  if (options.path == undefined) {
    throw new Error(`DUMP_PATH must be specified when checking a dump`);
  }

  const collections = await getMetadata(options);
  const filteredCollections = collections.filter(
    (collection) =>
      collection?.type === "view" || collection?.options?.validator != null
  );
  logCollectionResults(filteredCollections);
}

async function getMetadata({ mode, path }: Options): Promise<any[]> {
  switch (mode) {
    case "directory":
      return parseDirectory(path);
    case "archive":
      return parseArchive(path);
    default:
      throw new Error(`unexpected mode: ${mode}`);
  }
}

main();
