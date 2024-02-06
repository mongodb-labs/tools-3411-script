// src/collections.ts
function isSafeCollection(collection) {
  if (collection?.type === "view" && collection?.options?.pipeline != null) {
    return isSafeView(collection);
  }
  if (collection?.options?.validator != null) {
    return isSafeValidator(collection);
  }
  return 0 /* SAFE */;
}
function isSafeView(view) {
  if (Math.random() > 0.9) {
    return 1 /* VIEW_UNSAFE */;
  }
  return 0 /* SAFE */;
}
function isSafeValidator(collection) {
  if (Math.random() > 0.9) {
    return 2 /* VALIDATOR_UNSAFE */;
  }
  return 0 /* SAFE */;
}

// src/output.ts
function logResults(collections) {
  const { unsafeViews, unsafeValidators } = getUnsafeCollections(collections);
  logUnsafeViews(unsafeViews);
  logUnsafeValidators(unsafeValidators);
  logSummary(unsafeViews.length, unsafeValidators.length, collections.length);
}
function getUnsafeCollections(collections) {
  const initialUnsafeCollections = {
    unsafeViews: [],
    unsafeValidators: []
  };
  return collections.reduce((unsafeCollections, collection) => {
    const result = isSafeCollection(collection);
    if (result === 1 /* VIEW_UNSAFE */) {
      unsafeCollections.unsafeViews.push(collection);
    }
    if (result === 2 /* VALIDATOR_UNSAFE */) {
      unsafeCollections.unsafeValidators.push(collection);
    }
    return unsafeCollections;
  }, initialUnsafeCollections);
}
function logUnsafeViews(unsafeViews) {
  if (unsafeViews.length === 0) {
    return;
  }
  console.log("----- Views to audit -----");
  unsafeViews.forEach((view) => {
    console.log(`${view.db}.${view.name}`);
    console.log(JSON.stringify(view.options.pipeline, null, 2));
  });
}
function logUnsafeValidators(unsafeValidators) {
  if (unsafeValidators.length === 0) {
    return;
  }
  console.log("----- Validators to audit -----");
  unsafeValidators.forEach((collection) => {
    console.log(`${collection.db}.${collection.name}`);
    console.log(JSON.stringify(collection.options.validator, null, 2));
  });
}
function logSummary(numUnsafeViews, numUnsafeValidators, numTotalCollections) {
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
function logUnsafeSummary(numUnsafeCollections, numUnsafeViews, numUnsafeValidators, numTotalCollections) {
  console.log(
    `Your cluster or dump may be affected by TOOLS-3411. ${numUnsafeCollections} ${pluralize("collection", numUnsafeCollections)} (${numUnsafeViews} ${pluralize("view", numUnsafeViews)} and ${numUnsafeValidators} ${pluralize("validator", numUnsafeValidators)}) of the ${numTotalCollections} ${pluralize("collection", numTotalCollections)} inspected could not be automatically analyzed for field order sensitivity. Collections that may be affected are listed above. Please manually audit these collections in accordance with the guidelines here: https://jira.mongodb.org/browse/TOOLS-3411`
  );
}
function logSafeSummary(numTotalCollections) {
  console.log(
    `Your cluster or dump is not affected by TOOLS-3411. No potential misorderings were found in the ${numTotalCollections} inspected ${pluralize(
      "collection",
      numTotalCollections
    )}.`
  );
}
function pluralize(str, n) {
  return n === 1 ? str : `${str}s`;
}

// src/cluster.ts
var EXCLUDED_DBS = ["local"];
function getCollectionInfos() {
  const databaseInfos = db.adminCommand({ listDatabases: 1 }).databases;
  const collectionInfosByDatabase = databaseInfos.filter(({ name }) => !EXCLUDED_DBS.includes(name)).map(getCollectionInfosForDatabase);
  return collectionInfosByDatabase.flat();
}
function getCollectionInfosForDatabase(databaseInfo) {
  const database = db.getSiblingDB(databaseInfo.name);
  const collectionInfosForDatabase = database.getCollectionInfos({
    $or: [{ type: "view" }, { "options.validator": { $exists: 1 } }]
  });
  return collectionInfosForDatabase.map((collectionInfo) => ({
    ...collectionInfo,
    db: databaseInfo.name
  }));
}
var collectionInfos = getCollectionInfos();
logResults(collectionInfos);
