// src/options.ts
function getOptions() {
  let options = {};
  switch (process.env.DUMP_TYPE) {
    case void 0:
    case "directory":
      options.mode = "directory";
      break;
    case "archive":
      options.mode = "archive";
      break;
    default:
      throw new Error(
        `Unknown DUMP_TYPE value '${process.env.mode}'. DUMP_TYPE must be one of ['directory', 'archive']`
      );
  }
  switch (process.env.VERBOSITY) {
    case void 0:
    case "full":
      options.verbosity = "full";
      break;
    case "collectionNameOnly":
      options.verbosity = "collectionNameOnly";
      break;
    default:
      throw new Error(
        `Unknown VERBOSITY value '${process.env.VERBOSITY}'. VERBOSITY must be one of ['full', 'collectionNameOnly']`
      );
  }
  options.path = process.env.DUMP_PATH;
  return options;
}

// src/stage.ts
function isStageSafe(stage) {
  if (stage == null || typeof stage !== "object") {
    return true;
  }
  const keys = Object.keys(stage);
  if (keys.length === 0) {
    return true;
  }
  if (keys.length > 1) {
    return false;
  }
  const key = keys[0];
  const inner = stage[key];
  switch (key) {
    case "$changeStream":
    case "$changeStreamSplitLargeEvent":
    case "$collStats":
    case "$count":
    case "$currentOp":
    case "$densify":
    case "$indexStats":
    case "$limit":
    case "$listLocalSessions":
    case "$listSampledQueries":
    case "$listSearchIndexes":
    case "$listSessions":
    case "$out":
    case "$planCacheStats":
    case "$sample":
    case "$shardedDataDistribution":
    case "$skip":
    case "$unset":
    case "$unwind":
      return true;
    case "$addFields":
    case "$project":
    case "$set":
    case "$match":
    case "$replaceRoot":
    case "$lookup":
    case "$group":
    case "$bucket":
    case "$bucketAuto":
    case "$facet":
    case "$fill":
    case "$geoNear":
    case "$graphLookup":
    case "$setWindowFields":
    case "$unionWith":
    case "$search":
    case "$searchMeta":
      return !hasMultiKeyObjectOutsideTopLevel(inner);
    case "$documents":
    case "$redact":
    case "$replaceWith":
    case "$sortByCount":
    case "$sort":
      return !hasMultiKeyObjectAtAnyLevel(inner);
    default:
      return false;
  }
}
function hasMultiKeyObjectOutsideTopLevel(obj) {
  if (obj == null || typeof obj !== "object") {
    return false;
  }
  return Object.values(obj).some(hasMultiKeyObjectAtAnyLevel);
}
function hasMultiKeyObjectAtAnyLevel(obj) {
  if (obj == null || typeof obj !== "object") {
    return false;
  }
  if (Array.isArray(obj)) {
    return obj.some(hasMultiKeyObjectAtAnyLevel);
  }
  const values = Object.values(obj);
  if (values.length > 1) {
    return true;
  }
  return values.some(hasMultiKeyObjectAtAnyLevel);
}

// src/validator.ts
function isValidatorSafe(validator) {
  if (validator == null || typeof validator !== "object") {
    return true;
  }
  if (isJSONSchemaOnly(validator)) {
    return true;
  }
  return !Object.values(validator).some(
    hasMultiKeyNonJSONSchemaObjectAtAnyLevel
  );
}
function hasMultiKeyNonJSONSchemaObjectAtAnyLevel(obj) {
  if (obj == null || typeof obj !== "object") {
    return false;
  }
  if (Array.isArray(obj)) {
    return obj.some(hasMultiKeyNonJSONSchemaObjectAtAnyLevel);
  }
  if (isJSONSchemaOnly(obj)) {
    return false;
  }
  const values = Object.values(obj);
  if (values.length > 1) {
    return true;
  }
  return values.some(hasMultiKeyNonJSONSchemaObjectAtAnyLevel);
}
function isJSONSchemaOnly(obj) {
  return Object.keys(obj).length === 1 && "$jsonSchema" in obj;
}

// src/collections.ts
function checkCollectionSafety(collection) {
  if (collection?.type === "view" && collection?.options?.pipeline != null) {
    return checkPipelineSafety(collection.options.pipeline);
  }
  if (collection?.options?.validator != null) {
    return checkValidatorSafety(collection.options.validator);
  }
  return 0 /* SAFE */;
}
function checkPipelineSafety(pipeline) {
  if (pipeline.every(isStageSafe)) {
    return 0 /* SAFE */;
  }
  return 1 /* VIEW_UNSAFE */;
}
function checkValidatorSafety(validator) {
  if (isValidatorSafe(validator)) {
    return 0 /* SAFE */;
  }
  return 2 /* VALIDATOR_UNSAFE */;
}

// src/output.ts
function logResults(collections, verbosity2) {
  const { unsafeViews, unsafeValidators } = getUnsafeCollections(collections);
  logUnsafeViews(unsafeViews, verbosity2);
  logUnsafeValidators(unsafeValidators, verbosity2);
  logSummary(unsafeViews.length, unsafeValidators.length, collections.length);
}
function getUnsafeCollections(collections) {
  const initialUnsafeCollections = {
    unsafeViews: [],
    unsafeValidators: []
  };
  return collections.reduce((unsafeCollections, collection) => {
    const result = checkCollectionSafety(collection);
    if (result === 1 /* VIEW_UNSAFE */) {
      unsafeCollections.unsafeViews.push(collection);
    }
    if (result === 2 /* VALIDATOR_UNSAFE */) {
      unsafeCollections.unsafeValidators.push(collection);
    }
    return unsafeCollections;
  }, initialUnsafeCollections);
}
function logUnsafeViews(unsafeViews, verbosity2) {
  if (unsafeViews.length === 0) {
    return;
  }
  console.log("----- Views to audit -----");
  unsafeViews.forEach((view) => {
    console.log(`${view.db}.${view.name}`);
    if (verbosity2 === "full") {
      console.log(JSON.stringify(view.options.pipeline, null, 2));
    }
  });
}
function logUnsafeValidators(unsafeValidators, verbosity2) {
  if (unsafeValidators.length === 0) {
    return;
  }
  console.log("----- Validators to audit -----");
  unsafeValidators.forEach((collection) => {
    console.log(`${collection.db}.${collection.name}`);
    if (verbosity2 === "full") {
      console.log(JSON.stringify(collection.options.validator, null, 2));
    }
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
var EXCLUDED_DBS = ["local", "config"];
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
var { verbosity } = getOptions();
var collectionInfos = getCollectionInfos();
logResults(collectionInfos, verbosity);
