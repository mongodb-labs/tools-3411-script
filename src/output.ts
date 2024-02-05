import { isSafeCollection } from "./collections";

export function logCollectionResults(collections: any[]): void {
  let numUnsafeCollections = 0;
  collections.forEach((collection) => {
    const isSafe = isSafeCollection(collection);
    if (!isSafe) {
      console.log(`${collection.db}.${collection.name}`);
      numUnsafeCollections++;
    }
  });
  console.log("----- Summary -----");
  if (numUnsafeCollections > 0) {
    logUnsafeMessage(numUnsafeCollections, collections.length);
  } else {
    logSafeMessage(collections.length);
  }
}

function logUnsafeMessage(
  numMaybeUnsafeCollections: number,
  numTotalCollections: number
): void {
  console.log(
    "Your cluster or dump may be affected by TOOLS-3411. " +
      `Potential misorderings could be present in ${numMaybeUnsafeCollections} ${pluralize(
        "collection",
        numMaybeUnsafeCollections
      )} of the ${numTotalCollections} ${pluralize(
        "collection",
        numTotalCollections
      )} inspected. ` +
      "Collections that may be affected are listed above. " +
      "Please manually audit these collections."
  );
}

function logSafeMessage(numTotalCollections: number): void {
  console.log(
    "Your cluster or dump is not affected by TOOLS-3411. " +
      `No potential misorderings were found in the ${numTotalCollections} inspected ${pluralize(
        "collection",
        numTotalCollections
      )}.`
  );
}

function pluralize(str: string, n: number) {
  return n === 1 ? str : `${str}s`;
}
