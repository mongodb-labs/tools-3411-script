// src/collections.ts
function isSafeCollection(collection) {
  if (collection?.type === "view" && collection?.options?.pipeline != null) {
    return isSafeView(collection);
  }
  if (collection?.options?.validator != null) {
    return isSafeValidator(collection);
  }
  return true;
}
function isSafeView(view) {
  if (Math.random() > 0.9) {
    return false;
  }
  return true;
}
function isSafeValidator(collection) {
  return true;
}

// src/output.ts
function logCollectionResults(collections) {
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
function logUnsafeMessage(numMaybeUnsafeCollections, numTotalCollections) {
  console.log(
    `Your cluster or dump may be affected by TOOLS-3411. Potential misorderings could be present in ${numMaybeUnsafeCollections} ${pluralize(
      "collection",
      numMaybeUnsafeCollections
    )} of the ${numTotalCollections} ${pluralize(
      "collection",
      numTotalCollections
    )} inspected. Collections that may be affected are listed above. Please manually audit these collections.`
  );
}
function logSafeMessage(numTotalCollections) {
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

// src/find_affected_collections.ts
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
logCollectionResults(collectionInfos);
