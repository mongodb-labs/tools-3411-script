import { readdirSync, readFileSync } from "fs";
import { EJSON } from "bson";
import path from "path";
import { gunzipSync } from "node:zlib";

const METADATA_FILE_SUFFIX = ".metadata.json";
const METADATA_FILE_SUFFIX_GZ = ".metadata.json.gz";

export function parseDirectory(directory: string): any[] {
  const metadataFiles = getMetadataFiles(directory);
  console.log(`Found ${metadataFiles.length} metadata files.`);

  return metadataFiles.map((file: string) => {
    let filePath = `${directory}/${file}`;
    let buffer = readFileSync(filePath);

    if (filePath.endsWith(METADATA_FILE_SUFFIX_GZ)) {
      buffer = gunzipSync(buffer);
    }

    const metadata = EJSON.parse(buffer.toString());
    return {
      name: metadata.collectionName ?? path.basename(file, METADATA_FILE_SUFFIX),
      db: path.dirname(file),
      ...metadata,
    };
  });
}

function getMetadataFiles(directory: string): string[] {
  try {
    const files = readdirSync(directory, { recursive: true }) as string[];
    return files.filter(isMetadataFile);
  } catch (err) {
    if (err.toString().includes("not a directory")) {
      throw new Error(
        `DUMP_PATH ${directory} is not a directory. Did you mean to specify DUMP_TYPE=archive?`
      );
    }
  }
}

function isMetadataFile(file: string): boolean {
  return (
    file.endsWith(METADATA_FILE_SUFFIX) ||
    file.endsWith(METADATA_FILE_SUFFIX_GZ)
  );
}
