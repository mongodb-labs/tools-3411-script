import { Result, isSafeCollection } from "./collections";
import { Verbosity } from "./options";

export function logResults(collections: any[], verbosity: Verbosity): void {
  const { unsafeViews, unsafeValidators } = getUnsafeCollections(collections);
  logUnsafeViews(unsafeViews, verbosity);
  logUnsafeValidators(unsafeValidators, verbosity);
  logSummary(unsafeViews.length, unsafeValidators.length, collections.length);
}

function getUnsafeCollections(collections: any[]): {
  unsafeViews: any[];
  unsafeValidators: any[];
} {
  const initialUnsafeCollections = {
    unsafeViews: [],
    unsafeValidators: [],
  };
  return collections.reduce((unsafeCollections: any, collection: any) => {
    const result = isSafeCollection(collection);
    if (result === Result.VIEW_UNSAFE) {
      unsafeCollections.unsafeViews.push(collection);
    }
    if (result === Result.VALIDATOR_UNSAFE) {
      unsafeCollections.unsafeValidators.push(collection);
    }
    return unsafeCollections;
  }, initialUnsafeCollections);
}

function logUnsafeViews(unsafeViews: any[], verbosity: Verbosity): void {
  if (unsafeViews.length === 0) {
    return;
  }
  console.log("----- Views to audit -----");
  unsafeViews.forEach((view) => {
    console.log(`${view.db}.${view.name}`);
    if (verbosity === "full") {
      console.log(JSON.stringify(view.options.pipeline, null, 2));
    }
  });
}

function logUnsafeValidators(unsafeValidators: any[], verbosity: Verbosity): void {
  if (unsafeValidators.length === 0) {
    return;
  }
  console.log("----- Validators to audit -----");
  unsafeValidators.forEach((collection) => {
    console.log(`${collection.db}.${collection.name}`);
    if (verbosity === "full") {
      console.log(JSON.stringify(collection.options.validator, null, 2));
    }
  });
}

function logSummary(
  numUnsafeViews: number,
  numUnsafeValidators: number,
  numTotalCollections: number
): void {
  console.log("----- Summary -----");
  const numUnsafeCollections = numUnsafeViews + numUnsafeValidators;
  if (numUnsafeCollections > 0) {
    logUnsafeSummary(
      numUnsafeCollections,
      numUnsafeViews,
      numUnsafeValidators,
      numTotalCollections
    );
  } else {
    logSafeSummary(numTotalCollections);
  }
}

function logUnsafeSummary(
  numUnsafeCollections: number,
  numUnsafeViews: number,
  numUnsafeValidators: number,
  numTotalCollections: number
): void {
  console.log(
    "Your cluster or dump may be affected by TOOLS-3411. " +
      `${numUnsafeCollections} ` +
      `${pluralize("collection", numUnsafeCollections)} ` +
      `(${numUnsafeViews} ${pluralize("view", numUnsafeViews)} and ` +
      `${numUnsafeValidators} ` +
      `${pluralize("validator", numUnsafeValidators)}) ` +
      `of the ${numTotalCollections} ` +
      `${pluralize("collection", numTotalCollections)} ` +
      "inspected could not be automatically analyzed for field order sensitivity. " +
      "Collections that may be affected are listed above. " +
      "Please manually audit these collections in accordance with the guidelines here: " +
      "https://jira.mongodb.org/browse/TOOLS-3411"
  );
}

function logSafeSummary(numTotalCollections: number): void {
  console.log(
    "Your cluster or dump is not affected by TOOLS-3411. " +
      `No potential misorderings were found in the ${numTotalCollections} inspected ${pluralize(
        "collection",
        numTotalCollections
      )}.`
  );
}

function pluralize(str: string, n: number): string {
  return n === 1 ? str : `${str}s`;
}
